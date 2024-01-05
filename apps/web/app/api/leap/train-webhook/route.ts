import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { currentUser } from '@clerk/nextjs';
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resendApiKey = process.env.RESEND_API_KEY;
const leapApiKey = process.env.LEAP_API_KEY;
// For local development, recommend using an Ngrok tunnel for the domain
const leapWebhookSecret = process.env.LEAP_WEBHOOK_SECRET;
const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const user = await currentUser();

  const incomingData = await request.json();
  // console.log(incomingData, "train model webhook incomingData");

  const { output } = incomingData;
  // console.log(output, "train model webhook result");

  const workflowRunId = incomingData.id;
  // console.log(workflowRunId, "workflowRunId");

  const urlObj = new URL(request.url);
  const webhook_secret = urlObj.searchParams.get("webhook_secret");

  if (!user) {
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

  if (!webhook_secret) {
    return NextResponse.json(
      {
        message: "Malformed URL, no webhook_secret detected!",
      },
      { status: 500 }
    );
  }

  if (webhook_secret.toLowerCase() !== leapWebhookSecret?.toLowerCase()) {
    return NextResponse.json(
      {
        message: "Unauthorized!",
      },
      { status: 401 }
    );
  }

  try {
    if (incomingData.status === "completed") {
      // Send Email
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "noreply@headshots.tryleap.ai",
          to: user.emailAddresses[0]?.emailAddress ?? "",
          subject: "Your model was successfully trained!",
          html: `<h2>We're writing to notify you that your model training was successful! 1 credit has been used from your account.</h2>`,
        });
      }

      const modelUpdated = await prisma.workflow.update({
        where: {
          workflowRunId: workflowRunId,
        },
        data: {
          status: "finished",
        },
        select: {
          id: true
        }
      }).catch(e => {
        console.error({ e });
      })

      if (!modelUpdated) {
        console.error("No model updated!");
        console.error({ modelUpdated });
      }

      let allImages = [] as string[];
      for (let step in output) {
        if (
          output[step].hasOwnProperty("images") &&
          Array.isArray(output[step].images)
        ) {
          allImages = allImages.concat(output[step].images);
        }
      }
      // console.log(allImages, "allImages");

      const workflowId = modelUpdated?.id;

      await prisma.sample.createMany({
        data: allImages.map((image) => ({
          workflowId: Number(workflowId),
          uri: image,
          ownerId: user.id
        }))
      }).catch(e => {
        console.error({ e });
      });
      return NextResponse.json(
        {
          message: "success",
        },
        { status: 200, statusText: "Success" }
      );
    } else {
      // Send Email
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "noreply@headshots.tryleap.ai",
          to: user.emailAddresses[0]?.emailAddress ?? "",
          subject: "Your model failed to train!",
          html: `<h2>We're writing to notify you that your model training failed!. Since this failed, you will not be billed for it</h2>`,
        });
      }

      // Update model status to failed.
      await prisma.workflow.update({
        where: {
          workflowRunId: workflowRunId,
        },
        data: {
          status: "failed",
        }
      }).catch(e => {
        console.error({ e });
      })

      if (stripeIsConfigured) {
        // Refund the user.
        const balance = await prisma.balance.findUnique({
          where: {
            ownerId: user.id
          }
        }).catch(e => {
          console.error({ e });
        })
        const credits = balance!.credits;

        // We are adding a credit back to the user, since we charged them for the model training earlier. Since it failed we need to refund it.
        const addCredit = credits + 1;
        await prisma.balance.update({
          where: {
            ownerId: user.id,
          },
          data: {
            credits: addCredit,
          },
        }).catch(e => {
          console.error({ e });
        })

        console.log("Refunded user 1 credit! User Id: ", user.id);
      }
    }
    return NextResponse.json(
      {
        message: "success",
      },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Something went wrong!",
      },
      { status: 500 }
    );
  }
}
