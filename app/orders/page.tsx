"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrdersByStudent, type Order } from "@/lib/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      // Get current user
      const { getCurrentUser } = await import("@/lib/auth");
      const user = await getCurrentUser();

      if (!user || !user.prefs?.studentId) {
        console.log("No user or studentId found");
        setLoading(false);
        return;
      }

      console.log("Fetching orders for studentId:", user.prefs.studentId);
      const fetchedOrders = await getOrdersByStudent(user.prefs.studentId);
      console.log("Fetched orders:", fetchedOrders);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const activeOrders = orders.filter((o) =>
    ["received", "preparing", "ready"].includes(o.status)
  );
  const pastOrders = orders.filter((o) =>
    ["taken-unpaid", "completed"].includes(o.status)
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      received: "bg-blue-50 text-blue-700 border-blue-200",
      preparing: "bg-yellow-50 text-yellow-700 border-yellow-200",
      ready: "bg-green-50 text-green-700 border-green-200",
      "taken-unpaid": "bg-orange-50 text-orange-700 border-orange-200",
      completed: "bg-neutral-100 text-neutral-600 border-neutral-200",
    };
    const labels = {
      received: "Received",
      preparing: "Preparing",
      ready: "Ready",
      "taken-unpaid": "Pending Payment",
      completed: "Completed",
    };
    return {
      style: styles[status as keyof typeof styles] || styles.received,
      label: labels[status as keyof typeof labels] || status,
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="border-b border-neutral-100">
          <div className="container mx-auto px-6 py-5 max-w-2xl flex items-center justify-between">
            <h1 className="text-xl font-semibold text-neutral-900">
              My Orders
            </h1>
          </div>
        </div>
        <div className="container mx-auto px-6 py-12 max-w-2xl text-center">
          <p className="text-neutral-500">Loading orders...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="border-b border-neutral-100">
        <div className="container mx-auto px-6 py-5 max-w-2xl flex items-center justify-between">
          <h1 className="text-xl font-semibold text-neutral-900">My Orders</h1>
          <button
            onClick={fetchOrders}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#86a349] hover:bg-[#86a349]/5 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-2xl space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">
              No orders yet
            </h2>
            <p className="text-neutral-500 mb-6">
              Start ordering your favorite meals
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#86a349] hover:bg-[#748f3e] text-white rounded-xl font-medium transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            {/* Active Orders */}
            {activeOrders.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-neutral-500 mb-3">
                  ACTIVE ORDERS
                </h2>
                <div className="space-y-3">
                  {activeOrders.map((order) => {
                    const badge = getStatusBadge(order.status);
                    return (
                      <div
                        key={order.$id}
                        className="bg-white border-2 border-[#86a349] rounded-2xl p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="text-3xl font-bold text-neutral-900 mb-2">
                              #{order.orderNumber}
                            </div>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${badge.style}`}
                            >
                              {badge.label}
                            </span>
                            <div className="text-xs text-neutral-400 mt-2">
                              {formatDate(order.createdAt)}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4 py-4 border-y border-neutral-100">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-neutral-600">
                                {item.quantity}x {item.name}
                              </span>
                              <span className="text-neutral-900">
                                HK$ {item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-neutral-500">
                            Total
                          </span>
                          <span className="text-xl font-semibold text-neutral-900">
                            HK$ {order.total}
                          </span>
                        </div>

                        {order.status === "ready" && (
                          <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                            <p className="text-sm text-green-800 font-medium mb-2">
                              ✓ Your order is ready for pickup!
                            </p>
                            <p className="text-sm text-green-700">
                              Please collect your order at the counter and pay{" "}
                              <span className="font-semibold">
                                HK$ {order.total}
                              </span>{" "}
                              after you finish your meal.
                            </p>
                            <p className="text-xs text-green-600 mt-2">
                              Order #{order.orderNumber}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past Orders */}
            {pastOrders.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-neutral-500 mb-3">
                  PAST ORDERS
                </h2>
                <div className="space-y-3">
                  {pastOrders.map((order) => {
                    const badge = getStatusBadge(order.status);
                    return (
                      <div
                        key={order.$id}
                        className="bg-white border border-neutral-100 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-neutral-900 mb-1">
                              #{order.orderNumber}
                            </div>
                            <div className="text-sm text-neutral-500">
                              {formatDate(order.createdAt)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-neutral-900 mb-1">
                              HK$ {order.total}
                            </div>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${badge.style}`}
                            >
                              {badge.label}
                            </span>
                          </div>
                        </div>

                        {order.status === "taken-unpaid" && (
                          <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                            <p className="text-sm text-orange-800 font-medium mb-2">
                              📦 Order picked up
                            </p>
                            <p className="text-sm text-orange-700">
                              Please pay{" "}
                              <span className="font-semibold">
                                HK$ {order.total}
                              </span>{" "}
                              at the counter after your meal.
                            </p>
                            <p className="text-xs text-orange-600 mt-2">
                              Order #{order.orderNumber}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="flex items-center justify-around py-3">
            <Link href="/menu" className="flex flex-col items-center gap-1">
              <svg
                className="w-6 h-6 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
                />
              </svg>
              <span className="text-xs text-neutral-400">Your meal</span>
            </Link>
            <Link href="/orders" className="flex flex-col items-center gap-1">
              <svg
                className="w-6 h-6 text-[#86a349]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-xs text-[#86a349]">My order</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center gap-1">
              <svg
                className="w-6 h-6 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-xs text-neutral-400">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
