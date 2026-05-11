'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR, calculateDiscount } from '@/lib/format';
import { Star, ShoppingCart, Heart, ArrowLeft, Truck, Shield, RotateCcw, Minus, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProductType, CartItemType } from '@/lib/types';
import { toast } from 'sonner';
import { useState, useEffect, useMemo } from 'react';

export function ProductDetailView() {
  const {
    selectedProductId,
    products,
    categories,
    setCurrentView,
    addToCart,
    getCartCount,
  } = useShopStore();

  return <ProductDetailInner key={selectedProductId} selectedProductId={selectedProductId} products={products} categories={categories} setCurrentView={setCurrentView} addToCart={addToCart} getCartCount={getCartCount} />;
}

function ProductDetailInner({ selectedProductId, products, categories, setCurrentView, addToCart, getCartCount }: {
  selectedProductId: string | null;
  products: ProductType[];
  categories: { id: string; name: string; slug: string }[];
  setCurrentView: (view: 'home' | 'cart' | 'checkout' | 'orders' | 'order-detail' | 'order-success' | 'product') => void;
  addToCart: (item: CartItemType) => void;
  getCartCount: () => number;
}) {
  const foundProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || null,
    [products, selectedProductId]
  );
  const [fetchedProduct, setFetchedProduct] = useState<ProductType | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = foundProduct || fetchedProduct;

  useEffect(() => {
    if (selectedProductId && !foundProduct) {
      fetch(`/api/products/${selectedProductId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            setFetchedProduct(data);
          }
        })
        .catch(console.error);
    }
  }, [selectedProductId, foundProduct]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Product not found</p>
        <Button onClick={() => setCurrentView('home')} className="mt-4">
          Go Home
        </Button>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.originalPrice);
  const category = categories.find((c) => c.id === product.categoryId);

  const handleAddToCart = () => {
    const mainImage = product.images[0] || '';
    const cartItem: CartItemType = {
      id: `temp-${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productImage: mainImage,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity,
      stock: product.stock,
    };
    addToCart(cartItem);
    toast.success(`${product.name} added to cart!`, {
      description: `${quantity} item${quantity > 1 ? 's' : ''} · ${formatINR(product.price * quantity)}`,
      action: {
        label: 'View Cart',
        onClick: () => setCurrentView('cart'),
      },
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setCurrentView('cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <button onClick={() => setCurrentView('home')} className="hover:text-foreground transition-colors">
          Home
        </button>
        <span>/</span>
        {category && (
          <>
            <button
              onClick={() => {
                useShopStore.getState().setSelectedCategory(category.slug);
                setCurrentView('home');
              }}
              className="hover:text-foreground transition-colors"
            >
              {category.name}
            </button>
            <span>/</span>
          </>
        )}
        <span className="text-foreground truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted/20 border border-border/50">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImage === idx ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-border hover:border-amber-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {category && (
              <Badge variant="secondary" className="mb-2">{category.name}</Badge>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-emerald-600 text-white px-2.5 py-0.5 rounded-md text-sm font-semibold">
              {product.rating} <Star className="h-3 w-3 fill-white" />
            </div>
            <span className="text-sm text-muted-foreground">
              {product.reviewCount.toLocaleString('en-IN')} ratings
            </span>
          </div>

          {/* Price */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">{formatINR(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 font-semibold">
                    {discount}% OFF
                  </Badge>
                </>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-sm text-emerald-600 font-medium">
                You save {formatINR(product.originalPrice - product.price)} on this purchase
              </p>
            )}
            <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
          </div>

          {/* Stock Status */}
          <div>
            {product.stock > 10 ? (
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <Check className="h-3 w-3 mr-1" /> In Stock
              </Badge>
            ) : product.stock > 0 ? (
              <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                Only {product.stock} left in stock - order soon!
              </Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-r-none"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-l-none"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">(max {product.stock})</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-base h-12"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-base h-12"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 shrink-0"
              onClick={() => toast.info('Added to wishlist!')}
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          <Separator />

          {/* Delivery Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-medium">Free Delivery</span>
                <span className="text-muted-foreground"> on orders above ₹499</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-medium">Secure Payment</span>
                <span className="text-muted-foreground"> · UPI, Cards, Net Banking, COD</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-medium">7-Day Returns</span>
                <span className="text-muted-foreground"> · Easy return policy</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Product Description</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
