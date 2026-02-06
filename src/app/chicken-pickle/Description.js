// src/app/OrderNow/Description.jsx
import React from "react";

/**
 *
 * - `playfairClass` lets you pass your Playfair_Display class for the heading.
 * - Typography and padding scale with Tailwind responsive classes.
 */
export default function ProductDescription({ playfairClass = "" }) {
    return (
        <section className="mt-8 px-4 2xl:px-14"
            style={{
                background: "radial-gradient(circle at top left, #FFF5E4 0%, #FFFFFF 45%, #FFFFFF 100%)",
            }}>
            <div className="leading-relaxed text-gray-700 px-4 sm:px-6 md:px-12 lg:px-20">
                <h2
                    className={`${playfairClass} text-[#FF3E3E] text-2xl sm:text-3xl md:text-4xl font-semibold`}
                    aria-label="Product description heading"
                >
                    Description
                </h2>

                <p className="mt-3 text-base sm:text-lg md:text-xl lg:text-[20px]">
                    Our chicken pickle is crafted using{" "}
                    <strong>pure cold-pressed groundnut oil</strong>, a heart-friendly oil rich in
                    natural nutrients and antioxidants. Made with{" "}
                    <strong>clean, tender boneless chicken</strong> and a bold blend of{" "}
                    <strong>authentic Telangana spices</strong>, it delivers rich flavour while staying gentle on your
                    stomach. No preservatives, no artificial colours, and no shortcuts — just a wholesome,
                    homestyle pickle that’s healthy, tasty and perfect with rice, rotis or any meal.
                </p>

                <ul className="mt-4 space-y-2 text-gray-600">
                    <li className="text-sm sm:text-base md:text-lg">
                        • Made with <strong>pure cold-pressed groundnut oil</strong> — rich in healthy fats & antioxidants.
                    </li>
                    <li className="text-sm sm:text-base md:text-lg">
                        • Contains <strong>zero preservatives, zero artificial colours, zero MSG</strong>.
                    </li>
                    <li className="text-sm sm:text-base md:text-lg">
                        • Uses <strong>clean, tender boneless chicken</strong> for easy digestion.
                    </li>
                    <li className="text-sm sm:text-base md:text-lg">
                        • Cooked with <strong>authentic Telangana spices</strong> for real homemade flavour.
                    </li>
                    <li className="text-sm sm:text-base md:text-lg">
                        • Small-batch preparation ensures <strong>consistent taste & hygiene</strong> every time.
                    </li>
                </ul>
            </div>
        </section>
    );
}
