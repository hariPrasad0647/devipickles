"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupForm({ redirectTo: redirectProp }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = redirectProp || searchParams.get("redirect") || "/";

  const [name, setName] = useState("");
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

      router.push(redirectTo);
    } catch (err) {
      console.error("[signup handleVerifyOtp] error:", err);
      setError(err?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-center text-gray-900">
        {step === 1 ? "Create your account" : "Verify OTP"}
      </h1>
      <p className="mt-1 text-center text-sm text-gray-500">
        Use your email to sign up quickly.
      </p>

      <form
        onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}
        className="mt-6 space-y-4"
      >
        {step === 1 && (
          <>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                className="w-full rounded-lg border text-black px-3 py-2 text-sm outline-none"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
          </>
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
  );
}
