import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// Mock order data
const currentOrder = {
  orderNumber: 42,
  status: "preparing",
  items: [
    { name: "Healthy Poke Bowl", quantity: 1, price: 45 },
    { name: "Iced Tea", quantity: 2, price: 15 },
  ],
  total: 60,
  time: "5 mins ago",
}

const pastOrders = [
  { orderNumber: 38, date: "Today, 11:30 AM", total: 60, status: "completed" },
  { orderNumber: 35, date: "Yesterday, 1:15 PM", total: 85, status: "completed" },
  { orderNumber: 29, date: "Dec 10, 12:00 PM", total: 50, status: "completed" },
]

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="border-b border-neutral-100">
        <div className="container mx-auto px-6 py-5 max-w-2xl">
          <h1 className="text-xl font-semibold text-neutral-900">My Orders</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-2xl space-y-6">
        {/* Current Order */}
        <div>
          <h2 className="text-sm font-medium text-neutral-500 mb-3">CURRENT ORDER</h2>
          <div className="bg-white border-2 border-[#86a349] rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-neutral-900 mb-1">#{currentOrder.orderNumber}</div>
                <Badge className="bg-green-50 text-green-700 border-green-200">Preparing</Badge>
              </div>
            </div>

            <div className="space-y-2 mb-4 py-4 border-y border-neutral-100">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-neutral-600">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-neutral-900">€ {item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-500">Total</span>
              <span className="text-xl font-semibold text-neutral-900">€ {currentOrder.total}</span>
            </div>

            <div className="mt-4 p-4 bg-neutral-50 rounded-xl">
              <p className="text-sm text-neutral-600">
                Your order is being prepared. We'll notify you when it's ready for pickup.
              </p>
            </div>
          </div>
        </div>

        {/* Past Orders */}
        <div>
          <h2 className="text-sm font-medium text-neutral-500 mb-3">PAST ORDERS</h2>
          <div className="space-y-3">
            {pastOrders.map((order) => (
              <div key={order.orderNumber} className="bg-white border border-neutral-100 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-neutral-900 mb-1">#{order.orderNumber}</div>
                    <div className="text-sm text-neutral-500">{order.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-neutral-900">€ {order.total}</div>
                    <Badge variant="secondary" className="bg-neutral-100 text-neutral-600 mt-1">
                      Completed
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="flex items-center justify-around py-3">
            <Link href="/menu" className="flex flex-col items-center gap-1">
              <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <svg className="w-6 h-6 text-[#86a349]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-xs text-[#86a349]">My order</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center gap-1">
              <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  )
}
