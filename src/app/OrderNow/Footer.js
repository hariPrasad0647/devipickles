// src/app/components/Footer.js
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function Footer() {
  return (
    <footer
      className={`${dmSans.className} border-t border-[#F5E6CC]`}
      style={{
        background:
          "radial-gradient(circle at top left, #FFF5E4 0%, #FFFFFF 45%, #FFFFFF 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 lg:pt-14 lg:pb-8">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
          {/* BRAND */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image
                src="/images/navbar/Logo.png"
                alt="Devi Spicy Chicken Pickles"
                width={70}
                height={70}
                className="object-contain"
              />
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">
                  Devi Spicy Chicken Pickles
                </p>
                <p className="text-xs text-gray-600">
                  Pure ingredients. Real flavour. Zero compromise.
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mt-2">
              Small-batch, homemade-style chicken pickles crafted with pure
              cold-pressed groundnut oil and authentic Telangana spices –
              delivered fresh to your doorstep.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li>
                <Link href={"/about-us"} className="hover:text-[#FF3E3E] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#ingredients"
                  className="hover:text-[#FF3E3E] transition"
                >
                  Our Ingredients
                </Link>
              </li>
              <li>
                <Link
                  href="/#Offers"
                  className="hover:text-[#FF3E3E] transition"
                >
                  Today&apos;s Offers
                </Link>
              </li>
              <li>
                <Link href="#faqs" className="hover:text-[#FF3E3E] transition">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT / SUPPORT */}
          <div>
            <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">
              Contact & Support
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <p className="mt-1">
                Email:{" "}
                <a
                  href="mailto:devispicypickles@gmail.com"
                  className="text-[#f34332] hover:text-[#c83225] underline-offset-2 hover:underline transition-colors"
                >
                  devispicypickles@gmail.com
                </a>
              </p>

              <p className="mt-1">
                Phone:{" "}
                <a
                  href="tel:+918500156333"
                  className="text-[#f34332] hover:text-[#c83225] underline-offset-2 hover:underline transition-colors"
                >
                  +91 8500156333
                </a>
              </p>

              <p className="mt-1">
                WhatsApp:{" "}
                <a
                  href="https://wa.me/918500156333"
                  className="text-[#f34332] hover:text-[#c83225] underline-offset-2 hover:underline transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat with us on WhatsApp
                </a>
              </p>

            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-[#F5E6CC] mt-8 pt-4" />

        {/* BOTTOM BAR */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-40">
          {/* LEFT: COPYRIGHT */}
          <p className="text-[18px] sm:text-xs text-gray-500">
            © {new Date().getFullYear()} Devi Spicy Chicken Pickles. All rights
            reserved.
          </p>

          {/* CENTER: POLICIES */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs text-gray-500">
            <Link href="/termsAndConditions" className="hover:text-[#FF3E3E] transition">
              Terms & Conditions
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/privacyPolicy"
              className="hover:text-[#FF3E3E] transition"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/returnsAndRefund"
              className="hover:text-[#FF3E3E] transition"
            >
              Shipping & Returns
            </Link>
          </div>

          {/* RIGHT: RAZORPAY STRIP */}

        </div>
      </div>
    </footer>
  );
}
