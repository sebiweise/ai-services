import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getAllVendors } from "@/lib/actions/vendor.actions";

export default async function VendorPage() {
    const data = await getAllVendors()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
