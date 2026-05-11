import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    if (!productId) return NextResponse.json([]);
    const reviews = await db.review.findMany({ where: { productId }, include: { user: { select: { name: true } } }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(reviews.map((r) => ({ ...r, userName: r.user.name })));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, productId, rating, title, comment } = await request.json();
    if (!userId || !productId || !rating || !comment) return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    const review = await db.review.upsert({ where: { userId_productId: { userId, productId } }, update: { rating, title, comment }, create: { userId, productId, rating, title, comment, verified: true } });
    // Update product rating
    const reviews = await db.review.findMany({ where: { productId } });
    const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await db.product.update({ where: { id: productId }, data: { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length } });
    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
