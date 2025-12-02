// src/app/login/page.js
"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginPageInner({ onSuccess, redirectTo: redirectProp }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = redirectProp ?? searchParams.get("redirect") ?? "/";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [serverOtp, setServerOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const API_BASE = "http://localhost:3000";

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
        body: JSON.stringify({ email }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        console.error("[login handleSendOtp] JSON parse error:", err);
      }

      console.log("[login handleSendOtp] response:", {
        status: res.status,
        ok: res.ok,
        data,
      });

      if (!res.ok || !data?.success) {
        throw new Error(
          data?.message || `Failed to send OTP (status ${res.status})`
        );
      }

      if (!data.exists) {
        setError("No account found for this email. Please sign up first.");
        return;
      }

      setMessage("OTP sent successfully!");
      setStep(2);

      if (data.debugOtp) {
        console.log("[login handleSendOtp] DEV OTP:", data.debugOtp);
        setServerOtp(data.debugOtp);
      }
    } catch (err) {
      console.error("[login handleSendOtp] error:", err);
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

    const endpoint = `${API_BASE}/api/v1/auth/verify-otp`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify({ email, otp }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        console.error("[login handleVerifyOtp] JSON parse error:", err);
      }

      console.log("[login handleVerifyOtp] response:", {
        status: res.status,
        ok: res.ok,
        data,
      });

      if (!res.ok || !data?.success) {
        throw new Error(
          data?.message || `Failed to verify OTP (status ${res.status})`
        );
      }

      setMessage("Login successful!");

      if (data.user) {
        try {
          localStorage.setItem("user", JSON.stringify(data.user));
        } catch (storageErr) {
          console.error(
            "[login handleVerifyOtp] localStorage error:",
            storageErr
          );
        }
      }

      if (data.token) {
        try {
          localStorage.setItem("authToken", data.token);
        } catch (storageErr) {
          console.error(
            "[login handleVerifyOtp] token localStorage error:",
            storageErr
          );
        }
      }

      // If used inside modal, parent passes onSuccess → close modal there.
      // If used as /login page, no onSuccess → just redirect like before.
      if (typeof onSuccess === "function") {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    } catch (err) {
      console.error("[login handleVerifyOtp] error:", err);
      setError(err?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-purple-800 to-black px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-2xl font-semibold text-center text-gray-900">
          {step === 1 ? "Login to your account" : "Verify OTP"}
        </h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          Use your email to login quickly.
        </p>
        <Link href="/signup">
          <span className="text-xs text-purple-600 underline">
            Don&apos;t have an account? Sign up
          </span>
        </Link>

        <form
          onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}
          className="mt-6 space-y-4"
        >
          {step === 1 && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-lg border text-black px-3 py-2 text-sm outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          {step === 2 && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border text-black px-3 py-2 text-sm text-center tracking-[0.3em]"
                  placeholder="------"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                className="text-xs text-purple-600 hover:underline"
              >
                Resend OTP
              </button>

              {serverOtp && (
                <p className="text-xs text-gray-500">
                  <strong>Dev OTP:</strong> {serverOtp}
                </p>
              )}
            </>
          )}

          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-md bg-green-50 px-3 py-2 text-xs text-green-700">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-purple-700 py-2.5 text-sm font-semibold text-white"
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
    </div>
  );
}

export default function LoginPage(props) {
  return (
    <Suspense fallback={null}>
      <LoginPageInner {...props} />
    </Suspense>
  );
}
