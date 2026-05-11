'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR, calculateDiscount } from '@/lib/format';
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function CartView() {
  const {
    cartItems,
    updateCartItemQuantity,
    removeFromCart,
    getCartTotal,
    setCurrentView,
  } = useShopStore();

  const total = getCartTotal();
  const totalSavings = cartItems.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);
  const deliveryCharge = total >= 499 ? 0 : 49;
  const grandTotal = total + deliveryCharge;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground/30 mb-6" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven&apos;t added anything to your cart yet. Start shopping to find amazing deals!
          </p>
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            onClick={() => setCurrentView('home')}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <p className="text-sm text-muted-foreground">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const discount = calculateDiscount(item.price, item.originalPrice);
            return (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-muted/20 shrink-0 cursor-pointer"
                      onClick={() => useShopStore.getState().navigateToProduct(item.productId)}
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold text-sm sm:text-base line-clamp-2 cursor-pointer hover:text-amber-600 transition-colors"
                        onClick={() => useShopStore.getState().navigateToProduct(item.productId)}
                      >
                        {item.productName}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-bold text-base sm:text-lg">{formatINR(item.price)}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <>
                            <span className="text-sm text-muted-foreground line-through">
                              {formatINR(item.originalPrice)}
                            </span>
                            <span className="text-xs text-emerald-600 font-semibold">{discount}% OFF</span>
                          </>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground mt-2">
                        Subtotal: <span className="font-semibold text-foreground">{formatINR(item.price * item.quantity)}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-36">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatINR(total + totalSavings)}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600">Discount</span>
                  <span className="text-emerald-600">−{formatINR(totalSavings)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className={deliveryCharge === 0 ? 'text-emerald-600 font-medium' : ''}>
                  {deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span className="text-amber-600">{formatINR(grandTotal)}</span>
              </div>
              {totalSavings > 0 && (
                <p className="text-xs text-emerald-600 font-medium text-center bg-emerald-50 rounded-lg p-2">
                  🎉 You&apos;ll save {formatINR(totalSavings)} on this order!
                </p>
              )}
              <Button
                size="lg"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-base h-12"
                onClick={() => setCurrentView('checkout')}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCurrentView('home')}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
