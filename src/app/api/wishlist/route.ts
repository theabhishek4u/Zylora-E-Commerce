import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json([]);
    const items = await db.wishlistItem.findMany({ where: { userId }, include: { product: { include: { category: { select: { name: true } } } } }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(items.map((i) => ({ ...i, product: { ...i.product, images: JSON.parse(i.product.images), tags: i.product.tags ? JSON.parse(i.product.tags) : null, categoryName: i.product.category.name } })));
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, productId } = await request.json();
    if (!userId || !productId) return NextResponse.json({ error: 'userId and productId required' }, { status: 400 });
    const item = await db.wishlistItem.upsert({ where: { userId_productId: { userId, productId } }, update: {}, create: { userId, productId } });
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, productId } = await request.json();
    if (!userId || !productId) return NextResponse.json({ error: 'userId and productId required' }, { status: 400 });
    await db.wishlistItem.delete({ where: { userId_productId: { userId, productId } } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}
