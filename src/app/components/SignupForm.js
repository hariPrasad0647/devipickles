"use client";

import React, { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const OTP_LENGTH = 6;

export default function SignupForm({ onSuccess, redirectTo: redirectProp }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = redirectProp ?? searchParams?.get("redirect") ?? "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otpBoxes, setOtpBoxes] = useState(Array(OTP_LENGTH).fill(""));
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const API_BASE =  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  const inputsRef = useRef(Array.from({ length: OTP_LENGTH }, () => React.createRef()));

  function getOtpString() {
    return otpBoxes.join("").trim();
  }

  async function handleSendOtp(e) {
    e?.preventDefault?.();
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
      setTimeout(() => inputsRef.current[0]?.current?.focus?.(), 80);
    } catch (err) {
      console.error("[signup handleSendOtp] error:", err);
      setError(err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e?.preventDefault?.();
    setError("");
    setMessage("");
    setLoading(true);

    const otp = getOtpString();

    if (otp.length < OTP_LENGTH) {
      setError("Please enter the full OTP.");
      setLoading(false);
      return;
    }

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

  // OTP box handlers (same behavior as in LoginForm)
  function handleOtpChange(e, idx) {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) {
      updateBox(idx, "");
      return;
    }

    if (val.length > 1) {
      const chars = val.split("");
      const newBoxes = [...otpBoxes];
      let pos = idx;
      for (let ch of chars) {
        if (pos >= OTP_LENGTH) break;
        newBoxes[pos] = ch;
        pos++;
      }
      setOtpBoxes(newBoxes);
      const next = Math.min(OTP_LENGTH - 1, idx + chars.length);
      inputsRef.current[next]?.current?.focus?.();
      return;
    }

    updateBox(idx, val);
    if (val && idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.current?.focus?.();
    }
  }

  function updateBox(i, v) {
    setOtpBoxes((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  }

  function handleOtpKeyDown(e, idx) {
    if (e.key === "Backspace") {
      if (otpBoxes[idx]) {
        updateBox(idx, "");
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.current?.focus?.();
        updateBox(idx - 1, "");
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1]?.current?.focus?.();
    } else if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.current?.focus?.();
    }
  }

  function handlePaste(e) {
    const paste = (e.clipboardData || window.clipboardData)?.getData("text") || "";
    const digits = paste.replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!digits) return;
    e.preventDefault();
    const chars = digits.split("");
    const newBoxes = Array.from({ length: OTP_LENGTH }, (_, i) => chars[i] || "");
    setOtpBoxes(newBoxes);
    const focusIndex = Math.min(digits.length, OTP_LENGTH - 1);
    setTimeout(() => inputsRef.current[focusIndex]?.current?.focus?.(), 20);
  }

  return (
    <div className="font-['DM_Sans'] min-h-[320px]">
      <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-center text-[#2a160f]">
        {step === 1 ? "Create your account" : "Verify OTP"}
      </h2>
      <p className="mt-2 text-center text-xs text-gray-500">
        Use your email to sign up quickly.
      </p>

      <form
        onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}
        className="mt-4 space-y-4 px-2"
      >
        {step === 1 && (
          <>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
                className="w-full rounded-xl border border-[#efd0b4] bg-[#fffaf5] text-[#2a160f] px-3 py-2 text-sm outline-none
                  transition-all duration-150
                  focus:border-[#f34332] focus:ring-2 focus:ring-[#f3b089]/40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#efd0b4] bg-[#fffaf5] text-[#2a160f] px-3 py-2 text-sm outline-none
                  transition-all duration-150
                  focus:border-[#f34332] focus:ring-2 focus:ring-[#f3b089]/40"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Enter OTP
              </label>

              <div
                className="flex gap-2 justify-center mt-2"
                onPaste={handlePaste}
                role="group"
                aria-label="OTP input"
              >
                {otpBoxes.map((val, idx) => (
                  <input
                    key={idx}
                    aria-label={`OTP digit ${idx + 1}`}
                    ref={(el) => (inputsRef.current[idx].current = el)}
                    value={val}
                    onChange={(e) => handleOtpChange(e, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 text-black h-12 sm:w-14 sm:h-14 text-center rounded-xl border border-[#efd0b4] bg-[#fffaf5] text-lg font-medium outline-none
                      transition-all duration-150 focus:border-[#f34332] focus:ring-2 focus:ring-[#f3b089]/40"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-[12px] text-[#f34332] hover:text-[#c83225] hover:underline transition-colors"
              >
                Resend OTP
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-600">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-md bg-green-50 px-3 py-2 text-[12px] text-green-700">
            {message}
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="inline-block w-40 rounded-full bg-[#542316] py-2.5 text-sm font-semibold text-white shadow-sm hover:scale-[1.02] transform transition-transform duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? step === 1
                ? "Sending..."
                : "Verifying..."
              : step === 1
              ? "Send OTP"
              : "Verify & Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
