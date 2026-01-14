"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getCategories,
  type Category,
} from "@/services/online-services/frontendCategoryService";
import { generateCategorySlug } from "@/lib/slugify";
// import { useCurrency } from "@/hooks/useCurrency";

export default function DealsSection() {
  // const currencySymbol = useCurrency();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Static deals data - commented out for now
  // const deals = [
  //   {
  //     title: "Fresh Vegetables",
  //     discount: "Up to 40% OFF",
  //     image:
  //       "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop",
  //     link: "/category/fruits-vegetables",
  //   },
  //   {
  //     title: "Dairy Products",
  //     discount: `Starting ${currencySymbol}25`,
  //     image:
  //       "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop",
  //     link: "/category/dairy-bread-eggs",
  //   },
  //   {
  //     title: "Atta & Rice",
  //     discount: "Up to 20% OFF",
  //     image:
  //       "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop",
  //     link: "/category/atta-rice-dal",
  //   },
  //   {
  //     title: "Snacks & Drinks",
  //     discount: "Buy 2 Get 1 Free",
  //     image:
  //       "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=200&fit=crop",
  //     link: "/category/snacks-beverages",
  //   },
  // ];

  return (
    <section className="py-4 sm:py-6 md:py-8 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Today's Deals - Commented out static content */}
        {/* <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-5">
            Today&apos;s Deals
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {deals.map((deal, index) => (
              <Link
                key={index}
                href={deal.link}
                className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group border border-gray-100"
              >
                <div className="relative h-24 sm:h-28 md:h-32 bg-gray-50">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-gray-800 text-sm sm:text-base mb-1">
                    {deal.title}
                  </h3>
                  <p className="text-[#e63946] font-semibold text-xs sm:text-sm">
                    {deal.discount}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div> */}

        {/* Shop by Category */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-5">
            Shop by Category
          </h2>

          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg overflow-hidden border border-gray-100 animate-pulse"
                >
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-2 sm:p-3">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${generateCategorySlug(category.name)}/${
                    category.id
                  }`}
                  className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group border border-gray-100"
                >
                  <div className="relative w-full aspect-square bg-gray-50">
                    <Image
                      src={
                        category.image ||
                        "https://images.unsplash.com/photo-1604719312566-b7cb9663483b?q=80&w=300&auto=format&fit=crop"
                      }
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2 sm:p-3 text-center">
                    <span className="text-[10px] sm:text-xs md:text-sm text-gray-800 font-medium line-clamp-2 group-hover:text-[#e63946] transition-colors">
                      {category.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
