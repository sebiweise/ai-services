import { PrismaClient, Vendor } from "@prisma/client";
import { columns } from "./columns"
import { DataTable } from "./data-table"

const prisma = new PrismaClient();

async function getData(): Promise<Vendor[]> {
    const vendors = await prisma.vendor.findMany({
        include: {
            _count: {
                select: { models: true },
            },
        },
    });

    return vendors;
}

export default async function VendorPage() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
