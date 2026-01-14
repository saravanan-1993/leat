'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories, type Category } from '@/services/online-services/frontendCategoryService';
import { generateCategoryUrl } from '@/lib/slugify';

export default function CategoriesPageClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="text-[#e63946] hover:underline">Home</Link>
            <span>/</span>
            <span className="text-gray-900">All Categories</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h1>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200"></div>
                <div className="text-center">
                  <div className="h-5 bg-gray-200 rounded mb-2 mx-auto w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mx-auto w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id}
                href={generateCategoryUrl(category)}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                      📦
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.subcategories?.length || 0} Subcategories</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
