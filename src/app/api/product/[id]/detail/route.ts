import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {

    const idPost = await params;

    if(!idPost) {
        return NextResponse.json({ error: "Product not found." }, { status: 404 }); 
    }

    try {
        const product = await prisma.product.findUnique({ where: { id: idPost.id } }); 

        if(!product) {
            return NextResponse.json({ error: "Product not found." }, { status: 404 }); 
        }
    
        return NextResponse.json({ product });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: "Error fetching product." }, { status: 500 }); 
    }
}