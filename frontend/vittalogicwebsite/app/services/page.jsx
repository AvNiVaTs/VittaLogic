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

import Footer from "@/components/footer"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
      href: "https://app.powerbi.com/links/jYnkzhllI3?ctid=27282fdd-4c0b-4dfb-ba91-228cd83fdf71&pbi_source=linkShare",
      id: "Dashboard Service",
    },
    {
      title: "Department",
      description: "Manage organizational departments and structure",
      icon: Building2,
      href: "/dashboard/department",
      id: "Department Service",
    },
    {
      title: "Employee",
      description: "Comprehensive employee management system",
      icon: Users,
      href: "/dashboard/employee",
      id: "Employee Service",
    },
    {
      title: "Transaction",
      description: "Track and manage financial transactions",
      icon: CreditCard,
      href: "/dashboard/transaction",
      id: "Transaction Service",
    },
    {
      title: "Asset",
      description: "Complete asset management and tracking",
      icon: Package,
      href: "/dashboard/assets",
      id: "Asset Service",
    },
    {
      title: "Company Financials",
      description: "Financial reports and analytics dashboard",
      icon: BarChart3,
      href: "/dashboard/financials",
      id: "Company Financials Service",
    },
    {
      title: "Vendors Details",
      description: "Vendor relationship management system",
      icon: Truck,
      href: "/dashboard/vendors",
      id: "Vendor Service",
    },
    {
      title: "Customer Details",
      description: "Customer relationship management",
      icon: UserCheck,
      href: "/dashboard/customers",
      id: "Customer Service",
    },
    {
      title: "Approval Services",
      description: "Workflow approval and authorization system",
      icon: CheckCircle,
      href: "/dashboard/approvals",
      id: "Approval Service",
    },
  ]

/*  function getServiceNameFromId(serviceId) {
  const mapping = {
    dashboard: "Dashboard Service",
    department: "Department Service",
    employee: "Employee Service",
    transaction: "Transaction Service",
    asset: "Asset Service",
    financials: "Company Financials Service",
    vendors: "Vendor Service",
    customers: "Customer Service",
    approvals: "Approval Service",
  }

  return mapping[serviceId] || `${serviceId.charAt(0).toUpperCase() + serviceId.slice(1)} Service`
  }
*/
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

 const handleEmployeeAuth = async (e) => {
  e.preventDefault()
  setIsAuthenticating(true)
  setAuthError("")
  
  try {
    const res = await fetch("http://localhost:8000/api/v1/emp/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // important to receive cookies
      body: JSON.stringify({
        emailAddress: employeeId,
        password,
        serviceName: selectedService,
      }),
    })
    
    const data = await res.json()
    
    if (!res.ok) {
      throw new Error(data?.message || "Login failed")
    }
    
    // ✅ FIXED: Save both employee data AND token
    localStorage.setItem("loggedInEmployee", JSON.stringify(data.data.employee))
    
    // ✅ ADD: Save the token if it exists in the response
    if (data.data.token) {
      localStorage.setItem("token", data.data.token)
    }
    // Alternative: if token is in a different location in response
    else if (data.token) {
      localStorage.setItem("token", data.token)
    }
    // Alternative: if token is in accessToken
    else if (data.data.accessToken) {
      localStorage.setItem("token", data.data.accessToken)
    }
    
    console.log("Login response data:", data) // Debug: see what's in the response
    
    const { employee, servicePermissions } = data.data
    
    // ✅ FIXED: declare service before using it
    const service = services.find((s) => s.id === selectedService)
    const fullServiceName = service?.id || selectedService
    
    if (!servicePermissions.includes(fullServiceName)) {
      setAuthError("You don't have permission to access this service.")
      return
    }
    
    // Redirect on success
    if (service) {
      setShowEmployeeAuthDialog(false)
      window.location.href = service.href
    }
  } catch (error) {
    setAuthError(error.message || "Authentication failed.")
  } finally {
    setIsAuthenticating(false)
  }
}

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordChangeError("")

    if (newPassword.length < 8 || newPassword !== confirmPassword) {
      setPasswordChangeError("Ensure password is at least 8 characters and both passwords match.")
      return
    }

    try {
      const res = await fetch("http://localhost:8000/api/v1/emp/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: changePasswordEmployeeId,
          oldPassword: previousPassword,
          newPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Password change failed")
      }

      const employeeRole = changePasswordEmployeeId.split("-")[0].toLowerCase()
      const requiredRoles = serviceRoles[selectedService] || []

      if (requiredRoles.includes(employeeRole)) {
        const service = services.find((s) => s.id === selectedService)
        if (service) window.location.href = service.href
      }
    } catch (error) {
      setPasswordChangeError(error.message)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setForgotPasswordError("")

    if (forgotPasswordNew.length < 8 || forgotPasswordNew !== forgotPasswordConfirm) {
      setForgotPasswordError("Ensure password is at least 8 characters and both passwords match.")
      return
    }

    try {
      const res = await fetch("http://localhost:8000/api/v1/emp/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: forgotPasswordEmployeeId,
          newPassword: forgotPasswordNew,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Password reset failed")
      }

      alert("Password reset successful! You can now login with your new password.")
      setShowForgotPasswordDialog(false)
      setShowEmployeeAuthDialog(true)
    } catch (error) {
      setForgotPasswordError(error.message)
    }
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
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/favicon2.png"
                alt="Logo"
                className="w-14 h-14 rounded-full object-cover"
                style={{ boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)' }}
              />
              <span className="text-2xl font-bold text-blue-600">VittaLogic</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                HOME
              </Link>
              <Link href="/services" className="text-blue-600 font-medium">
                SERVICES
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                CONTACT US
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
            <Button asChild variant="ghost">
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
          <div className="flex flex-col gap-3 mt-6">
            {!showPasswordChange ? (
              <form onSubmit={handleEmployeeAuth} className="space-y-4 mt-4">
                {authError && (
                  <Alert variant="destructive">
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID or Email</Label>
                  <Input
                    id="employee email or employeeId"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="Enter your email or employee ID"
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
          </div>
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
          <div className="flex flex-col gap-3 mt-6">
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
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
