import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterPage() {
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
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Create account</h1>
          <p className="text-neutral-500">Register as HSU student</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-neutral-700">
              Full Name
            </Label>
            <Input id="name" type="text" placeholder="John Doe" className="h-12 border-neutral-200 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-neutral-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="h-12 border-neutral-200 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-id" className="text-sm text-neutral-700">
              Student ID <span className="text-[#86a349]">*</span>
            </Label>
            <Input id="student-id" type="text" placeholder="s123456" className="h-12 border-neutral-200 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="programme" className="text-sm text-neutral-700">
              Programme <span className="text-[#86a349]">*</span>
            </Label>
            <Select>
              <SelectTrigger className="h-12 border-neutral-200 rounded-xl">
                <SelectValue placeholder="Select programme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BA-AHCC">BA-AHCC</SelectItem>
                <SelectItem value="BA-GCS">BA-GCS</SelectItem>
                <SelectItem value="BA-CSD">BA-CSD</SelectItem>
                <SelectItem value="BSc-DS">BSc-DS</SelectItem>
                <SelectItem value="BSc-CS">BSc-CS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year" className="text-sm text-neutral-700">
              Year of Entrance <span className="text-[#86a349]">*</span>
            </Label>
            <Select>
              <SelectTrigger className="h-12 border-neutral-200 rounded-xl">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-neutral-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create password"
              className="h-12 border-neutral-200 rounded-xl"
            />
          </div>

          <Button className="w-full h-12 text-base bg-[#86a349] hover:bg-[#748f3e] text-white rounded-xl mt-6">
            Register
          </Button>

          <p className="text-center text-sm text-neutral-500 pt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[#86a349] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
