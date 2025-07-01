"use client"

import {
  BarChart3,
  Building2,
  CheckCircle,
  CreditCard,
  LogOut,
  Package,
  Truck,
  User,
  UserCheck,
  Users,
  X,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Footer from "@/components/footer"

// Define service roles
const serviceRoles = {
  dashboard: ["admin", "manager", "director"],
  department: ["admin", "hr", "manager"],
  employee: ["admin", "hr", "manager"],
  transaction: ["admin", "finance", "accountant"],
  asset: ["admin", "asset-manager", "inventory"],
  financials: ["admin", "finance", "accountant"],
  vendors: ["admin", "procurement", "finance"],
  customers: ["admin", "sales", "marketing"],
  approvals: ["admin", "manager", "director"],
}

export default function ServicesPage() {
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showEmployeeAuthDialog, setShowEmployeeAuthDialog] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Set to true to show logged in state
  const [selectedService, setSelectedService] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const services = [
    {
      title: "Dashboard",
      description: "Comprehensive analytics and overview of all business operations",
      icon: BarChart3,
      href: "/dashboard",
      id: "dashboard",
    },
    {
      title: "Department",
      description: "Manage organizational departments and structure",
      icon: Building2,
      href: "/dashboard/department",
      id: "department",
    },
    {
      title: "Employee",
      description: "Comprehensive employee management system",
      icon: Users,
      href: "/dashboard/employee",
      id: "employee",
    },
    {
      title: "Transaction",
      description: "Track and manage financial transactions",
      icon: CreditCard,
      href: "/dashboard/transaction",
      id: "transaction",
    },
    {
      title: "Asset",
      description: "Complete asset management and tracking",
      icon: Package,
      href: "/dashboard/assets",
      id: "asset",
    },
    {
      title: "Company Financials",
      description: "Financial reports and analytics dashboard",
      icon: BarChart3,
      href: "/dashboard/financials",
      id: "financials",
    },
    {
      title: "Vendors Details",
      description: "Vendor relationship management system",
      icon: Truck,
      href: "/dashboard/vendors",
      id: "vendors",
    },
    {
      title: "Customer Details",
      description: "Customer relationship management",
      icon: UserCheck,
      href: "/dashboard/customers",
      id: "customers",
    },
    {
      title: "Approval Services",
      description: "Workflow approval and authorization system",
      icon: CheckCircle,
      href: "/dashboard/approvals",
      id: "approvals",
    },
  ]

  const handleServiceClick = (service) => {
    if (isLoggedIn) {
      // Organization is logged in, now show employee authentication
      setSelectedService(service.id)
      setShowEmployeeAuthDialog(true)
      setAuthError("")
      setEmployeeId("")
      setPassword("")
    } else {
      // Organization not logged in
      setShowLoginDialog(true)
    }
  }

  const handleEmployeeAuth = (e) => {
    e.preventDefault()
    setIsAuthenticating(true)
    setAuthError("")

    // Simulate authentication delay
    setTimeout(() => {
      // Mock employee authentication and role check
      // In a real app, this would be an API call to verify credentials and check roles
      if (employeeId && password) {
        // For demo purposes, we'll use a simple rule:
        // Employee IDs starting with "admin" have admin role
        // Employee IDs starting with "hr" have hr role, etc.
        const employeeRole = employeeId.split("-")[0].toLowerCase()

        // Check if the employee has the required role for the selected service
        const requiredRoles = serviceRoles[selectedService] || []

        if (requiredRoles.includes(employeeRole)) {
          // Authentication successful and role authorized
          const service = services.find((s) => s.id === selectedService)
          if (service) {
            setShowEmployeeAuthDialog(false)
            // Navigate to the service page
            window.location.href = service.href
          }
        } else {
          // Role not authorized
          setAuthError("You don't have permission to access this service. Contact your administrator.")
        }
      } else {
        // Invalid credentials
        setAuthError("Invalid employee ID or password. Please try again.")
      }
      setIsAuthenticating(false)
    }, 1000)
  }

  const handleSignOut = () => {
    setIsLoggedIn(false)
    // Add your sign out logic here
    console.log("User signed out")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Modified Navbar with Profile Icon */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-blue-600">
              VittaLogic
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                HOME
              </Link>
              <Link href="/services" className="text-blue-600 font-medium">
                SERVICES
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                CONTACT US
              </Link>
              <Link href="/help" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                HELP
              </Link>
            </div>

            {/* Profile Icon or Auth Buttons */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-600 text-white">ORG</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild>
                      <Link href="/org-profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Organization Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <Button asChild variant="ghost">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Service Details Section */}
      <section className="pt-32 pb-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">Explore our comprehensive suite of business management tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const IconComponent = service.icon
              return (
                <div key={service.title} onClick={() => handleServiceClick(service)}>
                  <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                    <CardHeader className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-sm">{service.description}</CardDescription>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Organization Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Organization Login Required</DialogTitle>
            <DialogDescription className="text-center">
              Please log in to your organization account to access this service.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            <Button asChild className="w-full">
              <Link href="/login">Login to Organization</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/signup">Register Organization</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Employee Authentication Dialog */}
      <Dialog open={showEmployeeAuthDialog} onOpenChange={setShowEmployeeAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Employee Authentication Required</DialogTitle>
            <DialogDescription className="text-center">
              Please enter your employee credentials to access this service.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEmployeeAuth} className="space-y-4 mt-4">
            {authError && (
              <Alert variant="destructive">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter your employee ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isAuthenticating}>
                {isAuthenticating ? "Authenticating..." : "Access Service"}
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center pt-2">
              <p>For demo purposes:</p>
              <p>Use employee IDs like "admin-123", "hr-456", "finance-789", etc.</p>
              <p>Any password will work.</p>
            </div>
          </form>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setShowEmployeeAuthDialog(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
