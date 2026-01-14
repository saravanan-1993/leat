import { Metadata } from 'next';
import CategoryDetailClient from '@/components/category/CategoryDetailClient';

export const metadata: Metadata = {
  title: 'Category | Leats - Fresh Groceries & Daily Essentials',
  description: 'Browse products in this category. Find fresh groceries, organic produce, and daily essentials at the best prices with fast delivery.',
  keywords: 'category, groceries, fresh products, online shopping, food delivery',
  openGraph: {
    title: 'Category | Leats',
    description: 'Browse products in this category',
    type: 'website',
  },
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  // URL formats:
  // /category/category-slug/categoryId - category page
  // /category/category-slug/subcategory-slug/subcategoryId - subcategory page
  
  const lastSegment = slug[slug.length - 1];
  
  // Check if this is a subcategory URL (4 segments: category-slug, subcategory-slug, subcategoryId)
  // or category URL (2 segments: category-slug, categoryId)
  const isSubcategoryUrl = slug.length >= 3;
  
  if (isSubcategoryUrl) {
    // Subcategory URL: /category/meat/fish/subcategoryId
    const subcategoryId = lastSegment;
    return <CategoryDetailClient subcategoryId={subcategoryId} />;
  } else {
    // Category URL: /category/meat/categoryId
    const categoryId = lastSegment;
    return <CategoryDetailClient categoryId={categoryId} />;
  }
}
