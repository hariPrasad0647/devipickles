// components/OrderSummaryPopup.js
"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
// add near other imports
import { useRouter } from "next/navigation";

import { loadRazorpayScript } from "../utils/razorpay";

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

  // Saved addresses from backend
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // step: "email" | "otp" | "address"
  const [step, setStep] = useState("email");
  const [authMode, setAuthMode] = useState(null); // "login" | "signup"

  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  const router = useRouter();


  // payment method: "ONLINE" | "COD"
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  // helper to fetch account info (addresses) when logged in
  async function refreshAccountData(token) {
    try {
      if (!token) return;
      setLoadingAddresses(true);

      const res = await fetch(`${API_BASE}/api/v1/account/address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);
      console.log("[OrderSummaryPopup] /api/v1/account/address (GET) response:", {
        status: res.status,
        ok: res.ok,
        data,
      });

      if (!res.ok || !data?.success) {
        setSavedAddresses([]);
        setSelectedAddressId(null);
        return;
      }

      const addrs = data.addresses || [];
      setSavedAddresses(addrs);

      if (addrs.length > 0) {
        const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
        const defaultId = defaultAddr._id || defaultAddr.id || null;
        setSelectedAddressId(defaultId);
        // Prefill contact phone from default address if present
        if (defaultAddr.phone && !contactPhone) {
          setContactPhone(defaultAddr.phone);
        }
      } else {
        setSelectedAddressId(null);
      }
    } catch (err) {
      console.error("[OrderSummaryPopup] Failed to fetch addresses:", err);
      setSavedAddresses([]);
      setSelectedAddressId(null);
    } finally {
      setLoadingAddresses(false);
    }
  }

  // keep auth state in sync when modal opens
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
            setContactPhone((prev) => prev || user.phone);
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

        // fetch saved addresses for this user
        refreshAccountData(token);
      } else {
        setIsAuthenticated(false);
        setStep("email");
        setCustomerId(null);
        setSavedAddresses([]);
        setSelectedAddressId(null);
      }
    } catch (err) {
      console.error("[OrderSummaryPopup] Error while checking auth state:", err);
      setIsAuthenticated(false);
      setStep("email");
      setCustomerId(null);
      setSavedAddresses([]);
      setSelectedAddressId(null);
    }
  }, [open]);

  // Prevent background scroll while modal is open and preserve scroll position
  useEffect(() => {
    if (!open) return;
    if (typeof window === "undefined") return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.dataset.modalScrollY = String(scrollY);

    return () => {
      const prev = Number(document.body.dataset.modalScrollY || 0);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      delete document.body.dataset.modalScrollY;
      window.scrollTo(0, prev);
    };
  }, [open]);

  if (!open) return null;

  async function handleStartOtpFlow() {
    if (!email.trim()) {
      toast.error("Please enter your email address.");
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
        toast.error(data?.message || "Failed to send OTP. Please try again.");
        return;
      }

      if (data.exists) {
        setAuthMode("login");
      } else {
        setAuthMode("signup");
      }

      setStep("otp");
      toast.success("OTP sent to your email address.");
    } catch (err) {
      console.error("[OrderSummaryPopup] send-otp error:", err);
      toast.error("Something went wrong while sending OTP.");
    } finally {
      setLoading(false);
    }
  }

 async function handleVerifyOtp() {
  const combinedOtp = otp.join("");

  if (!email.trim() || combinedOtp.length !== 6) {
    toast.error("Please enter the complete 6-digit OTP.");
    return;
  }

  try {
    setLoading(true);

    // LOGIN FLOW
    if (authMode === "login") {
      const res = await fetch(`${API_BASE}/api/v1/auth/otp-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp: combinedOtp,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success || !data?.token || !data?.user) {
        toast.error(data?.message || "OTP verification failed.");
        return;
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setCustomerId(data.user?._id || data.user?.id || null);
      setIsAuthenticated(true);
      setStep("address");
      setOtp(["", "", "", "", "", ""]);

      await refreshAccountData(data.token);
      return;
    }

    // SIGNUP FLOW
    if (authMode === "signup") {
      if (!name.trim()) {
        toast.error("Please enter your name.");
        return;
      }

      const res = await fetch(`${API_BASE}/api/v1/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          otp: combinedOtp,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success || !data?.token || !data?.user) {
        toast.error(data?.message || "Signup failed.");
        return;
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setCustomerId(data.user?._id || data.user?.id || null);
      setIsAuthenticated(true);
      setStep("address");
      setOtp(["", "", "", "", "", ""]);

      await refreshAccountData(data.token);
    }
  } catch (err) {
    console.error("[OrderSummaryPopup] verify OTP error:", err);
    toast.error("Something went wrong while verifying OTP.");
  } finally {
    setLoading(false);
  }
}

  // --- HELPERS (COD + Razorpay) ---

  async function placeCodOrder({ payload, items, totalPrice, address: orderAddress }) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/orders/cod`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
        body: JSON.stringify({
          customerId: payload.customerId,
          items,
          amount: totalPrice,
          address: orderAddress,
        }),
      });

      const data = await res.json().catch(() => null);
      console.log("[OrderSummaryPopup] COD order response:", {
        status: res.status,
        ok: res.ok,
        data,
      });

      if (!res.ok || !data?.success) {
        toast.error(data?.message || "Failed to place COD order.");
        return null;
      }

      toast.success("Your COD order has been placed.");
      return data.order;
    } catch (err) {
      console.error("[OrderSummaryPopup] COD order error:", err);
      toast.error("Something went wrong while placing COD order.");
      return null;
    }
  }

  async function createRazorpayOrder({ amount, payload, items, address: orderAddress }) {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;

      const res = await fetch(`${API_BASE}/api/v1/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          amount,
          currency: "INR",
          paymentMethod: "razorpay",
          // backend can now derive customerId from JWT; this is just extra
          customerId: payload.customerId,
          items,
          address: orderAddress,
          notes: {
            email: payload.email,
          },
        }),
      });

      const data = await res.json().catch(() => null);
      console.log("[OrderSummaryPopup] create-order response:", {
        status: res.status,
        ok: res.ok,
        data,
      });

      if (!res.ok || !data?.success || !data?.order) {
        toast.error(data?.message || "Failed to start payment.");
        return null;
      }

      return {
        razorpayOrder: data.order,
        keyId: data.keyId,
      };
    } catch (err) {
      console.error("[OrderSummaryPopup] create-order error:", err);
      toast.error("Failed to start payment.");
      return null;
    }
  }

  async function openRazorpayCheckout({
    razorpayOrder,
    keyId,
    payload,
    items,
    totalPrice,
    address: orderAddress,
  }) {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.Razorpay) {
        toast.error("Razorpay SDK not loaded.");
        console.error("[OrderSummaryPopup] Razorpay SDK not found on window.");
        return reject(new Error("Razorpay SDK not loaded"));
      }

      if (!keyId) {
        toast.error("Payment configuration error. Missing Razorpay key.");
        console.error("[OrderSummaryPopup] Missing keyId in openRazorpayCheckout");
        return reject(new Error("Missing Razorpay keyId"));
      }

      const options = {
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Devi Foods",
        description: "Order payment",
        order_id: razorpayOrder.id,
        prefill: {
          name: payload.name,
          email: payload.email,
          contact: payload.phone,
        },
        notes: {
          customerId: payload.customerId,
        },
        handler: async function (response) {
          console.log(
            "[OrderSummaryPopup] Razorpay success response:",
            response
          );
          try {
            const verifyRes = await fetch(`${API_BASE}/api/v1/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,

                customerId: payload.customerId,
                items,
                amount: totalPrice,
                address: orderAddress,
                paymentDetails: {
                  email: payload.email,
                  name: payload.name || payload.customerName || orderAddress.name || "",
                  phone: payload.phone || orderAddress.phone || ""
                },
              }),

            });

            const verifyData = await verifyRes.json().catch(() => null);
            console.log("[OrderSummaryPopup] verify response:", {
              status: verifyRes.status,
              ok: verifyRes.ok,
              verifyData,
            });

            if (!verifyRes.ok || !verifyData?.success) {
              toast.error(
                verifyData?.message ||
                "Payment verified but order creation failed."
              );
              return reject(new Error("Verify/payment error"));
            }

            toast.success("Payment successful and order created.");
            resolve(verifyData.order);
          } catch (err) {
            console.error("[OrderSummaryPopup] verify error:", err);
            toast.error("Payment verification failed.");
            reject(err);
          }
        },
        modal: {
          ondismiss: function () {
            console.log("[OrderSummaryPopup] Razorpay popup closed by user");
            reject(new Error("Payment cancelled"));
          },
        },
        theme: {
          color: "#542316",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // Minimal validation & preserve existing flow
      if (!isAuthenticated) {
        if (step === "email") {
          await handleStartOtpFlow();
          return;
        }
        if (step === "otp") {
          await handleVerifyOtp();
          return;
        }
      }

      // If authenticated:
      if (isAuthenticated) {
        const hasSavedAddress =
          savedAddresses.length > 0 && !!selectedAddressId;

        // If no saved addresses yet, require address fields
        if (!hasSavedAddress) {
          if (!address.trim()) {
            toast.error("Please enter your address.");
            return;
          }
          if (!city.trim()) {
            toast.error("Please enter your city.");
            return;
          }
          if (!pincode.trim()) {
            toast.error("Please enter your pincode.");
            return;
          }
        }

        if (!contactPhone.trim()) {
          toast.error("Please enter your contact phone.");
          return;
        }
      }

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const payload = {
        email: email.trim(),
        phone: contactPhone.trim(),
        name: user?.name || name || "",
        customerId:
          customerId ||
          user?._id ||
          user?.id ||
          user?.customerId ||
          null,
        paymentMethod: paymentMethod, // "ONLINE" | "COD"
        cashOnDelivery: paymentMethod === "COD",
      };

      const items = [
        {
          productId: selectedWeight?.productId || "chicken-pickle",
          name: "Devi Spicy Chicken Pickle",
          qty,
          price: totalPrice,
        },
      ];

      // Decide which address to use for this order
      let orderAddress;
      const hasSavedAddress =
        savedAddresses.length > 0 && !!selectedAddressId;

      if (hasSavedAddress) {
        const chosenAddress =
          savedAddresses.find(
            (a) =>
              (a._id && a._id === selectedAddressId) ||
              (a.id && a.id === selectedAddressId)
          ) || savedAddresses[0];

        orderAddress = {
          name: chosenAddress.name || payload.name,
          phone: contactPhone.trim() || chosenAddress.phone || payload.phone,
          line1: chosenAddress.line1,
          line2: chosenAddress.line2 || "",
          city: chosenAddress.city,
          pincode: chosenAddress.pincode,
        };
      } else {
        // First-time address entered at checkout
        orderAddress = {
          name: payload.name,
          phone: contactPhone.trim() || payload.phone,
          line1: address.trim(),
          line2: "",
          city: city.trim(),
          pincode: pincode.trim(),
        };
      }

      console.log("[OrderSummaryPopup] Order payload:", {
        payload,
        items,
        orderAddress,
      });

      setLoading(true);

      let finalOrder = null;

      if (paymentMethod === "COD") {
        // COD: directly create order, no Razorpay
        finalOrder = await placeCodOrder({
          payload,
          items,
          totalPrice,
          address: orderAddress,
        });
        if (!finalOrder) {
          setLoading(false);
          return;
        }
      } else {
        // ONLINE: load Razorpay script + create order + open checkout
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast.error(
            "Razorpay SDK failed to load. Please check your connection."
          );
          setLoading(false);
          return;
        }

        const orderResult = await createRazorpayOrder({
          amount: totalPrice,
          payload,
          items,
          address: orderAddress,
        });

        if (!orderResult) {
          setLoading(false);
          return;
        }

        const { razorpayOrder, keyId } = orderResult;

        try {
          finalOrder = await openRazorpayCheckout({
            razorpayOrder,
            keyId,
            payload,
            items,
            totalPrice,
            address: orderAddress,
          });
        } catch (err) {
          console.error("[OrderSummaryPopup] Payment flow error:", err);
          setLoading(false);
          return;
        }
      }


      if (typeof onLoginSuccess === "function") {
        onLoginSuccess({
          ...payload,
          items,
          totalPrice,
          order: finalOrder,
          address: orderAddress,
        });
      }
      window.location.href = "/account";
      onClose();
    } catch (err) {
      console.error("[OrderSummaryPopup] Submit failed:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4"
      aria-modal="true"
      role="dialog"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose && onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden text-black"
        style={{
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
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

        <div
          className="overflow-y-auto px-0 pb-5"
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 8,
            WebkitOverflowScrolling: "touch",
          }}
        >
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

          {/* Form */}
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
                    className="w-full px-3 py-2 rounded-xl border text-sm text_black outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400"
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

                    <div className="flex justify-between gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            if (!val) return;

                            const newOtp = [...otp];
                            newOtp[index] = val;
                            setOtp(newOtp);

                            const next = document.getElementById(`otp-${index + 1}`);
                            if (next) next.focus();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Backspace") {
                              const newOtp = [...otp];
                              if (newOtp[index]) {
                                newOtp[index] = "";
                                setOtp(newOtp);
                              } else {
                                const prev = document.getElementById(`otp-${index - 1}`);
                                if (prev) prev.focus();
                              }
                            }
                          }}
                          className="w-10 h-10 text-center text-lg border rounded-lg outline-none focus:ring-1 focus:ring-black"
                        />
                      ))}
                    </div>

                  </>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <div className="text-xs font_medium text-gray-800">
                  Delivery details
                </div>

                {loadingAddresses && (
                  <div className="text-[11px] text-gray-500">
                    Loading your saved addresses…
                  </div>
                )}

                {savedAddresses.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      <div className="text-[11px] text-gray-700">
                        Select a saved address
                      </div>
                      <div className="space-y-2">
                        {savedAddresses.map((addr, idx) => {
                          const addrId = addr._id || addr.id || String(idx);
                          const isSelected = selectedAddressId === addrId;
                          return (
                            <label
                              key={addrId}
                              className={`flex items-start gap-2 rounded-xl border px-3 py-2 cursor-pointer ${isSelected
                                ? "border-black bg-gray-50"
                                : "border-gray-200 hover:border-gray-400"
                                }`}
                            >
                              <input
                                type="radio"
                                name="selectedAddress"
                                className="mt-1"
                                checked={isSelected}
                                onChange={() => {
                                  setSelectedAddressId(addrId);
                                  if (addr.phone) {
                                    setContactPhone(addr.phone);
                                  }
                                }}
                              />
                              <div className="text-xs">
                                <div className="font-semibold">
                                  {addr.name || name || "Customer"}
                                  {(addr.isDefault || idx === 0) && (
                                    <span className="ml-2 text-[9px] px-2 py-0.5 rounded-full bg-gray-100 border border-gray-300 uppercase">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-gray-500">
                                  {addr.phone}
                                </div>
                                <div className="text-[11px] text-gray-700 mt-1">
                                  {addr.line1}
                                  {addr.line2 && `, ${addr.line2}`}
                                  , {addr.city} – {addr.pincode}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] text-gray-700">
                        Contact phone (for this order)
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="Enter mobile number"
                        className="w-full px-3 py-2 rounded-xl border text-sm text-black outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400"
                      />
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}

                {/* Payment method */}
                <div className="pt-2 border_t mt-2">
                  <div className="text-xs font-medium text-gray-800 mb-2">
                    Payment method
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="ONLINE"
                        checked={paymentMethod === "ONLINE"}
                        onChange={() => setPaymentMethod("ONLINE")}
                        className="w-4 h-4"
                      />
                      <span>Online / Prepaid</span>
                    </label>

                    {/* <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="w-4 h-4"
                      />
                      <span>Cash on Delivery (Pay on delivery)</span>
                    </label> */}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-2">
                    {paymentMethod === "COD"
                      ? "You’ll pay the delivery person in cash when your order arrives."
                      : "You will be redirected to the online payments page at checkout."}
                  </div>
                </div>
              </div>
            )}

            {/* Submit button */}
            <div
              className="sticky bottom-0 left-0 right-0 pt-2 bg-white"
              style={{ paddingTop: 8 }}
            >
              <button
                type="submit"
                disabled={loading || (step === "otp" && otp.some(d => !d))}
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
