import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {

    const idProduct = await params;

    if (!idProduct) {
        return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    try {
        await prisma.cartItem.deleteMany({ where: { id: idProduct.id } });

        const response = await prisma.product.delete({ where: { id: idProduct.id } });
        return NextResponse.json({ response });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: "Error deleting product." }, { status: 500 });
    }
}