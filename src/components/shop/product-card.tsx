'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR, calculateDiscount } from '@/lib/format';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductType, CartItemType } from '@/lib/types';
import { toast } from 'sonner';

interface ProductCardProps {
  product: ProductType;
}

export function ProductCard({ product }: ProductCardProps) {
  const { navigateToProduct, addToCart, getCartCount } = useShopStore();
  const discount = calculateDiscount(product.price, product.originalPrice);
  const mainImage = product.images[0] || '';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cartItem: CartItemType = {
      id: `temp-${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productImage: mainImage,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      stock: product.stock,
    };
    addToCart(cartItem);
    toast.success(`${product.name} added to cart!`, {
      description: `Cart now has ${getCartCount() + 1} items`,
    });
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-border"
      onClick={() => navigateToProduct(product.id)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        <img
          src={mainImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
            {discount}% OFF
          </Badge>
        )}
        {product.featured && (
          <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold">
            ★ Featured
          </Badge>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <Badge variant="destructive" className="absolute bottom-2 left-2">
            Only {product.stock} left!
          </Badge>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-1">Out of Stock</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 mb-1 min-h-[2.5rem] group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount.toLocaleString('en-IN')})</span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-foreground">{formatINR(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatINR(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              toast.info('Added to wishlist!');
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
