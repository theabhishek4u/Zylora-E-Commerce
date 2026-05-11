import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await db.product.findUnique({
      where: { id },
      include: { category: { select: { name: true, slug: true } }, reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: 'desc' } } },
    });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ ...product, images: JSON.parse(product.images), tags: product.tags ? JSON.parse(product.tags) : null, categoryName: product.category.name, categorySlug: product.category.slug, reviews: product.reviews.map((r) => ({ ...r, userName: r.user.name })) });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
