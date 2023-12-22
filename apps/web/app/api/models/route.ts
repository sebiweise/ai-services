import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const vendor = searchParams.get('vendor')

    const models = await prisma.model.findMany({
        where: { status: 1 },
        include: {
            vendor: {
                select: { name: true },
                ...(vendor && {
                    where: {
                        name: vendor
                    }
                }),
            },
        },
    });

    return Response.json(models)
}