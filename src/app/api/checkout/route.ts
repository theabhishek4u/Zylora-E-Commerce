import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { generateOrderNumber } from '@/lib/format';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, email, phone, address, city, state, pincode, paymentMethod, sessionId } = body;

    if (!customerName || !email || !phone || !address || !city || !state || !pincode || !paymentMethod || !sessionId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Get cart
    const cart = await db.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: true, price: true, stock: true },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Validate stock
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return NextResponse.json(
          { error: `${item.product.name} has only ${item.product.stock} items in stock` },
          { status: 400 }
        );
      }
    }

    // Calculate total
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        totalAmount,
        status: 'confirmed',
        paymentMethod,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productImage: JSON.parse(item.product.images)[0] || '',
            price: item.product.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    // Update stock
    for (const item of cart.items) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Clear cart
    await db.cartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
