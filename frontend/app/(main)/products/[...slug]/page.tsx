import { Metadata } from 'next';
import ProductDetailClient from '@/components/products/ProductDetailClient';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Product Details | Leats - Fresh Groceries & Daily Essentials',
    description: 'View detailed information about this product including price, variants, specifications, and customer reviews. Shop online for quality products with fast delivery.',
    keywords: 'product details, online shopping, groceries, fresh products, buy online',
    openGraph: {
      title: 'Product Details | Leats',
      description: 'View detailed product information and shop online',
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const productId = slug[slug.length - 1];
  
  return <ProductDetailClient productId={productId} />;
}
