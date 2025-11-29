"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { logout } from "@/lib/auth"
import { getAvailableMenuItems, getAvailableDrinks, type MenuItem, type Drink } from "@/lib/menu"

export default function MenuPage() {
  const { addItem, itemCount } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const [items, drinkItems] = await Promise.all([
          getAvailableMenuItems(),
          getAvailableDrinks()
        ]);
        console.log('Fetched menu items:', items);
        console.log('Fetched drinks:', drinkItems);
        console.log('Meals:', items.filter(item => item.category === 'Meals'));
        setMenuItems(items);
        setDrinks(drinkItems);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // Force page reload to clear all state
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-neutral-500">Loading menu...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-100">
        <div className="container mx-auto px-6 py-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">Dashboard</h1>
              {user && <p className="text-sm text-neutral-500">Hi, {user.name}!</p>}
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleLogout}
                className="text-neutral-500 hover:text-neutral-900 text-sm"
              >
                Logout
              </button>
              <Link href="/cart" className="relative">
                <svg className="w-6 h-6 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#86a349] text-white text-xs rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-2xl">
        {/* Meals Section */}
        {menuItems.filter(item => item.category === 'Meals').length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Meals</h2>
            <p className="text-sm text-neutral-500 mb-4">Drinks are discounted when ordered with a meal</p>
            <div className="grid grid-cols-1 gap-5">
              {menuItems.filter(item => item.category === 'Meals').map((item) => (
                <div
                  key={item.$id}
                  className="bg-white border border-neutral-100 rounded-2xl p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                      className="w-28 h-28 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-neutral-900 mb-1">{item.name}</h3>
                      {item.calories && (
                        <p className="text-xs text-neutral-400 mb-2">{item.calories} cal</p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-lg font-semibold text-[#86a349]">HK$ {item.price}</span>
                        <button 
                          onClick={() => addItem({ id: item.$id || '', name: item.name, price: item.price, image: item.image, type: 'meal', hasDiscountedDrinks: item.hasDiscountedDrinks })}
                          className="bg-[#86a349] hover:bg-[#748f3e] text-white rounded-lg h-9 px-6 text-sm font-medium transition-colors">
                          ADD ITEM
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drinks Section - from separate drinks collection */}
        {drinks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Drinks</h2>
            <div className="grid grid-cols-1 gap-5">
              {drinks.map((drink) => (
                <div
                  key={drink.$id}
                  className="bg-white border border-neutral-100 rounded-2xl p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex gap-4">
                    <img
                      src={drink.image || "/placeholder.svg"}
                      alt={drink.name}
                      onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                      className="w-28 h-28 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-neutral-900 mb-1">{drink.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-neutral-400 line-through">HK$ {drink.originalPrice}</span>
                        <span className="text-xs text-green-600 font-medium">HK$ {drink.discountedPrice} with meal</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-lg font-semibold text-[#86a349]">HK$ {drink.originalPrice}</span>
                        <button 
                          onClick={() => addItem({ id: drink.$id || '', name: drink.name, price: drink.originalPrice, image: drink.image, type: 'drink', originalPrice: drink.originalPrice, discountedPrice: drink.discountedPrice })}
                          className="bg-[#86a349] hover:bg-[#748f3e] text-white rounded-lg h-9 px-6 text-sm font-medium transition-colors">
                          ADD ITEM
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="flex items-center justify-around py-3">
            <Link href="/menu" className="flex flex-col items-center gap-1">
              <svg className="w-6 h-6 text-[#86a349]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
              </svg>
              <span className="text-xs text-[#86a349]">Menu</span>
            </Link>
            <Link href="/orders" className="flex flex-col items-center gap-1">
              <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span className="text-xs text-neutral-400">My order</span>
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
