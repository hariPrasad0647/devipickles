"use client";

import React, { Suspense, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const OTP_LENGTH = 6;

// ✅ Page component now just provides a Suspense boundary
export default function LoginForm(props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormInner {...props} />
    </Suspense>
  );
}

// ✅ All your original logic moved here, unchanged
function LoginFormInner({ onSuccess, redirectTo: redirectProp }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = redirectProp ?? searchParams?.get("redirect") ?? "/";

  const [email, setEmail] = useState("");
  const [otpBoxes, setOtpBoxes] = useState(Array(OTP_LENGTH).fill(""));
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  const inputsRef = useRef(
    Array.from({ length: OTP_LENGTH }, () => React.createRef())
  );

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
        body: JSON.stringify({ email }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        console.error("[login handleSendOtp] JSON parse error:", err);
      }

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

      // focus the first OTP input
      setTimeout(() => inputsRef.current[0]?.current?.focus?.(), 80);
    } catch (err) {
      console.error("[login handleSendOtp] error:", err);
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

    const endpoint = `${API_BASE}/api/v1/auth/otp-login`;


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

  // OTP handlers
  function updateBox(i, v) {
    setOtpBoxes((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  }

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
    } else if (e.key === "Enter" && step === 2) {
      // trigger the submit button so Enter works reliably
      const btn = document.getElementById("otp-submit-button");
      if (btn) btn.click();
    }
  }

  function handlePaste(e) {
    const paste =
      (e.clipboardData || window.clipboardData)?.getData("text") || "";
    const digits = paste.replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!digits) return;
    e.preventDefault();
    const chars = digits.split("");
    const newBoxes = Array.from(
      { length: OTP_LENGTH },
      (_, i) => chars[i] || ""
    );
    setOtpBoxes(newBoxes);
    const focusIndex = Math.min(digits.length, OTP_LENGTH - 1);
    setTimeout(
      () => inputsRef.current[focusIndex]?.current?.focus?.(),
      20
    );
  }

  return (
    <div className="min-h-[280px] font-['DM_Sans']">
      <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-center text-[#2a160f]">
        {step === 1 ? "Login to your account" : "Verify OTP"}
      </h2>
      <p className="mt-2 text-center text-xs text-gray-500">
        Use your email to login quickly.
      </p>

      <div className="mt-3 mb-2 text-center">
        <Link href="/signup">
          <span className="text-[12px] text-[#f34332] hover:text-[#c83225] underline-offset-2 hover:underline transition-colors">
            Don't have an account? Sign up
          </span>
        </Link>
      </div>

      <form
        onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}
        className="mt-4 space-y-4"
      >
        {step === 1 && (
          <div className="space-y-1 px-2">
            <label className="text-xs font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[#efd0b4] bg-[#fffaf5] text-[#2a160f] px-3 py-2 text-sm outline-none transition-all duration-150 focus:border-[#f34332] focus:ring-2 focus:ring-[#f3b089]/40"
            />
          </div>
        )}

        {step === 2 && (
          <>
            <div className="space-y-1 px-2">
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
                    ref={(el) =>
                      (inputsRef.current[idx].current = el)
                    }
                    value={val}
                    onChange={(e) => handleOtpChange(e, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center rounded-xl border border-[#efd0b4] bg-[#fffaf5] text-lg font-medium outline-none transition-all duration-150 focus:border-[#f34332] focus:ring-2 focus:ring-[#f3b089]/40"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-[12px] sm:text-sm text-[#f34332] hover:text-[#c83225] hover:underline underline-offset-2 transition-colors"
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

        {/* Primary button (always visible, id used to trigger Enter) */}
        <div className="flex justify-center">
          <button
            id="otp-submit-button"
            type="submit"
            disabled={loading}
            className="inline-block w-40 rounded-full bg-[#f34332] py-2.5 text-sm font-semibold text-white shadow-md hover:scale-[1.02] transform transition-transform duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
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
