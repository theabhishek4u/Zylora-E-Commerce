import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json([]);
    const addresses = await db.address.findMany({ where: { userId }, orderBy: { isDefault: 'desc' } });
    return NextResponse.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, name, phone, address, city, state, pincode, isDefault, type } = await request.json();
    if (!userId || !name || !phone || !address || !city || !state || !pincode) return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    if (isDefault) await db.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    const addr = await db.address.create({ data: { userId, name, phone, address, city, state, pincode, isDefault: isDefault || false, type: type || 'home' } });
    return NextResponse.json(addr);
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    if (data.isDefault) await db.address.updateMany({ where: { userId: data.userId, isDefault: true }, data: { isDefault: false } });
    const addr = await db.address.update({ where: { id }, data });
    return NextResponse.json(addr);
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await db.address.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
