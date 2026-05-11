import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json([]);
    const notifications = await db.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, all, userId } = await request.json();
    if (all && userId) {
      await db.notification.updateMany({ where: { userId }, data: { read: true } });
    } else if (id) {
      await db.notification.update({ where: { id }, data: { read: true } });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notifications:', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
