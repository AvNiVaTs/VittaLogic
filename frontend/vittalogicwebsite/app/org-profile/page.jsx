"use client"

import { ArrowLeft, Building2, CreditCard, Loader2, MapPin } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

<<<<<<< HEAD
export default function OrganizationProfile() {
  const [organizationData, setOrganizationData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/org/current-user", {
        method: "GET",
        credentials: "include",
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setOrganizationData(result.data)
      } else {
        throw new Error(result.message || "Failed to fetch profile")
      }
    } catch (err) {
      console.error("❌ Profile load error:", err)
      setOrganizationData(null)
      setError("Failed to load profile.")
    } finally {
      setLoading(false)
    }
  }

  fetchProfile()
}, [])


=======
// Static organization data
const staticOrganizationData = {
  name: "ABC Pvt. Ltd.",
  email: "contact@abcpvtltd.com",
  phone: "+91 9876543210",
  website: "https://www.abcpvtltd.com",
  pan: "ABCDE1234F",
  gstin: "29ABCDE1234F1Z5",
  address: "123 Business Park, Tech City, Mumbai",
  country: "India",
  pinCode: "400001",
  bankName: "State Bank of India",
  ifscCode: "SBIN0001234",
  accountNumber: "1234567890123456",
}

export default function OrganizationProfile() {
  const [organizationData, setOrganizationData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API loading with a timeout
    const timer = setTimeout(() => {
      setOrganizationData(staticOrganizationData)
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
<<<<<<< HEAD
        <div className="container mx-auto max-w-4xl px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading organization profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto max-w-4xl px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <Button onClick={() => location.reload()}>Retry</Button>
=======
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto max-w-6xl px-4 py-6">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/services" className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Services
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Organization Profile</h1>
                <p className="text-gray-600">Manage your organization information</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading organization profile...</p>
            </div>
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/services" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Organization Profile</h1>
              <p className="text-gray-600">Manage your organization information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-6">
          {/* Organization Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <CardTitle>Organization Details</CardTitle>
              </div>
              <CardDescription>Basic information about your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<<<<<<< HEAD
                <Detail label="Organization Name" value={organizationData?.organizationName} />
                <Detail label="Organization Email" value={organizationData?.email} />
                <Detail label="Contact Number" value={organizationData?.contactNumber} />
                <Detail label="Organization Website" value={organizationData?.website} />
                <Detail label="PAN Number" value={organizationData?.panNumber} mono />
                <Detail label="GSTIN" value={organizationData?.gstin} mono />
=======
                <div>
                  <label className="text-sm font-medium text-gray-500">Organization Name</label>
                  <p className="text-gray-900 font-medium">{organizationData?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Organization Email</label>
                  <p className="text-gray-900">{organizationData?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact Number</label>
                  <p className="text-gray-900">{organizationData?.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Organization Website</label>
                  <p className="text-gray-900">{organizationData?.website}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">PAN Number</label>
                  <p className="text-gray-900 font-mono">{organizationData?.pan}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">GSTIN</label>
                  <p className="text-gray-900 font-mono">{organizationData?.gstin}</p>
                </div>
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <CardTitle>Address Information</CardTitle>
              </div>
              <CardDescription>Organization location and address details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<<<<<<< HEAD
                <Detail label="Complete Organization Address" value={organizationData?.address} full />
                <Detail label="Country" value={organizationData?.country} />
                <Detail label="Pin Code" value={organizationData?.pincode} />
=======
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Complete Organization Address</label>
                  <p className="text-gray-900">{organizationData?.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Country</label>
                  <p className="text-gray-900">{organizationData?.country}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Pin Code</label>
                  <p className="text-gray-900">{organizationData?.pinCode}</p>
                </div>
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <CardTitle>Bank Details</CardTitle>
              </div>
              <CardDescription>Banking information for transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<<<<<<< HEAD
                <Detail label="Bank Name" value={organizationData?.bankName} />
                <Detail label="IFSC Code" value={organizationData?.ifscCode} mono />
                <Detail label="Bank Account Number" value={organizationData?.bankAccountNumber} mono full />
=======
                <div>
                  <label className="text-sm font-medium text-gray-500">Bank Name</label>
                  <p className="text-gray-900">{organizationData?.bankName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">IFSC Code</label>
                  <p className="text-gray-900 font-mono">{organizationData?.ifscCode}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Bank Account Number</label>
                  <p className="text-gray-900 font-mono">{organizationData?.accountNumber}</p>
                </div>
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
<<<<<<< HEAD

// Reusable Detail renderer
function Detail({ label, value, mono = false, full = false }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <p className={`text-gray-900 ${mono ? "font-mono" : "font-medium"}`}>{value || "-"}</p>
    </div>
  )
}

=======
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1
