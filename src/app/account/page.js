// pages/account.js
"use client";

import { useEffect, useState } from "react";
import { clearAuth, logout } from "../utils/auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null); // { name, email }
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressSubmitting, setAddressSubmitting] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    async function fetchAccount() {
      try {
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("authToken");
        const userRaw = localStorage.getItem("user");

        if (!token || !userRaw) {
          setNeedsLogin(true);
          setLoading(false);
          return;
        }

        const user = JSON.parse(userRaw || "{}");

        const res = await fetch(`${API_BASE}/api/v1/userAccount/account`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json().catch(() => null);
        console.log("[AccountPage] /userAccount/account response:", {
          status: res.status,
          ok: res.ok,
          data,
        });

        if (!res.ok || !data?.success) {
          const msg = data?.message || "Failed to load your account.";
          if (res.status === 401 || /invalid|expired/i.test(msg || "")) {
            clearAuth();
            setNeedsLogin(true);
            setLoading(false);
            return;
          }
          setError(msg);
          setLoading(false);
          return;
        }

        setProfile({
          name: data.user?.name || user.name || "",
          email: data.user?.email || user.email || "",
        });

        setAddresses(data.addresses || []);
        console.log("[AccountPage] addresses from API:", data.addresses); // 👈 debug

        setOrders(data.orders || []);
        setLoading(false);
      } catch (err) {
        console.error("[AccountPage] Failed to fetch account:", err);
        setError("Something went wrong while loading your account.");
        setLoading(false);
      }
    }

    fetchAccount();
  }, []);

  function handleAddressInputChange(e) {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleLogoutClick() {
    try {
      if (typeof window === "undefined") return;
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // ensure client is cleared and redirect to home
      clearAuth();
      window.location.href = "/";
    }
  }

  async function handleAddAddressSubmit(e) {
    e.preventDefault();
    setAddressError("");

    const { name, phone, line1, city, pincode } = addressForm;

    if (!name.trim() || !phone.trim() || !line1.trim() || !city.trim() || !pincode.trim()) {
      setAddressError("Please fill all required fields.");
      return;
    }

    try {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("authToken");
      if (!token) {
        setAddressError("You are not logged in.");
        return;
      }

      // 🔹 derive customerId from stored user
      let customerId = null;
      try {
        const userRaw = localStorage.getItem("user");
        const user = JSON.parse(userRaw || "{}");
        customerId = user._id || user.id || user.customerId || null;
      } catch (err) {
        console.error("[AccountPage] Failed to parse user for customerId:", err);
      }

      setAddressSubmitting(true);

      const res = await fetch(`${API_BASE}/api/v1/account/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId, // 👈 match backend expectation
          address: {
            name: addressForm.name.trim(),
            phone: addressForm.phone.trim(),
            line1: addressForm.line1.trim(),
            line2: addressForm.line2.trim(),
            city: addressForm.city.trim(),
            pincode: addressForm.pincode.trim(),
          },
        }),
      });

      const data = await res.json().catch(() => null);
      console.log("[AccountPage] /api/v1/account/address response:", {
        status: res.status,
        ok: res.ok,
        data,
      });

      if (!res.ok || !data?.success) {
        setAddressError(data?.message || "Failed to save address.");
        return;
      }

      // Assuming backend returns { success, addresses: [...] }
      setAddresses(data.addresses || []);
      console.log("[AccountPage] addresses after save:", data.addresses); // 👈 debug

      setAddressForm({
        name: "",
        phone: "",
        line1: "",
        line2: "",
        city: "",
        pincode: "",
      });
      setIsAddingAddress(false);
    } catch (err) {
      console.error("[AccountPage] Failed to add address:", err);
      setAddressError("Something went wrong while saving address.");
    } finally {
      setAddressSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fff7ee] text-[#2a160f]">
      {/* Simple top bar */}
      <header className="border-b border-[#f3d0b5] bg-[#fffaf5]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-tight">
            My Account
          </h1>

          {profile && (
            <div className="flex flex-col items-end text-right bg-white rounded-xl px-3 py-2 shadow-sm border border-[#f3d0b5] transition-transform transition-shadow duration-200 hover:shadow-md hover:-translate-y-0.5">
              <span className="text-xs sm:text-sm font-medium">
                {profile.name}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500">
                {profile.email}
              </span>
            </div>
          )}
          {profile && (
            <button
              type="button"
              onClick={handleLogoutClick}
              className="ml-3 rounded-full border border-[#f34332] px-3 py-1 text-xs sm:text-sm font-semibold text-[#f34332] hover:bg-[#fef0eb] transition-colors duration-150"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {loading && (
          <div className="text-sm sm:text-base text-gray-600 animate-pulse">
            Loading account…
          </div>
        )}

        {!loading && needsLogin && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#f3d0b5] p-5 text-sm sm:text-base space-y-2 transition-shadow duration-200 hover:shadow-md">
            <p className="font-semibold">You&apos;re not signed in.</p>
            <p className="text-gray-600 text-xs sm:text-sm">
              Please log in with your email & OTP to view your profile, addresses
              and orders.
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-2xl px-4 py-3">
            {error}
          </div>
        )}

        {!loading && !needsLogin && !error && (
          <>
            {/* Profile */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#f3d0b5] p-5 md:p-6 transition-transform transition-shadow duration-200 hover:shadow-md hover:-translate-y-0.5">
              <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-4">
                Profile
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <div className="text-[10px] sm:text-[11px] uppercase tracking-wide text-gray-500">
                    Name
                  </div>
                  <div className="mt-1 font-medium">
                    {profile?.name || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] sm:text-[11px] uppercase tracking-wide text-gray-500">
                    Email
                  </div>
                  <div className="mt-1 font-medium break-all">
                    {profile?.email || "—"}
                  </div>
                </div>
              </div>
            </section>

            {/* Addresses */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#f3d0b5] p-5 md:p-6 transition-transform transition-shadow duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h2 className="text-sm sm:text-base md:text-lg font-semibold">
                  Saved Addresses
                </h2>
                <button
                  type="button"
                  onClick={() => setIsAddingAddress((prev) => !prev)}
                  className="inline-flex items-center rounded-full border border-[#f34332]/40 px-4 py-1.5 text-[11px] sm:text-xs font-semibold text-[#f34332] hover:bg-[#fef0eb] hover:border-[#f34332] transition-colors transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                  {isAddingAddress ? "Cancel" : "+ Add address"}
                </button>
              </div>

              {isAddingAddress && (
                <form
                  onSubmit={handleAddAddressSubmit}
                  className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm bg-[#fffaf5] border border-[#f3d0b5] rounded-2xl px-4 py-3"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-[11px] text-gray-600">
                      Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={addressForm.name}
                      onChange={handleAddressInputChange}
                      className="w-full px-3 py-2 rounded-lg border text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#f34332]/70 focus:border-[#f34332] transition-shadow transition-colors duration-200"
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-[11px] text-gray-600">
                      Phone*
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={addressForm.phone}
                      onChange={handleAddressInputChange}
                      className="w-full px-3 py-2 rounded-lg border text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#f34332]/70 focus:border-[#f34332] transition-shadow transition-colors duration-200"
                      placeholder="Mobile number"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] sm:text-[11px] text-gray-600">
                      Address line 1*
                    </label>
                    <input
                      type="text"
                      name="line1"
                      value={addressForm.line1}
                      onChange={handleAddressInputChange}
                      className="w-full px-3 py-2 rounded-lg border text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#f34332]/70 focus:border-[#f34332] transition-shadow transition-colors duration-200"
                      placeholder="House / Flat / Street"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] sm:text-[11px] text-gray-600">
                      Address line 2
                    </label>
                    <input
                      type="text"
                      name="line2"
                      value={addressForm.line2}
                      onChange={handleAddressInputChange}
                      className="w-full px-3 py-2 rounded-lg border text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#f34332]/70 focus:border-[#f34332] transition-shadow transition-colors duration-200"
                      placeholder="Area / Landmark (optional)"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-[11px] text-gray-600">
                      City*
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressInputChange}
                      className="w-full px-3 py-2 rounded-lg border text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#f34332]/70 focus:border-[#f34332] transition-shadow transition-colors duration-200"
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-[11px] text-gray-600">
                      Pincode*
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={addressForm.pincode}
                      onChange={handleAddressInputChange}
                      className="w-full px-3 py-2 rounded-lg border text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#f34332]/70 focus:border-[#f34332] transition-shadow transition-colors duration-200"
                      placeholder="PIN"
                    />
                  </div>

                  {addressError && (
                    <div className="md:col-span-2 text-[11px] text-red-600">
                      {addressError}
                    </div>
                  )}

                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={addressSubmitting}
                      className="rounded-full bg-[#f34332] text-white px-5 py-2 text-xs sm:text-sm font-semibold hover:bg-[#d73526] disabled:opacity-60 disabled:cursor-not-allowed transition-colors transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
                    >
                      {addressSubmitting ? "Saving…" : "Save address"}
                    </button>
                  </div>
                </form>
              )}

              {addresses.length === 0 ? (
                <p className="text-xs sm:text-sm text-gray-500">
                  No saved addresses yet. Your address will be saved next time
                  you place an order.
                </p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {addresses.map((addr, idx) => (
                    <div
                      key={addr._id || idx}
                      className="relative rounded-2xl border border-[#f3d0b5] bg-[#fffaf5] px-4 py-3 text-xs sm:text-sm transition-transform transition-shadow duration-200 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-sm sm:text-base">
                            {addr.name}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-gray-500">
                            {addr.phone}
                          </div>
                        </div>
                        {(idx === 0 || addr.isDefault) && (
                          <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-[#fef2e7] text-[#b26a3e] font-semibold border border-[#f3d0b5]">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-[11px] sm:text-xs text-[#5b3a29] leading-relaxed">
                        <div>{addr.line1}</div>
                        {addr.line2 && <div>{addr.line2}</div>}
                        <div>
                          {addr.city} – {addr.pincode}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Orders */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#f3d0b5] p-5 md:p-6 transition-transform transition-shadow duration-200 hover:shadow-md hover:-translate-y-0.5">
              <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-4">
                Orders
              </h2>

              {orders.length === 0 ? (
                <div className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-500">
                  You haven&apos;t placed any orders yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="rounded-2xl border border-[#f3d0b5] bg-[#fffaf5] px-4 py-3 text-[11px] sm:text-xs md:text-sm transition-transform transition-shadow duration-200 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-semibold text-sm sm:text-base lg:text-lg">
                          Order #{order._id.slice(-6)}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] md:text-xs text-gray-500">
                          <span>
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <span>•</span>
                          <span className="capitalize">
                            {order.paymentStatus === "cod_pending"
                              ? "COD"
                              : order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-[10px] sm:text-[11px] lg:text-sm font-medium tracking-wide text-gray-900">
                            Items
                          </div>
                          <ul className="text-[11px] sm:text-xs lg:text-sm text-[#5b3a29] space-y-0.5">
                            {order.items?.map((item, idx) => (
                              <li key={idx}>
                                {item.qty} × {item.name} – ₹
                                {item.price.toLocaleString("en-IN")}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-1 md:-mt-6">
                          <div className="text-[10px] sm:text-[11px] lg:text-sm uppercase tracking-wide text-gray-900">
                            Deliver to
                          </div>
                          <div className="text-[11px] sm:text-xs lg:text-sm text-[#5b3a29] leading-relaxed max-w-xs">
                            <div>{order.address?.name}</div>
                            <div className="text-[10px] sm:text-[11px] text-gray-500">
                              {order.address?.phone}
                            </div>
                            <div>{order.address?.line1}</div>
                            {order.address?.line2 && (
                              <div>{order.address?.line2}</div>
                            )}
                            <div>
                              {order.address?.city} – {order.address?.pincode}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1 text-right">
                          <div className="text-[10px] sm:text-[11px] uppercase tracking-wide text-gray-500">
                            Total
                          </div>
                          <div className="text-sm sm:text-base lg:text-lg font-semibold text-[#f34332]">
                            ₹{order.amount?.toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
