import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const vendors = await prisma.vendor.findMany({
        where: { status: 1 },
        include: {
            _count: {
                select: { models: true },
            },
        },
    });

    return Response.json(vendors)
}