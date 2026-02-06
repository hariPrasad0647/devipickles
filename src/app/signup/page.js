// src/components/SignupForm.jsx
"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SignupFormInner({ onSuccess, redirectTo: redirectProp }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = redirectProp ?? searchParams.get("redirect") ?? "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [serverOtp, setServerOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const API_BASE =  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const endpoint = `${API_BASE}/api/v1/auth/send-otp`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify({ name, email }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        console.error("[signup handleSendOtp] JSON parse error:", err);
      }

      console.log("[signup handleSendOtp] response:", {
        status: res.status,
        ok: res.ok,
        data,
      });

      if (!res.ok || !data?.success) {
        throw new Error(
          data?.message || `Failed to send OTP (status ${res.status})`
        );
      }

      if (data.exists) {
        setError("This email is already registered. Please login instead.");
        return;
      }

      setMessage("OTP sent successfully!");
      setStep(2);

      if (data.debugOtp) {
        console.log("[signup handleSendOtp] DEV OTP:", data.debugOtp);
        setServerOtp(data.debugOtp);
      }
    } catch (err) {
      console.error("[signup handleSendOtp] error:", err);
      setError(err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const endpoint = `${API_BASE}/api/v1/auth/signup`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify({ name, email, otp }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        console.error("[signup handleVerifyOtp] JSON parse error:", err);
      }

      console.log("[signup handleVerifyOtp] response:", {
        status: res.status,
        ok: res.ok,
        data,
      });

      if (!res.ok || !data?.success) {
        throw new Error(
          data?.message || `Failed to verify OTP (status ${res.status})`
        );
      }

      setMessage("Signup successful!");

      if (data.user) {
        try {
          localStorage.setItem("user", JSON.stringify(data.user));
        } catch (storageErr) {
          console.error(
            "[signup handleVerifyOtp] localStorage user error:",
            storageErr
          );
        }
      }

      if (data.token) {
        try {
          localStorage.setItem("authToken", data.token);
        } catch (storageErr) {
          console.error(
            "[signup handleVerifyOtp] localStorage token error:",
            storageErr
          );
        }
      }

      if (typeof onSuccess === "function") {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    } catch (err) {
      console.error("[signup handleVerifyOtp] error:", err);
      setError(err?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="font-['DM_Sans']">
      <h1 className="font-['Playfair_Display'] text-xl sm:text-2xl font-semibold text-center text-[#2a160f]">
        {step === 1 ? "Create your account" : "Verify OTP"}
      </h1>
      <p className="mt-2 text-center text-xs sm:text-sm text-gray-500">
        Use your email to sign up quickly.
      </p>

      <form
        onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}
        className="mt-5 space-y-4"
      >
        {step === 1 && (
          <>
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-[#efd0b4] bg-[#fffaf5] text-[#2a160f] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#f3b089] focus:border-[#f3b089] transition-all"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-[#efd0b4] bg-[#fffaf5] text-[#2a160f] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#f3b089] focus:border-[#f3b089] transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-[#efd0b4] bg-[#fffaf5] text-[#2a160f] px-3 py-2 text-sm text-center tracking-[0.35em] outline-none focus:ring-2 focus:ring-[#f3b089] focus:border-[#f3b089] transition-all"
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <button
              type="button"
              onClick={handleSendOtp}
              className="text-[11px] sm:text-xs text-[#f34332] hover:text-[#c83225] hover:underline underline-offset-2 transition-colors"
            >
              Resend OTP
            </button>

            {serverOtp && (
              <p className="text-[11px] sm:text-xs text-gray-500">
                <strong>Dev OTP:</strong> {serverOtp}
              </p>
            )}
          </>
        )}

        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-[11px] sm:text-xs text-red-600">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-md bg-green-50 px-3 py-2 text-[11px] sm:text-xs text-green-700">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-full bg-[#542316] py-2.5 text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-[#3b170f] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {loading
            ? step === 1
              ? "Sending OTP..."
              : "Verifying..."
            : step === 1
            ? "Send OTP"
            : "Verify & Continue"}
        </button>
      </form>
    </div>
  );
}

export default function SignupForm(props) {
  return (
    <Suspense fallback={null}>
      <SignupFormInner {...props} />
    </Suspense>
  );
}
