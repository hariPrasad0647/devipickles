// components/AboutSection.js
"use client";

import React from "react";
import Image from "next/image";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Link from "next/link";

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

export default function AboutSection() {
  return (
    <section
      aria-label="About Devi Spicy Chicken Pickles"
      className={`${dmSans.className} text-white`}
      style={{
        background:
          "radial-gradient(circle at top left, #FFF5E4 0%, #FFFFFF 45%, #FFFFFF 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* LEFT – CONTENT (MOVED FROM RIGHT) */}
          <div className="lg:col-span-7 order-2 lg:order-1">


            {/* heading */}
            <h2
              className={`${playfair.className} text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-[#1A1A1A]`}
            >
              We’re more than
              <span className="text-[#FF5C5C]"> just a pickle brand</span>
            </h2>

            <p className="mt-4 text-lg text-[#4A3B34]">
              Devi Spicy Chicken Pickles was born from a simple idea –{" "}
              <span className="font-semibold">bottle the comfort of homemade food</span>
              and share it with people who miss that authentic, spicy, mom-made taste.
            </p>

            <p className="mt-4 text-sm sm:text-base text-[#6D6D6D] max-w-2xl">
              Every batch is cooked the way it’s done in Telangana homes: tender chicken
              slow-cooked in <strong>pure cold-pressed groundnut oil</strong>, layered with
              hand-pounded regional spices and finished in small batches for consistent
              flavour. No shortcuts, no premixes, and absolutely{" "}
              <strong>no added preservatives</strong>.
            </p>

            {/* features */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base text-[#1A1A1A]">

              <div className="flex items-start gap-3">
                <span className="mt-1 text-[#FFB347] text-lg">👩‍🍳</span>
                <div>
                  <p className="font-semibold">Family Recipe</p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Passed down across generations, adapted for today but rooted in tradition.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 text-[#FFB347] text-lg">🌶️</span>
                <div>
                  <p className="font-semibold">Telangana Spice Blend</p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Sun-dried chillies and whole spices roasted and ground fresh for each batch.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 text-[#FFB347] text-lg">🥜</span>
                <div>
                  <p className="font-semibold">Cold-Pressed Groundnut Oil</p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Gentle on the stomach, rich in flavour, and better for everyday indulgence.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 text-[#FFB347] text-lg">✅</span>
                <div>
                  <p className="font-semibold">Clean, Small-Batch Kitchen</p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Limited batches cooked in a hygienic setup so every jar tastes like it came
                    from home.
                  </p>
                </div>
              </div>

            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/#Offers">
                <button

                  className="inline-flex items-center px-6 py-3 rounded-full bg-[#E87922] hover:bg-[#e06f18] text-sm sm:text-base font-semibold shadow-md transition-colors"
                >
                  Explore Our Pickles
                </button>
              </Link>
              <span className="text-xs sm:text-sm text-gray-500">
                Once you taste it, you’ll know why our customers call it{" "}
                <span className="text-[#FFB347] font-medium">“bottle of home.”</span>
              </span>
            </div>

          </div>

          {/* RIGHT – IMAGE (MOVED FROM LEFT) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] lg:w-[420px] lg:h-[420px]">

              <div className="absolute inset-0 rounded-[40%] " />

              <Image
                src="/images/about/about.png"
                alt="Homemade chicken pickle being served"
                className="relative w-[85%] h-[85%] object-contain mx-auto mt-6"
                height={180}
                width={180}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
