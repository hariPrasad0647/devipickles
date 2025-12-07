// pages/terms.js

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fff7ee] text-[#2a160f]">
      {/* Simple top bar */}
      <header className="border-b border-[#f3d0b5] bg-[#fffaf5]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <h1 className="font-['Playfair_Display'] text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
            Terms &amp; Conditions
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        <div className="bg-white rounded-3xl shadow-sm border border-[#f3d0b5] p-5 sm:p-7 md:p-8 transition-transform transition-shadow duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)]">
          <p className="font-['DM_Sans'] text-xs sm:text-sm md:text-base text-gray-600 mb-4">
            Last updated: 07 December 2025
          </p>

          <section className="space-y-6 font-['DM_Sans'] text-xs sm:text-sm md:text-[15px] leading-relaxed">
            <p>
              Welcome to <span className="font-semibold">Devi Pickles</span>{" "}
              (“we”, “us”, “our”). These Terms &amp; Conditions govern your use
              of our website and the purchase of our products, including our
              chicken pickles and related items. By accessing or using this
              website, you agree to be bound by these Terms.
            </p>

            {/* 1. Eligibility */}
            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                1. Eligibility
              </h2>
              <p>
                By placing an order on this website, you confirm that you are at
                least 18 years old or using the website under the supervision of
                a parent or legal guardian.
              </p>
            </div>

            {/* 2. Products & Freshness */}
            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                2. Products &amp; Freshness
              </h2>
              <p>
                Our chicken pickles and other products are prepared in small
                batches to maintain freshness and quality. Product images on the
                website are for illustration only. Actual products may vary
                slightly in appearance, colour or packaging.
              </p>
            </div>

            {/* 3. Orders & Pricing */}
            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                3. Orders &amp; Pricing
              </h2>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  All prices shown on the website are in INR and inclusive of
                  applicable taxes, unless stated otherwise.
                </li>
                <li>
                  We reserve the right to modify prices, offers and product
                  availability at any time without prior notice.
                </li>
                <li>
                  Your order is considered accepted only after we confirm it via
                  email, SMS, or on-screen order confirmation.
                </li>
              </ul>
            </div>

            {/* 4. Payments */}
            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                4. Payments
              </h2>
              <p>
                We currently accept online payments through supported payment
                gateways (such as Razorpay). By providing your payment
                information, you represent and warrant that you are authorized
                to use the chosen payment method and that the payment
                information is accurate.
              </p>
            </div>

            {/* 5. Shipping & Delivery */}
            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                5. Shipping &amp; Delivery
              </h2>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  Delivery timelines shown at checkout are estimates and may
                  vary due to courier delays, holidays, or factors beyond our
                  control.
                </li>
                <li>
                  You are responsible for providing an accurate delivery
                  address and contact number. We are not responsible for delayed
                  or failed delivery due to incorrect or incomplete details.
                </li>
              </ul>
            </div>

            {/* 6. Perishable Food Products */}
            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                6. Perishable Food Products
              </h2>
              <p>
                Our pickles are food products and may be perishable. Please
                follow the storage instructions provided on the packaging for
                best taste and safety. Once delivered, you are responsible for
                proper storage and handling.
              </p>
            </div>

            {/* 7. Allergy & Health Disclaimer */}
            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                7. Allergy &amp; Health Disclaimer
              </h2>
              <p>
                Our products may contain or come in contact with common
                allergens such as groundnut, edible oils, spices or other
                ingredients. If you have any food allergies, dietary
                restrictions or medical conditions, please read the ingredient
                list carefully before consuming and consult your doctor if
                needed. By purchasing our products, you acknowledge that you
                have reviewed this information and are consuming them at your
                own discretion.
              </p>
            </div>

            {/* 8. Returns, Replacements & Refunds */}
            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                8. Returns, Replacements &amp; Refunds
              </h2>
              <p>
                Due to the nature of our food products, we generally do not
                accept returns for reasons such as taste preferences. However,
                if you receive a damaged, spoiled, or incorrect product, please
                refer to our{" "}
                <a
                  href="/returns"
                  className="text-[#f34332] hover:text-[#c83225] underline-offset-2 hover:underline transition-colors"
                >
                  Returns &amp; Refunds Policy
                </a>{" "}
                for details.
              </p>
            </div>

            {/* 9. Use of the Website */}
            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                9. Use of the Website
              </h2>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  You agree not to misuse the website, including attempting to
                  interfere with its operation, security or underlying
                  infrastructure.
                </li>
                <li>
                  You may not use this website for any unlawful purpose or to
                  violate any local, national or international law.
                </li>
              </ul>
            </div>

            {/* 10. Intellectual Property */}
            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                10. Intellectual Property
              </h2>
              <p>
                All content on this website, including logos, images, text and
                designs, is owned by or licensed to{" "}
                <span className="font-semibold">Devi Pickles</span> and is
                protected by applicable intellectual property laws. You may not
                copy, reproduce or distribute any content without our prior
                written consent.
              </p>
            </div>

            {/* 11. Limitation of Liability */}
            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                11. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, we are not liable for
                any indirect, incidental, special or consequential damages
                arising from your use of the website or our products. Our
                maximum aggregate liability for any claim relating to an order
                shall not exceed the total amount paid for that order.
              </p>
            </div>

            {/* 12. Changes to These Terms */}
            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                12. Changes to These Terms
              </h2>
              <p>
                We may update these Terms &amp; Conditions from time to time.
                Any changes will be posted on this page with an updated “Last
                updated” date. Your continued use of the website after changes
                are posted will constitute your acceptance of the updated Terms.
              </p>
            </div>

            {/* 13. Contact Us */}
            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                13. Contact Us
              </h2>
              <p>
                If you have any questions about these Terms &amp; Conditions,
                you can contact us at:
              </p>
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

            </div>

            {/* 14. Governing Law & Jurisdiction */}
            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                14. Governing Law &amp; Jurisdiction
              </h2>
              <p>
                These Terms &amp; Conditions are governed by and construed in
                accordance with the laws of India. Any disputes arising out of
                or in connection with your use of the website or purchase of our
                products shall be subject to the exclusive jurisdiction of the
                courts located in [Your City], India.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
