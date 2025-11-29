"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, FormEvent } from "react"
import { login, isAdmin } from "@/lib/auth"
import { useAuth } from "@/contexts/AuthContext"

export default function AdminLoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Check if already logged in
      const currentAdmin = await isAdmin();
      if (currentAdmin) {
        router.push("/admin/dashboard");
        return;
      }

      await login(email, password);
      await refreshUser();
      
      // Check if user is admin
      const adminStatus = await isAdmin();
      if (!adminStatus) {
        setError("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }
      
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-6 py-8 max-w-md">
        <Link href="/" className="inline-flex items-center text-neutral-500 mb-12 hover:text-neutral-900">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Admin Portal</h1>
          <p className="text-neutral-500">Canteen & shop management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-2xl border border-neutral-200">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="admin-email" className="text-sm text-neutral-700 font-medium">
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@hsu.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#86a349]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-sm text-neutral-700 font-medium">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#86a349]"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-12 text-base bg-[#86a349] hover:bg-[#748f3e] text-white rounded-xl mt-6 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-xs text-neutral-400 text-center pt-4">For authorized canteen staff only</p>
        </form>
      </div>
    </main>
  )
}
