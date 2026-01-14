'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DynamicProductCard from './DynamicProductCard';
import { getHomepageProducts, type Product } from '@/services/online-services/frontendProductService';
import { getCategories, type Category } from '@/services/online-services/frontendCategoryService';

export default function PopularProducts() {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch bestseller products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products with "Bestseller" badge from homepage products
        const response = await getHomepageProducts({
          badge: 'Bestseller',
          category: activeCategory || undefined,
          limit: 10,
        });
        
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching bestseller products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  // Don't render section if no products and not loading
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-4 sm:py-6 md:py-8 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Best Sellers</h2>
            <p className="text-xs sm:text-sm text-gray-500">Most popular products near you</p>
          </div>
          <Link 
            href="/products" 
            className="text-[#e63946] font-medium hover:underline text-xs sm:text-sm md:text-base"
          >
            View All →
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors active:scale-95 ${
              activeCategory === ''
                ? 'bg-[#e63946] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.slice(0, 6).map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.name)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors active:scale-95 ${
                activeCategory === category.name
                  ? 'bg-[#e63946] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
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
        ) : error ? (
          <div className="text-center py-8 text-gray-500">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {products.map((product) => (
              <DynamicProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
