import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const coupons = await db.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const coupon = await db.coupon.create({ data: { code: body.code.toUpperCase(), type: body.type || 'percentage', value: body.value, minOrder: body.minOrder || 0, maxDiscount: body.maxDiscount || null, usageLimit: body.usageLimit || null, active: body.active !== false, expiresAt: body.expiresAt ? new Date(body.expiresAt) : null } });
    return NextResponse.json(coupon);
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    if (data.expiresAt) data.expiresAt = new Date(data.expiresAt);
    const coupon = await db.coupon.update({ where: { id }, data });
    return NextResponse.json(coupon);
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await db.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}
