import { PrismaClient } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { currentUser } from '@clerk/nextjs';
import { Icons } from "@/components/icons";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient()

export default async function Index({ params }: { params: { id: string } }) {
  const user = await currentUser();

  if (!currentUser) {
    return <div>User not found</div>;
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: Number(params.id),
      ownerId: user?.id
    },
    include: {
      images: true,
      samples: true
    }
  });

  if (!workflow) {
    redirect("/overview");
  }

  return (
    <div id="train-model-container" className="w-full h-full">
      <div className="flex flex-row gap-4">
        <Link href="/overview" className="text-xs w-fit">
          <Button variant={"outline"} className="text-xs" size="sm">
            <FaArrowLeft className="mr-2" />
            Go Back
          </Button>
        </Link>
        <div className="flex flex-row gap-2 align-middle text-center items-center pb-4">
          <h1 className="text-xl">{workflow.name}</h1>
          <div>
            <Badge
              variant={workflow.status === "finished" ? "default" : "secondary"}
              className="text-xs font-medium"
            >
              {workflow.status === "processing" ? "training" : workflow.status}
              {workflow.status === "processing" && (
                <Icons.spinner className="h-4 w-4 animate-spin ml-2 inline-block" />
              )}
            </Badge>
          </div>
        </div>
      </div>

      {/* <ClientSideModel samples={workflow.samples ?? []} serverModel={workflow} serverImages={workflow.images ?? []} /> */}
    </div>
  );
}
