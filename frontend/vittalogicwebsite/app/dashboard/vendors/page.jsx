"use client"

import {
  ArrowLeft,
  Banknote,
  Building,
  Building2,
  CreditCard,
  Edit,
  Filter,
  List,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

// Enhanced utility function to convert Decimal128 objects to strings recursively
const formatMongoData = (data) => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map((item) => formatMongoData(item));
  }
  if (typeof data === "object" && data !== null) {
    if (data.$numberDecimal) {
      return data.toString(); // Convert Decimal128 to string
    }
    const formatted = {};
    for (const key in data) {
      formatted[key] = formatMongoData(data[key]); // Recursively process nested fields
    }
    return formatted;
  }
  return data;
};

const employee = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("loggedInEmployee")) : null
const LOGGED_IN_EMPLOYEE_ID = employee?.employeeId || null
const TOKEN = typeof window !== "undefined" ? localStorage.getItem("token") : null

export default function VendorsPage() {
  const [activeTab, setActiveTab] = useState("add-vendor")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [vendors, setVendors] = useState([])
  const [payments, setPayments] = useState([])
  const [vendorSearchTerm, setVendorSearchTerm] = useState("")
  const [vendorTypeFilter, setVendorTypeFilter] = useState("All")
  const [paymentSearchTerm, setPaymentSearchTerm] = useState("")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All")
  const [editVendorDialog, setEditVendorDialog] = useState(false)
  const [editPaymentDialog, setEditPaymentDialog] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [editVendorForm, setEditVendorForm] = useState({})
  const [editPaymentForm, setEditPaymentForm] = useState({})

  const [vendorForm, setVendorForm] = useState({
    vendorId: "",
    companyName: "",
    address: "",
    vendorTypes: [],
    contactPersonName: "",
    contactPersonEmail: "",
    contactPersonNumber: "",
    location: "",
    createdBy: LOGGED_IN_EMPLOYEE_ID,
    updatedBy: LOGGED_IN_EMPLOYEE_ID,
    bankAccountNumber: "",
    bankName: "",
    bankBranch: "",
    ifscCode: "",
    accountHolderName: "",
    taxId: "",
    panNumber: "",
    countryName: "",
    intBankName: "",
    ibanAccountNumber: "",
    swiftBicCode: "",
    bankAddress: "",
    beneficiaryName: "",
    currency: "",
    iecCode: "",
  })

  const [paymentForm, setPaymentForm] = useState({
    paymentId: "",
    vendorId: "",
    paymentAmountVendorCurrency: "",
    exchangeRateAgainstINR: "",
    paymentAmountINR: "",
    purpose: "",
    dueDate: "",
    paymentMethod: "",
    status: "",
    createdBy: LOGGED_IN_EMPLOYEE_ID,
    updatedBy: LOGGED_IN_EMPLOYEE_ID,
  })

  const vendorTypeOptions = [
    "Technology",
    "Manufacturing",
    "Software",
    "Hardware",
    "Services",
    "Consulting",
    "Export",
    "Import",
    "Retail",
    "Wholesale",
    "Construction",
    "Healthcare",
    "Liability",
    "Others",
  ]

  const paymentMethods = ["Bank Transfer", "Wire Transfer", "Check", "Cash", "Online Payment", "UPI", "NEFT", "RTGS"]
  const paymentStatuses = ["Pending", "Processing", "Completed", "Failed", "Cancelled", "On Hold"]
  const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SGD", "AED"]

  // Fetch vendors for dropdown and list
  useEffect(() => {
    fetchVendors()
    fetchPayments()
  }, [])

  const fetchVendors = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/vendor", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${employee?.token || ""}`,
        },
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch vendors")
      const data = await response.json()
      setVendors(formatMongoData(data.data))
    } catch (error) {
      console.error("Error fetching vendors:", error)
      setSuccessMessage("Failed to fetch vendors")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    }
  }

