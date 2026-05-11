'use client';

import { useShopStore } from '@/store/shop-store';
import { ProductCard } from './product-card';
import { formatINR, calculateDiscount } from '@/lib/format';
import { ArrowRight, TrendingUp, Clock, Percent, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';

export function HomeView() {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    sortBy,
    setSortBy,
    navigateToProduct,
  } = useShopStore();

  const featuredProducts = useMemo(() => products.filter((p) => p.featured), [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter((p) => {
        const cat = categories.find((c) => c.id === p.categoryId);
        return cat?.slug === selectedCategory;
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.categoryName?.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
    }

    return filtered;
  }, [products, selectedCategory, searchQuery, sortBy, categories]);

  const currentCategory = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      {!searchQuery && !selectedCategory && (
        <section className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-amber-900 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop')] bg-cover bg-center opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-500/30">
                🔥 Great Indian Sale is Live!
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Shop the Best <span className="text-amber-400">Deals</span> in India
              </h1>
              <p className="text-slate-300 text-lg mb-6 max-w-lg">
                Up to 70% off on electronics, fashion, home essentials and more. Free delivery on orders above ₹499.
              </p>
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                  onClick={() => setSelectedCategory('electronics')}
                >
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => setSortBy('rating')}
                >
                  Top Rated
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trust badges */}
      {!searchQuery && !selectedCategory && (
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-5 w-5 text-emerald-600 shrink-0" />
                <span className="text-muted-foreground">Free Delivery ₹499+</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-5 w-5 text-emerald-600 shrink-0" />
                <span className="text-muted-foreground">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Percent className="h-5 w-5 text-emerald-600 shrink-0" />
                <span className="text-muted-foreground">Best Prices</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-5 w-5 text-emerald-600 shrink-0" />
                <span className="text-muted-foreground">Easy Returns</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {!searchQuery && !selectedCategory && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-white border border-border/50 hover:border-amber-300 hover:shadow-md transition-all duration-300"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-muted/30">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-sm font-medium text-center group-hover:text-amber-600 transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {!searchQuery && !selectedCategory && featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Featured Products</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Deal of the Day */}
      {!searchQuery && !selectedCategory && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 sm:p-8 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5" />
              <h2 className="text-xl sm:text-2xl font-bold">Deal of the Day</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products
                .filter((p) => p.originalPrice && calculateDiscount(p.price, p.originalPrice) >= 30)
                .slice(0, 3)
                .map((product) => (
                  <button
                    key={product.id}
                    onClick={() => navigateToProduct(product.id)}
                    className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors text-left"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-white/20">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-bold">{formatINR(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-sm line-through opacity-70">
                            {formatINR(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      {product.originalPrice && (
                        <Badge className="mt-1 bg-white/20 text-white hover:bg-white/30 text-xs">
                          {calculateDiscount(product.price, product.originalPrice)}% OFF
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products / Search Results */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : currentCategory
                ? currentCategory.name
                : 'All Products'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory(null);
                useShopStore.getState().setSearchQuery('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
