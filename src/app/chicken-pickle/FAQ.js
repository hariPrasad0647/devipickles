// src/app/OrderNow/FAQ.js
"use client";

import React, { useState, useMemo } from "react";
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

/**
 * FAQ component
 * - Styling kept exactly like your requested design.
 * - Accepts `items` prop in multiple shapes: [{ question, answer }] OR [{ q, a }].
 * - Normalizes incoming items so the rest of the component is consistent.
 * - Fixes the "NaN" key error by using a stable key (index-based + safe text preview).
 *
 * Usage:
 * <FAQ items={MY_FAQ_ARRAY} />
 */

const DEFAULT_ITEMS = [
    {
        q: "What payment methods do you accept?",
        a: "We accept UPI, debit/credit cards, netbanking and major wallets via Razorpay. If you prefer cash on delivery, check availability at the top of the checkout page — COD may have additional charges.",
    },
    {
        q: "When will my order be delivered?",
        a: "Orders are typically dispatched within 1–2 business days. Delivery time depends on your location and the chosen shipping method. You’ll receive tracking details once the order ships.",
    },
    {
        q: "Can I change my delivery address after placing an order?",
        a: "If your order is not yet dispatched we can update the delivery address. Please contact support immediately with your order ID. Once dispatched, address changes are not possible.",
    },
    {
        q: "How do I request a refund or return?",
        a: "Open a support request from your account or email support with your order ID and reason. Perishable items like pickles are eligible for refund/return only if there’s a quality/packaging issue — photos and order details help speed up the process.",
    },
    {
        q: "Do you provide invoices and GST details?",
        a: "Yes — you can download the invoice from your account orders page after payment is successful. If your GST details are required, add them on the checkout form; we’ll include them on the invoice.",
    },
    {
        q: "Is the product safe and how should I store it?",
        a: "Our pickles are made in small batches with high hygiene standards and no artificial preservatives. Refrigerate after opening and use a clean, dry spoon for serving. Refer to the product label for shelf-life and storage specifics.",
    },
    {
        q: "Who do I contact for order support?",
        a: "Contact our support at support@devifoods.example (or use the in-app chat). Include your order ID and a short description so we can help quickly.",
    },
];

export default function FAQ({ items = DEFAULT_ITEMS, className = "" }) {
    // -1 means all closed
    const [openIndex, setOpenIndex] = useState(-1);

    // Normalize the incoming items so we consistently use { question, answer }
    const normalized = useMemo(
        () =>
            (items || []).map((it, idx) => {
                // handle shapes: { question, answer } or { q, a } or mixed
                const question = (it && (it.question ?? it.q ?? "")) || `FAQ ${idx + 1}`;
                const answer = (it && (it.answer ?? it.a ?? "")) || "";
                // short preview for safe keys if needed
                const preview = question
                    .replace(/\s+/g, "-")
                    .replace(/[^a-zA-Z0-9\-]/g, "")
                    .slice(0, 20)
                    .toLowerCase();
                return { question, answer, preview };
            }),
        [items]
    );

    function toggle(idx) {
        setOpenIndex((prev) => (prev === idx ? -1 : idx));
    }

    return (
        <section
            id="faqs"
            aria-label="Frequently Asked Questions"
            className={`${dmSans.className} w-full ${className}`}
            style={{
                background: "radial-gradient(circle at top left, #FFF5E4 0%, #FFFFFF 45%, #FFFFFF 100%)",
            }}
        >
            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                <div className="text-center mb-10 lg:mb-14">
                    <h2
                        className={`${playfair.className} text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[#1A1A1A]`}
                    >
                        Frequently Asked <span className="text-[#FF3E3E]">Questions</span>
                    </h2>
                    <p className="mt-4 max-w-3xl mx-auto text-xs sm:text-sm md:text-[15px] lg:text-lg text-neutral-700 leading-relaxed">
                        Answers to the things people most often ask about the product, checkout and delivery.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-3">
                    {normalized.map((item, index) => {
                        const isOpen = index === openIndex;

                        // stable key that cannot be NaN — uses index + a short preview from question
                        const key = `faq-${index}-${item.preview || "item"}`;

                        return (
                            <div
                                key={key}
                                className="border border-[#F5E6CC] rounded-2xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)] overflow-hidden"
                            >
                                <button
                                    type="button"
                                    id={`faq-btn-${index}`}
                                    aria-controls={`faq-panel-${index}`}
                                    aria-expanded={isOpen}
                                    onClick={() => toggle(index)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            toggle(index);
                                        }
                                        if (e.key === "ArrowDown") {
                                            const next = Math.min(normalized.length - 1, index + 1);
                                            document.getElementById(`faq-btn-${next}`)?.focus();
                                        }
                                        if (e.key === "ArrowUp") {
                                            const prev = Math.max(0, index - 1);
                                            document.getElementById(`faq-btn-${prev}`)?.focus();
                                        }
                                    }}
                                    className="w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                                >
                                    <span className="text-sm sm:text-base font-semibold text-[#1A1A1A]">
                                        {item.question}
                                    </span>

                                    <span
                                        className="ml-4 flex h-7 w-7 items-center justify-center rounded-full border border-[#F5E6CC] text-xs text-[#FF3E3E] select-none"
                                        aria-hidden="true"
                                    >
                                        {isOpen ? "−" : "+"}
                                    </span>
                                </button>

                                <div
                                    id={`faq-panel-${index}`}
                                    role="region"
                                    aria-labelledby={`faq-btn-${index}`}
                                    className={`px-5 sm:px-6 pb-4 sm:pb-5 text-xs sm:text-sm text-neutral-700 transition-all duration-200 ${isOpen ? "max-h-[480px] pt-0 opacity-100" : "max-h-0 pt-0 opacity-0"
                                        } overflow-hidden`}
                                >
                                    <p className="leading-relaxed">{item.answer}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
