import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const [products, total] = await Promise.all([
      db.product.findMany({ include: { category: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      db.product.count(),
    ]);
    return NextResponse.json({ products: products.map((p) => ({ ...p, images: JSON.parse(p.images), tags: p.tags ? JSON.parse(p.tags) : null, categoryName: p.category.name })), total, page, limit });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = await db.product.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
        description: body.description || '',
        brand: body.brand || null,
        sku: body.sku || null,
        price: body.price,
        originalPrice: body.originalPrice || null,
        images: JSON.stringify(body.images || []),
        stock: body.stock || 0,
        rating: 0,
        reviewCount: 0,
        featured: body.featured || false,
        onSale: body.onSale || false,
        newArrival: body.newArrival || false,
        categoryId: body.categoryId,
        tags: body.tags ? JSON.stringify(body.tags) : null,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    if (data.images) data.images = JSON.stringify(data.images);
    if (data.tags) data.tags = JSON.stringify(data.tags);
    if (data.slug) data.slug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const product = await db.product.update({ where: { id }, data });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
