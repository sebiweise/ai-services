import { Vendor } from "@prisma/client";
import { columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Vendor[]> {
    const res = await fetch('/api/vendors', { cache: 'force-cache' });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json();
}

export default async function VendorPage() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
