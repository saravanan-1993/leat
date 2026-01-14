import { PolicyPage } from "@/components/policies/policy-page";
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return await generatePageMetadata({
    pagePath: "/privacy",
    defaultTitle: "Privacy Policy | Leats",
    defaultDescription: "Learn about how we collect, use, and protect your personal data.",
    defaultKeywords: "privacy policy, data protection, personal information, privacy",
  });
}

export default function PrivacyPage() {
  return <PolicyPage slug="privacy-policy" defaultTitle="Privacy Policy" />;
}
