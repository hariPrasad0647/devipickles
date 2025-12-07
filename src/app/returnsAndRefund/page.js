// pages/returns.js

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#fff7ee] text-[#2a160f]">
      <header className="border-b border-[#f3d0b5] bg-[#fffaf5]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <h1 className="font-['Playfair_Display'] text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
            Returns &amp; Refunds
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
              At <span className="font-semibold">Devi Pickles</span>, we take
              great care to prepare and pack your chicken pickles and other
              products. Because our items are food products, we follow a
              strict&nbsp;
              <span className="font-semibold">no-return policy</span> in most
              situations. However, we will always support you in case of valid
              issues such as damage, leakage, or wrong items received. This
              policy should be read together with our{" "}
              <a
                href="/terms"
                className="text-[#f34332] hover:text-[#c83225] underline-offset-2 hover:underline transition-colors"
              >
                Terms &amp; Conditions
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-[#f34332] hover:text-[#c83225] underline-offset-2 hover:underline transition-colors"
              >
                Privacy Policy
              </a>
              .
            </p>

            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                1. Non-Returnable Items
              </h2>
              <p>
                As our products are edible and perishable, we{" "}
                <span className="font-semibold">
                  cannot accept returns or exchanges
                </span>{" "}
                for the following reasons:
              </p>
              <ul className="list-disc pl-4 space-y-1 mt-1">
                <li>Change of mind or taste preferences.</li>
                <li>Products opened and consumed partially or fully.</li>
                <li>
                  Improper storage after delivery (for example, not refrigerating
                  when required).
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                2. Damaged, Leaking or Wrong Items
              </h2>
              <p>
                If you receive a parcel that is visibly damaged, leaking, or
                contains the wrong products, please contact us as soon as
                possible so we can help.
              </p>
              <p className="mt-1">
                To be eligible for a replacement or refund in such cases:
              </p>
              <ul className="list-disc pl-4 space-y-1 mt-1">
                <li>
                  Raise a complaint within{" "}
                  <span className="font-semibold">24–48 hours</span> of
                  delivery.
                </li>
                <li>
                  Share clear photos of the outer packaging, inner packaging and
                  the affected product.
                </li>
                <li>
                  Provide your order ID, registered mobile number and a brief
                  description of the issue.
                </li>
              </ul>
              <p className="mt-1">
                After verification, we may offer a{" "}
                <span className="font-semibold">
                  replacement shipment or a refund
                </span>{" "}
                to your original payment method, at our discretion.
              </p>
            </div>

            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                3. Quality Concerns
              </h2>
              <p>
                We maintain strict hygiene and quality standards while preparing
                our pickles. If you suspect that the product has spoiled or is
                not fit for consumption, please:
              </p>
              <ul className="list-disc pl-4 space-y-1 mt-1">
                <li>Stop consuming the product immediately.</li>
                <li>
                  Share clear photos, batch details and order information with
                  us.
                </li>
                <li>
                  Provide details on how the product was stored after delivery.
                </li>
              </ul>
              <p className="mt-1">
                Each case will be evaluated individually, and we may provide a
                replacement or refund where appropriate.
              </p>
            </div>

            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                4. Refund Timelines
              </h2>
              <p>
                If a refund is approved, it will be processed to your original
                payment method (for example, card, UPI, wallet) within{" "}
                <span className="font-semibold">5–7 business days</span>. The
                actual time for the amount to reflect in your account may vary
                depending on your bank or payment provider.
              </p>
            </div>

            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                5. Shipping Issues &amp; Delays
              </h2>
              <p>
                We work with third-party courier partners for delivery. While we
                try our best to meet estimated timelines, delays may occur due
                to factors beyond our control (weather, strikes, operational
                issues, etc.). Such delays alone do not qualify for refunds.
              </p>
              <p className="mt-1">
                However, if your parcel is undelivered for an extended period or
                marked lost by the courier, we will coordinate with them and
                offer a suitable resolution, which may include a replacement or
                refund.
              </p>
            </div>

            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                6. Cancellations
              </h2>
              <p>
                Orders can typically be cancelled{" "}
                <span className="font-semibold">
                  before they are packed or dispatched
                </span>
                . Once an order is prepared or handed over to the courier, it
                cannot be cancelled. For cancellation requests, please contact
                us immediately with your order details.
              </p>
            </div>

            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                7. How to Contact Us
              </h2>
              <p>
                For any issues related to returns, refunds or quality, please
                reach out to us:
              </p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
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

                <li>Include your order ID and registered phone number.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                8. Changes to This Policy
              </h2>
              <p>
                We may update this Returns &amp; Refunds Policy from time to
                time. Any changes will be posted on this page with an updated
                “Last updated” date. Your continued use of our website and
                services indicates your acceptance of the updated policy.
              </p>
            </div>

            <div>
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold text-[#2a160f] mb-2">
                9. Governing Law &amp; Jurisdiction
              </h2>
              <p>
                This Returns &amp; Refunds Policy is governed by and construed
                in accordance with the laws of India. Any disputes arising out
                of or in connection with this policy shall be subject to the
                exclusive jurisdiction of the courts located in [Your City],
                India.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
