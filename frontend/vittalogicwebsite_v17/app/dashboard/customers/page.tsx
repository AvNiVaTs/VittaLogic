"use client"

import { ArrowLeft, Users, CreditCard, Info, Plus, Save, Search, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock logged-in user
const LOGGED_IN_EMPLOYEE_ID = "EMP001"

// Mock existing customers with payments
const mockCustomers = [
  {
    id: "CUST_1703123456789",
    companyName: "Tech Solutions Ltd",
    address: "123 Business Park, Mumbai, MH 400001",
    email: "contact@techsolutions.com",
    types: ["Technology", "B2B"],
    contactPerson: {
      name: "Rajesh Kumar",
      email: "rajesh@techsolutions.com",
      number: "+91-9876543210",
    },
    location: "indian",
    createdBy: "EMP001",
    createdAt: "2024-01-15",
    indianDetails: {
      industry: "Information Technology",
      billingAddress: "123 Business Park, Mumbai, MH 400001",
      state: "Maharashtra",
      receiverName: "Rajesh Kumar",
      receiverContact: "+91-9876543210",
      shippingAddresses: ["123 Business Park, Mumbai", "456 Tech Center, Pune"],
      segment: "premium",
      shippingMethod: "road",
      bankAccount: "1234567890",
      bankName: "HDFC Bank",
      bankBranch: "Mumbai Central",
      ifscCode: "HDFC0001234",
      accountHolder: "Tech Solutions Ltd",
      gstin: "27ABCDE1234F1Z5",
      panNumber: "ABCDE1234F",
    },
    payments: [
      {
        paymentId: "PAY_1703123456790",
        createdBy: "EMP001",
        amount: 50000,
        purpose: "Software License Payment",
        dueDate: "2024-02-15",
        status: "pending",
        creditLimit: 100000,
        creditDays: 30,
        outstandingAmount: 75000,
        receivablesAging: "0-30",
        currency: "INR",
        exchangeRate: 1,
        paymentCreationDate: "2024-01-15T10:30:00Z",
      },
    ],
  },
  {
    id: "CUST_1703123456791",
    companyName: "Global Manufacturing Inc",
    address: "456 Industrial Zone, New York, NY 10001",
    email: "info@globalmanufacturing.com",
    types: ["Manufacturing", "B2B", "Enterprise"],
    contactPerson: {
      name: "John Smith",
      email: "john@globalmanufacturing.com",
      number: "+1-555-123-4567",
    },
    location: "international",
    createdBy: "EMP002",
    createdAt: "2024-01-20",
    internationalDetails: {
      billingAddress: "456 Industrial Zone, New York, NY 10001",
      industry: "Manufacturing",
      tinVatEin: "US123456789",
      receiverName: "John Smith",
      receiverContact: "+1-555-123-4567",
      shippingAddresses: ["456 Industrial Zone, New York", "789 Warehouse District, Chicago"],
      priority: "high",
      shippingMethod: "air",
      currency: "USD",
      taxProfile: "VAT",
      country: "United States",
      bankName: "Chase Bank",
      ibanAccount: "US1234567890123456",
      swiftBic: "CHASUS33",
      bankAddress: "123 Wall Street, New York, NY",
      beneficiaryName: "Global Manufacturing Inc",
      iec: "IEC1234567890",
    },
    payments: [
      {
        paymentId: "PAY_1703123456792",
        createdBy: "EMP002",
        amount: 25000,
        purpose: "Equipment Purchase",
        dueDate: "2024-03-01",
        status: "completed",
        creditLimit: 200000,
        creditDays: 45,
        outstandingAmount: 150000,
        receivablesAging: "31-60",
        currency: "USD",
        exchangeRate: 83.25,
        paymentCreationDate: "2024-01-20T14:15:00Z",
      },
    ],
  },
]

export default function CustomersPage() {
  const [activeSection, setActiveSection] = useState("add-customer")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [customers, setCustomers] = useState(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingPayment, setEditingPayment] = useState(null)
  const [editDialogStates, setEditDialogStates] = useState({})
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all")
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [customerEditDialogStates, setCustomerEditDialogStates] = useState({})

  // Customer Entry Form State
  const [customerId, setCustomerId] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [address, setAddress] = useState("")
  const [email, setEmail] = useState("")
  const [customerTypes, setCustomerTypes] = useState([])
  const [contactPersonName, setContactPersonName] = useState("")
  const [contactPersonEmail, setContactPersonEmail] = useState("")
  const [contactPersonNumber, setContactPersonNumber] = useState("")
  const [customerLocation, setCustomerLocation] = useState("indian")

  // Indian Customer Details
  const [industry, setIndustry] = useState("")
  const [billingAddress, setBillingAddress] = useState("")
  const [state, setState] = useState("")
  const [receiverName, setReceiverName] = useState("")
  const [receiverContact, setReceiverContact] = useState("")
  const [shippingAddresses, setShippingAddresses] = useState([""])
  const [segment, setSegment] = useState("")
  const [shippingMethod, setShippingMethod] = useState("")
  const [bankAccount, setBankAccount] = useState("")
  const [bankName, setBankName] = useState("")
  const [bankBranch, setBankBranch] = useState("")
  const [ifscCode, setIfscCode] = useState("")
  const [accountHolder, setAccountHolder] = useState("")
  const [gstin, setGstin] = useState("")
  const [panNumber, setPanNumber] = useState("")

  // International Customer Details
  const [intlBillingAddress, setIntlBillingAddress] = useState("")
  const [intlIndustry, setIntlIndustry] = useState("")
  const [tinVatEin, setTinVatEin] = useState("")
  const [intlReceiverName, setIntlReceiverName] = useState("")
  const [intlReceiverContact, setIntlReceiverContact] = useState("")
  const [intlShippingAddresses, setIntlShippingAddresses] = useState([""])
  const [priority, setPriority] = useState("")
  const [intlShippingMethod, setIntlShippingMethod] = useState("")
  const [currency, setCurrency] = useState("")
  const [taxProfile, setTaxProfile] = useState("")
  const [country, setCountry] = useState("")
  const [intlBankName, setIntlBankName] = useState("")
  const [ibanAccount, setIbanAccount] = useState("")
  const [swiftBic, setSwiftBic] = useState("")
  const [intlBankAddress, setIntlBankAddress] = useState("")
  const [beneficiaryName, setBeneficiaryName] = useState("")
  const [iec, setIec] = useState("")

  // Customer Payment Form State
  const [paymentId, setPaymentId] = useState("")
  const [paymentCustomerId, setPaymentCustomerId] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [purpose, setPurpose] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("")
  const [creditLimit, setCreditLimit] = useState("")
  const [creditDays, setCreditDays] = useState("")
  const [outstandingAmount, setOutstandingAmount] = useState("")
  const [receivablesAging, setReceivablesAging] = useState("")
  const [paymentCurrency, setPaymentCurrency] = useState("INR")
  const [exchangeRate, setExchangeRate] = useState("")
  const [paymentCreationDate, setPaymentCreationDate] = useState("")

  // Available options
  const availableCustomerTypes = [
    "Technology",
    "Manufacturing",
    "Retail",
    "Healthcare",
    "Finance",
    "Education",
    "B2B",
    "B2C",
    "Enterprise",
    "SME",
  ]
  const segments = ["premium", "regular", "one-time"]
  const priorities = ["low", "medium", "high"]
  const shippingMethods = {
    indian: ["road", "rail", "air"],
    international: ["road", "rail", "air", "ship"],
  }
  const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR"]
  const taxProfiles = ["VAT", "Sales Tax"]
  const paymentStatuses = ["pending", "completed", "overdue", "cancelled", "processing"]
  const agingCategories = ["0-30", "31-60", "61-90", "90+"]

  // Generate unique ID based on timestamp
  const generateTimestampId = (prefix) => {
    return `${prefix}_${Date.now()}`
  }

  // Generate IDs when component mounts or when creating new entries
  useEffect(() => {
    setCustomerId(generateTimestampId("CUST"))
    setPaymentId(generateTimestampId("PAY"))
    setPaymentCreationDate(new Date().toISOString())
  }, [activeSection])

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get all payments from all customers
  const allPayments = customers.flatMap((customer) =>
    customer.payments.map((payment) => ({
      ...payment,
      customerName: customer.companyName,
      customerId: customer.id,
    })),
  )

  const filteredPayments = allPayments.filter((payment) => {
    const matchesSearch =
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = paymentStatusFilter === "all" || payment.status === paymentStatusFilter
    return matchesSearch && matchesStatus
  })

  const handleCustomerSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    const newCustomer = {
      id: customerId,
      companyName,
      address,
      email,
      types: customerTypes,
      contactPerson: {
        name: contactPersonName,
        email: contactPersonEmail,
        number: contactPersonNumber,
      },
      location: customerLocation,
      createdBy: LOGGED_IN_EMPLOYEE_ID,
      createdAt: new Date().toISOString().split("T")[0],
      payments: [],
      ...(customerLocation === "indian"
        ? {
            indianDetails: {
              industry,
              billingAddress,
              state,
              receiverName,
              receiverContact,
              shippingAddresses: shippingAddresses.filter((addr) => addr.trim() !== ""),
              segment,
              shippingMethod,
              bankAccount,
              bankName,
              bankBranch,
              ifscCode,
              accountHolder,
              gstin,
              panNumber,
            },
          }
        : {
            internationalDetails: {
              billingAddress: intlBillingAddress,
              industry: intlIndustry,
              tinVatEin,
              receiverName: intlReceiverName,
              receiverContact: intlReceiverContact,
              shippingAddresses: intlShippingAddresses.filter((addr) => addr.trim() !== ""),
              priority,
              shippingMethod: intlShippingMethod,
              currency,
              taxProfile,
              country,
              bankName: intlBankName,
              ibanAccount,
              swiftBic,
              bankAddress: intlBankAddress,
              beneficiaryName,
              iec,
            },
          }),
    }

    // Simulate API call
    setTimeout(() => {
      setCustomers((prev) => [...prev, newCustomer])
      setSubmitMessage("Customer created successfully!")

      // Reset form
      resetCustomerForm()
      setIsSubmitting(false)

      // Clear message after 3 seconds
      setTimeout(() => setSubmitMessage(""), 3000)
    }, 1000)
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    const newPayment = {
      paymentId,
      createdBy: LOGGED_IN_EMPLOYEE_ID,
      amount: Number.parseFloat(paymentAmount),
      purpose,
      dueDate,
      status: paymentStatus,
      creditLimit: Number.parseFloat(creditLimit),
      creditDays: Number.parseInt(creditDays),
      outstandingAmount: Number.parseFloat(outstandingAmount),
      receivablesAging,
      currency: paymentCurrency,
      exchangeRate: Number.parseFloat(exchangeRate),
      paymentCreationDate,
    }

    // Simulate API call
    setTimeout(() => {
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === paymentCustomerId ? { ...customer, payments: [...customer.payments, newPayment] } : customer,
        ),
      )

      setSubmitMessage("Customer payment created successfully!")

      // Reset form
      resetPaymentForm()
      setIsSubmitting(false)

      // Clear message after 3 seconds
      setTimeout(() => setSubmitMessage(""), 3000)
    }, 1000)
  }

  const resetCustomerForm = () => {
    setCustomerId(generateTimestampId("CUST"))
    setCompanyName("")
    setAddress("")
    setEmail("")
    setCustomerTypes([])
    setContactPersonName("")
    setContactPersonEmail("")
    setContactPersonNumber("")
    setCustomerLocation("indian")

    // Reset Indian details
    setIndustry("")
    setBillingAddress("")
    setState("")
    setReceiverName("")
    setReceiverContact("")
    setShippingAddresses([""])
    setSegment("")
    setShippingMethod("")
    setBankAccount("")
    setBankName("")
    setBankBranch("")
    setIfscCode("")
    setAccountHolder("")
    setGstin("")
    setPanNumber("")

    // Reset International details
    setIntlBillingAddress("")
    setIntlIndustry("")
    setTinVatEin("")
    setIntlReceiverName("")
    setIntlReceiverContact("")
    setIntlShippingAddresses([""])
    setPriority("")
    setIntlShippingMethod("")
    setCurrency("")
    setTaxProfile("")
    setCountry("")
    setIntlBankName("")
    setIbanAccount("")
    setSwiftBic("")
    setIntlBankAddress("")
    setBeneficiaryName("")
    setIec("")
  }

  const resetPaymentForm = () => {
    setPaymentId(generateTimestampId("PAY"))
    setPaymentCustomerId("")
    setPaymentAmount("")
    setPurpose("")
    setDueDate("")
    setPaymentStatus("")
    setCreditLimit("")
    setCreditDays("")
    setOutstandingAmount("")
    setReceivablesAging("")
    setPaymentCurrency("INR")
    setExchangeRate("")
    setPaymentCreationDate(new Date().toISOString())
  }

  const handleDeleteCustomer = (customerId) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== customerId))
    setSubmitMessage("Customer deleted successfully!")
    setTimeout(() => setSubmitMessage(""), 3000)
  }

  const handleEditPayment = (customerId, paymentId, updatedPayment) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === customerId
          ? {
              ...customer,
              payments: customer.payments.map((payment) =>
                payment.paymentId === paymentId ? { ...payment, ...updatedPayment } : payment,
              ),
            }
          : customer,
      ),
    )
    setEditingPayment(null)
    setSubmitMessage("Payment updated successfully!")
    setTimeout(() => setSubmitMessage(""), 3000)
  }

  const handleEditCustomer = (customerId, updatedCustomer) => {
    setCustomers((prev) =>
      prev.map((customer) => (customer.id === customerId ? { ...customer, ...updatedCustomer } : customer)),
    )
    setEditingCustomer(null)
    setSubmitMessage("Customer updated successfully!")
    setTimeout(() => setSubmitMessage(""), 3000)
  }

  const addShippingAddress = (isInternational = false) => {
    if (isInternational) {
      setIntlShippingAddresses([...intlShippingAddresses, ""])
    } else {
      setShippingAddresses([...shippingAddresses, ""])
    }
  }

  const removeShippingAddress = (index, isInternational = false) => {
    if (isInternational) {
      const newAddresses = intlShippingAddresses.filter((_, i) => i !== index)
      setIntlShippingAddresses(newAddresses.length > 0 ? newAddresses : [""])
    } else {
      const newAddresses = shippingAddresses.filter((_, i) => i !== index)
      setShippingAddresses(newAddresses.length > 0 ? newAddresses : [""])
    }
  }

  const updateShippingAddress = (index, value, isInternational = false) => {
    if (isInternational) {
      const newAddresses = [...intlShippingAddresses]
      newAddresses[index] = value
      setIntlShippingAddresses(newAddresses)
    } else {
      const newAddresses = [...shippingAddresses]
      newAddresses[index] = value
      setShippingAddresses(newAddresses)
    }
  }

  const handleCustomerTypeChange = (type, checked) => {
    if (checked) {
      setCustomerTypes([...customerTypes, type])
    } else {
      setCustomerTypes(customerTypes.filter((t) => t !== type))
    }
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
              <p className="text-gray-600">Manage customers and payment records</p>
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
                <CardTitle className="text-lg">Customer Services</CardTitle>
                <CardDescription>Select a service to manage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeSection === "add-customer" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("add-customer")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
                <Button
                  variant={activeSection === "customer-list" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("customer-list")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Customer List
                </Button>
                <Button
                  variant={activeSection === "customer-payment" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("customer-payment")}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Customer Payment
                </Button>
                <Button
                  variant={activeSection === "customer-payment-list" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("customer-payment-list")}
                >
                  <Info className="h-4 w-4 mr-2" />
                  Customer Payment List
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {submitMessage && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{submitMessage}</AlertDescription>
              </Alert>
            )}

            {activeSection === "add-customer" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Add Customer
                  </CardTitle>
                  <CardDescription>Create a new customer in your organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCustomerSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="customerId">Customer ID *</Label>
                      <Input id="customerId" value={customerId} readOnly className="bg-gray-50" />
                      <p className="text-xs text-gray-500">
                        Customer ID is auto-generated based on timestamp and is unique.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter company name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter company address"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Company Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter company email"
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Customer Types *</Label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {availableCustomerTypes.map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={type}
                              checked={customerTypes.includes(type)}
                              onCheckedChange={(checked) => handleCustomerTypeChange(type, checked)}
                            />
                            <Label htmlFor={type} className="text-sm">
                              {type}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Person Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        Contact Person Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                          <Input
                            id="contactPersonName"
                            value={contactPersonName}
                            onChange={(e) => setContactPersonName(e.target.value)}
                            placeholder="Enter contact person name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPersonEmail">Contact Person Email *</Label>
                          <Input
                            id="contactPersonEmail"
                            type="email"
                            value={contactPersonEmail}
                            onChange={(e) => setContactPersonEmail(e.target.value)}
                            placeholder="Enter contact person email"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPersonNumber">Contact Person Number *</Label>
                          <Input
                            id="contactPersonNumber"
                            value={contactPersonNumber}
                            onChange={(e) => setContactPersonNumber(e.target.value)}
                            placeholder="Enter contact person number"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerLocation">Customer Location *</Label>
                      <Select value={customerLocation} onValueChange={setCustomerLocation} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="indian">Indian</SelectItem>
                          <SelectItem value="international">International</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Conditional Fields Based on Location */}
                    {customerLocation === "indian" ? (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                          Indian Customer Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="industry">Industry/Sector</Label>
                            <Input
                              id="industry"
                              value={industry}
                              onChange={(e) => setIndustry(e.target.value)}
                              placeholder="Enter industry/sector"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State/Province/Region</Label>
                            <Input
                              id="state"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              placeholder="Enter state/province/region"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="billingAddress">Billing Address</Label>
                            <Textarea
                              id="billingAddress"
                              value={billingAddress}
                              onChange={(e) => setBillingAddress(e.target.value)}
                              placeholder="Enter billing address"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="receiverName">Receiver Name</Label>
                            <Input
                              id="receiverName"
                              value={receiverName}
                              onChange={(e) => setReceiverName(e.target.value)}
                              placeholder="Enter receiver name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="receiverContact">Receiver Contact No.</Label>
                            <Input
                              id="receiverContact"
                              value={receiverContact}
                              onChange={(e) => setReceiverContact(e.target.value)}
                              placeholder="Enter receiver contact number"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="segment">Customer Segment</Label>
                            <Select value={segment} onValueChange={setSegment}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select customer segment" />
                              </SelectTrigger>
                              <SelectContent>
                                {segments.map((seg) => (
                                  <SelectItem key={seg} value={seg}>
                                    {seg.charAt(0).toUpperCase() + seg.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="shippingMethod">Preferred Shipping Method</Label>
                            <Select value={shippingMethod} onValueChange={setShippingMethod}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select shipping method" />
                              </SelectTrigger>
                              <SelectContent>
                                {shippingMethods.indian.map((method) => (
                                  <SelectItem key={method} value={method}>
                                    {method.charAt(0).toUpperCase() + method.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Shipping Addresses */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Shipping Addresses</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addShippingAddress(false)}
                              className="flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add Address
                            </Button>
                          </div>
                          {shippingAddresses.map((address, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={address}
                                onChange={(e) => updateShippingAddress(index, e.target.value, false)}
                                placeholder={`Shipping address ${index + 1}`}
                              />
                              {shippingAddresses.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeShippingAddress(index, false)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Bank Details */}
                        <div className="space-y-4">
                          <h4 className="text-md font-semibold text-gray-800">Bank Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="bankAccount">Bank Account Number</Label>
                              <Input
                                id="bankAccount"
                                value={bankAccount}
                                onChange={(e) => setBankAccount(e.target.value)}
                                placeholder="Enter bank account number"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="bankName">Bank Name</Label>
                              <Input
                                id="bankName"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                placeholder="Enter bank name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="bankBranch">Bank Branch</Label>
                              <Input
                                id="bankBranch"
                                value={bankBranch}
                                onChange={(e) => setBankBranch(e.target.value)}
                                placeholder="Enter bank branch"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="ifscCode">IFSC Code</Label>
                              <Input
                                id="ifscCode"
                                value={ifscCode}
                                onChange={(e) => setIfscCode(e.target.value)}
                                placeholder="Enter IFSC code"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="accountHolder">Account Holder Name (Optional)</Label>
                              <Input
                                id="accountHolder"
                                value={accountHolder}
                                onChange={(e) => setAccountHolder(e.target.value)}
                                placeholder="Enter account holder name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gstin">GSTIN (Optional)</Label>
                              <Input
                                id="gstin"
                                value={gstin}
                                onChange={(e) => setGstin(e.target.value)}
                                placeholder="Enter GSTIN"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="panNumber">PAN Number (Optional)</Label>
                              <Input
                                id="panNumber"
                                value={panNumber}
                                onChange={(e) => setPanNumber(e.target.value)}
                                placeholder="Enter PAN number"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                          International Customer Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="intlBillingAddress">Billing Address</Label>
                            <Textarea
                              id="intlBillingAddress"
                              value={intlBillingAddress}
                              onChange={(e) => setIntlBillingAddress(e.target.value)}
                              placeholder="Enter billing address"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="intlIndustry">Industry/Sector</Label>
                            <Input
                              id="intlIndustry"
                              value={intlIndustry}
                              onChange={(e) => setIntlIndustry(e.target.value)}
                              placeholder="Enter industry/sector"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tinVatEin">TIN/VAT/EIN/Company Reg No.</Label>
                            <Input
                              id="tinVatEin"
                              value={tinVatEin}
                              onChange={(e) => setTinVatEin(e.target.value)}
                              placeholder="Enter TIN/VAT/EIN/Company registration number"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="intlReceiverName">Receiver Name</Label>
                            <Input
                              id="intlReceiverName"
                              value={intlReceiverName}
                              onChange={(e) => setIntlReceiverName(e.target.value)}
                              placeholder="Enter receiver name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="intlReceiverContact">Receiver Contact No.</Label>
                            <Input
                              id="intlReceiverContact"
                              value={intlReceiverContact}
                              onChange={(e) => setIntlReceiverContact(e.target.value)}
                              placeholder="Enter receiver contact number"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="priority">Customer Priority</Label>
                            <Select value={priority} onValueChange={setPriority}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select customer priority" />
                              </SelectTrigger>
                              <SelectContent>
                                {priorities.map((pri) => (
                                  <SelectItem key={pri} value={pri}>
                                    {pri.charAt(0).toUpperCase() + pri.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="intlShippingMethod">Preferred Shipping Method</Label>
                            <Select value={intlShippingMethod} onValueChange={setIntlShippingMethod}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select shipping method" />
                              </SelectTrigger>
                              <SelectContent>
                                {shippingMethods.international.map((method) => (
                                  <SelectItem key={method} value={method}>
                                    {method.charAt(0).toUpperCase() + method.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="currency">Default Currency</Label>
                            <Select value={currency} onValueChange={setCurrency}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select default currency" />
                              </SelectTrigger>
                              <SelectContent>
                                {currencies.map((curr) => (
                                  <SelectItem key={curr} value={curr}>
                                    {curr}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="taxProfile">Applicable Tax Profile</Label>
                            <Select value={taxProfile} onValueChange={setTaxProfile}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tax profile" />
                              </SelectTrigger>
                              <SelectContent>
                                {taxProfiles.map((profile) => (
                                  <SelectItem key={profile} value={profile}>
                                    {profile}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* International Shipping Addresses */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Shipping Addresses</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addShippingAddress(true)}
                              className="flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add Address
                            </Button>
                          </div>
                          {intlShippingAddresses.map((address, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={address}
                                onChange={(e) => updateShippingAddress(index, e.target.value, true)}
                                placeholder={`Shipping address ${index + 1}`}
                              />
                              {intlShippingAddresses.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeShippingAddress(index, true)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* International Bank Details */}
                        <div className="space-y-4">
                          <h4 className="text-md font-semibold text-gray-800">Bank Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="country">Country Name</Label>
                              <Input
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder="Enter country name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="intlBankName">Bank Name</Label>
                              <Input
                                id="intlBankName"
                                value={intlBankName}
                                onChange={(e) => setIntlBankName(e.target.value)}
                                placeholder="Enter bank name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="ibanAccount">IBAN/Bank Account Number</Label>
                              <Input
                                id="ibanAccount"
                                value={ibanAccount}
                                onChange={(e) => setIbanAccount(e.target.value)}
                                placeholder="Enter IBAN or bank account number"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="swiftBic">SWIFT/BIC Code</Label>
                              <Input
                                id="swiftBic"
                                value={swiftBic}
                                onChange={(e) => setSwiftBic(e.target.value)}
                                placeholder="Enter SWIFT/BIC code"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="intlBankAddress">Bank Address</Label>
                              <Textarea
                                id="intlBankAddress"
                                value={intlBankAddress}
                                onChange={(e) => setIntlBankAddress(e.target.value)}
                                placeholder="Enter bank address"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
                              <Input
                                id="beneficiaryName"
                                value={beneficiaryName}
                                onChange={(e) => setBeneficiaryName(e.target.value)}
                                placeholder="Enter beneficiary name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="iec">Importer Exporter Code (IEC)</Label>
                              <Input
                                id="iec"
                                value={iec}
                                onChange={(e) => setIec(e.target.value)}
                                placeholder="Enter IEC code"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="createdBy">Created By *</Label>
                      <Input id="createdBy" value={LOGGED_IN_EMPLOYEE_ID} readOnly className="bg-gray-50" />
                      <p className="text-xs text-gray-500">Automatically filled with your employee ID.</p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Creating Customer..."
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Customer
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeSection === "customer-payment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                    Customer Payment
                  </CardTitle>
                  <CardDescription>Create payment records for customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="paymentId">Payment ID *</Label>
                      <Input id="paymentId" value={paymentId} readOnly className="bg-gray-50" />
                      <p className="text-xs text-gray-500">
                        Payment ID is auto-generated based on timestamp and is unique.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentCreatedBy">Created By *</Label>
                      <Input id="paymentCreatedBy" value={LOGGED_IN_EMPLOYEE_ID} readOnly className="bg-gray-50" />
                      <p className="text-xs text-gray-500">Automatically filled with your employee ID.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentCustomerId">Customer ID *</Label>
                      <Select value={paymentCustomerId} onValueChange={setPaymentCustomerId} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.id} - {customer.companyName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Select the customer for which you're creating the payment record.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentAmount">Payment Amount *</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <Input
                          id="paymentAmount"
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          placeholder="0.00"
                          className="pl-8"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose (Optional)</Label>
                      <Input
                        id="purpose"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="Enter payment purpose"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date *</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentStatus">Status *</Label>
                      <Select value={paymentStatus} onValueChange={setPaymentStatus} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="creditLimit">Credit Limit</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <Input
                            id="creditLimit"
                            type="number"
                            value={creditLimit}
                            onChange={(e) => setCreditLimit(e.target.value)}
                            placeholder="0.00"
                            className="pl-8"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="creditDays">Credit Days</Label>
                        <Input
                          id="creditDays"
                          type="number"
                          value={creditDays}
                          onChange={(e) => setCreditDays(e.target.value)}
                          placeholder="Enter credit days"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="outstandingAmount">Outstanding Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <Input
                          id="outstandingAmount"
                          type="number"
                          value={outstandingAmount}
                          onChange={(e) => setOutstandingAmount(e.target.value)}
                          placeholder="0.00"
                          className="pl-8"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="receivablesAging">Receivables Aging</Label>
                      <Select value={receivablesAging} onValueChange={setReceivablesAging}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select aging category" />
                        </SelectTrigger>
                        <SelectContent>
                          {agingCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category} days
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentCurrency">Currency</Label>
                        <Select value={paymentCurrency} onValueChange={setPaymentCurrency}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((curr) => (
                              <SelectItem key={curr} value={curr}>
                                {curr}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exchangeRate">Exchange Rate (vs INR)</Label>
                        <Input
                          id="exchangeRate"
                          type="number"
                          value={exchangeRate}
                          onChange={(e) => setExchangeRate(e.target.value)}
                          placeholder="1.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentCreationDate">Payment Creation Date *</Label>
                      <Input
                        id="paymentCreationDate"
                        type="datetime-local"
                        value={paymentCreationDate.slice(0, 16)}
                        readOnly
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">Automatically set to current timestamp.</p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Creating Payment..."
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Create Payment Record
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeSection === "customer-list" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Customer List
                  </CardTitle>
                  <CardDescription>View and manage existing customers</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Search Bar */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search customers by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Customer Cards */}
                  <div className="space-y-4">
                    {filteredCustomers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {searchTerm ? "No customers found matching your search." : "No customers created yet."}
                      </div>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <Card key={customer.id} className="border-l-4 border-l-blue-500">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <CardTitle className="text-lg">{customer.companyName}</CardTitle>
                                <CardDescription className="mt-1">
                                  ID: {customer.id} | Created by: {customer.createdBy} | Date: {customer.createdAt}
                                </CardDescription>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant={customer.location === "indian" ? "default" : "secondary"}>
                                    {customer.location === "indian" ? "Indian" : "International"}
                                  </Badge>
                                  {customer.types.map((type) => (
                                    <Badge key={type} variant="outline" className="text-xs">
                                      {type}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="mt-3 text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-2">
                                  <p>
                                    <strong>Email:</strong> {customer.email}
                                  </p>
                                  <p>
                                    <strong>Contact:</strong> {customer.contactPerson.name}
                                  </p>
                                  <p>
                                    <strong>Contact Email:</strong> {customer.contactPerson.email}
                                  </p>
                                  <p>
                                    <strong>Contact Number:</strong> {customer.contactPerson.number}
                                  </p>
                                  <p className="md:col-span-2">
                                    <strong>Address:</strong> {customer.address}
                                  </p>
                                  {customer.location === "indian" && customer.indianDetails && (
                                    <>
                                      <p>
                                        <strong>Industry:</strong> {customer.indianDetails.industry}
                                      </p>
                                      <p>
                                        <strong>State:</strong> {customer.indianDetails.state}
                                      </p>
                                      <p>
                                        <strong>Segment:</strong> {customer.indianDetails.segment}
                                      </p>
                                      <p>
                                        <strong>Shipping Method:</strong> {customer.indianDetails.shippingMethod}
                                      </p>
                                      {customer.indianDetails.gstin && (
                                        <p>
                                          <strong>GSTIN:</strong> {customer.indianDetails.gstin}
                                        </p>
                                      )}
                                      {customer.indianDetails.panNumber && (
                                        <p>
                                          <strong>PAN:</strong> {customer.indianDetails.panNumber}
                                        </p>
                                      )}
                                    </>
                                  )}
                                  {customer.location === "international" && customer.internationalDetails && (
                                    <>
                                      <p>
                                        <strong>Industry:</strong> {customer.internationalDetails.industry}
                                      </p>
                                      <p>
                                        <strong>Country:</strong> {customer.internationalDetails.country}
                                      </p>
                                      <p>
                                        <strong>Priority:</strong> {customer.internationalDetails.priority}
                                      </p>
                                      <p>
                                        <strong>Currency:</strong> {customer.internationalDetails.currency}
                                      </p>
                                      <p>
                                        <strong>Tax Profile:</strong> {customer.internationalDetails.taxProfile}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Dialog
                                  open={customerEditDialogStates[customer.id] || false}
                                  onOpenChange={(open) => {
                                    setCustomerEditDialogStates((prev) => ({
                                      ...prev,
                                      [customer.id]: open,
                                    }))
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={() => setEditingCustomer(customer)}>
                                      <Edit className="h-4 w-4 mr-1" />
                                      Edit
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Edit Customer</DialogTitle>
                                      <DialogDescription>
                                        Update customer information for {customer.companyName}
                                      </DialogDescription>
                                    </DialogHeader>
                                    {editingCustomer && (
                                      <CustomerEditForm
                                        customer={editingCustomer}
                                        onSave={(updatedCustomer) => {
                                          handleEditCustomer(customer.id, updatedCustomer)
                                          setCustomerEditDialogStates((prev) => ({
                                            ...prev,
                                            [customer.id]: false,
                                          }))
                                        }}
                                        onCancel={() => {
                                          setCustomerEditDialogStates((prev) => ({
                                            ...prev,
                                            [customer.id]: false,
                                          }))
                                        }}
                                      />
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteCustomer(customer.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-gray-600">
                              <p>
                                <strong>Payment Records:</strong> {customer.payments.length} payment
                                {customer.payments.length !== 1 ? "s" : ""}
                              </p>
                              {customer.payments.length > 0 && (
                                <div className="mt-2">
                                  <p>
                                    <strong>Total Outstanding:</strong> ₹
                                    {customer.payments
                                      .reduce((sum, payment) => sum + payment.outstandingAmount, 0)
                                      .toLocaleString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "customer-payment-list" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                    Customer Payment List
                  </CardTitle>
                  <CardDescription>View and manage all customer payment records</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Search and Filter Bar */}
                  <div className="mb-6 space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search payments by customer name, payment ID, or customer ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Label htmlFor="paymentStatusFilter" className="text-sm font-medium text-gray-700">
                        Filter by Status:
                      </Label>
                      <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          {paymentStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Badge variant="outline" className="ml-auto">
                        {filteredPayments.length} payment{filteredPayments.length !== 1 ? "s" : ""} found
                      </Badge>
                    </div>
                  </div>

                  {/* Payment Records */}
                  <div className="space-y-4">
                    {filteredPayments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {searchTerm || paymentStatusFilter !== "all"
                          ? "No payments found matching your criteria."
                          : "No payment records created yet."}
                      </div>
                    ) : (
                      filteredPayments.map((payment) => (
                        <Card key={payment.paymentId} className="border-l-4 border-l-green-500">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <CardTitle className="text-lg">Payment ID: {payment.paymentId}</CardTitle>
                                <CardDescription className="mt-1">
                                  Customer: {payment.customerName} ({payment.customerId}) | Created by:{" "}
                                  {payment.createdBy}
                                </CardDescription>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge
                                    variant={
                                      payment.status === "completed"
                                        ? "default"
                                        : payment.status === "pending"
                                          ? "secondary"
                                          : payment.status === "overdue"
                                            ? "destructive"
                                            : "outline"
                                    }
                                  >
                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                  </Badge>
                                  <Badge variant="outline">{payment.currency}</Badge>
                                  <Badge variant="outline">{payment.receivablesAging} days aging</Badge>
                                </div>
                                <div className="mt-3 text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                  <p>
                                    <strong>Amount:</strong> {payment.currency} {payment.amount.toLocaleString()}
                                  </p>
                                  {payment.currency !== "INR" && (
                                    <p>
                                      <strong>INR Amount:</strong> ₹
                                      {(payment.amount * payment.exchangeRate).toLocaleString()}
                                    </p>
                                  )}
                                  <p>
                                    <strong>Due Date:</strong> {payment.dueDate}
                                  </p>
                                  <p>
                                    <strong>Credit Limit:</strong> ₹{payment.creditLimit.toLocaleString()}
                                  </p>
                                  <p>
                                    <strong>Credit Days:</strong> {payment.creditDays} days
                                  </p>
                                  <p>
                                    <strong>Outstanding:</strong> ₹{payment.outstandingAmount.toLocaleString()}
                                  </p>
                                  {payment.purpose && (
                                    <p className="md:col-span-2 lg:col-span-3">
                                      <strong>Purpose:</strong> {payment.purpose}
                                    </p>
                                  )}
                                  <p className="md:col-span-2 lg:col-span-3">
                                    <strong>Created:</strong> {new Date(payment.paymentCreationDate).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Dialog
                                  open={editDialogStates[payment.paymentId] || false}
                                  onOpenChange={(open) => {
                                    setEditDialogStates((prev) => ({
                                      ...prev,
                                      [payment.paymentId]: open,
                                    }))
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Edit className="h-4 w-4 mr-1" />
                                      Edit
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Edit Payment</DialogTitle>
                                      <DialogDescription>
                                        Update payment information for {payment.customerName}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <PaymentEditForm
                                      payment={payment}
                                      onSave={(updatedPayment) => {
                                        handleEditPayment(payment.customerId, payment.paymentId, updatedPayment)
                                        setEditDialogStates((prev) => ({
                                          ...prev,
                                          [payment.paymentId]: false,
                                        }))
                                      }}
                                      onCancel={() => {
                                        setEditDialogStates((prev) => ({
                                          ...prev,
                                          [payment.paymentId]: false,
                                        }))
                                      }}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    // Remove payment from customer
                                    setCustomers((prev) =>
                                      prev.map((customer) =>
                                        customer.id === payment.customerId
                                          ? {
                                              ...customer,
                                              payments: customer.payments.filter(
                                                (p) => p.paymentId !== payment.paymentId,
                                              ),
                                            }
                                          : customer,
                                      ),
                                    )
                                    setSubmitMessage("Payment deleted successfully!")
                                    setTimeout(() => setSubmitMessage(""), 3000)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Payment Edit Form Component
function PaymentEditForm({ payment, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    amount: payment.amount.toString(),
    purpose: payment.purpose || "",
    dueDate: payment.dueDate,
    status: payment.status,
    creditLimit: payment.creditLimit.toString(),
    creditDays: payment.creditDays.toString(),
    outstandingAmount: payment.outstandingAmount.toString(),
    receivablesAging: payment.receivablesAging,
    currency: payment.currency,
    exchangeRate: payment.exchangeRate.toString(),
  })

  const paymentStatuses = ["pending", "completed", "overdue", "cancelled", "processing"]
  const agingCategories = ["0-30", "31-60", "61-90", "90+"]
  const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR"]

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      amount: Number.parseFloat(formData.amount),
      creditLimit: Number.parseFloat(formData.creditLimit),
      creditDays: Number.parseInt(formData.creditDays),
      outstandingAmount: Number.parseFloat(formData.outstandingAmount),
      exchangeRate: Number.parseFloat(formData.exchangeRate),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="editAmount">Payment Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <Input
              id="editAmount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              className="pl-8"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="editStatus">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {paymentStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="editPurpose">Purpose</Label>
        <Input
          id="editPurpose"
          value={formData.purpose}
          onChange={(e) => setFormData((prev) => ({ ...prev, purpose: e.target.value }))}
          placeholder="Enter payment purpose"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="editDueDate">Due Date</Label>
        <Input
          id="editDueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="editCreditLimit">Credit Limit</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <Input
              id="editCreditLimit"
              type="number"
              value={formData.creditLimit}
              onChange={(e) => setFormData((prev) => ({ ...prev, creditLimit: e.target.value }))}
              className="pl-8"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="editCreditDays">Credit Days</Label>
          <Input
            id="editCreditDays"
            type="number"
            value={formData.creditDays}
            onChange={(e) => setFormData((prev) => ({ ...prev, creditDays: e.target.value }))}
            min="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="editOutstandingAmount">Outstanding Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
          <Input
            id="editOutstandingAmount"
            type="number"
            value={formData.outstandingAmount}
            onChange={(e) => setFormData((prev) => ({ ...prev, outstandingAmount: e.target.value }))}
            className="pl-8"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="editReceivablesAging">Receivables Aging</Label>
          <Select
            value={formData.receivablesAging}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, receivablesAging: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {agingCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category} days
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="editCurrency">Currency</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
          >
            <SelectTrigger>
              <SelectValue />
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="editExchangeRate">Exchange Rate (vs INR)</Label>
        <Input
          id="editExchangeRate"
          type="number"
          value={formData.exchangeRate}
          onChange={(e) => setFormData((prev) => ({ ...prev, exchangeRate: e.target.value }))}
          min="0"
          step="0.01"
        />
      </div>

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </DialogFooter>
    </form>
  )
}

// Customer Edit Form Component
function CustomerEditForm({ customer, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    companyName: customer.companyName,
    address: customer.address,
    email: customer.email,
    types: customer.types,
    contactPerson: customer.contactPerson,
    location: customer.location,
    ...(customer.location === "indian" && customer.indianDetails ? { indianDetails: customer.indianDetails } : {}),
    ...(customer.location === "international" && customer.internationalDetails
      ? { internationalDetails: customer.internationalDetails }
      : {}),
  })

  const availableCustomerTypes = [
    "Technology",
    "Manufacturing",
    "Retail",
    "Healthcare",
    "Finance",
    "Education",
    "B2B",
    "B2C",
    "Enterprise",
    "SME",
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleCustomerTypeChange = (type, checked) => {
    if (checked) {
      setFormData((prev) => ({ ...prev, types: [...prev.types, type] }))
    } else {
      setFormData((prev) => ({ ...prev, types: prev.types.filter((t) => t !== type) }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="editCompanyName">Company Name</Label>
          <Input
            id="editCompanyName"
            value={formData.companyName}
            onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="editEmail">Company Email</Label>
          <Input
            id="editEmail"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="editAddress">Address</Label>
        <Textarea
          id="editAddress"
          value={formData.address}
          onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
          rows={3}
          required
        />
      </div>

      <div className="space-y-4">
        <Label>Customer Types</Label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {availableCustomerTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`edit-${type}`}
                checked={formData.types.includes(type)}
                onCheckedChange={(checked) => handleCustomerTypeChange(type, checked)}
              />
              <Label htmlFor={`edit-${type}`} className="text-sm">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold">Contact Person Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="editContactName">Contact Name</Label>
            <Input
              id="editContactName"
              value={formData.contactPerson.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactPerson: { ...prev.contactPerson, name: e.target.value },
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editContactEmail">Contact Email</Label>
            <Input
              id="editContactEmail"
              type="email"
              value={formData.contactPerson.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactPerson: { ...prev.contactPerson, email: e.target.value },
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editContactNumber">Contact Number</Label>
            <Input
              id="editContactNumber"
              value={formData.contactPerson.number}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactPerson: { ...prev.contactPerson, number: e.target.value },
                }))
              }
              required
            />
          </div>
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </DialogFooter>
    </form>
  )
}
