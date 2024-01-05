import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { Leap } from "@leap-ai/workflows";
import { auth } from '@clerk/nextjs';

export const dynamic = "force-dynamic";

const leapApiKey = process.env.LEAP_API_KEY;
// For local development, recommend using an Ngrok tunnel for the domain
const webhookUrl = `https://${process.env.VERCEL_URL}/api/leap/train-webhook`;
const leapWebhookSecret = process.env.LEAP_WEBHOOK_SECRET;
const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { userId } = auth();

  const payload = await request.json();
  const images = payload.urls;
  const type = payload.type;
  const name = payload.name;

  if (!userId) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  if (!leapApiKey) {
    return NextResponse.json(
      {
        message: "Missing API Key: Add your Leap API Key to generate headshots",
      },
      {
        status: 500,
      }
    );
  }

  if (images?.length < 4) {
    return NextResponse.json(
      {
        message: "Upload at least 4 sample images",
      },
      { status: 500 }
    );
  }
  let _balance = null;

  console.log({ stripeIsConfigured });
  if (stripeIsConfigured) {
    const balance = await prisma.balance.findUnique({
      where: {
        userId: userId
      }
    }).catch(e => {
      console.error({ e });
    })

    if (!balance) {
      // create credits for user.
      await prisma.balance.create({
        data: {
          credits: 0,
          userId: userId
        }
      }).catch(e => {
        console.error({ e });
      })

      return NextResponse.json(
        {
          message:
            "Not enough credits, please purchase some credits and try again.",
        },
        { status: 500 }
      );
    } else if (balance.credits < 1) {
      return NextResponse.json(
        {
          message:
            "Not enough credits, please purchase some credits and try again.",
        },
        { status: 500 }
      );
    } else {
      _balance = balance;
    }
  }

  try {
    const webhookUrlString = `${webhookUrl}?user_id=${userId}&webhook_secret=${leapWebhookSecret}&model_type=${type}`;

    const leap = new Leap({
      apiKey: leapApiKey,
    });

    const response = await leap.workflowRuns.workflow({
      workflow_id: process.env.LEAP_WORKFLOW_ID as string,
      webhook_url: webhookUrlString,
      input: {
        title: name, // title of the model
        name: type, // name of the model type
        image_urls: images,
      },
    });

    const { status, statusText, data: workflowResponse } = response;
    // console.log("workflows response: ", workflowResponse);

    if (status !== 201) {
      console.error({ status });
      if (status === 400) {
        return NextResponse.json(
          {
            message: "webhookUrl must be a URL address",
          },
          { status }
        );
      }
      if (status === 402) {
        return NextResponse.json(
          {
            message: "Training models is only available on paid plans.",
          },
          { status }
        );
      }
    }

    const data = await prisma.workflow.create({
      data: {
        workflowRunId: workflowResponse.id,
        userId: userId,
        name,
        type,
      },
      select: {
        id: true,
      },
    }).catch(e => {
      console.error({ e });
    })

    // Get the modelId from the created model
    const workflowId = data;

    await prisma.sample.createMany({
      data: images.map((sample: string) => ({
        workflowId: workflowId,
        uri: sample,
        userId: userId
      }))
    }).catch(e => {
      console.error({ e });
    })

    if (stripeIsConfigured && _balance) {
      const subtractedCredits = _balance.credits - 1;

      await prisma.balance.update({
        where: {
          userId: userId,
        },
        data: {
          credits: subtractedCredits,
        },
      }).catch(e => {
        console.error({ e });
      })

      console.log({ data });
      console.log({ subtractedCredits });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Something went wrong!",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: "success",
    },
    { status: 200 }
  );
}
