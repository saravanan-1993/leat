'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DynamicProductCard from './DynamicProductCard';
import { getHomepageProducts, type Product } from '@/services/online-services/frontendProductService';

export default function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products with "Trending" badge from homepage products
        const response = await getHomepageProducts({
          badge: 'Trending',
          limit: 10,
        });
        
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching trending products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-4 sm:py-6 md:py-8 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Trending Products</h2>
              <p className="text-xs sm:text-sm text-gray-500">Best deals with maximum savings</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Don't render section if no products
  if (error || products.length === 0) {
    return null;
  }

  return (
    <section className="py-4 sm:py-6 md:py-8 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Trending Products</h2>
            <p className="text-xs sm:text-sm text-gray-500">Best deals with maximum savings</p>
          </div>
          <Link 
            href="/products" 
            className="text-[#e63946] font-medium hover:underline text-xs sm:text-sm md:text-base"
          >
            View All →
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {products.map((product) => (
            <DynamicProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
