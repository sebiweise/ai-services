import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const models = await prisma.model.findMany({
        where: { status: 1 },
        include: {
            vendor: {
                select: { name: true },
            },
        },
    });

    return Response.json(models)
}