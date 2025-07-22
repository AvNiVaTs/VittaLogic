"use client"

import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:8000/api/v1/org/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // important for cookie-based auth
      body: JSON.stringify({
        email: email,
        authorizedPerson: {
          password: password
        }
      })
    });

    const result = await response.json();
    console.log("🔐 Login Response:", result);

    if (response.ok) {
      // ✅ Store tokens in localStorage (for later API use if needed)
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("refreshToken", result.data.refreshToken);

      // alert("✅ Logged in successfully!");
      
      // ✅ Redirect to the org profile/dashboard
      window.location.href = "/services"; // or use router.push() if using next/router
    } else {
      alert(`❌ Login failed: ${result.message || "Invalid credentials"}`);
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("❌ Something went wrong during login");
  }
};


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
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Organization Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your organization email"
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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


