import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'featured';
    const featured = searchParams.get('featured');
    const onSale = searchParams.get('onSale');
    const newArrival = searchParams.get('newArrival');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const brand = searchParams.get('brand');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: Record<string, unknown> = {};

    if (category) {
      const cat = await db.category.findFirst({ where: { slug: category } });
      if (cat) where.categoryId = cat.id;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } },
      ];
    }
    if (featured === 'true') where.featured = true;
    if (onSale === 'true') where.onSale = true;
    if (newArrival === 'true') where.newArrival = true;
    if (brand) where.brand = { contains: brand };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, number>).gte = parseInt(minPrice);
      if (maxPrice) (where.price as Record<string, number>).lte = parseInt(maxPrice);
    }

    let orderBy: Record<string, unknown> = {};
    switch (sort) {
      case 'price-low': orderBy = { price: 'asc' }; break;
      case 'price-high': orderBy = { price: 'desc' }; break;
      case 'rating': orderBy = { rating: 'desc' }; break;
      case 'newest': orderBy = { createdAt: 'desc' }; break;
      default: orderBy = [{ featured: 'desc' }, { rating: 'desc' }];
    }

    const [products, total] = await Promise.all([
      db.product.findMany({ where, include: { category: { select: { name: true } } }, orderBy, skip: (page - 1) * limit, take: limit }),
      db.product.count({ where }),
    ]);

    const formatted = products.map((p) => ({ ...p, images: JSON.parse(p.images), tags: p.tags ? JSON.parse(p.tags) : null, categoryName: p.category.name }));

    return NextResponse.json({ products: formatted, total, page, limit });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
