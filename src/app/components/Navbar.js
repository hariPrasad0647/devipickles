// src/components/Navbar.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa6";
import { FiMenu, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import AuthModal from "./AuthModal";
import { DM_Sans } from "next/font/google";
import Link from "next/link";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      setIsLoggedIn(!!token);
    } catch (err) {
      console.error("[Navbar] localStorage read error:", err);
    }
  }, []);

  const handleUserClick = () => {
    if (isLoggedIn) {
      router.push("/account");
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setAuthModalOpen(false);
  };

  return (
    <>
      <nav
        className="w-full fixed top-0 left-0 z-50 "
        style={{
          background:
            "radial-gradient(circle at top left, #FFF5E4 0%, #FFFFFF 65%, #FFFFFF 100%)",
        }}
      >


        <div className="max-w-7xl mx-auto px-4 md:px-6 relative flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center scale-[0.78] sm:scale-[0.50] md:scale-[0.80] lg:scale-[1.0]">
            <Image
              src="/images/navbar/Logo.png"
              alt="Logo"
              width={90}
              height={90}
            />
          </div>

          {/* DESKTOP CENTERED MENU */}
          <div className="hidden md:block sm:ml-10 absolute left-1/2 -translate-x-1/2">
            <ul className="flex items-center gap-12 sm:gap-8  md:text-[22px] sm:text-[15px] xl:gap-16 xl:text-[26px] 2xl:text-[22px] text-black font-medium">
              <Link href={"#Offers"}>
                <li className="cursor-pointer hover:text-red-400 transition whitespace-nowrap">
                  Today Special Offers
                </li>
              </Link>
              <Link href={"#AboutUs"}>
                <li className="cursor-pointer hover:text-red-400 transition whitespace-nowrap">
                  Why Devi Pickles
                </li>
              </Link>
              <Link href={"#Ingredients"}>
                <li className="cursor-pointer hover:text-red-400 transition whitespace-nowrap">
                  Our Ingredients
                </li>
              </Link>
              <Link href={"#/HealthBenifits"}>
                <li className="cursor-pointer hover:text-red-400 transition whitespace-nowrap">
                  Our Popular Food
                </li>
              </Link>
              <li
                onClick={handleUserClick}
                className="cursor-pointer hover:text-red-400 transition flex items-center"
              >
                <FaUser className="text-[18px]" />
              </li>
            </ul>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-full border border-black/10 bg-white/80 shadow-sm backdrop-blur-sm text-black hover:bg-white"
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* MOBILE DROPDOWN (animated) */}
        <div className="md:hidden px-4 mt-3">
          <div
            className={`
              rounded-2xl bg-white/95 border border-neutral-200 shadow-xl backdrop-blur-sm
              transform origin-top transition-all duration-300 ease-out
              ${isOpen
                ? "opacity-100 scale-100 max-h-96"
                : "opacity-0 scale-95 max-h-0 pointer-events-none"
              }
              overflow-hidden
            `}
          >
            <ul className="flex flex-col gap-2 py-4 px-4 text-[#1A1A1A] font-medium text-sm">
              <li className="cursor-pointer hover:text-red-500 transition">
                Today Special Offers
              </li>
              <li className="cursor-pointer hover:text-red-500 transition">
                Why FoodHut
              </li>
              <li className="cursor-pointer hover:text-red-500 transition">
                Our Menu
              </li>
              <li className="cursor-pointer hover:text-red-500 transition">
                Our Popular Food
              </li>
              <li
                className="cursor-pointer hover:text-red-500 transition flex items-center pt-1 border-t border-neutral-200 mt-2"
                onClick={handleUserClick}
              >
                <FaUser className="mr-2 text-[14px]" />
                <span className="text-sm">
                  {isLoggedIn ? "My Account" : "Login / Signup"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}
