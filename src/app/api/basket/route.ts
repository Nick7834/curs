import { getUserSession } from '@/lib/get-user-session';
import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
 
export async function POST(request: NextRequest) {
    const session = await getUserSession();
    const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 });
  }

  try {
    const { productId, quantity } = await request.json();

    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json({ error: 'Product ID and quantity are required.' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
        include: { items: true },
      });
    }

 
    const existingCartItem = cart.items.find((item) => item.productId === productId);

    if (existingCartItem) {

      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
    } else {
    
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return NextResponse.json({ message: 'Product added to cart successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return NextResponse.json({ error: 'Error adding product to cart.' }, { status: 500 });
  }
}

export async function GET() {
    const session = await getUserSession();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: "User not authenticated." }, { status: 401 });
    }

    try {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ 
                items: [], 
                total: 0, 
                message: "Cart is empty." 
            }, { status: 200 });
        }

        const totalPrice = cart.items.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);

        const cartWithTotal = {
            items: cart.items.map(item => ({
                id: item.id,
                productId: item.productId,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                image: item.product.image,
                total: item.product.price * item.quantity,
            })),
            total: totalPrice,
            allQuantity: cart.items.reduce((acc, item) => acc + item.quantity, 0),
        };

        return NextResponse.json(cartWithTotal, { status: 200 });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return NextResponse.json({ error: "Error fetching cart." }, { status: 500 });
    }
}