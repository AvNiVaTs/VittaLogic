"use client"

import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Navbar />

      <div className="flex items-center justify-center min-h-screen pt-20 pb-12 px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">Organization Login</CardTitle>
            <CardDescription className="text-gray-600">Sign in to your organization account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Organization Name</Label>
                <Input id="username" type="text" placeholder="Enter your organization name" className="h-12" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-12 pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                  Forgot Password?
                </Link>
                <Link href="/signup" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                  Organization not registered?
                </Link>
              </div>

              <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-medium">
                Login →
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
