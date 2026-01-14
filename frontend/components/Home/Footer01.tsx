"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandYoutube,
} from "@tabler/icons-react";
import {
  getWebSettings,
  type WebSettings,
} from "@/services/online-services/webSettingsService";

export default function Footer01() {
  const [webSettings, setWebSettings] = useState<WebSettings | null>(null);
  const webSettingsCacheRef = useRef<WebSettings | null>(null);

  // Fetch web settings on mount with caching
  useEffect(() => {
    const fetchWebSettings = async () => {
      try {
        // Check cache first
        if (webSettingsCacheRef.current) {
          setWebSettings(webSettingsCacheRef.current);
        } else {
          // Fetch web settings only if not cached
          const settingsResponse = await getWebSettings();
          if (settingsResponse.success) {
            setWebSettings(settingsResponse.data);
            webSettingsCacheRef.current = settingsResponse.data; // Cache the settings
          }
        }
      } catch (err) {
        console.error("Error fetching web settings:", err);
      }
    };

    fetchWebSettings();
  }, []);
  return (
    <footer className="bg-gray-900 text-gray-300 pt-8 sm:pt-12 pb-4 sm:pb-6">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center mb-3 sm:mb-4">
              {webSettings?.logoUrl ? (
                <Image
                  src={webSettings.logoUrl}
                  alt="Logo"
                  width={180}
                  height={64}
                  className="h-12 sm:h-14 lg:h-16 w-auto object-contain"
                  priority
                />
              ) : (
                <span className="text-white font-bold text-2xl sm:text-3xl">
                  LEATS
                </span>
              )}
            </Link>
            <p className="text-xs sm:text-sm mb-3 sm:mb-4 text-gray-400">
              Your one-stop shop for fresh groceries, daily essentials, and
              household items. We deliver quality products at the best prices,
              right to your doorstep.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <a
                href="#"
                className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#e63946] transition-colors active:scale-95"
              >
                <IconBrandFacebook
                  size={16}
                  className="sm:w-[18px] sm:h-[18px]"
                />
              </a>
              <a
                href="#"
                className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#e63946] transition-colors active:scale-95"
              >
                <IconBrandTwitter
                  size={16}
                  className="sm:w-[18px] sm:h-[18px]"
                />
              </a>
              <a
                href="#"
                className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#e63946] transition-colors active:scale-95"
              >
                <IconBrandInstagram
                  size={16}
                  className="sm:w-[18px] sm:h-[18px]"
                />
              </a>
              <a
                href="#"
                className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#e63946] transition-colors active:scale-95"
              >
                <IconBrandYoutube
                  size={16}
                  className="sm:w-[18px] sm:h-[18px]"
                />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
              Quick Links
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#e63946] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#e63946] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-[#e63946] transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/my-orders"
                  className="hover:text-[#e63946] transition-colors"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
              Customer Service
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-[#e63946] transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="hover:text-[#e63946] transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#e63946] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[#e63946] transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
              Contact Us
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>123 Main Street, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>1800-123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <span>support@leats.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
