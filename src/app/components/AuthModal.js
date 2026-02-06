// src/components/AuthModal.jsx
"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthModal({ open, onClose, onAuthSuccess }) {
  const [tab, setTab] = useState("login");

  if (!open) return null;

  const handleSuccess = () => {
    if (typeof onAuthSuccess === "function") onAuthSuccess();
    if (typeof onClose === "function") onClose();
  };

  return (
    // add padding on the overlay so modal keeps spacing from edges on small screens
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
      <div
        // responsive max widths: small screens -> compact, md+ -> larger
        className="w-full max-w-sm md:max-w-lg pb-18 bg-white rounded-2xl shadow-2xl p-6 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at top left, #FFF5E4 80%, #FFFFFF 65%, #FFFFFF 100%)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          ✕
        </button>

        <div className="flex mb-4 border-b">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-2 text-sm font-semibold ${
              tab === "login"
                ? "border-b-2 border-purple-600 text-purple-700"
                : "text-gray-500"
            } transition-colors`}
          >
            Login
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`flex-1 py-2 text-sm font-semibold ${
              tab === "signup"
                ? "border-b-2 border-purple-600 text-purple-700"
                : "text-gray-500"
            } transition-colors`}
          >
            Sign up
          </button>
        </div>

        <div className="relative mt-2 min-h-[260px]">
          <div
            className={`absolute inset-0 transition-all duration-300 ease-out ${
              tab === "login"
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 -translate-x-4 pointer-events-none"
            }`}
          >
            <LoginForm redirectTo={null} onSuccess={handleSuccess} />
          </div>

          <div
            className={`absolute inset-0 transition-all duration-300 ease-out ${
              tab === "signup"
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 translate-x-4 pointer-events-none"
            }`}
          >
            <SignupForm redirectTo={null} onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}
