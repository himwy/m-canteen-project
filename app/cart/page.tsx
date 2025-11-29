"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/CartContext"
import { createOrder } from "@/lib/orders"
import { useState } from "react"

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const router = useRouter();
  const hasMealWithDiscountedDrinks = items.some(item => item.type === 'meal' && item.hasDiscountedDrinks);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      // Get current user from Appwrite
      const { getCurrentUser } = await import('@/lib/auth');
      const user = await getCurrentUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      await createOrder({
        studentName: user.name,
        studentId: user.prefs?.studentId || 'N/A',
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total,
        status: 'received'
      });

      clearCart();
      router.push('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-100">
        <div className="container mx-auto px-6 py-4 max-w-2xl">
          <div className="flex items-center gap-4">
            <Link href="/menu" className="text-neutral-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold text-neutral-900">Your Cart</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-2xl">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">Your cart is empty</h2>
            <p className="text-neutral-500 mb-6">Add some delicious items from the menu</p>
            <Link href="/menu" className="inline-flex items-center justify-center px-6 py-3 bg-[#86a349] hover:bg-[#748f3e] text-white rounded-xl font-medium transition-colors">
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white border border-neutral-100 rounded-2xl p-4">
                  <div className="flex gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900 mb-2">{item.name}</h3>
                      {item.type === 'drink' && hasMealWithDiscountedDrinks && item.discountedPrice && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-neutral-400 line-through">HK$ {item.originalPrice}</span>
                          <span className="text-xs text-green-600 font-medium">Discounted with meal!</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-[#86a349]">
                          HK$ {item.type === 'drink' && hasMealWithDiscountedDrinks && item.discountedPrice ? item.discountedPrice : item.price}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-50"
                          >
                            -
                          </button>
                          <span className="text-neutral-900 font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-50"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-neutral-50 rounded-2xl p-6 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-neutral-600">Subtotal ({itemCount} items)</span>
                <span className="text-neutral-900 font-semibold">HK$ {total}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-neutral-600">Service fee</span>
                <span className="text-neutral-900 font-semibold">HK$ 0</span>
              </div>
              <div className="border-t border-neutral-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-neutral-900">Total</span>
                  <span className="text-2xl font-bold text-[#86a349]">HK$ {total}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full h-14 bg-[#86a349] hover:bg-[#748f3e] text-white rounded-xl font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>

            <p className="text-center text-sm text-neutral-500 mt-4">
              You'll pay at the counter when collecting your order
            </p>
          </>
        )}
      </div>
    </main>
  );
}
