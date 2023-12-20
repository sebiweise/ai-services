import { Model } from "@prisma/client";
import { columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Model[]> {
    const res = await fetch('/api/models', { cache: 'force-cache' });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json();
}

export default async function ModelPage() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
