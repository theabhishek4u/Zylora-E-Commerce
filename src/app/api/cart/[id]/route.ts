import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: 'Quantity must be at least 1' }, { status: 400 });
    }

    const cartItem = await db.cartItem.findUnique({
      where: { id },
      include: { product: { select: { stock: true } } },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    if (quantity > cartItem.product.stock) {
      return NextResponse.json({ error: 'Quantity exceeds stock' }, { status: 400 });
    }

    await db.cartItem.update({
      where: { id },
      data: { quantity },
    });

    // Fetch full cart
    const cart = await db.cart.findFirst({
      where: { items: { some: { id } } },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: true, price: true, originalPrice: true, stock: true },
            },
          },
        },
      },
    });

    const formattedItems = (cart?.items || []).map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      productImage: JSON.parse(item.product.images)[0] || '',
      price: item.product.price,
      originalPrice: item.product.originalPrice,
      quantity: item.quantity,
      stock: item.product.stock,
    }));

    return NextResponse.json({ items: formattedItems });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.cartItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json({ error: 'Failed to delete cart item' }, { status: 500 });
  }
}
