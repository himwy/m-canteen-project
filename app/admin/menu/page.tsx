"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getMenuItems,
  getDrinks,
  createMenuItem,
  createDrink,
  updateMenuItem,
  updateDrink,
  deleteMenuItem,
  deleteDrink,
  type MenuItem,
  type Drink,
} from "@/lib/menu";

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"menu" | "drinks">("menu");
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showDrinkForm, setShowDrinkForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null);

  const [menuForm, setMenuForm] = useState({
    name: "",
    price: "",
    image: "",
    category: "Meals",
    calories: "",
    hasDiscountedDrinks: false,
    available: true,
  });

  const [drinkForm, setDrinkForm] = useState({
    name: "",
    originalPrice: "",
    discountedPrice: "",
    image: "",
    available: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [menuData, drinksData] = await Promise.all([
        getMenuItems(),
        getDrinks(),
      ]);
      setMenuItems(menuData);
      setDrinks(drinksData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemData = {
        name: menuForm.name,
        price: parseInt(menuForm.price),
        image: menuForm.image,
        category: "Meals",
        calories: menuForm.calories ? parseInt(menuForm.calories) : undefined,
        hasDiscountedDrinks: menuForm.hasDiscountedDrinks,
        available: menuForm.available,
      };

      if (editingItem) {
        await updateMenuItem(editingItem.$id!, itemData);
      } else {
        await createMenuItem(itemData);
      }

      setShowMenuForm(false);
      setEditingItem(null);
      setMenuForm({
        name: "",
        price: "",
        image: "",
        category: "Meals",
        calories: "",
        hasDiscountedDrinks: false,
        available: true,
      });
      await fetchData();
    } catch (error) {
      console.error("Error saving menu item:", error);
      alert("Failed to save menu item");
    }
  };

  const handleDrinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const drinkData = {
        name: drinkForm.name,
        originalPrice: parseInt(drinkForm.originalPrice),
        discountedPrice: parseInt(drinkForm.discountedPrice),
        image: drinkForm.image,
        available: drinkForm.available,
      };

      if (editingDrink) {
        await updateDrink(editingDrink.$id!, drinkData);
      } else {
        await createDrink(drinkData);
      }

      setShowDrinkForm(false);
      setEditingDrink(null);
      setDrinkForm({
        name: "",
        originalPrice: "",
        discountedPrice: "",
        image: "",
        available: true,
      });
      await fetchData();
    } catch (error) {
      console.error("Error saving drink:", error);
      alert("Failed to save drink");
    }
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingItem(item);
    setMenuForm({
      name: item.name,
      price: item.price.toString(),
      image: item.image,
      category: item.category,
      calories: item.calories?.toString() || "",
      hasDiscountedDrinks: item.hasDiscountedDrinks,
      available: item.available,
    });
    setShowMenuForm(true);
  };

  const handleEditDrink = (drink: Drink) => {
    setEditingDrink(drink);
    setDrinkForm({
      name: drink.name,
      originalPrice: drink.originalPrice.toString(),
      discountedPrice: drink.discountedPrice.toString(),
      image: drink.image,
      available: drink.available,
    });
    setShowDrinkForm(true);
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      try {
        await deleteMenuItem(id);
        await fetchData();
      } catch (error) {
        console.error("Error deleting menu item:", error);
        alert("Failed to delete menu item");
      }
    }
  };

  const handleDeleteDrink = async (id: string) => {
    if (confirm("Are you sure you want to delete this drink?")) {
      try {
        await deleteDrink(id);
        await fetchData();
      } catch (error) {
        console.error("Error deleting drink:", error);
        alert("Failed to delete drink");
      }
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="container mx-auto px-6 py-12 max-w-6xl text-center">
          <p className="text-neutral-500">Loading...</p>
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
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center text-neutral-500 hover:text-neutral-900 mb-2 text-sm"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-semibold text-neutral-900 mb-1">
                Menu Management
              </h1>
              <p className="text-neutral-500 text-sm">
                Manage menu items and drinks
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("menu")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === "menu"
                  ? "bg-[#86a349] text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              Menu Items ({menuItems.length})
            </button>
            <button
              onClick={() => setActiveTab("drinks")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === "drinks"
                  ? "bg-[#86a349] text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              Drinks ({drinks.length})
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-6xl">
        {activeTab === "menu" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                Menu Items
              </h2>
              <button
                onClick={() => {
                  setShowMenuForm(true);
                  setEditingItem(null);
                  setMenuForm({
                    name: "",
                    price: "",
                    image: "",
                    category: "Meals",
                    calories: "",
                    hasDiscountedDrinks: false,
                    available: true,
                  });
                }}
                className="bg-[#86a349] hover:bg-[#748f3e] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                + Add Menu Item
              </button>
            </div>

            {showMenuForm && (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
                </h3>
                <form onSubmit={handleMenuSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-neutral-700 font-medium block mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={menuForm.name}
                        onChange={(e) =>
                          setMenuForm({ ...menuForm, name: e.target.value })
                        }
                        required
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-neutral-700 font-medium block mb-2">
                        Price (HK$)
                      </label>
                      <input
                        type="number"
                        value={menuForm.price}
                        onChange={(e) =>
                          setMenuForm({ ...menuForm, price: e.target.value })
                        }
                        required
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-700 font-medium block mb-2">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={menuForm.image}
                      onChange={(e) =>
                        setMenuForm({ ...menuForm, image: e.target.value })
                      }
                      required
                      placeholder="https://i.imgur.com/example.jpg"
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      For Imgur: Right-click image → "Open image in new tab" →
                      Copy that URL (should end in .jpg/.png)
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-700 font-medium block mb-2">
                      Calories (optional)
                    </label>
                    <input
                      type="number"
                      value={menuForm.calories}
                      onChange={(e) =>
                        setMenuForm({ ...menuForm, calories: e.target.value })
                      }
                      placeholder="e.g. 450"
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={menuForm.hasDiscountedDrinks}
                        onChange={(e) =>
                          setMenuForm({
                            ...menuForm,
                            hasDiscountedDrinks: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-neutral-700">
                        Drinks are discounted when ordered with this meal
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={menuForm.available}
                        onChange={(e) =>
                          setMenuForm({
                            ...menuForm,
                            available: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-neutral-700">
                        Available
                      </span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-[#86a349] hover:bg-[#748f3e] text-white rounded-lg px-4 py-2 text-sm font-medium"
                    >
                      {editingItem ? "Update" : "Add"} Menu Item
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenuForm(false);
                        setEditingItem(null);
                      }}
                      className="border border-neutral-200 rounded-lg px-4 py-2 text-sm font-medium hover:bg-neutral-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.$id}
                  className="bg-white rounded-2xl p-4 border border-neutral-200 flex items-center gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900">
                      {item.name}
                    </h3>
                    {item.calories && (
                      <p className="text-sm text-neutral-500">
                        {item.calories} cal
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[#86a349] font-semibold">
                        HK$ {item.price}
                      </span>
                      {item.hasDiscountedDrinks && (
                        <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
                          🥤 Discounted Drinks
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          item.available
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {item.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditMenuItem(item)}
                      className="border border-neutral-200 rounded-lg px-3 py-2 text-sm hover:bg-neutral-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item.$id!)}
                      className="border border-red-200 text-red-600 rounded-lg px-3 py-2 text-sm hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {menuItems.length === 0 && (
                <div className="text-center py-12 text-neutral-500">
                  No menu items yet. Add your first item!
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "drinks" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-neutral-900">Drinks</h2>
              <button
                onClick={() => {
                  setShowDrinkForm(true);
                  setEditingDrink(null);
                  setDrinkForm({
                    name: "",
                    originalPrice: "",
                    discountedPrice: "",
                    image: "",
                    available: true,
                  });
                }}
                className="bg-[#86a349] hover:bg-[#748f3e] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                + Add Drink
              </button>
            </div>

            {showDrinkForm && (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  {editingDrink ? "Edit Drink" : "Add New Drink"}
                </h3>
                <form onSubmit={handleDrinkSubmit} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-neutral-700 font-medium block mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={drinkForm.name}
                        onChange={(e) =>
                          setDrinkForm({ ...drinkForm, name: e.target.value })
                        }
                        required
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-neutral-700 font-medium block mb-2">
                        Original Price (HK$)
                      </label>
                      <input
                        type="number"
                        value={drinkForm.originalPrice}
                        onChange={(e) =>
                          setDrinkForm({
                            ...drinkForm,
                            originalPrice: e.target.value,
                          })
                        }
                        required
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-neutral-700 font-medium block mb-2">
                        Discounted Price (HK$)
                      </label>
                      <input
                        type="number"
                        value={drinkForm.discountedPrice}
                        onChange={(e) =>
                          setDrinkForm({
                            ...drinkForm,
                            discountedPrice: e.target.value,
                          })
                        }
                        required
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-700 font-medium block mb-2">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={drinkForm.image}
                      onChange={(e) =>
                        setDrinkForm({ ...drinkForm, image: e.target.value })
                      }
                      required
                      placeholder="https://example.com/image.jpg"
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={drinkForm.available}
                        onChange={(e) =>
                          setDrinkForm({
                            ...drinkForm,
                            available: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-neutral-700">
                        Available
                      </span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-[#86a349] hover:bg-[#748f3e] text-white rounded-lg px-4 py-2 text-sm font-medium"
                    >
                      {editingDrink ? "Update" : "Add"} Drink
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDrinkForm(false);
                        setEditingDrink(null);
                      }}
                      className="border border-neutral-200 rounded-lg px-4 py-2 text-sm font-medium hover:bg-neutral-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid gap-4">
              {drinks.map((drink) => (
                <div
                  key={drink.$id}
                  className="bg-white rounded-2xl p-4 border border-neutral-200 flex items-center gap-4"
                >
                  <img
                    src={drink.image}
                    alt={drink.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900">
                      {drink.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-neutral-500 line-through text-sm">
                        HK$ {drink.originalPrice}
                      </span>
                      <span className="text-[#86a349] font-semibold">
                        HK$ {drink.discountedPrice}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          drink.available
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {drink.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditDrink(drink)}
                      className="border border-neutral-200 rounded-lg px-3 py-2 text-sm hover:bg-neutral-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDrink(drink.$id!)}
                      className="border border-red-200 text-red-600 rounded-lg px-3 py-2 text-sm hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {drinks.length === 0 && (
                <div className="text-center py-12 text-neutral-500">
                  No drinks yet. Add your first drink!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
