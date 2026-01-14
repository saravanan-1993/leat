import ProductsPageClient from '@/components/products/ProductsPageClient';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return await generatePageMetadata({
    pagePath: "/products",
    defaultTitle: "All Products | Leats - Fresh Groceries & Daily Essentials",
    defaultDescription: "Browse our wide selection of fresh groceries, fruits, vegetables, dairy products, and daily essentials. Shop online for quality products at the best prices with fast delivery.",
    defaultKeywords: "groceries, fresh products, online shopping, fruits, vegetables, dairy, daily essentials, food delivery",
  });
}

export default function ProductsPage() {
  return <ProductsPageClient />;
}
