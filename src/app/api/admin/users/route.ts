import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const [users, total] = await Promise.all([
      db.user.findMany({ select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true, _count: { select: { orders: true } } }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      db.user.count(),
    ]);
    return NextResponse.json({ users, total, page, limit });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, role } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const user = await db.user.update({ where: { id }, data: { role } });
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
