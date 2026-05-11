import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { generateOrderNumber } from '@/lib/format';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, customerName, email, phone, address, city, state, pincode, paymentMethod, couponCode, items: bodyItems } = body;

    if (!customerName || !email || !phone || !address || !city || !state || !pincode || !paymentMethod) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    let orderItems = bodyItems;
    if (!orderItems || orderItems.length === 0) {
      // Get from cart
      const cart = userId
        ? await db.cart.findUnique({ where: { userId }, include: { items: { include: { product: true } } } })
        : null;
      if (!cart || cart.items.length === 0) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
      orderItems = cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity, product: i.product }));
    }

    // Validate stock
    for (const item of orderItems) {
      const product = item.product || await db.product.findUnique({ where: { id: item.productId } });
      if (!product || product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product?.name || item.productId}` }, { status: 400 });
      }
    }

    // Calculate total
    let totalAmount = 0;
    const orderItemData = [];
    for (const item of orderItems) {
      const product = item.product || await db.product.findUnique({ where: { id: item.productId } });
      totalAmount += product.price * item.quantity;
      orderItemData.push({ productId: product.id, productName: product.name, productImage: JSON.parse(product.images)[0] || '', price: product.price, quantity: item.quantity });
    }

    // Apply coupon
    let discount = 0;
    if (couponCode) {
      const coupon = await db.coupon.findFirst({ where: { code: couponCode, active: true } });
      if (coupon && (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date())) {
        if (totalAmount >= coupon.minOrder) {
          if (coupon.type === 'percentage') {
            discount = Math.min(Math.floor(totalAmount * coupon.value / 100), coupon.maxDiscount || Infinity);
          } else {
            discount = Math.min(coupon.value, totalAmount);
          }
        }
      }
    }

    const finalAmount = totalAmount - discount;

    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: userId || null,
        customerName, email, phone, address, city, state, pincode,
        totalAmount: finalAmount,
        discount,
        couponCode: couponCode || null,
        status: 'confirmed',
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        items: { create: orderItemData },
      },
      include: { items: true },
    });

    // Update stock
    for (const item of orderItems) {
      await db.product.update({ where: { id: item.productId || item.product?.id }, data: { stock: { decrement: item.quantity } } });
    }

    // Clear cart
    if (userId) {
      const cart = await db.cart.findUnique({ where: { userId } });
      if (cart) await db.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
