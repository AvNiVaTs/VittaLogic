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

// Mock database of default company passwords
const defaultPasswords = {
  "admin-123": "admin123",
  "hr-456": "hr123",
  "finance-789": "finance123",
  "sales-101": "sales123",
  "manager-202": "manager123",
}

export default function ServicesPage() {
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showEmployeeAuthDialog, setShowEmployeeAuthDialog] = useState(false)
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Set to true to show logged in state
  const [selectedService, setSelectedService] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [changePasswordEmployeeId, setChangePasswordEmployeeId] = useState("")
  const [previousPassword, setPreviousPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordChangeError, setPasswordChangeError] = useState("")
  const [forgotPasswordEmployeeId, setForgotPasswordEmployeeId] = useState("")
  const [forgotPasswordNew, setForgotPasswordNew] = useState("")
  const [forgotPasswordConfirm, setForgotPasswordConfirm] = useState("")
  const [forgotPasswordError, setForgotPasswordError] = useState("")

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
      if (employeeId && password) {
        // Check if employee exists and password is correct
        const defaultPassword = defaultPasswords[employeeId]

        if (defaultPassword && password === defaultPassword) {
          // Employee is using default password, force password change
          setIsAuthenticating(false)
          setShowPasswordChange(true)
          setChangePasswordEmployeeId(employeeId)
          return
        }

        // For other passwords, proceed with normal authentication
        const employeeRole = employeeId.split("-")[0].toLowerCase()
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

  const handlePasswordChange = (e) => {
    e.preventDefault()
    setPasswordChangeError("")

    if (!changePasswordEmployeeId) {
      setPasswordChangeError("Employee ID is required.")
      return
    }

    if (!previousPassword) {
      setPasswordChangeError("Previous password is required.")
      return
    }

    if (newPassword.length < 8) {
      setPasswordChangeError("Password must be at least 8 characters long.")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordChangeError("Passwords do not match.")
      return
    }

    if (newPassword === defaultPasswords[changePasswordEmployeeId]) {
      setPasswordChangeError("New password cannot be the same as the default password.")
      return
    }

    if (newPassword === previousPassword) {
      setPasswordChangeError("New password cannot be the same as the previous password.")
      return
    }

    // Simulate password change
    setTimeout(() => {
      // Password changed successfully, proceed with authentication
      const employeeRole = changePasswordEmployeeId.split("-")[0].toLowerCase()
      const requiredRoles = serviceRoles[selectedService] || []

      if (requiredRoles.includes(employeeRole)) {
        const service = services.find((s) => s.id === selectedService)
        if (service) {
          setShowEmployeeAuthDialog(false)
          setShowPasswordChange(false)
          // Navigate to the service page
          window.location.href = service.href
        }
      }
    }, 1000)
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    setForgotPasswordError("")

    if (!forgotPasswordEmployeeId) {
      setForgotPasswordError("Employee ID is required.")
      return
    }

    if (forgotPasswordNew.length < 8) {
      setForgotPasswordError("Password must be at least 8 characters long.")
      return
    }

    if (forgotPasswordNew !== forgotPasswordConfirm) {
      setForgotPasswordError("Passwords do not match.")
      return
    }

    if (forgotPasswordNew === defaultPasswords[forgotPasswordEmployeeId]) {
      setForgotPasswordError("New password cannot be the same as the default password.")
      return
    }

    // Simulate password reset
    setTimeout(() => {
      alert("Password reset successful! You can now login with your new password.")
      setShowForgotPasswordDialog(false)
      setForgotPasswordEmployeeId("")
      setForgotPasswordNew("")
      setForgotPasswordConfirm("")
    }, 1000)
  }

  const handleSignOut = () => {
    setIsLoggedIn(false)
    // Add your sign out logic here
    console.log("User signed out")
  }

  const resetAuthDialog = () => {
    setShowEmployeeAuthDialog(false)
    setShowPasswordChange(false)
    setEmployeeId("")
    setPassword("")
    setChangePasswordEmployeeId("")
    setPreviousPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setAuthError("")
    setPasswordChangeError("")
  }

  const openForgotPasswordDialog = () => {
    setShowEmployeeAuthDialog(false)
    setShowForgotPasswordDialog(true)
    setForgotPasswordError("")
    setForgotPasswordEmployeeId("")
    setForgotPasswordNew("")
    setForgotPasswordConfirm("")
  }

  const openChangePasswordDialog = () => {
    setShowPasswordChange(true)
    setChangePasswordEmployeeId(employeeId)
    setPasswordChangeError("")
    setPreviousPassword("")
    setNewPassword("")
    setConfirmPassword("")
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
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/signup">Register Organization</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Employee Authentication Dialog */}
      <Dialog open={showEmployeeAuthDialog} onOpenChange={resetAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {showPasswordChange ? "Change Password Required" : "Employee Authentication Required"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {showPasswordChange
                ? "You are using a default password. Please create a new secure password to continue."
                : "Please enter your employee credentials to access this service."}
            </DialogDescription>
          </DialogHeader>

          {!showPasswordChange ? (
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

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={openForgotPasswordDialog}
                >
                  Forgot Password?
                </button>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={openChangePasswordDialog}
                >
                  Change Password
                </button>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full" disabled={isAuthenticating}>
                  {isAuthenticating ? "Authenticating..." : "Access Service"}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4 mt-4">
              {passwordChangeError && (
                <Alert variant="destructive">
                  <AlertDescription>{passwordChangeError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="changePasswordEmployeeId">Employee ID</Label>
                <Input
                  id="changePasswordEmployeeId"
                  value={changePasswordEmployeeId}
                  onChange={(e) => setChangePasswordEmployeeId(e.target.value)}
                  placeholder="Enter your employee ID"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousPassword">Previous Password</Label>
                <Input
                  id="previousPassword"
                  type="password"
                  value={previousPassword}
                  onChange={(e) => setPreviousPassword(e.target.value)}
                  placeholder="Enter your previous password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setShowPasswordChange(false)
                    setChangePasswordEmployeeId("")
                    setPreviousPassword("")
                    setNewPassword("")
                    setConfirmPassword("")
                    setPasswordChangeError("")
                  }}
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Change Password
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPasswordDialog} onOpenChange={setShowForgotPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Reset Password</DialogTitle>
            <DialogDescription className="text-center">
              Enter your employee ID and create a new password to reset your account.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleForgotPassword} className="space-y-4 mt-4">
            {forgotPasswordError && (
              <Alert variant="destructive">
                <AlertDescription>{forgotPasswordError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="forgotPasswordEmployeeId">Employee ID</Label>
              <Input
                id="forgotPasswordEmployeeId"
                value={forgotPasswordEmployeeId}
                onChange={(e) => setForgotPasswordEmployeeId(e.target.value)}
                placeholder="Enter your employee ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="forgotPasswordNew">New Password</Label>
              <Input
                id="forgotPasswordNew"
                type="password"
                value={forgotPasswordNew}
                onChange={(e) => setForgotPasswordNew(e.target.value)}
                placeholder="Enter new password (min 8 characters)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="forgotPasswordConfirm">Confirm Password</Label>
              <Input
                id="forgotPasswordConfirm"
                type="password"
                value={forgotPasswordConfirm}
                onChange={(e) => setForgotPasswordConfirm(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  setShowForgotPasswordDialog(false)
                  setShowEmployeeAuthDialog(true)
                }}
              >
                Back to Login
              </Button>
              <Button type="submit" className="flex-1">
                Reset Password
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
