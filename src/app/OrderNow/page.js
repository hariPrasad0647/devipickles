// src/app/OrderNow/page.js
"use client";

import React, { useState, useMemo, useEffect } from "react";
import OrderSummaryPopup from "./OrderSummaryPopUp";
import { loadRazorpayScript } from "../utils/razorpay";
import { Playfair_Display, DM_Sans } from "next/font/google";
import ProductDescription from "./Description";
import Footer from "./Footer";
import FAQs from "./FAQ";
import { toast } from "react-hot-toast";

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

const API_BASE =  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const WEIGHT_OPTIONS = [
  { id: "250g", label: "250gm", price: 1, img: "/images/offers/2.png" },
  { id: "500g", label: "500gm", price: 499, img: "/images/offers/2.png" },
  { id: "1kg", label: "1kg", price: 899, img: "/images/offers/2.png" },
];

const PACK_OPTIONS = [
  { id: "bottle", label: "Bottle" },
  { id: "pouch", label: "Without Bottle" },
];

const THUMB_IMAGES = [
  "/images/offers/1.png",
  "/images/offers/2.png",
  "/images/offers/3.png",
  
];

export default function ProductOrderSection() {
  const [weight, setWeight] = useState(WEIGHT_OPTIONS[1].id);
  const [pack, setPack] = useState(PACK_OPTIONS[0].id);
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("authToken");
      const userRaw = localStorage.getItem("user");

      setIsLoggedIn(!!token);

      if (userRaw) {
        try {
          const user = JSON.parse(userRaw);
          const idFromUser =
            user?._id || user?.id || user?.customerId || null;
          setCustomerId(idFromUser);
        } catch (err) {
          console.error(
            "[ProductOrderSection] Failed to parse user from localStorage:",
            err
          );
          setCustomerId(null);
        }
      } else {
        setCustomerId(null);
      }
    } catch (err) {
      console.error(
        "[ProductOrderSection] Failed to read authToken/user:",
        err
      );
      setIsLoggedIn(false);
      setCustomerId(null);
    }
  }, []);

  const selectedWeight = useMemo(
    () => WEIGHT_OPTIONS.find((w) => w.id === weight),
    [weight]
  );

  const basePrice = selectedWeight?.price ?? 0;
  const totalPrice = basePrice * qty;

  function handleDecQty() {
    setQty((q) => Math.max(1, q - 1));
  }

  function handleIncQty() {
    setQty((q) => q + 1);
  }

  function handleAddToCart() {
    const payload = {
      productId: "devi-spicy-chicken-pickle",
      name: "Devi Spicy Chicken Pickle",
      weight: selectedWeight.label,
      packing: pack,
      unitPrice: basePrice,
      quantity: qty,
      total: totalPrice,
    };
    console.log("Add to cart:", payload);
    toast.success(
      `Added ${qty} × ${selectedWeight.label} to cart (₹${totalPrice}).`
    );
  }

  function handleBuyNow() {
    setIsOrderModalOpen(true);
  }

  async function startRazorpayCheckout(customerData) {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load. Please check your connection.");
      return;
    }

    try {
      const orderPayload = {
        amount: totalPrice,
        currency: "INR",
        notes: {
          productId: "devi-spicy-chicken-pickle",
          weight: selectedWeight?.label,
          pack,
          qty,
          phone: customerData.phone || "",
          address: customerData.address || "",
          city: customerData.city || "",
          pincode: customerData.pincode || "",
          email: customerData.email || "",
          name: customerData.name || "",
        },
      };

      const res = await fetch(`${API_BASE}/api/v1/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        console.error("[startRazorpayCheckout] JSON parse error:", err);
      }

      console.log("[startRazorpayCheckout] create-order response:", {
        status: res.status,
        ok: res.ok,
        data,
      });

      if (!res.ok || !data?.success || !data.order) {
        throw new Error(
          data?.message || `Failed to create order (status ${res.status})`
        );
      }

      const { order, keyId } = data;

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Devi Foods",
        description: `Devi Spicy Chicken Pickle (${selectedWeight?.label}, ${pack})`,
        order_id: order.id,
        prefill: {
          contact: customerData.phone || "",
          email: customerData.email || "",
          name: customerData.name || "",
        },
        notes: order.notes,
        theme: {
          color: "#542316",
        },
        handler: async function (response) {
          console.log("[Razorpay handler] response:", response);
          try {
            const items = [
              {
                productId: "devi-spicy-chicken-pickle",
                name: "Devi Spicy Chicken Pickle",
                qty,
                price: basePrice,
                weight: selectedWeight?.label,
                pack,
              },
            ];
            const addressPayload = {
              name: customerData.name || "",
              phone: customerData.phone || "",
              address: customerData.address || "",
              city: customerData.city || "",
              pincode: customerData.pincode || "",
            };

            const verifyBody = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customerId: customerData.customerId || customerId || null,
              items,
              amount: totalPrice,
              address: addressPayload,
            };

            const verifyRes = await fetch(
              `${API_BASE}/api/v1/payments/verify`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(verifyBody),
              }
            );

            let verifyData = null;
            try {
              verifyData = await verifyRes.json();
            } catch (err) {
              console.error("[Razorpay verify] JSON parse error:", err);
            }

            console.log("[Razorpay verify] response:", {
              status: verifyRes.status,
              ok: verifyRes.ok,
              verifyData,
            });

            if (!verifyRes.ok || !verifyData?.success) {
              toast.error(
                verifyData?.message ||
                "Payment verification failed. Please contact support."
              );
              return;
            }

            toast.success("Payment successful! Thank you for your order.");
          } catch (err) {
            console.error("[Razorpay verify] error:", err);
            toast.error("Something went wrong while verifying payment.");
          }
        },
        modal: {
          ondismiss: function () {
            console.log("[Razorpay] Checkout closed by user");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("[Razorpay] payment.failed:", response.error);
        toast.error(
          response.error?.description ||
          "Payment failed or was cancelled. Please try again."
        );
      });

      rzp.open();
    } catch (err) {
      console.error("[startRazorpayCheckout] error:", err);
      toast.error(err?.message || "Unable to start payment. Please try again.");
    }
  }

  function handleLoginSuccess(payload) {
    console.log("Checkout payload from popup:", payload);
    setIsLoggedIn(true);

    if (payload && payload.customerId) {
      setCustomerId(payload.customerId);
    }

    // No Razorpay here anymore.
    // COD and ONLINE flows (including payment + order creation) are fully handled inside the popup.
  }


  const mainImage = THUMB_IMAGES[activeThumb] || selectedWeight.img;

  return (
    <>
      <section
        className={`${dmSans.className} text-[#161616] font-[var(--font-sofia)]`}
        aria-label="Order Devi Spicy Chicken Pickle"
        style={{
          background:
            "radial-gradient(circle at top left, #FFF5E4 0%, #FFFFFF 45%, #FFFFFF 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <div className="aspect-square w-full rounded-3xl bg-[#f5f5f5] overflow-hidden flex items-center justify-center">
                <img
                  src={mainImage}
                  alt="Devi Spicy Chicken Pickle"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3">
                {THUMB_IMAGES.map((src, index) => (
                  <button
                    key={src + index}
                    type="button"
                    onClick={() => setActiveThumb(index)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border transition
                      ${activeThumb === index
                        ? "border-black"
                        : "border-transparent hover:border-gray-300"
                      }`}
                  >
                    <img
                      src={src}
                      alt={`Chicken pickle view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className={`${playfair.className} text-3xl sm:text-4xl font-semibold tracking-tight`}>
                  Devi Spicy Chicken Pickle
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Taxes included. Free delivery on orders above ₹500.
                </p>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-semibold">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-gray-500">
                    (₹{basePrice.toLocaleString("en-IN")} per pack)
                  </span>
                </div>
              </div>

              <div className="text-sm leading-relaxed text-gray-700">
                Our boneless chicken pickle is slow-cooked in{" "}
                <strong>cold-pressed groundnut oil</strong> with a bold blend of{" "}
                <strong>Telangana spices</strong>. A comforting, home-style pickle
                that’s rich in flavour and gentle on your stomach — perfect with rice,
                rotis or as a side to any meal.
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-900">Weight</div>
                <div className="flex flex-wrap gap-3">
                  {WEIGHT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setWeight(opt.id)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition
                        ${weight === opt.id
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-800 border-gray-300 hover:border-black"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-900">Quantity</div>
                <div className="inline-flex items-center border border-gray-300 rounded-full overflow-hidden">
                  <button
                    type="button"
                    onClick={handleDecQty}
                    className="px-4 py-2 text-lg leading-none hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 text-sm font-medium">{qty}</span>
                  <button
                    type="button"
                    onClick={handleIncQty}
                    className="px-4 py-2 text-lg leading-none hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto sm:flex-1 px-6 py-3 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-900 transition"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full sm:w-auto sm:flex-1 px-6 py-3 rounded-full border border-black text-sm font-semibold hover:bg-black hover:text-white transition"
                >
                  Buy It Now
                </button>
              </div>

              <div className="pt-2 text-xs text-gray-500 space-y-1">
                <p>• Refrigerate after opening. Always use a clean, dry spoon.</p>
                <p>
                  • Best before 6 months from date of packing. Shake well to mix
                  the masala before serving.
                </p>
              </div>
            </div>
          </div>
        </div>

        <ProductDescription playfairClass={playfair.className} />
        <FAQs className="mt-8" />
        <Footer />
      </section >

      <OrderSummaryPopup
        open={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        qty={qty}
        onDecQty={handleDecQty}
        onIncQty={handleIncQty}
        selectedWeight={selectedWeight}
        pack={pack}
        totalPrice={totalPrice}
        mainImage={mainImage}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
