"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAllOrders, updateOrderStatus, type Order, type OrderStatus } from "@/lib/orders"
import { isAdmin, logout } from "@/lib/auth"

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchOrders();
      // Poll for new orders every 10 seconds
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthorized]);

  async function checkAdminAccess() {
    try {
      const adminStatus = await isAdmin();
      if (!adminStatus) {
        router.push('/');
        return;
      }
      setIsAuthorized(true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      router.push('/');
    }
  }

  async function fetchOrders() {
    try {
      const fetchedOrders = await getAllOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(orderId: string, newStatus: OrderStatus) {
    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  }

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const receivedOrders = orders.filter(o => o.status === 'received');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');
  const takenOrders = orders.filter(o => o.status === 'taken-unpaid');
  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    return `${Math.floor(diffMins / 60)} hours ago`;
  };

  if (loading || !isAuthorized) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="container mx-auto px-6 py-12 max-w-6xl text-center">
          <p className="text-neutral-500">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-6 py-5 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Canteen Dashboard</h1>
              <p className="text-neutral-500 text-sm">Manage orders and operations</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/menu" className="border border-neutral-200 rounded-lg bg-transparent px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 transition-colors">
                Menu
              </Link>
              <Link href="/admin/api" className="border border-neutral-200 rounded-lg bg-transparent px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 transition-colors">
                API Access
              </Link>
              <button 
                onClick={handleLogout}
                className="text-neutral-500 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="text-3xl font-semibold text-neutral-900 mb-1">{receivedOrders.length}</div>
              <div className="text-sm text-neutral-500">New Orders</div>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="text-3xl font-semibold text-neutral-900 mb-1">{preparingOrders.length}</div>
              <div className="text-sm text-neutral-500">Preparing</div>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="text-3xl font-semibold text-neutral-900 mb-1">{readyOrders.length}</div>
              <div className="text-sm text-neutral-500">Ready</div>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="text-3xl font-semibold text-neutral-900 mb-1">{todayOrders.length}</div>
              <div className="text-sm text-neutral-500">Today's Orders</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* New Orders */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">New Orders</h2>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-700 border border-red-200">{receivedOrders.length} pending</span>
            </div>
            <div className="space-y-3">
              {receivedOrders.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">No new orders</div>
              ) : (
                receivedOrders.map((order) => (
                  <div key={order.$id} className="bg-white rounded-2xl p-5 border-2 border-[#86a349]">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-neutral-900 mb-1">#{order.orderNumber}</div>
                        <div className="text-sm text-neutral-600">{order.studentName}</div>
                        <div className="text-xs text-neutral-400">{order.studentId}</div>
                        <div className="text-xs text-neutral-400 mt-1">{formatTime(order.createdAt)}</div>
                      </div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-700 border border-red-200">New</span>
                    </div>

                    <div className="space-y-1 mb-4 py-3 border-y border-neutral-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm text-neutral-700">
                          • {item.quantity}x {item.name}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-neutral-900">HK$ {order.total}</div>
                      <button 
                        onClick={() => handleStatusUpdate(order.$id!, 'preparing')}
                        className="bg-[#86a349] hover:bg-[#748f3e] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                      >
                        Start Preparing
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Preparing Orders */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Preparing</h2>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
                {preparingOrders.length} in progress
              </span>
            </div>
            <div className="space-y-3">
              {preparingOrders.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">No orders being prepared</div>
              ) : (
                preparingOrders.map((order) => (
                  <div key={order.$id} className="bg-white rounded-2xl p-5 border border-neutral-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-neutral-900 mb-1">#{order.orderNumber}</div>
                        <div className="text-sm text-neutral-600">{order.studentName}</div>
                        <div className="text-xs text-neutral-400">{order.studentId}</div>
                        <div className="text-xs text-neutral-400 mt-1">{formatTime(order.createdAt)}</div>
                      </div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">Preparing</span>
                    </div>

                    <div className="space-y-1 mb-4 py-3 border-y border-neutral-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm text-neutral-700">
                          • {item.quantity}x {item.name}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-neutral-900">HK$ {order.total}</div>
                      <button 
                        onClick={() => handleStatusUpdate(order.$id!, 'ready')}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                      >
                        Mark as Ready
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Ready & Taken Orders */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Ready Orders */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Ready for Pickup</h2>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 border border-green-200">{readyOrders.length} ready</span>
            </div>
            <div className="space-y-3">
              {readyOrders.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">No orders ready</div>
              ) : (
                readyOrders.map((order) => (
                  <div key={order.$id} className="bg-white rounded-2xl p-5 border border-green-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-neutral-900 mb-1">#{order.orderNumber}</div>
                        <div className="text-sm text-neutral-600">{order.studentName}</div>
                        <div className="text-xs text-neutral-400">{order.studentId}</div>
                        <div className="text-xs text-neutral-400 mt-1">{formatTime(order.createdAt)}</div>
                      </div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 border border-green-200">Ready</span>
                    </div>

                    <div className="space-y-1 mb-4 py-3 border-y border-neutral-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm text-neutral-700">
                          • {item.quantity}x {item.name}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-neutral-900">HK$ {order.total}</div>
                      <button 
                        onClick={() => handleStatusUpdate(order.$id!, 'taken-unpaid')}
                        className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                      >
                        Taken (Unpaid)
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Taken Unpaid Orders */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Pending Payment</h2>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">{takenOrders.length} unpaid</span>
            </div>
            <div className="space-y-3">
              {takenOrders.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">No pending payments</div>
              ) : (
                takenOrders.map((order) => (
                  <div key={order.$id} className="bg-white rounded-2xl p-5 border border-orange-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-neutral-900 mb-1">#{order.orderNumber}</div>
                        <div className="text-sm text-neutral-600">{order.studentName}</div>
                        <div className="text-xs text-neutral-400">{order.studentId}</div>
                        <div className="text-xs text-neutral-400 mt-1">{formatTime(order.createdAt)}</div>
                      </div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">Unpaid</span>
                    </div>

                    <div className="space-y-1 mb-4 py-3 border-y border-neutral-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm text-neutral-700">
                          • {item.quantity}x {item.name}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-neutral-900">HK$ {order.total}</div>
                      <button 
                        onClick={() => handleStatusUpdate(order.$id!, 'completed')}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                      >
                        Mark as Paid
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white border border-neutral-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900 mb-2">Order Ready Notification</h3>
              <p className="text-sm text-neutral-600 mb-3">When you mark an order as ready, the student receives:</p>
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                <p className="text-sm text-neutral-900">
                  "Order #42 is ready! Please proceed to the counter for payment and pickup."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
