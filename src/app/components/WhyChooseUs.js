// src/app/components/WhyChooseUs.js
"use client";

import React from "react";
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

export default function WhyChooseUs() {
  return (
    <section
      aria-label="Why Choose Us - Devi Spicy Chicken Pickles"
      className={`${dmSans.className} text-[#1A1A1A]`}
      style={{
        background:
          "radial-gradient(circle at top left, #FFF5E4 0%, #FFFFFF 45%, #FFFFFF 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        
        {/* HEADING */}
        <div className="text-center mb-12">
          <h2
            className={`${playfair.className} text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A]`}
          >
            Why Choose <span className="text-[#FF4E4E]">Devi Chicken Pickles?</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-700 max-w-2xl mx-auto">
            A healthier, tastier, preservative-free pickle crafted the way it’s done at home.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <Feature
            icon="🏠"
            title="100% Homemade Quality"
            desc="Crafted in small batches with care — never factory-made."
          />

          <Feature
            icon="🥜"
            title="Pure Cold-Pressed Oil"
            desc="Retains nutrients & healthy fats, enhancing both taste and digestion."
          />

          <Feature
            icon="❌"
            title="No Preservatives"
            desc="Zero chemicals, zero artificial flavors — only natural ingredients."
          />

          <Feature
            icon="🐔"
            title="Clean, Tender Chicken"
            desc="Fresh chicken slow-cooked for soft texture and deep flavor."
          />

          <Feature
            icon="🌶️"
            title="Authentic Telangana Spices"
            desc="Hand-roasted masalas with a unique, addictive homemade aroma."
          />

          <Feature
            icon="💪"
            title="Protein + Healthy Fats"
            desc="A guilt-free indulgence made for both health and taste lovers."
          />

          <Feature
            icon="⭐"
            title="Consistent Every Time"
            desc="Small-batch cooking ensures the same delicious taste in every jar."
          />

          <Feature
            icon="👨‍👩‍👧"
            title="Made for All Ages"
            desc="Balanced spices make it enjoyable for both kids & adults."
          />

          <Feature
            icon="❤️"
            title="Loved Across India"
            desc="Customers say it tastes like home — rich, nostalgic & comforting."
          />
        </div>

      </div>
    </section>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="p-6 bg-white/90 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}
