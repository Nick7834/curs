import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getUserSession();
    const userId = session?.user?.id;

    const productId = await params;

    if (!productId) {
        return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }
    
    if (!userId) {
        return NextResponse.json({ error: "User not authenticated." }, { status: 401 });
    }

    try {

        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: true },
        });

        if (!cart) {
            return NextResponse.json({ error: "Cart not found." }, { status: 404 });
        }

        await prisma.cartItem.delete({
            where: { id: productId.id },
        });

        return NextResponse.json({ message: "Product removed from cart successfully." }, { status: 200 });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        return NextResponse.json({ error: "Error removing product from cart." }, { status: 500 });
    }

    
}