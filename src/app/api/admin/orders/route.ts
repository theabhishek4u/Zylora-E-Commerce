import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const where = status ? { status } : {};
    const [orders, total] = await Promise.all([
      db.order.findMany({ where, include: { items: true }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      db.order.count({ where }),
    ]);
    return NextResponse.json({ orders, total, page, limit });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status, paymentStatus } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const data: Record<string, unknown> = {};
    if (status) data.status = status;
    if (paymentStatus) data.paymentStatus = paymentStatus;
    const order = await db.order.update({ where: { id }, data });
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
