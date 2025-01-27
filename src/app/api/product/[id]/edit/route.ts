import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {

    const userId = await getUserSession();

    const idProduct = await params;

    if (!idProduct) {
        return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    if (!userId) {
        return NextResponse.json({ error: "User not authenticated." }, { status: 401 });
    }

    if (userId?.user.role !== 'admin') {
        return NextResponse.json({ error: "User not authenticated." }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const priceStr = formData.get('price') as string;
        const price = priceStr ? parseFloat(priceStr) : null;
        const description = formData.get('description') as string;
        const image = formData.get('image') as File | string;
        const oldImage = formData.get('oldPhoto') as string;
        const characteristics = formData.getAll('characteristics') as string[];
        const parsedCharacteristics = characteristics.map((char) => JSON.parse(char)); 

        if (!name || !price || !description || !characteristics) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        if (isNaN(price)) {
            return NextResponse.json({ error: "Price must be a valid number." }, { status: 400 });
        }

        const existingProduct = await prisma.product.findUnique({
            where: { id: idProduct.id },
        });

        if (!existingProduct) {
            return NextResponse.json({ error: "Product not found." }, { status: 404 });
        }

        let imageUrl = oldImage;

        if (image && image instanceof File) {
            const imageBlob = await put(image.name, image.stream(), {
                access: 'public',
            });
            imageUrl = imageBlob.url;
        }

        const updatedProduct = await prisma.product.update({
            where: { id: idProduct.id },
            data: {
                name,
                price,
                description,
                image: imageUrl,
                characteristics: parsedCharacteristics,
            },
        });

        return NextResponse.json({ message: "Product updated successfully.", updatedProduct }, { status: 200 });

    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: "Error updating product." }, { status: 500 });
    }
}
