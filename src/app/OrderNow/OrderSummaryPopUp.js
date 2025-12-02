// components/OrderSummaryPopup.js
"use client";

import React, { useState, useEffect } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export default function OrderSummaryPopup({
  open,
  onClose,
  qty,
  onDecQty,
  onIncQty,
  selectedWeight,
  pack,
  totalPrice,
  mainImage,
  onLoginSuccess,
}) {
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(true);

  const [email, setEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // step: "email" | "otp" | "address"
  const [step, setStep] = useState("email");
  const [authMode, setAuthMode] = useState(null); // "login" | "signup"

  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    if (!open) return;

    try {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("authToken");
      const userRaw = localStorage.getItem("user");

      if (token && userRaw) {
        setIsAuthenticated(true);
        setStep("address");

        try {
          const user = JSON.parse(userRaw);
          if (user?.email) {
            setEmail(user.email);
          }
          if (user?.name) {
            setName(user.name);
          }
          if (user?.phone) {
            setContactPhone(user.phone);
          }
          const idFromUser =
            user?._id || user?.id || user?.customerId || null;
          setCustomerId(idFromUser);
        } catch (err) {
          console.error(
            "[OrderSummaryPopup] Failed to parse user from localStorage:",
            err
          );
          setCustomerId(null);
        }
      } else {
        setIsAuthenticated(false);
        setStep("email");
        setCustomerId(null);
      }
    } catch (err) {
      console.error("[OrderSummaryPopup] Error while checking auth state:", err);
      setIsAuthenticated(false);
      setStep("email");
      setCustomerId(null);
    }
  }, [open]);

  if (!open) return null;

  async function handleStartOtpFlow() {
    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/v1/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json().catch(() => null);
      console.log("[OrderSummaryPopup] send-otp response:", {
        status: res.status,
        ok: res.ok,
        data,
      });

      if (!res.ok || !data?.success) {
        alert(data?.message || "Failed to send OTP. Please try again.");
        return;
      }

      if (data.exists) {
        setAuthMode("login");
      } else {
        setAuthMode("signup");
      }

      setStep("otp");
      alert("OTP sent to your email address.");
    } catch (err) {
      console.error("[OrderSummaryPopup] send-otp error:", err);
      alert("Something went wrong while sending OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (!email.trim() || !otp.trim()) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);

      if (authMode === "login") {
        const res = await fetch(`${API_BASE}/api/auth/otp-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
          }),
        });

        const data = await res.json().catch(() => null);
        console.log("[OrderSummaryPopup] otp-login response:", {
          status: res.status,
          ok: res.ok,
          data,
        });

        if (!res.ok || !data?.success || !data?.token || !data?.user) {
          alert(data?.message || "OTP verification failed. Please try again.");
          return;
        }

        try {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        } catch (err) {
          console.error("[OrderSummaryPopup] Failed to store auth:", err);
        }

        const idFromUser =
          data.user?._id || data.user?.id || data.user?.customerId || null;
        setCustomerId(idFromUser);

        if (data.user?.name) setName(data.user.name);
        if (data.user?.phone) setContactPhone(data.user.phone);

        setIsAuthenticated(true);
        setStep("address");
        setOtp("");
        alert("Login successful. Please enter your delivery address.");
        return;
      }

      if (authMode === "signup") {
        if (!name.trim()) {
          alert("Please enter your name.");
          return;
        }

        const res = await fetch(`${API_BASE}/api/v1/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            otp: otp.trim(),
          }),
        });

        const data = await res.json().catch(() => null);
        console.log("[OrderSummaryPopup] signup response:", {
          status: res.status,
          ok: res.ok,
          data,
        });

        if (!res.ok || !data?.success || !data?.token || !data?.user) {
          alert(data?.message || "Signup failed. Please try again.");
          return;
        }

        try {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        } catch (err) {
          console.error("[OrderSummaryPopup] Failed to store auth:", err);
        }

        setCustomerId(data.user?.id || data.user?._id || null);

        setIsAuthenticated(true);
        setStep("address");
        setOtp("");
        alert("Account created. Please enter your delivery address.");
      }
    } catch (err) {
      console.error("[OrderSummaryPopup] verify OTP error:", err);
      alert("Something went wrong while verifying OTP.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    try {
      if (!isAuthenticated) {
        if (step === "email") {
          handleStartOtpFlow();
          return;
        }

        if (step === "otp") {
          handleVerifyOtp();
          return;
        }

        return;
      }

      if (!address.trim() || !pincode.trim()) {
        alert("Please enter your address and pincode before continuing.");
        return;
      }

      if (!contactPhone.trim()) {
        alert("Please enter your contact phone number for delivery.");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const payload = {
        email: email.trim(),
        phone: contactPhone.trim(),
        name: user?.name || name || "",
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        customerId: customerId || null,
      };

      console.log(
        "[OrderSummaryPopup] Logged-in user, address payload:",
        payload
      );

      if (typeof onLoginSuccess === "function") {
        onLoginSuccess(payload);
      }
      onClose();
    } catch (err) {
      console.error("[OrderSummaryPopup] Submit failed:", err);
      alert("Something went wrong. Please try again.");
    }
  }

  let primaryButtonLabel;
  if (!isAuthenticated) {
    if (step === "email") primaryButtonLabel = "Continue";
    else primaryButtonLabel = "Verify OTP";
  } else {
    primaryButtonLabel = "Continue to checkout";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-3xl shadow-xl overflow-hidden text-black">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <button
            type="button"
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            ←
          </button>

          <button
            type="button"
            onClick={() => setIsOrderDetailsOpen((prev) => !prev)}
            className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-medium text-black"
          >
            <span>Order total</span>
            <span className="font-semibold">
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px]">
              {isOrderDetailsOpen ? "▲" : "▼"}
            </span>
          </button>
        </div>

        {isOrderDetailsOpen && (
          <div className="px-4 pt-3 pb-4 border-b space-y-3 text-black">
            <div className="flex gap-3">
              <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                <img
                  src={mainImage}
                  alt="Selected product"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  Devi Spicy Chicken Pickle
                </div>
                <div className="mt-0.5 text-xs text-gray-600">
                  {selectedWeight?.label} /{" "}
                  {pack === "bottle" ? "Bottle" : "Without Bottle"}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="inline-flex items-center border border-gray-300 rounded-full overflow-hidden">
                    <button
                      type="button"
                      onClick={onDecQty}
                      className="px-3 py-1.5 text-sm leading-none hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-4 py-1.5 text-xs font-medium">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={onIncQty}
                      className="px-3 py-1.5 text-sm leading-none hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm font-semibold">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-semibold pt-1">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="px-5 py-5 space-y-5 text-sm text-black"
        >
          <div className="text-center">
            <div className="text-xs font-semibold tracking-wide text-gray-700">
              Homemade &amp; Authentic Foods
            </div>
          </div>

          {!isAuthenticated ? (
            <>
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-800">
                  Email address
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded-xl border text-sm text-black outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400"
                />
              </div>

              {step === "otp" && (
                <>
                  {authMode === "signup" && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-800">
                        Your name
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-3 py-2 rounded-xl border text-sm text-black outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-800">
                      Enter OTP
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="6-digit OTP"
                      className="w-full px-3 py-2 rounded-xl border text-sm text-black outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400"
                    />
                    <div className="text-[10px] text-gray-500">
                      We have sent an OTP to your email address.
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-medium text-gray-800">
                Delivery details
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] text-gray-700">
                  Address
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Flat / Street"
                  className="w-full px-3 py-2 rounded-xl border text-sm text-black outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400 resize-none"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <label className="block text-[11px] text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-3 py-2 rounded-xl border text-sm text-black outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400"
                  />
                </div>
                <div className="w-28 space-y-1">
                  <label className="block text-[11px] text-gray-700">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="PIN"
                    className="w-full px-3 py-2 rounded-xl border text-sm text-black outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] text-gray-700">
                  Contact phone (for delivery)
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Enter mobile number"
                  className="w-full px-3 py-2 rounded-xl border text-sm text-black outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#542316] text-white py-3 text-sm font-semibold hover:bg-[#3a170f] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : primaryButtonLabel}
          </button>

          {!isAuthenticated && (
            <div className="pt-1 text-[10px] text-center text-gray-500">
              By proceeding, you accept the T&amp;C and Privacy Policy.
            </div>
          )}

          {isAuthenticated && (
            <div className="pt-1 text-[10px] text-center text-gray-500">
              We’ll use this address and phone for delivering your order.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
