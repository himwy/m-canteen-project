import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock orders data
const activeOrders = [
  {
    orderNumber: 42,
    student: "John Doe",
    studentId: "s123456",
    items: ["Healthy Poke Bowl", "Iced Tea x2"],
    total: 60,
    time: "5 mins ago",
  },
  {
    orderNumber: 43,
    student: "Jane Smith",
    studentId: "s123457",
    items: ["Salmon Salad", "Coffee"],
    total: 50,
    time: "3 mins ago",
  },
]

const preparingOrders = [
  {
    orderNumber: 41,
    student: "Sarah Lee",
    studentId: "s123459",
    items: ["Chicken Rice", "Iced Tea"],
    total: 55,
    time: "8 mins ago",
  },
]

export default function AdminDashboard() {
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
              <Link href="/admin/api">
                <Button variant="outline" size="sm" className="border-neutral-200 rounded-lg bg-transparent">
                  API Access
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-neutral-500 rounded-lg">
                  Logout
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="text-3xl font-semibold text-neutral-900 mb-1">2</div>
              <div className="text-sm text-neutral-500">New Orders</div>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="text-3xl font-semibold text-neutral-900 mb-1">1</div>
              <div className="text-sm text-neutral-500">Preparing</div>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="text-3xl font-semibold text-neutral-900 mb-1">47</div>
              <div className="text-sm text-neutral-500">Today's Orders</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">New Orders</h2>
              <Badge className="bg-red-50 text-red-700 border-red-200">{activeOrders.length} pending</Badge>
            </div>
            <div className="space-y-3">
              {activeOrders.map((order) => (
                <div key={order.orderNumber} className="bg-white rounded-2xl p-5 border-2 border-[#86a349]">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-neutral-900 mb-1">#{order.orderNumber}</div>
                      <div className="text-sm text-neutral-600">{order.student}</div>
                      <div className="text-xs text-neutral-400">{order.studentId}</div>
                      <div className="text-xs text-neutral-400 mt-1">{order.time}</div>
                    </div>
                    <Badge className="bg-red-50 text-red-700 border-red-200">New</Badge>
                  </div>

                  <div className="space-y-1 mb-4 py-3 border-y border-neutral-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm text-neutral-700">
                        • {item}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-neutral-900">€ {order.total}</div>
                    <Button className="bg-[#86a349] hover:bg-[#748f3e] text-white rounded-lg">Start Preparing</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Preparing</h2>
              <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                {preparingOrders.length} in progress
              </Badge>
            </div>
            <div className="space-y-3">
              {preparingOrders.map((order) => (
                <div key={order.orderNumber} className="bg-white rounded-2xl p-5 border border-neutral-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-neutral-900 mb-1">#{order.orderNumber}</div>
                      <div className="text-sm text-neutral-600">{order.student}</div>
                      <div className="text-xs text-neutral-400">{order.studentId}</div>
                      <div className="text-xs text-neutral-400 mt-1">{order.time}</div>
                    </div>
                    <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Preparing</Badge>
                  </div>

                  <div className="space-y-1 mb-4 py-3 border-y border-neutral-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm text-neutral-700">
                        • {item}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-neutral-900">€ {order.total}</div>
                    <Button className="bg-green-600 hover:bg-green-700 text-white rounded-lg">Mark as Ready</Button>
                  </div>
                </div>
              ))}
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
