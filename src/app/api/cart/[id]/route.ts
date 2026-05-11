import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { quantity } = await request.json();
    if (!quantity || quantity < 1) return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    const item = await db.cartItem.findUnique({ where: { id }, include: { product: { select: { stock: true } } } });
    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    if (quantity > item.product.stock) return NextResponse.json({ error: 'Exceeds stock' }, { status: 400 });
    await db.cartItem.update({ where: { id }, data: { quantity } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.cartItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
