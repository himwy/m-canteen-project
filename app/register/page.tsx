"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { registerStudent } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    programme: "",
    yearOfEntrance: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerStudent(formData);
      await refreshUser();
      router.push("/menu");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8 max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-neutral-500 mb-12 hover:text-neutral-900"
        >
          <svg
            className="w-5 h-5 mr-1"
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
          Back
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
            Create account
          </h1>
          <p className="text-neutral-500">Register as HSU student</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm text-neutral-700 font-medium"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full h-12 border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#86a349]"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm text-neutral-700 font-medium"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full h-12 border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#86a349]"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="studentId"
              className="text-sm text-neutral-700 font-medium"
            >
              Student ID <span className="text-[#86a349]">*</span>
            </label>
            <input
              id="studentId"
              name="studentId"
              type="text"
              placeholder="s123456"
              value={formData.studentId}
              onChange={handleChange}
              required
              className="w-full h-12 border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#86a349]"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="programme"
              className="text-sm text-neutral-700 font-medium"
            >
              Programme <span className="text-[#86a349]">*</span>
            </label>
            <select
              id="programme"
              name="programme"
              value={formData.programme}
              onChange={handleChange}
              required
              className="w-full h-12 border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#86a349] bg-white"
            >
              <option value="">Select programme</option>
              <option value="BSc-AC">BSc-AC</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="yearOfEntrance"
              className="text-sm text-neutral-700 font-medium"
            >
              Year of Study <span className="text-[#86a349]">*</span>
            </label>
            <select
              id="yearOfEntrance"
              name="yearOfEntrance"
              value={formData.yearOfEntrance}
              onChange={handleChange}
              required
              className="w-full h-12 border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#86a349] bg-white"
            >
              <option value="">Select year</option>
              <option value="Year 1">Year 1</option>
              <option value="Year 2">Year 2</option>
              <option value="Year 3">Year 3</option>
              <option value="Year 4">Year 4</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm text-neutral-700 font-medium"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create password (min 8 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full h-12 border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#86a349]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-base bg-[#86a349] hover:bg-[#748f3e] text-white rounded-xl mt-6 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          <p className="text-center text-sm text-neutral-500 pt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[#86a349] hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
