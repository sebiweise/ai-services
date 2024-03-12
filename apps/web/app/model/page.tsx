import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getAllModels } from "@/lib/actions/model.actions";

export default async function ModelPage() {
    const data = await getAllModels()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
