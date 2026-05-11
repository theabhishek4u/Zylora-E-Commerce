import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || 'featured';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const where: Record<string, unknown> = {};

    if (category) {
      const cat = await db.category.findFirst({ where: { slug: category } });
      if (cat) where.categoryId = cat.id;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, number>).gte = parseInt(minPrice);
      if (maxPrice) (where.price as Record<string, number>).lte = parseInt(maxPrice);
    }

    let orderBy: Record<string, unknown> = {};
    switch (sort) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'featured':
      default:
        orderBy = [{ featured: 'desc' }, { rating: 'desc' }];
        break;
    }

    const products = await db.product.findMany({
      where,
      include: {
        category: { select: { name: true } },
      },
      orderBy,
    });

    const formatted = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images),
      categoryName: p.category.name,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