const fetchPayments = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/vendor/payment/", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${employee?.token || ""}`,
      },
      credentials: "include",
    })

    if (!response.ok) throw new Error("Failed to fetch payments")

    const data = await response.json()

    const normalizedPayments = data.data.map(payment => {
      const parseDecimal = (val) => parseFloat(val?.$numberDecimal || "0")

      return {
        id: payment._id,
        paymentId: payment.payment_id,
        vendorId: payment.vendor_id,
        vendorName: payment.vendorDetails?.company_Name || "Unknown Vendor",

        currency: payment.currency,
        paymentAmountVendor: parseDecimal(payment.payment_amount_in_vendor_currency),
        exchangeRate: parseDecimal(payment.exchangeRate),
        paymentAmountINR: parseDecimal(payment.payment_amount_in_indian_currency),
        paidAmount: parseDecimal(payment.paid_amount),

        dueDate: new Date(payment.due_date).toISOString().split("T")[0],
        purpose: payment.purpose,
        paymentMethod: payment.payment_method,
        status: payment.status,

        createdBy: payment.createdBy,
        updatedBy: payment.updatedBy,
        createdAt: new Date(payment.createdAt).toISOString().split("T")[0],
        updatedAt: new Date(payment.updatedAt).toISOString().split("T")[0],
      }
    })

    setPayments(normalizedPayments)
  } catch (error) {
    console.error("Error fetching payments:", error)
    setSuccessMessage("Failed to fetch payments")
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }
}


  const getSelectedVendor = () => {
    return vendors.find((v) => v.vendor_id === paymentForm.vendorId)
  }

  const calculateINRAmount = () => {
    const vendorAmount = Number.parseFloat(paymentForm.paymentAmountVendorCurrency) || 0
    const rate = Number.parseFloat(paymentForm.exchangeRateAgainstINR) || 0
    return (vendorAmount * rate).toFixed(2)
  }

  const handleVendorCurrencyChange = (value) => {
    setPaymentForm((prev) => {
      const newForm = { ...prev, paymentAmountVendorCurrency: value }
      const vendorAmount = Number.parseFloat(value) || 0
      const rate = Number.parseFloat(prev.exchangeRateAgainstINR) || 0
      newForm.paymentAmountINR = (vendorAmount * rate).toFixed(2)
      return newForm
    })
  }

  const handleExchangeRateChange = (value) => {
    setPaymentForm((prev) => {
      const newForm = { ...prev, exchangeRateAgainstINR: value }
      const vendorAmount = Number.parseFloat(prev.paymentAmountVendorCurrency) || 0
      const rate = Number.parseFloat(value) || 0
      newForm.paymentAmountINR = (vendorAmount * rate).toFixed(2)
      return newForm
    })
  }

  const handleVendorTypeChange = (type, checked) => {
    if (checked) {
      setVendorForm((prev) => ({
        ...prev,
        vendorTypes: [...prev.vendorTypes, type],
      }))
    } else {
      setVendorForm((prev) => ({
        ...prev,
        vendorTypes: prev.vendorTypes.filter((t) => t !== type),
      }))
    }
  }

  const handleEditVendorTypeChange = (type, checked) => {
    if (checked) {
      setEditVendorForm((prev) => ({
        ...prev,
        vendor_type: [...(prev.vendor_type || []), type],
      }))
    } else {
      setEditVendorForm((prev) => ({
        ...prev,
        vendor_type: (prev.vendor_type || []).filter((t) => t !== type),
      }))
    }
  }

  const handleAddVendor = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        company_Name: vendorForm.companyName,
        company_Address: vendorForm.address,
        vendor_type: vendorForm.vendorTypes,
        contactPerson: {
          name: vendorForm.contactPersonName,
          email: vendorForm.contactPersonEmail,
          number: vendorForm.contactPersonNumber,
        },
        vendor_location: vendorForm.location,
        createdBy: LOGGED_IN_EMPLOYEE_ID,
        updatedBy: LOGGED_IN_EMPLOYEE_ID,
        indianBankDetails: vendorForm.location === "Indian" ? {
          bankAccountNumber: vendorForm.bankAccountNumber.trim(),
          bankName: vendorForm.bankName,
          bankBranch: vendorForm.bankBranch,
          ifscCode: vendorForm.ifscCode,
          accountHolderName: vendorForm.accountHolderName,
          taxId: vendorForm.taxId,
          panNumber: vendorForm.panNumber,
        } : undefined,
        internationalBankDetails: vendorForm.location === "International" ? {
          countryName: vendorForm.countryName,
          bankName: vendorForm.intBankName,
          ibanOrAccountNumber: vendorForm.ibanAccountNumber,
          swiftBicCode: vendorForm.swiftBicCode,
          bankAddress: vendorForm.bankAddress,
          beneficiaryName: vendorForm.beneficiaryName,
          currency: vendorForm.currency,
          iecCode: vendorForm.iecCode,
        } : undefined,
      }

      const response = await fetch("http://localhost:8000/api/v1/vendor/registerVendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${employee?.token || ""}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add vendor")
      }
      const data = await response.json()
      setVendors((prev) => [...prev, formatMongoData(data.data)])
      setVendorForm({
        vendorId: "",
        companyName: "",
        address: "",
        vendorTypes: [],
        contactPersonName: "",
        contactPersonEmail: "",
        contactPersonNumber: "",
        location: "",
        createdBy: LOGGED_IN_EMPLOYEE_ID,
        updatedBy: LOGGED_IN_EMPLOYEE_ID,
        bankAccountNumber: "",
        bankName: "",
        bankBranch: "",
        ifscCode: "",
        accountHolderName: "",
        taxId: "",
        panNumber: "",
        countryName: "",
        intBankName: "",
        ibanAccountNumber: "",
        swiftBicCode: "",
        bankAddress: "",
        beneficiaryName: "",
        currency: "",
        iecCode: "",
      })
      setSuccessMessage("Vendor added successfully!")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      console.error("Error adding vendor:", error)
      setSuccessMessage(error.message || "Failed to add vendor")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    }
  }

  const handleAddPayment = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        vendor_id: paymentForm.vendorId,
        payment_amount_in_vendor_currency: paymentForm.paymentAmountVendorCurrency,
        exchangeRate: paymentForm.exchangeRateAgainstINR,
        due_date: paymentForm.dueDate,
        purpose: paymentForm.purpose,
        payment_method: paymentForm.paymentMethod,
        status: paymentForm.status,
        createdBy: LOGGED_IN_EMPLOYEE_ID,
        updatedBy: LOGGED_IN_EMPLOYEE_ID,
      }

      const response = await fetch("http://localhost:8000/api/v1/vendor/payment/registerVendorPay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${employee?.token || ""}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create payment")
      }
      const data = await response.json()
      setPayments((prev) => [...prev, formatMongoData(data.data)])
      setPaymentForm({
        paymentId: "",
        vendorId: "",
        paymentAmountVendorCurrency: "",
        exchangeRateAgainstINR: "",
        paymentAmountINR: "",
        purpose: "",
        dueDate: "",
        paymentMethod: "",
        status: "",
        createdBy: LOGGED_IN_EMPLOYEE_ID,
        updatedBy: LOGGED_IN_EMPLOYEE_ID,
      })
      setSuccessMessage("Payment record created successfully!")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      console.error("Error adding payment:", error)
      setSuccessMessage(error.message || "Failed to create payment")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    }
  }

  const handleEditVendor = (vendor) => {
    setSelectedVendor(vendor)
    setEditVendorForm({
      vendor_id: vendor.vendor_id,
      company_Name: vendor.company_Name,
      company_Address: vendor.company_Address,
      vendor_type: vendor.vendor_type,
      contactPerson: vendor.contactPerson,
      vendor_location: vendor.vendor_location,
      indianBankDetails: vendor.indianBankDetails,
      internationalBankDetails: vendor.internationalBankDetails,
      createdBy: vendor.createdBy,
      updatedBy: LOGGED_IN_EMPLOYEE_ID,
    })
    setEditVendorDialog(true)
  }

  const handleSaveVendorEdit = async () => {
    try {
      const payload = {
        company_Name: editVendorForm.company_Name,
        company_Address: editVendorForm.company_Address,
        vendor_type: editVendorForm.vendor_type,
        contactPerson: editVendorForm.contactPerson,
        vendor_location: editVendorForm.vendor_location,
        indianBankDetails: editVendorForm.vendor_location === "Indian" ? editVendorForm.indianBankDetails : undefined,
        internationalBankDetails: editVendorForm.vendor_location === "International" ? editVendorForm.internationalBankDetails : undefined,
        updatedBy: LOGGED_IN_EMPLOYEE_ID,
      }

      const response = await fetch(`http://localhost:8000/api/v1/vendor/update/${editVendorForm.vendor_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${employee?.token || ""}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update vendor")
      }
      const data = await response.json()
      setVendors((prev) =>
        prev.map((vendor) =>
          vendor.vendor_id === editVendorForm.vendor_id ? formatMongoData(data.data) : vendor
        )
      )
      setEditVendorDialog(false)
      setSuccessMessage("Vendor updated successfully!")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      console.error("Error updating vendor:", error)
      setSuccessMessage(error.message || "Failed to update vendor")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    }
  }

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment)
    setEditPaymentForm({
      payment_id: payment.payment_id,
      vendor_id: payment.vendor_id,
      vendorName: payment.vendor_id.company_Name,
      currency: payment.currency,
      payment_amount_in_vendor_currency: payment.payment_amount_in_vendor_currency,
      exchangeRate: payment.exchangeRate,
      payment_amount_in_indian_currency: payment.payment_amount_in_indian_currency,
      due_date: payment.due_date,
      purpose: payment.purpose,
      payment_method: payment.payment_method,
      status: payment.status,
      createdBy: payment.createdBy,
      updatedBy: LOGGED_IN_EMPLOYEE_ID,
    })
    setEditPaymentDialog(true)
  }

  const handleSavePaymentEdit = async () => {
    try {
      const payload = {
        due_date: editPaymentForm.due_date,
        status: editPaymentForm.status,
        updatedBy: LOGGED_IN_EMPLOYEE_ID,
      }

      const response = await fetch(`http://localhost:8000/api/v1/vendor/payment/update/${editPaymentForm.payment_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${employee?.token || ""}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update payment")
      }
      const data = await response.json()
      setPayments((prev) =>
        prev.map((payment) =>
          payment.payment_id === editPaymentForm.payment_id ? formatMongoData(data.data) : payment
        )
      )
      setEditPaymentDialog(false)
      setSuccessMessage("Payment updated successfully!")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      console.error("Error updating payment:", error)
      setSuccessMessage(error.message || "Failed to update payment")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    }
  }

  const handleDeleteVendor = async (vendorId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/vendor/delete/${vendorId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${employee?.token || ""}`,
        },
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete vendor")
      }
      setVendors((prev) => prev.filter((v) => v.vendor_id !== vendorId))
      setSuccessMessage("Vendor deleted successfully!")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      console.error("Error deleting vendor:", error)
      setSuccessMessage(error.message || "Failed to delete vendor")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    }
  }

  const handleDeletePayment = async (paymentId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/vendor/payment/delete/${paymentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${employee?.token || ""}`,
        },
        credentials: "include"
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete payment")
      }
      setPayments((prev) => prev.filter((p) => p.payment_id !== paymentId))
      setSuccessMessage("Payment record deleted successfully!")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      console.error("Error deleting payment:", error)
      setSuccessMessage(error.message || "Failed to delete payment")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    }
  }

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.company_Name.toLowerCase().includes(vendorSearchTerm.toLowerCase()) ||
      vendor.vendor_id.toLowerCase().includes(vendorSearchTerm.toLowerCase())
    const matchesType = vendorTypeFilter === "All" || vendor.vendor_type.includes(vendorTypeFilter)
    return matchesSearch && matchesType
  })

  const filteredPayments = payments.filter((payment) => {
    const searchTerm = paymentSearchTerm?.toLowerCase?.() || "";
    const companyName = payment?.vendor_id?.company_Name?.toLowerCase?.() || "";
    const paymentId = payment?.payment_id?.toLowerCase?.() || "";
    const vendorId = payment?.vendor_id?._id?.toLowerCase?.() || "";
    const matchesSearch =
      companyName.includes(searchTerm) ||
      paymentId.includes(searchTerm) ||
      vendorId.includes(searchTerm);
    const matchesStatus =
      paymentStatusFilter === "All" || payment.status === paymentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const tabs = [
    { id: "add-vendor", label: "Add Vendor", icon: Plus },
    { id: "vendors-list", label: "Vendors List", icon: List },
    { id: "vendor-payment", label: "Vendor Payment", icon: CreditCard },
    { id: "payment-list", label: "Payment List", icon: Banknote },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/services" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
              <p className="text-gray-600">Manage vendors and payment records</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Vendor Services
                </CardTitle>
                <CardDescription>Select a service to manage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {tab.label}
                    </Button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {showSuccessMessage && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
              </Alert>
            )}

            {/* Add Vendor Tab */}
            {activeTab === "add-vendor" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Vendor
                  </CardTitle>
                  <CardDescription>Create a new vendor record with complete details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddVendor} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Input
                            id="companyName"
                            value={vendorForm.companyName}
                            onChange={(e) => setVendorForm((prev) => ({ ...prev, companyName: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Company Address *</Label>
                        <Textarea
                          id="address"
                          value={vendorForm.address}
                          onChange={(e) => setVendorForm((prev) => ({ ...prev, address: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Vendor Types *</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {vendorTypeOptions.map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={type}
                                checked={vendorForm.vendorTypes.includes(type)}
                                onCheckedChange={(checked) => handleVendorTypeChange(type, checked)}
                              />
                              <Label htmlFor={type} className="text-sm">{type}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="createdByVendor">Created By</Label>
                          <Input id="createdByVendor" value={vendorForm.createdBy} readOnly className="bg-gray-50" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="updatedByVendor">Updated By</Label>
                          <Input id="updatedByVendor" value={vendorForm.updatedBy} readOnly className="bg-gray-50" />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Contact Person Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Contact Person Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                          <Input
                            id="contactPersonName"
                            value={vendorForm.contactPersonName}
                            onChange={(e) => setVendorForm((prev) => ({ ...prev, contactPersonName: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPersonEmail">Contact Person Email *</Label>
                          <Input
                            id="contactPersonEmail"
                            type="email"
                            value={vendorForm.contactPersonEmail}
                            onChange={(e) => setVendorForm((prev) => ({ ...prev, contactPersonEmail: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPersonNumber">Contact Person Number *</Label>
                          <Input
                            id="contactPersonNumber"
                            value={vendorForm.contactPersonNumber}
                            onChange={(e) => setVendorForm((prev) => ({ ...prev, contactPersonNumber: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Location and Bank Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Location & Bank Details</h3>
                      <div className="space-y-2">
                        <Label htmlFor="location">Vendor Location *</Label>
                        <Select
                          value={vendorForm.location}
                          onValueChange={(value) => setVendorForm((prev) => ({ ...prev, location: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select vendor location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Indian">Indian</SelectItem>
                            <SelectItem value="International">International</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {vendorForm.location === "Indian" && (
                        <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
                          <h4 className="font-medium text-blue-900">Indian Bank Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="bankAccountNumber">Bank Account Number *</Label>
                              <Input
                                id="bankAccountNumber"
                                value={vendorForm.bankAccountNumber}
                                onChange={(e) => setVendorForm((prev) => ({ ...prev, bankAccountNumber: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="bankName">Bank Name *</Label>
                              <Input
                                id="bankName"
                                value={vendorForm.bankName}
                                onChange={(e) => setVendorForm((prev) => ({ ...prev, bankName: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="bankBranch">Bank Branch *</Label>
                              <Input
                                id="bankBranch"
                                value={vendorForm.bankBranch}
                                onChange={(e) => setVendorForm((prev) => ({ ...prev, bankBranch: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="ifscCode">IFSC Code *</Label>
                              <Input
                                id="ifscCode"
                                value={vendorForm.ifscCode}
                                onChange={(e) => setVendorForm((prev) => ({ ...prev, ifscCode: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                              <Input
                                id="accountHolderName"
                                value={vendorForm.accountHolderName}
                                onChange={(e) => setVendorForm((prev) => ({ ...prev, accountHolderName: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="taxId">Tax ID</Label>
                              <Input
                                id="taxId"
                                value={vendorForm.taxId}
                                onChange={(e) => setVendorForm((prev) => ({ ...prev, taxId: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="panNumber">PAN Number</Label>
                              <Input
                                id="panNumber"
                                value={vendorForm.panNumber}
                                onChange={(e) => setVendorForm((prev) => ({ ...prev, panNumber: e.target.value }))}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {vendorForm.location === "International" && (
                        <div className="space-y-4 p-4 border rounded-lg bg-green-50">
                          <h4 className="font-medium text-green-900">International Bank Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="countryName">Country Name *</Label>
                              <Input
                                id="countryName"
                                value={vendorForm.countryName}
                                onChange={(e) => setVendorForm((prev) => ({ ...prev, countryName: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="intBankName">Bank Name *</Label>
                              <Input
                                id="intBankName"
                                value={vendorForm.intBankName}
                                onChange={(e) => setVendorForm((prev) => ({ ...prev, intBankName: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="ibanAccountNumber">IBAN/Bank Account Number *</Label>
                              <Input
                                id="ibanAccountNumber"
                                value={vendorForm.ibanAccountNumber}
                                onChange={(e) => setVendorForm((prev) => ({ ...prev, ibanAccountNumber: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="swiftBicCode">SWIFT/BIC Code *</Label>
                              <Input
                                id="swiftBicCode"
                                value={vendorForm.swiftBicCode}
                                onChange={(e) => setVendorForm((prev) => ({ ...prev, swiftBicCode: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="bankAddress">Bank Address *</Label>
                              <Input
                                id="bankAddress"
                                value={vendorForm.bankAddress}
                                onChange={(e) => setVendorForm((prev) => ({ ...prev, bankAddress: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="beneficiaryName">Beneficiary Name *</Label>
                              <Input
                                id="beneficiaryName"
                                value={vendorForm.beneficiaryName}
                                onChange={(e) => setVendorForm((prev) => ({ ...prev, beneficiaryName: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="currency">Currency *</Label>
                              <Select
                                value={vendorForm.currency}
                                onValueChange={(value) => setVendorForm((prev) => ({ ...prev, currency: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                  {currencies.map((currency) => (
                                    <SelectItem key={currency} value={currency}>
                                      {currency}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="iecCode">Importer Exporter Code (IEC)</Label>
                              <Input
                                id="iecCode"
                                value={vendorForm.iecCode}
                                onChange={(e) => setVendorForm((prev) => ({ ...prev, iecCode: e.target.value }))}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button type="submit" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Vendor
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Vendors List Tab */}
            {activeTab === "vendors-list" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <List className="h-5 w-5 mr-2" />
                    Vendors List
                  </CardTitle>
                  <CardDescription>View and manage all vendor records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center space-x-2 flex-1">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search by vendor name or ID..."
                          value={vendorSearchTerm}
                          onChange={(e) => setVendorSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <Select value={vendorTypeFilter} onValueChange={setVendorTypeFilter}>
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All Types</SelectItem>
                            {vendorTypeOptions.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {filteredVendors.map((vendor) => (
                        <Card key={vendor.vendor_id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold">{vendor.company_Name}</h3>
                                <p className="text-sm text-gray-600">ID: {vendor.vendor_id}</p>
                                <p className="text-sm text-gray-600">Created By: {vendor.createdBy}</p>
                                <p className="text-sm text-gray-600">Updated By: {vendor.updatedBy}</p>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" onClick={() => handleEditVendor(vendor)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDeleteVendor(vendor.vendor_id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                  {vendor.company_Address}
                                </div>
                                <div className="flex items-center text-sm">
                                  <User className="h-4 w-4 mr-2 text-gray-400" />
                                  {vendor.contactPerson.name}
                                </div>
                                <div className="flex items-center text-sm">
                                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                  {vendor.contactPerson.email}
                                </div>
                                <div className="flex items-center text-sm">
                                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                  {vendor.contactPerson.number}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                  <Building className="h-4 w-4 mr-2 text-gray-400" />
                                  Location: {vendor.vendor_location}
                                </div>
                                {vendor.vendor_location === "Indian" && vendor.indianBankDetails && (
                                  <div className="space-y-1 p-2 bg-blue-50 rounded border-l-2 border-blue-200">
                                    <p className="text-xs font-medium text-blue-800 mb-1">Bank Details</p>
                                    <div className="flex items-center text-xs">
                                      <Building2 className="h-3 w-3 mr-1 text-blue-600" />
                                      {vendor.indianBankDetails.bankName}
                                    </div>
                                    {vendor.indianBankDetails.bankBranch && (
                                      <div className="text-xs text-blue-700">Branch: {vendor.indianBankDetails.bankBranch}</div>
                                    )}
                                    {vendor.indianBankDetails.ifscCode && (
                                      <div className="text-xs text-blue-700">IFSC: {vendor.indianBankDetails.ifscCode}</div>
                                    )}
                                    {vendor.indianBankDetails.bankAccountNumber && (
                                      <div className="text-xs text-blue-700">A/C: {vendor.indianBankDetails.bankAccountNumber}</div>
                                    )}
                                    {vendor.indianBankDetails.accountHolderName && (
                                      <div className="text-xs text-blue-700">Holder: {vendor.indianBankDetails.accountHolderName}</div>
                                    )}
                                  </div>
                                )}
                                {vendor.vendor_location === "International" && vendor.internationalBankDetails && (
                                  <div className="space-y-1 p-2 bg-green-50 rounded border-l-2 border-green-200">
                                    <p className="text-xs font-medium text-green-800 mb-1">Bank Details</p>
                                    <div className="flex items-center text-xs">
                                      <Building2 className="h-3 w-3 mr-1 text-green-600" />
                                      {vendor.internationalBankDetails.bankName}
                                    </div>
                                    {vendor.internationalBankDetails.countryName && (
                                      <div className="text-xs text-green-700">Country: {vendor.internationalBankDetails.countryName}</div>
                                    )}
                                    {vendor.internationalBankDetails.swiftBicCode && (
                                      <div className="text-xs text-green-700">SWIFT: {vendor.internationalBankDetails.swiftBicCode}</div>
                                    )}
                                    {vendor.internationalBankDetails.ibanOrAccountNumber && (
                                      <div className="text-xs text-green-700">IBAN: {vendor.internationalBankDetails.ibanOrAccountNumber}</div>
                                    )}
                                    {vendor.internationalBankDetails.currency && (
                                      <div className="text-xs text-green-700">Currency: {vendor.internationalBankDetails.currency}</div>
                                    )}
                                    {vendor.internationalBankDetails.beneficiaryName && (
                                      <div className="text-xs text-green-700">Beneficiary: {vendor.internationalBankDetails.beneficiaryName}</div>
                                    )}
                                  </div>
                                )}
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {vendor.vendor_type.map((type) => (
                                    <Badge key={type} variant="secondary" className="text-xs">
                                      {type}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {filteredVendors.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No vendors found matching your search criteria.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vendor Payment Tab */}
            {activeTab === "vendor-payment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Create Vendor Payment
                  </CardTitle>
                  <CardDescription>Create a new payment record for vendors</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddPayment} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vendorIdPayment">Vendor ID *</Label>
                        <Select
                          value={paymentForm.vendorId}
                          onValueChange={(value) => setPaymentForm((prev) => ({ ...prev, vendorId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select or enter vendor ID" />
                          </SelectTrigger>
                          <SelectContent>
                            {vendors.map((vendor) => (
                              <SelectItem key={vendor.vendor_id} value={vendor.vendor_id}>
                                {vendor.vendor_id} - {vendor.company_Name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="createdByPayment">Created By</Label>
                        <Input id="createdByPayment" value={paymentForm.createdBy} readOnly className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="updatedByPayment">Updated By</Label>
                        <Input id="updatedByPayment" value={paymentForm.updatedBy} readOnly className="bg-gray-50" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vendorCurrency">Vendor Currency</Label>
                        <Input
                          id="vendorCurrency"
                          value={getSelectedVendor()?.internationalBankDetails?.currency || getSelectedVendor()?.currency || ""}
                          readOnly
                          className="bg-gray-50"
                          placeholder="Select vendor first"
                        />
                        <p className="text-xs text-gray-500">Auto-filled from selected vendor</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentAmountVendorCurrency">Payment Amount *</Label>
                        <Input
                          id="paymentAmountVendorCurrency"
                          type="number"
                          step="0.01"
                          value={paymentForm.paymentAmountVendorCurrency}
                          onChange={(e) => handleVendorCurrencyChange(e.target.value)}
                          placeholder="Enter amount"
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Amount in {getSelectedVendor()?.internationalBankDetails?.currency || getSelectedVendor()?.currency || "vendor currency"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exchangeRateAgainstINR">Exchange Rate (against INR) *</Label>
                      <Input
                        id="exchangeRateAgainstINR"
                        type="number"
                        step="0.01"
                        value={paymentForm.exchangeRateAgainstINR}
                        onChange={(e) => handleExchangeRateChange(e.target.value)}
                        placeholder="Enter exchange rate"
                        required
                      />
                      <p className="text-xs text-gray-500">1 {getSelectedVendor()?.internationalBankDetails?.currency || getSelectedVendor()?.currency || "Currency"} = ? INR</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentAmountINR">Payment Amount (in INR)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <Input
                          id="paymentAmountINR"
                          type="number"
                          value={paymentForm.paymentAmountINR}
                          readOnly
                          className="pl-8 bg-gray-50"
                          placeholder="Auto-calculated"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose</Label>
                      <Textarea
                        id="purpose"
                        value={paymentForm.purpose}
                        onChange={(e) => setPaymentForm((prev) => ({ ...prev, purpose: e.target.value }))}
                        placeholder="Enter payment purpose (optional)"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date *</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={paymentForm.dueDate}
                          onChange={(e) => setPaymentForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method *</Label>
                        <Select
                          value={paymentForm.paymentMethod}
                          onValueChange={(value) => setPaymentForm((prev) => ({ ...prev, paymentMethod: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((method) => (
                              <SelectItem key={method} value={method}>
                                {method}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select
                          value={paymentForm.status}
                          onValueChange={(value) => setPaymentForm((prev) => ({ ...prev, status: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Create Payment Record
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Payment List Tab */}
            {activeTab === "payment-list" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Banknote className="h-5 w-5 mr-2" />
                    Payment Records
                  </CardTitle>
                  <CardDescription>
                    View and manage all vendor payment records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center space-x-2 flex-1">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search by vendor name, payment ID, or vendor ID..."
                          value={paymentSearchTerm}
                          onChange={(e) => setPaymentSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All Status</SelectItem>
                            {paymentStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Payment Cards */}
                    <div className="grid gap-4">
                      {filteredPayments.map((payment) => {
                        // Calculate amounts properly
                        const purchaseAmount = Number(payment.payment_amount_in_indian_currency?.$numberDecimal || 0);
                        const paidAmount = Number(payment.paid_amount?.$numberDecimal || 0);
                        const outstandingAmount = purchaseAmount - paidAmount;
                        const vendorCurrencyAmount = Number(payment.payment_amount_in_vendor_currency?.$numberDecimal || 0);
                        const exchangeRate = Number(payment.exchangeRate?.$numberDecimal || 0);

                        return (
                          <Card key={payment.payment_id} className="border-l-4 border-l-green-500">
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold">
                                    {payment.vendorName || 'Unknown Company'}
                                  </h3>
                                    <p>Payment ID: {payment.paymentId}</p>
                                    <p>Vendor ID: {payment.vendorId}</p>
                                    <p>Vendor Name: {payment.vendorName}</p>
                                    <p>Exchange Rate: {payment.exchangeRate?.toFixed(2)}</p>

                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant={
                                      payment.status === "Completed"
                                        ? "default"
                                        : payment.status === "Pending"
                                        ? "secondary"
                                        : payment.status === "Failed"
                                        ? "destructive"
                                        : "outline"
                                    }
                                  >
                                    {payment.status}
                                  </Badge>
                                  <Button size="sm" variant="outline" onClick={() => handleEditPayment(payment)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeletePayment(payment.payment_id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Payment Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-gray-500">Purchase Amount</p>
                                  <p className="text-lg font-semibold text-blue-600">
                                    ₹{payment.paymentAmountINR?.toFixed(2) ?? "0.00"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-gray-500">Paid Amount</p>
                                  <p className="text-lg font-semibold text-green-600">
                                    ₹{payment.paidAmount?.toFixed(2) ?? "0.00"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-gray-500">Outstanding Amount</p>
                                  <p className={`text-lg font-semibold ${payment.paymentAmountINR - payment.paidAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    ₹{(payment.paymentAmountINR - payment.paidAmount)?.toFixed(2) ?? "0.00"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-gray-500">Due Date</p>
                                  <p className="text-sm">
                                    {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString("en-IN") : "N/A"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-gray-500">Payment Method</p>
                                  <p className="text-sm">{payment.paymentMethod || "N/A"}</p>
                                </div>
                              </div>


                              {/* Optional Fields */}
                              {payment.purpose && (
                                <div className="mt-4">
                                  <p className="text-sm font-medium text-gray-500">Purpose</p>
                                  <p className="text-sm">{payment.purpose}</p>
                                </div>
                              )}
                              {payment.payment_amount_in_vendor_currency && (
                                <div className="mt-4">
                                  <p className="text-sm font-medium text-gray-500">Amount in Vendor Currency</p>
                                  <p className="text-sm">
                                    {payment.currency} {vendorCurrencyAmount.toFixed(2)}
                                  </p>
                                </div>
                              )}
                              {payment.exchangeRate && (
                                <div className="mt-4">
                                  <p className="text-sm font-medium text-gray-500">Exchange Rate</p>
                                  <p className="text-sm">{payment.exchangeRate?.toFixed(2)}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {/* No Results */}
                    {filteredPayments.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No payment records found matching your search criteria.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>

      {/* Edit Vendor Dialog */}
      <Dialog open={editVendorDialog} onOpenChange={setEditVendorDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
            <DialogDescription>Update vendor information and bank details</DialogDescription>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-6 pr-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vendor ID</Label>
                    <Input value={editVendorForm.vendor_id || ""} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input
                      value={editVendorForm.company_Name || ""}
                      onChange={(e) => setEditVendorForm((prev) => ({ ...prev, company_Name: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={editVendorForm.company_Address || ""}
                    onChange={(e) => setEditVendorForm((prev) => ({ ...prev, company_Address: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vendor Types</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {vendorTypeOptions.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-${type}`}
                          checked={(editVendorForm.vendor_type || []).includes(type)}
                          onCheckedChange={(checked) => handleEditVendorTypeChange(type, checked)}
                        />
                        <Label htmlFor={`edit-${type}`} className="text-sm">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Created By</Label>
                    <Input value={editVendorForm.createdBy || ""} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Updated By</Label>
                    <Input value={LOGGED_IN_EMPLOYEE_ID} readOnly className="bg-gray-50" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Person Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Contact Person Name</Label>
                    <Input
                      value={editVendorForm.contactPerson?.name || ""}
                      onChange={(e) => setEditVendorForm((prev) => ({
                        ...prev,
                        contactPerson: { ...prev.contactPerson, name: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Person Email</Label>
                    <Input
                      type="email"
                      value={editVendorForm.contactPerson?.email || ""}
                      onChange={(e) => setEditVendorForm((prev) => ({
                        ...prev,
                        contactPerson: { ...prev.contactPerson, email: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Person Number</Label>
                    <Input
                      value={editVendorForm.contactPerson?.number || ""}
                      onChange={(e) => setEditVendorForm((prev) => ({
                        ...prev,
                        contactPerson: { ...prev.contactPerson, number: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location & Bank Details</h3>
                <div className="space-y-2">
                  <Label>Vendor Location</Label>
                  <Select
                    value={editVendorForm.vendor_location || ""}
                    onValueChange={(value) => setEditVendorForm((prev) => ({ ...prev, vendor_location: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Indian">Indian</SelectItem>
                      <SelectItem value="International">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editVendorForm.vendor_location === "Indian" && (
                  <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-medium text-blue-900">Indian Bank Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Bank Account Number</Label>
                        <Input
                          value={editVendorForm.indianBankDetails?.bankAccountNumber || ""}
                          onChange={(e) => setEditVendorForm((prev) => ({
                            ...prev,
                            indianBankDetails: { ...prev.indianBankDetails, bankAccountNumber: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bank Name</Label>
                        <Input
                          value={editVendorForm.indianBankDetails?.bankName || ""}
                          onChange={(e) => setEditVendorForm((prev) => ({
                            ...prev,
                            indianBankDetails: { ...prev.indianBankDetails, bankName: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bank Branch</Label>
                        <Input
                          value={editVendorForm.indianBankDetails?.bankBranch || ""}
                          onChange={(e) => setEditVendorForm((prev) => ({
                            ...prev,
                            indianBankDetails: { ...prev.indianBankDetails, bankBranch: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>IFSC Code</Label>
                        <Input
                          value={editVendorForm.indianBankDetails?.ifscCode || ""}
                          onChange={(e) => setEditVendorForm((prev) => ({
                            ...prev,
                            indianBankDetails: { ...prev.indianBankDetails, ifscCode: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Account Holder Name</Label>
                        <Input
                          value={editVendorForm.indianBankDetails?.accountHolderName || ""}
                          onChange={(e) => setEditVendorForm((prev) => ({
                            ...prev,
                            indianBankDetails: { ...prev.indianBankDetails, accountHolderName: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tax ID</Label>
                        <Input
                          value={editVendorForm.indianBankDetails?.taxId || ""}
                          onChange={(e) => setEditVendorForm((prev) => ({
                            ...prev,
                            indianBankDetails: { ...prev.indianBankDetails, taxId: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>PAN Number</Label>
                        <Input
                          value={editVendorForm.indianBankDetails?.panNumber || ""}
                          onChange={(e) => setEditVendorForm((prev) => ({
                            ...prev,
                            indianBankDetails: { ...prev.indianBankDetails, panNumber: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {editVendorForm.vendor_location === "International" && (
                  <div className="space-y-4 p-4 border rounded-lg bg-green-50">
                    <h4 className="font-medium text-green-900">International Bank Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Country Name</Label>
                        <Input
                          value={editVendorForm.internationalBankDetails?.countryName || ""}
                          onChange={(e) => setEditVendorForm((prev) => ({
                            ...prev,
                            internationalBankDetails: { ...prev.internationalBankDetails, countryName: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bank Name</Label>
                        <Input
                          value={editVendorForm.internationalBankDetails?.bankName || ""}
                          onChange={(e) => setEditVendorForm((prev) => ({
                            ...prev,
                            internationalBankDetails: { ...prev.internationalBankDetails, bankName: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>IBAN/Bank Account Number</Label>
                        <Input
                          value={editVendorForm.internationalBankDetails?.ibanOrAccountNumber || ""}
                          onChange={(e) => setEditVendorForm((prev) => ({
                            ...prev,
                            internationalBankDetails: { ...prev.internationalBankDetails, ibanOrAccountNumber: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>SWIFT/BIC Code</Label>
                        <Input
                          value={editVendorForm.internationalBankDetails?.swiftBicCode || ""}
                          onChange={(e) => setEditVendorForm((prev) => ({
                            ...prev,
                            internationalBankDetails: { ...prev.internationalBankDetails, swiftBicCode: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bank Address</Label>
                        <Input
                          value={editVendorForm.internationalBankDetails?.bankAddress || ""}
                          onChange={(e) => setEditVendorForm((prev) => ({
                            ...prev,
                            internationalBankDetails: { ...prev.internationalBankDetails, bankAddress: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Beneficiary Name</Label>
                        <Input
                          value={editVendorForm.internationalBankDetails?.beneficiaryName || ""}
                          onChange={(e) => setEditVendorForm((prev) => ({
                            ...prev,
                            internationalBankDetails: { ...prev.internationalBankDetails, beneficiaryName: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select
                          value={editVendorForm.internationalBankDetails?.currency || ""}
                          onValueChange={(value) => setEditVendorForm((prev) => ({
                            ...prev,
                            internationalBankDetails: { ...prev.internationalBankDetails, currency: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency} value={currency}>
                                {currency}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Importer Exporter Code (IEC)</Label>
                        <Input
                          value={editVendorForm.internationalBankDetails?.iecCode || ""}
                          onChange={(e) => setEditVendorForm((prev) => ({
                            ...prev,
                            internationalBankDetails: { ...prev.internationalBankDetails, iecCode: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setEditVendorDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveVendorEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Payment Dialog */}
      <Dialog open={editPaymentDialog} onOpenChange={setEditPaymentDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
            <DialogDescription>Update payment information</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Payment ID</Label>
                <Input value={editPaymentForm.payment_id || ""} className="bg-gray-50" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Vendor Name</Label>
                <Input value={editPaymentForm.vendorName || ""} className="bg-gray-50" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Amount in Vendor Currency</Label>
                <Input
                  value={editPaymentForm.payment_amount_in_vendor_currency || "0.00"}
                  className="bg-gray-50"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label>Exchange Rate</Label>
                <Input
                  value={editPaymentForm.exchangeRate || "0.00"}
                  className="bg-gray-50"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label>Amount in INR</Label>
                <Input
                  value={editPaymentForm.payment_amount_in_indian_currency || "0.00"}
                  className="bg-gray-50"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label>Created By</Label>
                <Input value={editPaymentForm.createdBy || ""} className="bg-gray-50" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Updated By</Label>
                <Input value={LOGGED_IN_EMPLOYEE_ID} className="bg-gray-50" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={editPaymentForm.due_date || ""}
                  onChange={(e) => setEditPaymentForm((prev) => ({ ...prev, due_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editPaymentForm.status || ""}
                  onValueChange={(value) => setEditPaymentForm((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditPaymentDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSavePaymentEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}