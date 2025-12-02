"use client";

import React, { useState } from "react";
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

const FAQS = [
  {
    question: "What makes Devi Spicy Chicken Pickle different?",
    answer:
      "We make our pickle in small batches using pure cold-pressed groundnut oil, tender chicken and hand-pounded Telangana spices. No premix masalas, no shortcuts – just slow-cooked flavour that tastes like it was made at home.",
  },
  {
    question: "How spicy is the chicken pickle?",
    answer:
      "We’d call it medium–spicy with a proper Telangana kick. It’s made to pair well with rice, dosa, roti and snacks without burning your tongue. If you like extra heat, you’ll still enjoy it – and if you’re spice-sensitive, start with a smaller portion.",
  },
  {
    question: "What oil do you use?",
    answer:
      "We use only pure cold-pressed groundnut oil. It’s more stable for cooking, easier on the stomach, and adds a rich, nutty flavour to the pickle. There are no refined or blended oils used.",
  },
  {
    question: "Does it contain preservatives or artificial colours?",
    answer:
      "No. Our chicken pickle does not contain artificial preservatives, colours or flavour enhancers. We rely on traditional methods – proper cooking, oil, salt and spices – to keep the pickle fresh.",
  },
  {
    question: "How long does the pickle stay fresh?",
    answer:
      "Unopened jars stay fresh for several months when stored in a cool, dry place away from direct sunlight. Once opened, we recommend using it within 45–60 days for best flavour, as long as it is handled and stored properly.",
  },
  {
    question: "How should I store the pickle after opening?",
    answer:
      "Always use a clean, dry spoon, make sure the chicken pieces are covered with oil, and close the lid tightly after each use. You can store the jar in a cool, dry place; if your kitchen is very warm or humid, you may refrigerate it to be extra safe.",
  },
  {
    question: "Is the chicken boneless?",
    answer:
      "Yes, we use carefully cleaned, boneless chicken pieces so you can enjoy the pickle without worrying about bones while eating.",
  },
  {
    question: "Where do you deliver?",
    answer:
      "We currently deliver to most major locations in India through trusted courier partners. Delivery time may vary by city. At checkout you can enter your pincode to see availability and estimated delivery time.",
  },
  {
    question: "How do I serve the chicken pickle?",
    answer:
      "Our chicken pickle pairs beautifully with hot rice and ghee, curd rice, dosa, idli, chapati, parotta, and even as a side with evening snacks. A little goes a long way because it’s packed with flavour.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faqs"
      aria-label="Frequently Asked Questions - Devi Spicy Chicken Pickles"
      className={`${dmSans.className} w-full`}
      style={{
        background:
          "radial-gradient(circle at top left, #FFF5E4 0%, #FFFFFF 45%, #FFFFFF 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        {/* Heading */}
        <div className="text-center mb-10 lg:mb-14">
          <h2
            className={`${playfair.className} text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[#1A1A1A]`}
          >
            Frequently Asked
            <span className="text-[#FF3E3E]"> Questions</span>
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-xs sm:text-sm md:text-[15px] lg:text-lg text-neutral-700 leading-relaxed">
            Answers to the things people most often ask us about our spicy
            chicken pickle, cold-pressed groundnut oil and how to enjoy it at
            home.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto space-y-3">
          {FAQS.map((item, index) => {
            const isOpen = index === openIndex;
            return (
              <div
                key={item.question}
                className="border border-[#F5E6CC] rounded-2xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(isOpen ? -1 : index)
                  }
                  className="w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 text-left"
                >
                  <span className="text-sm sm:text-base font-semibold text-[#1A1A1A]">
                    {item.question}
                  </span>
                  <span className="ml-4 flex h-7 w-7 items-center justify-center rounded-full border border-[#F5E6CC] text-xs text-[#FF3E3E]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <div
                  className={`px-5 sm:px-6 pb-4 sm:pb-5 text-xs sm:text-sm text-neutral-700 transition-all duration-200 ${
                    isOpen ? "max-h-40 sm:max-h-60 pt-0 opacity-100" : "max-h-0 opacity-0"
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
