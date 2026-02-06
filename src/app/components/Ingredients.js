// src/app/components/IngredientsSection.js
"use client";

import React from "react";
import Image from "next/image";
import { Playfair_Display, DM_Sans } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function IngredientsSection() {
  return (
    <section
    id="Ingredients"
      aria-label="Ingredients - Devi Spicy Chicken Pickles"
      className={`${dmSans.className} text-white`}
      style={{
        background:
          "radial-gradient(circle at top left, #FFF5E4 0%, #FFFFFF 45%, #FFFFFF 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        {/* ✅ use normal gaps so content doesn't stretch too wide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* LEFT – image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[380px] lg:h-[380px]">
              {/* ✅ keep image within its box, no huge scaling */}
              <div className="relative w-full h-full overflow-hidden 2xl:scale-[1.70] flex items-center justify-center">
                <Image
                  src="/images/ingredients/ingre.png"
                  alt="Fresh ingredients and chicken pickle"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* RIGHT – text */}
          <div className="lg:col-span-7">
            <h2
              className={`${playfair.className} text-3xl sm:text-4xl lg:text-[2.6rem] font-bold leading-tight mb-4 text-[#1A1A1A]`}
            >
              We keep our
              <span className="text-[#ff4b4b]"> ingredients </span>
              <span className="text-[#F6B35E]">simple</span>, never compromised.
            </h2>

            <p className="text-sm sm:text-base text-gray-700 max-w-2xl mb-8">
              Every jar of <strong>Devi Spicy Chicken Pickle</strong> is made
              with cold-pressed groundnut oil, clean chicken and bold Telangana
              spices. No shortcuts, no hidden additives – just ingredients that
              are good for your taste buds and kinder on your health.
            </p>

            {/* BULLET GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 mb-10 text-sm sm:text-base text-[#1A1A1A]">
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#1f2a24] text-xs text-white">
                  🥜
                </span>
                <div>
                  <p className="font-semibold">Cold-Pressed Groundnut Oil</p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Retains natural nutrients and healthy fats with zero
                    refining.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#261f2a] text-xs text-white">
                  🌶️
                </span>
                <div>
                  <p className="font-semibold">Authentic Telangana Spices</p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Hand-roasted chilli, garlic and spices for that fiery,
                    homely kick.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#222631] text-xs text-white">
                  🐔
                </span>
                <div>
                  <p className="font-semibold">Tender, Clean Chicken</p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Carefully cleaned pieces, trimmed and cooked slow for better
                    digestion.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#222b24] text-xs text-white">
                  💚
                </span>
                <div>
                  <p className="font-semibold">Good for Everyday Health</p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    No artificial preservatives – just balanced oils, protein
                    and spices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
