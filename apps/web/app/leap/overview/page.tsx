import { PrismaClient } from "@prisma/client";
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { currentUser } from '@clerk/nextjs';

const prisma = new PrismaClient()

export default async function ModelPage() {
    const user = await currentUser();

    if (!user) {
        return <div>User not found</div>;
    }

    const data = await prisma.workflow.findMany({
        where: {
            userId: user.id
        },
        include: {
            samples: true,
        },
    });

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
