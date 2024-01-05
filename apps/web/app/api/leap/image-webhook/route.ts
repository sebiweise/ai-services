import { PrismaClient } from "@prisma/client";
import { LeapWebhookImage } from "@/types/leap";
import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs';

export const dynamic = "force-dynamic";

const leapApiKey = process.env.LEAP_API_KEY;
const leapWebhookSecret = process.env.LEAP_WEBHOOK_SECRET;

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { userId } = auth();

  const incomingData = await request.json();
  const urlObj = new URL(request.url);
  const model_id = urlObj.searchParams.get("model_id");
  const webhook_secret = urlObj.searchParams.get("webhook_secret");
  const model_db_id = urlObj.searchParams.get("model_db_id");
  const result = incomingData?.result;

  if (!userId) {
    return NextResponse.json(
      {
        message: "User not found!",
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

  if (!model_id) {
    return NextResponse.json(
      {
        message: "Malformed URL, no model_id detected!",
      },
      { status: 500 }
    );
  }

  if (!model_db_id) {
    return NextResponse.json(
      {
        message: "Malformed URL, no model_db_id detected!",
      },
      { status: 500 }
    );
  }

  try {
    const images = result.images as LeapWebhookImage[];

    await Promise.all(
      images.map(async (image) => {
        await prisma.image.create({
          data: {
            workflowId: Number(model_db_id),
            uri: image.uri,
            ownerId: userId
          }
        }).catch(e => {
          console.error({ e });
        })
      })
    );
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
