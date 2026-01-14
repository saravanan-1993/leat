import HeroSection from '@/components/Home/HeroSection';
import PopularProducts from '@/components/Home/PopularProducts';
import DealsSection from '@/components/Home/DealsSection';
import MidBannerCategory from '@/components/Home/MidBannerCategory';
import TrendingProducts from '@/components/Home/TrendingProducts';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return await generatePageMetadata({
    pagePath: "/",
    defaultTitle: "Home - ECommerce Store",
    defaultDescription: "Welcome to our online store. Shop quality products at great prices.",
    defaultKeywords: "ecommerce, online shopping, home, products",
  });
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <PopularProducts />
      <DealsSection />
      <MidBannerCategory />
      <TrendingProducts />
      
    </div>
  );
}
