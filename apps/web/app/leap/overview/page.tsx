import { PrismaClient, Workflow } from "@prisma/client";
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { currentUser } from '@clerk/nextjs';
import { FaImages } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const prisma = new PrismaClient()

async function getData(userId: string): Promise<Workflow[]> {
    const workflows = await prisma.workflow.findMany({
        where: {
            userId: userId
        },
        include: {
            samples: true,
        },
    });

    return workflows;
}

export default async function ModelPage() {
    const user = await currentUser();

    if (!user) {
        return <div>User not found</div>;
    }

    const data = await getData(user.id)

    return (
        <div className="container mx-auto py-10">
            {data && data.length > 0 && (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-4 w-full justify-between items-center text-center">
                        <h1>Your models</h1>
                        <Link href="/leap/overview/models/train" className="w-fit">
                            <Button size={"sm"}>
                                Train model
                            </Button>
                        </Link>
                    </div>
                    <DataTable columns={columns} data={data} />
                </div>
            )}
            {data && data.length === 0 && (
                <div className="flex flex-col gap-4 items-center">
                    <FaImages size={64} className="text-gray-500" />
                    <h1 className="text-2xl">
                        Get started by training your first model.
                    </h1>
                    <div>
                        <Link href="/leap/overview/models/train">
                            <Button size={"lg"}>Train model</Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
