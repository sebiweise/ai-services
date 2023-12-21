import { Model, PrismaClient } from "@prisma/client";
import { columns } from "./columns"
import { DataTable } from "./data-table"

const prisma = new PrismaClient()

async function getData(): Promise<Model[]> {
    const models = await prisma.model.findMany({
        include: {
            vendor: {
                select: { name: true },
            },
        },
    });

    return models;
}

export default async function ModelPage() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
