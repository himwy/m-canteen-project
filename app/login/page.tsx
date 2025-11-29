import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
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

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-neutral-700">
              Email or Student ID
            </Label>
            <Input id="email" type="text" placeholder="s123456" className="h-12 border-neutral-200 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-neutral-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              className="h-12 border-neutral-200 rounded-xl"
            />
          </div>

          <Button className="w-full h-12 text-base bg-[#86a349] hover:bg-[#748f3e] text-white rounded-xl mt-6">
            Login
          </Button>

          <p className="text-center text-sm text-neutral-500 pt-4">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#86a349] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
