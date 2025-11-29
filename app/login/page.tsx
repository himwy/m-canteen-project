"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, FormEvent } from "react"
import { login, isAdmin } from "@/lib/auth"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
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
      const alreadyAdmin = await isAdmin();
      if (alreadyAdmin) {
        router.push("/admin/dashboard");
        return;
      }

      await login(email, password);
      await refreshUser();
      
      // Check if user is admin and redirect accordingly
      const adminStatus = await isAdmin();
      
      if (adminStatus) {
        router.push("/admin/dashboard");
      } else {
        router.push("/menu");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8 max-w-md">
        <Link href="/" className="inline-flex items-center text-neutral-500 mb-12 hover:text-neutral-900">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Welcome back</h1>
          <p className="text-neutral-500">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-neutral-700 font-medium">
              Email
            </label>
            <input 
              id="email" 
              type="email" 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#86a349]" 
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-neutral-700 font-medium">
              Password
            </label>
            <input
              id="password"
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

          <p className="text-center text-sm text-neutral-500 pt-4">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#86a349] hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}
