"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import { getPublishedPolicy, Policy } from "@/services/online-services/policyService";
import { Loader2 } from "lucide-react";

interface PolicyPageProps {
  slug: string;
  defaultTitle: string;
  defaultContent?: React.ReactNode;
}

export const PolicyPage = ({ slug, defaultTitle, defaultContent }: PolicyPageProps) => {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        setLoading(true);
        const data = await getPublishedPolicy(slug);
        if (data) {
          setPolicy(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error loading policy:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If no policy found or error, show default content
  if (error || !policy) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-[#e63946]">
                Home
              </Link>
              <IconChevronRight size={16} className="text-gray-400" />
              <span className="text-gray-800 font-medium">{defaultTitle}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-[90rem] mx-auto bg-white rounded-xl shadow-sm p-8">
            {defaultContent || (
              <div className="text-center py-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{defaultTitle}</h1>
                <p className="text-gray-500">This policy is currently being updated. Please check back later.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#e63946]">
              Home
            </Link>
            <IconChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-800 font-medium">{policy.title}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-[90rem] mx-auto bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{policy.title}</h1>
          {policy.lastUpdated && (
            <p className="text-gray-500 mb-8">
              Last updated: {new Date(policy.lastUpdated).toLocaleDateString()}
            </p>
          )}

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: policy.content }}
          />

          {policy.version > 1 && (
            <div className="mt-8 text-sm text-gray-500">
              Version {policy.version}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
