import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, orderTotal } = await request.json();
    if (!code || !orderTotal) return NextResponse.json({ error: 'Code and order total required' }, { status: 400 });
    const coupon = await db.coupon.findFirst({ where: { code, active: true } });
    if (!coupon) return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return NextResponse.json({ error: 'Coupon expired' }, { status: 400 });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
    if (orderTotal < coupon.minOrder) return NextResponse.json({ error: `Minimum order amount is ₹${coupon.minOrder}` }, { status: 400 });

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.min(Math.floor(orderTotal * coupon.value / 100), coupon.maxDiscount || Infinity);
    } else {
      discount = Math.min(coupon.value, orderTotal);
    }

    return NextResponse.json({ coupon: { code: coupon.code, type: coupon.type, value: coupon.value }, discount });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
