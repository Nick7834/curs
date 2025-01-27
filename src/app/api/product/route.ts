import { put } from '@vercel/blob';
import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    const userId = await getUserSession();

    if(!userId) {
        return NextResponse.json({ error: "User not authenticated." }, { status: 401 });
    }

    if(userId?.user.role !== 'admin') {
        return NextResponse.json({ error: "User not authenticated." }, { status: 401 });
    }

    try {

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const priceStr = formData.get('price') as string;
        const price = priceStr ? parseFloat(priceStr) : null;
        const description = formData.get('description') as string;
        const image = formData.get('image') as File | null;
        const characteristics = formData.getAll('characteristics') as string[];   
        const parsedCharacteristics = characteristics.map((char) => JSON.parse(char)); 

        if(!name || !price || !description || !image || !characteristics) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        if (isNaN(price)) {
            return NextResponse.json({ error: "Price must be a valid number." }, { status: 400 });
        }

        const imageBlob = await put(image.name, image.stream(), {
            access: 'public',
        });

        const createProduct = await prisma.product.create({
            data: {
                name,
                price,
                description,
                image: imageBlob.url,
                characteristics: parsedCharacteristics
            },
        });

        return NextResponse.json({ message: "Product created successfully.", createProduct }, { status: 200 });

    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Error creating product." }, { status: 500 });
    }
}

export async function GET() {

    const products = await prisma.product.findMany();

    return NextResponse.json({ products });
}