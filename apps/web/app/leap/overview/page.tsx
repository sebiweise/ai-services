import { PrismaClient, Workflow } from "@prisma/client";
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { auth } from '@clerk/nextjs';

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
    const { userId } = auth();

    if (!userId) {
        return <div>User not found</div>;
    }

    const data = await getData(userId)

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
