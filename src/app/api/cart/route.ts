import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function getSessionId(request: NextRequest): string {
  let sessionId = request.cookies.get('zshop-session')?.value;
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  return sessionId;
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);
    let cart = await db.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: true, price: true, originalPrice: true, stock: true },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await db.cart.create({
        data: { sessionId },
        include: {
          items: {
            include: {
              product: {
                select: { name: true, images: true, price: true, originalPrice: true, stock: true },
              },
            },
          },
        },
      });
    }

    const formattedItems = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      productImage: JSON.parse(item.product.images)[0] || '',
      price: item.product.price,
      originalPrice: item.product.originalPrice,
      quantity: item.quantity,
      stock: item.product.stock,
    }));

    const response = NextResponse.json({ items: formattedItems, cartId: cart.id });

    // Set session cookie if not set
    if (!request.cookies.get('zshop-session')) {
      response.cookies.set('zshop-session', sessionId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Check product exists and has stock
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    if (product.stock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    // Get or create cart
    let cart = await db.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!cart) {
      cart = await db.cart.create({
        data: { sessionId },
        include: { items: true },
      });
    }

    // Check if product already in cart
    const existingItem = cart.items.find((item) => item.productId === productId);
    if (existingItem) {
      const newQuantity = Math.min(existingItem.quantity + quantity, product.stock);
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    // Fetch updated cart
    const updatedCart = await db.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: true, price: true, originalPrice: true, stock: true },
            },
          },
        },
      },
    });

    const formattedItems = updatedCart!.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      productImage: JSON.parse(item.product.images)[0] || '',
      price: item.product.price,
      originalPrice: item.product.originalPrice,
      quantity: item.quantity,
      stock: item.product.stock,
    }));

    const response = NextResponse.json({ items: formattedItems, cartId: updatedCart!.id });

    if (!request.cookies.get('zshop-session')) {
      response.cookies.set('zshop-session', sessionId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);
    const body = await request.json();
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    // Verify cart belongs to session
    const cart = await db.cart.findUnique({ where: { sessionId } });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    await db.cartItem.delete({
      where: { id: itemId, cartId: cart.id },
    });

    const updatedCart = await db.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: true, price: true, originalPrice: true, stock: true },
            },
          },
        },
      },
    });

    const formattedItems = (updatedCart?.items || []).map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      productImage: JSON.parse(item.product.images)[0] || '',
      price: item.product.price,
      originalPrice: item.product.originalPrice,
      quantity: item.quantity,
      stock: item.product.stock,
    }));

    return NextResponse.json({ items: formattedItems });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}
