"use client"

import { ArrowLeft, Building2, CreditCard, Loader2, MapPin } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
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
                <Detail label="Organization Name" value={organizationData?.organizationName} />
                <Detail label="Organization Email" value={organizationData?.email} />
                <Detail label="Contact Number" value={organizationData?.contactNumber} />
                <Detail label="Organization Website" value={organizationData?.website} />
                <Detail label="PAN Number" value={organizationData?.panNumber} mono />
                <Detail label="GSTIN" value={organizationData?.gstin} mono />
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
                <Detail label="Complete Organization Address" value={organizationData?.address} full />
                <Detail label="Country" value={organizationData?.country} />
                <Detail label="Pin Code" value={organizationData?.pincode} />
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
                <Detail label="Bank Name" value={organizationData?.bankName} />
                <Detail label="IFSC Code" value={organizationData?.ifscCode} mono />
                <Detail label="Bank Account Number" value={organizationData?.bankAccountNumber} mono full />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Reusable Detail renderer
function Detail({ label, value, mono = false, full = false }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <p className={`text-gray-900 ${mono ? "font-mono" : "font-medium"}`}>{value || "-"}</p>
    </div>
  )
}

