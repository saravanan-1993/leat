'use client';

import { IconMapPin, IconPhone, IconMail } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePageSEO } from '@/lib/seo';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  // Apply dynamic SEO
  useEffect(() => {
    usePageSEO('/contact');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">

      
      <div className="bg-white border-b">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Link href="/" className="text-[#E63946] hover:underline">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">Contact Us</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Get in Touch</h1>
          <p className="text-sm sm:text-base text-gray-600">We are here to help you</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div className="bg-white rounded-lg p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <IconPhone size={18} className="text-[#E63946] sm:w-[22px] sm:h-[22px]" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Call Us</h3>
            <p className="text-gray-600 text-sm">1800-123-4567</p>
            <p className="text-xs sm:text-sm text-gray-500">Mon-Sat, 8am-8pm</p>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <IconMail size={18} className="text-[#E63946] sm:w-[22px] sm:h-[22px]" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Email Us</h3>
            <p className="text-gray-600 text-sm">support@leats.com</p>
            <p className="text-xs sm:text-sm text-gray-500">We reply within 24 hrs</p>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <IconMapPin size={18} className="text-[#E63946] sm:w-[22px] sm:h-[22px]" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Visit Us</h3>
            <p className="text-gray-600 text-sm">123 Main Street, Mumbai</p>
            <p className="text-xs sm:text-sm text-gray-500">Maharashtra 400001</p>
          </div>
        </div>

        <div className="max-w-xl mx-auto bg-white rounded-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] text-sm"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] text-sm"
                required
              />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] text-sm"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] resize-none text-sm"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-[#E63946] text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-[#C62E39] text-sm sm:text-base"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>


    </div>
  );
}
