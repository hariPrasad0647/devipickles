// src/app/components/HeroSection.js (or .tsx)
"use client";
import Link from "next/link";
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

export default function HeroSection() {
  return (
    <section
      className={`${dmSans.className} relative w-full overflow-hidden pt-24 md:pt-20 lg:pt-24 pb-12 md:pb-20`}
      style={{
        background:
          "radial-gradient(circle at top left, #FFF5E4 0%, #FFFFFF 45%, #FFFFFF 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* LEFT CONTENT */}
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Top dashed arrow decor */}
          <div className="w-24 sm:w-28 md:w-32 lg:w-36 translate-x-10 scale-[0.70] sm:translate-x-16 lg:translate-x-24 -translate-y-10">
            <Image
              src="/images/herosection/d-1.png"
              alt="decor"
              width={150}
              height={150}
              className="opacity-90 pointer-events-none w-full h-auto"
            />
          </div>

          {/* HEADING + DECORATIONS */}
          <div className="relative">
            <h1
              className={`${playfair.className} text-[2.2rem] md:-mt-30 -mt-20 2xl:-mt-25 sm:text-[2.6rem] lg:text-[3.1rem] xl:text-[3.4rem] font-extrabold leading-tight text-[#1A1A1A] max-w-xl`}
            >
              <span className="text-[#FF3E3E] block">Pure Ingredients.</span>
              <span className="block mt-1">Real Flavour.</span>
              <span className="block mt-1">
                Zero{" "}
                <span className="relative inline-block text-[#F6B800]">
                  Compromise.
                  {/* underline decor */}
                  <span className="absolute left-0 -bottom-3 w-[160px] sm:w-[190px]">
                    <Image
                      src="/images/herosection/Decore.png"
                      alt="decor underline"
                      width={190}
                      height={24}
                      className="w-full h-auto"
                    />
                  </span>
                </span>
              </span>
            </h1>

            {/* citrus / outline decor near heading */}
            <div className="pointer-events-none absolute -right-4 sm:right-0 top-1/2 -translate-y-1/2 w-14 sm:w-16 lg:w-20 ">
              <Image
                src="/images/herosection/Orange.png"
                alt="orange slice"
                width={120}
                height={120}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Paragraph */}
          <p className="max-w-lg text-sm sm:text-base lg:text-lg text-neutral-700 leading-relaxed">
            Our chicken pickles are made in small batches using cold-pressed
            groundnut oil, ensuring health, freshness, and deliciousness you
            can trust.
          </p>

          {/* DESKTOP/TABLET BUTTON */}
          <div className="hidden md:flex items-center gap-4 pt-2">
            <Link href="./OrderNow">
              <button className="bg-[#FF3E3E] hover:bg-[#E23232] transition-all duration-200 text-white px-8 py-3 rounded-full font-semibold text-base lg:text-lg shadow-[0_14px_30px_rgba(255,62,62,0.35)]">
                Order Now
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center md:justify-end">
          <div className="relative w-full max-w-xs scale-[1.55] translate-y-5 2xl:translate-y-18 sm:max-w-sm md:max-w-md 2xl:scale-[1.55] lg:max-w-lg xl:max-w-xl aspect-[4/3]">
            <Image
              src="/images/herosection/newpic-photoroom.png"
              alt="Delicious food"
              fill
              className="object-contain drop-shadow-xl"
            />
          </div>

          {/* Right-side decorative shape */}
          <div className="pointer-events-none absolute -right-2 sm:right-2 top-4 md:top-6 opacity-70 w-16 md:w-20 lg:w-24 rotate-6">
            <Image
              src="/images/herosection/Vector 3.png"
              alt="decor vector"
              width={105}
              height={100}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* MOBILE-ONLY BUTTON */}
      <div className="flex md:hidden items-center translate-y-20 gap-4 px-6">
        <Link href="./OrderNow">
          <button className="bg-[#FF3E3E] hover:bg-[#E23232] transition-all duration-200 text-white px-8 py-3 rounded-full font-semibold shadow-[0_12px_25px_rgba(255,62,62,0.35)]">
            Order Now
          </button>
        </Link>
      </div>

      {/* bottom scroll dots decor */}
      <div className="mt-8 px-6 md:px-10 flex translate-y-15 justify-start md:justify-center lg:justify-start">
        <Image
          src="/images/herosection/slider.png"
          alt="slider indicator"
          width={25}
          height={30}
          className="h-auto w-6"
        />
      </div>
    </section>
  );
}
