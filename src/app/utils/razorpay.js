// src/app/utils/razorpay.js

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);

    // Already loaded
    if (document.getElementById("razorpay-script")) {
      return resolve(true);
    }

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      console.log("[Razorpay] SDK loaded");
      resolve(true);
    };
    script.onerror = (err) => {
      console.error("[Razorpay] SDK failed to load:", err);
      resolve(false);
    };
    document.body.appendChild(script);
  });
}
