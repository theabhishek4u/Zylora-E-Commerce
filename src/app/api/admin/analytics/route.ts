import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const totalOrders = await db.order.count();
    const totalUsers = await db.user.count();
    const totalProducts = await db.product.count();
    const pendingOrders = await db.order.count({ where: { status: 'pending' } });
    const orders = await db.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' }, take: 10 });
    const revenueResult = await db.order.aggregate({ _sum: { totalAmount: true } });
    const revenue = revenueResult._sum.totalAmount || 0;

    // Top products from order items
    const allOrderItems = await db.orderItem.findMany();
    const productMap = new Map<string, { name: string; sold: number; revenue: number }>();
    for (const item of allOrderItems) {
      const existing = productMap.get(item.productId);
      if (existing) {
        existing.sold += item.quantity;
        existing.revenue += item.price * item.quantity;
      } else {
        productMap.set(item.productId, { name: item.productName, sold: item.quantity, revenue: item.price * item.quantity });
      }
    }
    const topProducts = Array.from(productMap.values()).sort((a, b) => b.sold - a.sold).slice(0, 5);

    return NextResponse.json({
      totalSales: orders.length,
      totalOrders,
      totalUsers,
      totalProducts,
      pendingOrders,
      revenue,
      recentOrders: orders,
      topProducts,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
