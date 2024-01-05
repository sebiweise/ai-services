import { PrismaClient, Workflow } from "@prisma/client";
import { columns } from "./columns"
import { DataTable } from "./data-table"

const prisma = new PrismaClient()

async function getData(): Promise<Workflow[]> {
    const workflows = await prisma.workflow.findMany({
        include: {
            samples: true,
        },
    });

    return workflows;
}

export default async function ModelPage() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
