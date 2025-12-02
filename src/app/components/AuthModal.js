// src/components/AuthModal.jsx
"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthModal({ open, onClose, onAuthSuccess }) {
  const [tab, setTab] = useState("login");

  if (!open) return null;

  // 🔑 Will be called by LoginForm / SignupForm when auth succeeds
  const handleSuccess = () => {
    if (typeof onAuthSuccess === "function") {
      onAuthSuccess();
    }
    if (typeof onClose === "function") {
      onClose(); // ✅ always close the modal after success
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
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
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`flex-1 py-2 text-sm font-semibold ${
              tab === "signup"
                ? "border-b-2 border-purple-600 text-purple-700"
                : "text-gray-500"
            }`}
          >
            Sign up
          </button>
        </div>

        {tab === "login" ? (
          <LoginForm redirectTo={null} onSuccess={handleSuccess} />
        ) : (
          <SignupForm redirectTo={null} onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
}
