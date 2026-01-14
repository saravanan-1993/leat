import { PolicyPage } from "@/components/policies/policy-page";
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return await generatePageMetadata({
    pagePath: "/terms",
    defaultTitle: "Terms & Conditions | Leats",
    defaultDescription: "Read our terms of service and user agreements.",
    defaultKeywords: "terms and conditions, terms of service, user agreement, legal",
  });
}

export default function TermsPage() {
  return <PolicyPage slug="terms-conditions" defaultTitle="Terms & Conditions" />;
}
