"use client";

import Image from "next/image";
import Link from "next/link";

const OFFERS = [
    {
        id: 1,
        title: "Chicken Pickle",
        quantity: "250g, 500g, 1Kg",
        href: "/chicken-pickle",
        rating: "4.7",
        image: "/images/offers/image.png",
        description: "Perfect for first-timers who want to taste our signature flavour.",
    },
    {
        id: 2,
        title: "Mutton Pickle",
        quantity: "250g, 500g, 1Kg",
        href: "/mutton-pickle",
        rating: "4.8",
        image: "/images/offers/image.png",
        description: "Ideal for small families who love a spicy side with every meal.",
    },


];

export default function TodaySpecialOffers() {
    return (
        <section
            id="Offers"
            className="relative w-full py-14 md:py-20 overflow-hidden"
            style={{
                background:
                    "radial-gradient(circle at top left, #FFF5E4 0%, #FFFFFF 45%, #FFFFFF 100%)",
            }}
        >
            <div className="max-w-7xl mx-auto px-6">
                {/* TOP DECOR (optional) */}
                <div className="pointer-events-none absolute -left-10 top-10 hidden md:block opacity-50">
                    <Image
                        src="/images/offers/top.png"
                        alt="top"
                        width={140}
                        height={140}
                        className="opacity-80"
                    />
                </div>
                <div className="pointer-events-none absolute -right-8 bottom-0 hidden md:block opacity-60">
                    <Image
                        src="/images/offers/bottom.png"
                        alt="bottom"
                        width={160}
                        height={160}
                    />
                </div>

                {/* HEADING */}
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-wide text-[#1A1A1A]">
                        Today <span className="text-[#FF3E3E]">Special</span> Offers
                    </h2>
                    <p className="mt-4 max-w-3xl mx-auto text-xs sm:text-sm md:text-[15px] lg:text-lg xl:text-xl text-neutral-700 leading-relaxed">
                        Small-batch chicken pickle made with pure cold-pressed groundnut oil –
                        rich flavour, clean ingredients, and zero compromise on your health.
                    </p>
                </div>

                {/* DESKTOP / TABLET GRID */}
                <div
                    className={`    hidden sm:grid
    gap-34
    place-items-center
    justify-center
    mx-auto
    [grid-template-columns:repeat(auto-fit,260px)]`}
                >
                    {OFFERS.map((offer) => (
                        <SpecialOfferCard key={offer.id} offer={offer} />
                    ))}
                </div>


                {/* MOBILE CAROUSEL */}
                <div className="sm:hidden -mx-6 px-6">
                    <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4">
                        {OFFERS.map((offer) => (
                            <div key={offer.id} className="snap-center shrink-0 w-[260px]">
                                <SpecialOfferCard offer={offer} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function SpecialOfferCard({ offer }) {
    return (
        <div className="relative flex flex-col items-center w-[260px] group">
            {/* IMAGE BADGE */}
            <div
                className="
    absolute -top-[28px] z-20 flex flex-col items-center
    transition-transform duration-300 ease-out
    transform-gpu
    group-hover:scale-110
  "
            >

                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full  flex items-center justify-center shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
                    <Image
                        src={offer.image}
                        alt={offer.title}
                        width={220}
                        height={220}
                        className="max-w-[80%] max-h-[80%] object-contain"
                    />
                </div>
            </div>

            {/* CARD BODY */}
            <div
                className="
    relative z-0 w-full bg-white rounded-[28px]
    pt-20 pb-7 px-5 mt-10
    border border-[#F5E6CC]

    transition-all duration-300 ease-out
    transform-gpu
    group-hover:scale-[1.04]
    group-hover:shadow-[0_28px_60px_rgba(0,0,0,0.18)]
  "
            >
                {/* Rating */}
                <div className="flex items-center justify-center mb-3">
                    <div className="flex items-center gap-1 text-sm text-neutral-700">
                        <span className="text-yellow-400 text-lg">★</span>
                        <span>({offer.rating})</span>
                    </div>
                </div>

                {/* TITLE */}
                <h3 className="text-lg font-semibold text-[#FF3E3E] mb-1 text-center">
                    {offer.title}
                </h3>
                <p className="text-[13px] font-medium text-neutral-700 mb-3 text-center">
                    {offer.quantity} • {offer.price}
                </p>

                {/* DESCRIPTION */}
                <p className="text-[13px] sm:text-xs text-neutral-600 leading-relaxed mb-6 text-center">
                    {offer.description}
                </p>

                {/* BUTTON */}
                <div className="flex justify-center">
                    <Link href={offer.href}>

                        <button
                            className="
    bg-[#FF3E3E] text-white px-6 py-2 rounded-full text-sm font-semibold
    shadow-[0_12px_25px_rgba(255,62,62,0.35)]

    transition-all duration-300 ease-out
    hover:scale-105
    hover:shadow-[0_18px_35px_rgba(255,62,62,0.45)]
    hover:bg-[#E23232]
  "
                        >
                            Order Now
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
