import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');
    const key = userId || sessionId;
    if (!key) return NextResponse.json({ items: [] });

    const cart = await db.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: { items: { include: { product: { select: { name: true, images: true, price: true, originalPrice: true, stock: true } } } } },
    });

    if (!cart) return NextResponse.json({ items: [] });
    const items = cart.items.map((i) => ({ id: i.id, productId: i.productId, productName: i.product.name, productImage: JSON.parse(i.product.images)[0] || '', price: i.product.price, originalPrice: i.product.originalPrice, quantity: i.quantity, stock: i.product.stock }));
    return NextResponse.json({ items, cartId: cart.id });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, sessionId, productId, quantity = 1 } = await request.json();
    if (!productId) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    if (product.stock < quantity) return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });

    let cart = await db.cart.findFirst({ where: userId ? { userId } : { sessionId } });
    if (!cart) cart = await db.cart.create({ data: { userId: userId || null, sessionId: sessionId || null } });

    const existing = await db.cartItem.findFirst({ where: { cartId: cart.id, productId } });
    if (existing) {
      await db.cartItem.update({ where: { id: existing.id }, data: { quantity: Math.min(existing.quantity + quantity, product.stock) } });
    } else {
      await db.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
    }

    const updated = await db.cart.findUnique({ where: { id: cart.id }, include: { items: { include: { product: { select: { name: true, images: true, price: true, originalPrice: true, stock: true } } } } } });
    const items = (updated?.items || []).map((i) => ({ id: i.id, productId: i.productId, productName: i.product.name, productImage: JSON.parse(i.product.images)[0] || '', price: i.product.price, originalPrice: i.product.originalPrice, quantity: i.quantity, stock: i.product.stock }));
    return NextResponse.json({ items, cartId: cart.id });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { itemId, userId, sessionId } = await request.json();
    if (!itemId) return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    await db.cartItem.delete({ where: { id: itemId } });
    const cart = await db.cart.findFirst({ where: userId ? { userId } : { sessionId }, include: { items: { include: { product: { select: { name: true, images: true, price: true, originalPrice: true, stock: true } } } } } });
    const items = (cart?.items || []).map((i) => ({ id: i.id, productId: i.productId, productName: i.product.name, productImage: JSON.parse(i.product.images)[0] || '', price: i.product.price, originalPrice: i.product.originalPrice, quantity: i.quantity, stock: i.product.stock }));
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}
