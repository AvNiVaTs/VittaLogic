"use client"

import {
  ArrowLeft,
  Building2,
  CreditCard,
  List,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  Banknote,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function VendorsPage() {
  const [activeTab, setActiveTab] = useState("add-vendor")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Add Vendor Form State
  const [vendorForm, setVendorForm] = useState({
    vendorId: `VEN-${Date.now()}`,
    companyName: "",
    address: "",
    vendorTypes: [],
    contactPersonName: "",
    contactPersonEmail: "",
    contactPersonNumber: "",
    location: "",
    // Indian Bank Details
    bankAccountNumber: "",
    bankName: "",
    bankBranch: "",
    ifscCode: "",
    accountHolderName: "",
    taxId: "",
    panNumber: "",
    // International Bank Details
    countryName: "",
    intBankName: "",
    ibanAccountNumber: "",
    swiftBicCode: "",
    bankAddress: "",
    beneficiaryName: "",
    currency: "",
    iecCode: "",
  })

  // Vendor Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    paymentId: `PAY-${Date.now()}`,
    vendorId: "",
    paymentAmountVendorCurrency: "",
    exchangeRateAgainstINR: "",
    paymentAmountINR: "",
    purpose: "",
    dueDate: "",
    paymentMethod: "",
    status: "",
  })

  const getSelectedVendor = () => {
    return vendors.find((v) => v.vendorId === paymentForm.vendorId)
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

  // Mock Data
  const [vendors, setVendors] = useState([
    {
      vendorId: "VEN-1703123456789",
      companyName: "Tech Solutions Pvt Ltd",
      address: "123 Business Park, Mumbai, Maharashtra",
      vendorTypes: ["Technology", "Software"],
      contactPersonName: "Rajesh Kumar",
      contactPersonEmail: "rajesh@techsolutions.com",
      contactPersonNumber: "+91-9876543210",
      location: "Indian",
      bankName: "HDFC Bank",
      bankBranch: "Andheri West",
      ifscCode: "HDFC0001234",
      createdAt: "2024-01-15",
      currency: "INR",
      bankAccountNumber: "1234567890",
      accountHolderName: "Rajesh Kumar",
    },
    {
      vendorId: "VEN-1703123456790",
      companyName: "Global Supplies Inc",
      address: "456 International Plaza, New York, USA",
      vendorTypes: ["Manufacturing", "Export"],
      contactPersonName: "John Smith",
      contactPersonEmail: "john@globalsupplies.com",
      contactPersonNumber: "+1-555-123-4567",
      location: "International",
      countryName: "United States",
      intBankName: "Chase Bank",
      currency: "USD",
      exchangeRate: "83.25",
      createdAt: "2024-01-10",
      swiftBicCode: "CHASUS33",
      ibanAccountNumber: "US64CHAS9876543210",
      beneficiaryName: "John Smith",
    },
  ])

  const [payments, setPayments] = useState([
    {
      paymentId: "PAY-1703123456789",
      vendorId: "VEN-1703123456789",
      vendorName: "Tech Solutions Pvt Ltd",
      purchaseAmount: "60000",
      paidAmount: "50000",
      outstandingAmount: "10000",
      purpose: "Software License Payment",
      dueDate: "2024-02-15",
      paymentMethod: "Bank Transfer",
      status: "Pending",
      createdAt: "2024-01-15",
    },
    {
      paymentId: "PAY-1703123456790",
      vendorId: "VEN-1703123456790",
      vendorName: "Global Supplies Inc",
      purchaseAmount: "150000",
      paidAmount: "125000",
      outstandingAmount: "25000",
      purpose: "Equipment Purchase",
      dueDate: "2024-02-20",
      paymentMethod: "Wire Transfer",
      status: "Completed",
      createdAt: "2024-01-12",
    },
  ])

  // Search and Filter States
  const [vendorSearchTerm, setVendorSearchTerm] = useState("")
  const [paymentSearchTerm, setPaymentSearchTerm] = useState("")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All")

  // Edit Dialog States
  const [editVendorDialog, setEditVendorDialog] = useState(false)
  const [editPaymentDialog, setEditPaymentDialog] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState(null)

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
    "Liability vendor",
  ]

  const paymentMethods = ["Bank Transfer", "Wire Transfer", "Check", "Cash", "Online Payment", "UPI", "NEFT", "RTGS"]

  const paymentStatuses = ["Pending", "Processing", "Completed", "Failed", "Cancelled", "On Hold"]

  const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SGD", "AED"]

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

  const handleAddVendor = (e) => {
    e.preventDefault()
    const newVendor = {
      ...vendorForm,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setVendors((prev) => [...prev, newVendor])
    setVendorForm({
      vendorId: `VEN-${Date.now()}`,
      companyName: "",
      address: "",
      vendorTypes: [],
      contactPersonName: "",
      contactPersonEmail: "",
      contactPersonNumber: "",
      location: "",
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
  }

  const handleAddPayment = (e) => {
    e.preventDefault()
    const vendor = vendors.find((v) => v.vendorId === paymentForm.vendorId)
    const newPayment = {
      ...paymentForm,
      vendorName: vendor?.companyName || "Unknown Vendor",
      purchaseAmount: paymentForm.paymentAmountINR,
      paidAmount: "0",
      outstandingAmount: paymentForm.paymentAmountINR,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setPayments((prev) => [...prev, newPayment])
    setPaymentForm({
      paymentId: `PAY-${Date.now()}`,
      vendorId: "",
      paymentAmountVendorCurrency: "",
      exchangeRateAgainstINR: "",
      paymentAmountINR: "",
      purpose: "",
      dueDate: "",
      paymentMethod: "",
      status: "",
    })
    setSuccessMessage("Payment record created successfully!")
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const handleEditVendor = (vendor) => {
    setSelectedVendor(vendor)
    setEditVendorDialog(true)
  }

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment)
    setEditPaymentDialog(true)
  }

  const handleDeleteVendor = (vendorId) => {
    setVendors((prev) => prev.filter((v) => v.vendorId !== vendorId))
    setSuccessMessage("Vendor deleted successfully!")
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const handleDeletePayment = (paymentId) => {
    setPayments((prev) => prev.filter((p) => p.paymentId !== paymentId))
    setSuccessMessage("Payment record deleted successfully!")
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.companyName.toLowerCase().includes(vendorSearchTerm.toLowerCase()) ||
      vendor.vendorId.toLowerCase().includes(vendorSearchTerm.toLowerCase()),
  )

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.vendorName.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
      payment.paymentId.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
      payment.vendorId.toLowerCase().includes(paymentSearchTerm.toLowerCase())
    const matchesStatus = paymentStatusFilter === "All" || payment.status === paymentStatusFilter
    return matchesSearch && matchesStatus
  })

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
                          <Label htmlFor="vendorId">Vendor ID</Label>
                          <Input id="vendorId" value={vendorForm.vendorId} readOnly className="bg-gray-50" />
                        </div>
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
                              <Label htmlFor={type} className="text-sm">
                                {type}
                              </Label>
                            </div>
                          ))}
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
                            onChange={(e) =>
                              setVendorForm((prev) => ({ ...prev, contactPersonNumber: e.target.value }))
                            }
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

                      {/* Indian Bank Details */}
                      {vendorForm.location === "Indian" && (
                        <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
                          <h4 className="font-medium text-blue-900">Indian Bank Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="bankAccountNumber">Bank Account Number *</Label>
                              <Input
                                id="bankAccountNumber"
                                value={vendorForm.bankAccountNumber}
                                onChange={(e) =>
                                  setVendorForm((prev) => ({ ...prev, bankAccountNumber: e.target.value }))
                                }
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
                              <Label htmlFor="accountHolderName">Account Holder Name</Label>
                              <Input
                                id="accountHolderName"
                                value={vendorForm.accountHolderName}
                                onChange={(e) =>
                                  setVendorForm((prev) => ({ ...prev, accountHolderName: e.target.value }))
                                }
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

                      {/* International Bank Details */}
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
                                onChange={(e) =>
                                  setVendorForm((prev) => ({ ...prev, ibanAccountNumber: e.target.value }))
                                }
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
                                onChange={(e) =>
                                  setVendorForm((prev) => ({ ...prev, beneficiaryName: e.target.value }))
                                }
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
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by vendor name or ID..."
                        value={vendorSearchTerm}
                        onChange={(e) => setVendorSearchTerm(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>

                    <div className="grid gap-4">
                      {filteredVendors.map((vendor) => (
                        <Card key={vendor.vendorId} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold">{vendor.companyName}</h3>
                                <p className="text-sm text-gray-600">ID: {vendor.vendorId}</p>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" onClick={() => handleEditVendor(vendor)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDeleteVendor(vendor.vendorId)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                  {vendor.address}
                                </div>
                                <div className="flex items-center text-sm">
                                  <User className="h-4 w-4 mr-2 text-gray-400" />
                                  {vendor.contactPersonName}
                                </div>
                                <div className="flex items-center text-sm">
                                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                  {vendor.contactPersonEmail}
                                </div>
                                <div className="flex items-center text-sm">
                                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                  {vendor.contactPersonNumber}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                  <Building className="h-4 w-4 mr-2 text-gray-400" />
                                  Location: {vendor.location}
                                </div>

                                {/* Bank Details Section */}
                                {vendor.location === "Indian" && vendor.bankName && (
                                  <div className="space-y-1 p-2 bg-blue-50 rounded border-l-2 border-blue-200">
                                    <p className="text-xs font-medium text-blue-800 mb-1">Bank Details</p>
                                    <div className="flex items-center text-xs">
                                      <Building2 className="h-3 w-3 mr-1 text-blue-600" />
                                      {vendor.bankName}
                                    </div>
                                    {vendor.bankBranch && (
                                      <div className="text-xs text-blue-700">Branch: {vendor.bankBranch}</div>
                                    )}
                                    {vendor.ifscCode && (
                                      <div className="text-xs text-blue-700">IFSC: {vendor.ifscCode}</div>
                                    )}
                                    {vendor.bankAccountNumber && (
                                      <div className="text-xs text-blue-700">A/C: {vendor.bankAccountNumber}</div>
                                    )}
                                    {vendor.accountHolderName && (
                                      <div className="text-xs text-blue-700">Holder: {vendor.accountHolderName}</div>
                                    )}
                                  </div>
                                )}

                                {vendor.location === "International" && vendor.intBankName && (
                                  <div className="space-y-1 p-2 bg-green-50 rounded border-l-2 border-green-200">
                                    <p className="text-xs font-medium text-green-800 mb-1">Bank Details</p>
                                    <div className="flex items-center text-xs">
                                      <Building2 className="h-3 w-3 mr-1 text-green-600" />
                                      {vendor.intBankName}
                                    </div>
                                    {vendor.countryName && (
                                      <div className="text-xs text-green-700">Country: {vendor.countryName}</div>
                                    )}
                                    {vendor.swiftBicCode && (
                                      <div className="text-xs text-green-700">SWIFT: {vendor.swiftBicCode}</div>
                                    )}
                                    {vendor.ibanAccountNumber && (
                                      <div className="text-xs text-green-700">IBAN: {vendor.ibanAccountNumber}</div>
                                    )}
                                    {vendor.currency && (
                                      <div className="text-xs text-green-700">Currency: {vendor.currency}</div>
                                    )}
                                    {vendor.beneficiaryName && (
                                      <div className="text-xs text-green-700">
                                        Beneficiary: {vendor.beneficiaryName}
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="flex flex-wrap gap-1 mt-2">
                                  {vendor.vendorTypes.map((type) => (
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
                        <Label htmlFor="paymentId">Payment ID</Label>
                        <Input id="paymentId" value={paymentForm.paymentId} readOnly className="bg-gray-50" />
                      </div>
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
                              <SelectItem key={vendor.vendorId} value={vendor.vendorId}>
                                {vendor.vendorId} - {vendor.companyName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentAmountVendorCurrency">Payment Amount (in Vendor Currency) *</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            {getSelectedVendor()?.currency || "Currency"}
                          </span>
                          <Input
                            id="paymentAmountVendorCurrency"
                            type="number"
                            step="0.01"
                            value={paymentForm.paymentAmountVendorCurrency}
                            onChange={(e) => handleVendorCurrencyChange(e.target.value)}
                            className="pl-20"
                            placeholder="Enter amount"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Currency: {getSelectedVendor()?.currency || "Select vendor first"}
                        </p>
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
                        <p className="text-xs text-gray-500">1 {getSelectedVendor()?.currency || "Currency"} = ? INR</p>
                      </div>
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
                  <CardDescription>View and manage all vendor payment records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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

                    <div className="grid gap-4">
                      {filteredPayments.map((payment) => (
                        <Card key={payment.paymentId} className="border-l-4 border-l-green-500">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold">{payment.vendorName}</h3>
                                <p className="text-sm text-gray-600">Payment ID: {payment.paymentId}</p>
                                <p className="text-sm text-gray-600">Vendor ID: {payment.vendorId}</p>
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
                                  onClick={() => handleDeletePayment(payment.paymentId)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Purchase Amount</p>
                                <p className="text-lg font-semibold text-blue-600">₹{payment.purchaseAmount}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Paid Amount</p>
                                <p className="text-lg font-semibold text-green-600">₹{payment.paidAmount}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Outstanding Amount</p>
                                <p className="text-lg font-semibold text-red-600">₹{payment.outstandingAmount}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Due Date</p>
                                <p className="text-sm">{payment.dueDate}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Payment Method</p>
                                <p className="text-sm">{payment.paymentMethod}</p>
                              </div>
                            </div>

                            {payment.purpose && (
                              <div className="mt-4">
                                <p className="text-sm font-medium text-gray-500">Purpose</p>
                                <p className="text-sm">{payment.purpose}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>

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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
            <DialogDescription>Update vendor information</DialogDescription>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input defaultValue={selectedVendor.companyName} />
                </div>
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input defaultValue={selectedVendor.contactPersonName} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea defaultValue={selectedVendor.address} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={selectedVendor.contactPersonEmail} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue={selectedVendor.contactPersonNumber} />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditVendorDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setEditVendorDialog(false)
                    setSuccessMessage("Vendor updated successfully!")
                    setShowSuccessMessage(true)
                    setTimeout(() => setShowSuccessMessage(false), 3000)
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Payment Dialog */}
      <Dialog open={editPaymentDialog} onOpenChange={setEditPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
            <DialogDescription>Update payment information</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Purchase Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <Input defaultValue={selectedPayment.purchaseAmount} className="pl-8 bg-gray-50" readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Paid Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <Input defaultValue={selectedPayment.paidAmount} className="pl-8 bg-gray-50" readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Outstanding Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <Input defaultValue={selectedPayment.outstandingAmount} className="pl-8 bg-gray-50" readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" defaultValue={selectedPayment.dueDate} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue={selectedPayment.status}>
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
              <div className="space-y-2">
                <Label>Purpose</Label>
                <Textarea defaultValue={selectedPayment.purpose} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditPaymentDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setEditPaymentDialog(false)
                    setSuccessMessage("Payment updated successfully!")
                    setShowSuccessMessage(true)
                    setTimeout(() => setShowSuccessMessage(false), 3000)
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
