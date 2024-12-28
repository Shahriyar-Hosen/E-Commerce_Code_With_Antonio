import prismadb from "@/lib/prismadb";
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: Promise<{ colorId: string }>}
) {
    try {
        const { colorId } = await params; 

        if(!colorId) {
            return new NextResponse("Color id is required", { status: 400 });
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: colorId,
            }
        })

        return NextResponse.json(color);
    } catch (err) {
        console.log('[COLOR_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: Promise<{ storeId: string, colorId: string }>}
) {
    try {
        const { userId } = await auth();
        const body = await req.json();

        const { name, value } = body;
        const { storeId, colorId } = await params; 

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 400 });
        }

        if(!colorId) {
            return new NextResponse("Color id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const color = await prismadb.color.updateMany({
            where: {
                id: colorId
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(color);
    } catch (err) {
        console.log('[COLOR_PATCH]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

//// Delete Method

export async function DELETE (
    req: Request,
    { params }: { params: Promise<{ storeId: string, colorId: string }>}
) {
    try {
        const { userId } = await auth();
        const { storeId, colorId } = await params; 

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!colorId) {
            return new NextResponse("Color id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const color = await prismadb.color.deleteMany({
            where: {
                id: colorId,
            }
        })

        return NextResponse.json(color);
    } catch (err) {
        console.log('[COLOR_DELETE]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}