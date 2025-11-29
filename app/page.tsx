import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12 max-w-md">
        {/* Header with Logo */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Image src="/hsu.png" alt="HSU Logo" width={80} height={80} className="rounded-xl" />
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">HSU M Canteen</h1>
          <p className="text-neutral-500">Order your meals</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/login" className="block">
            <Button className="w-full h-12 text-base bg-[#86a349] hover:bg-[#748f3e] text-white rounded-xl">
              Login
            </Button>
          </Link>

          <Link href="/register" className="block">
            <Button
              variant="outline"
              className="w-full h-12 text-base border-2 border-neutral-200 bg-white hover:bg-neutral-50 rounded-xl"
            >
              Register as Student
            </Button>
          </Link>

          <Link href="/admin/login" className="block">
            <Button variant="ghost" className="w-full h-12 text-base text-neutral-500 hover:bg-neutral-50 rounded-xl">
              Admin Login
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
