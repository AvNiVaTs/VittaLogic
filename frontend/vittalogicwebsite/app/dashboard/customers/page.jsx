"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CreditCard, Edit, Info, Plus, Save, Search, Trash2, Users } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

// Authenticated employee ID
const employee = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("loggedInEmployee")) : null
const LOGGED_IN_EMPLOYEE_ID = employee?.employeeId || null

export default function CustomersPage() {
  const [activeSection, setActiveSection] = useState("add-customer")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [customers, setCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingPayment, setEditingPayment] = useState(null)
  const [editDialogStates, setEditDialogStates] = useState({})
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all")
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [customerEditDialogStates, setCustomerEditDialogStates] = useState({})
  const [customerPriorityFilter, setCustomerPriorityFilter] = useState("all")

  // Customer Entry Form State
  const [customerId, setCustomerId] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [address, setAddress] = useState("")
  const [email, setEmail] = useState("")
  const [customerTypes, setCustomerTypes] = useState([])
  const [contactPersonName, setContactPersonName] = useState("")
  const [contactPersonEmail, setContactPersonEmail] = useState("")
  const [contactPersonNumber, setContactPersonNumber] = useState("")
  const [customerLocation, setCustomerLocation] = useState("Indian")
  const [billingAddress, setBillingAddress] = useState("")
  const [receiverName, setReceiverName] = useState("")
  const [receiverContact, setReceiverContact] = useState("")
  const [shippingAddresses, setShippingAddresses] = useState([""])
  const [priority, setPriority] = useState("")

  // Indian Customer Details
  const [industry, setIndustry] = useState("")
  const [state, setState] = useState("")
  const [shippingMethod, setShippingMethod] = useState("")
  const [bankAccount, setBankAccount] = useState("")
  const [bankName, setBankName] = useState("")
  const [bankBranch, setBankBranch] = useState("")
  const [ifscCode, setIfscCode] = useState("")
  const [accountHolder, setAccountHolder] = useState("")
  const [gstin, setGstin] = useState("")
  const [panNumber, setPanNumber] = useState("")

  // International Customer Details

  const [intlIndustry, setIntlIndustry] = useState("")
  const [tinVatEin, setTinVatEin] = useState("")
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
  const [paymentAmountINR, setPaymentAmountINR] = useState("")
  const [purchaseAmount, setPurchaseAmount] = useState("")
  const [paidAmount, setPaidAmount] = useState("")
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
    "Others",
  ]
  const priorities = ["Low", "Medium", "High"]
  const shippingMethods = {
    Indian: [
  "Road", 
  "Rail", 
  "Air"],
  
    International: [
  "Road", 
  "Rail", 
  "Air", 
  "Ship"],
  }
  const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR"]
  const taxProfiles = ["VAT", "Sales Tax"]
  const paymentStatuses = ["pending", "completed", "overdue", "cancelled", "processing"]
  const agingCategories = ["0-30", "31-60", "61-90", "90+"]

  // Generate unique ID based on timestamp for UI purposes
  const generateTimestampId = (prefix) => {
    return `${prefix}_${Date.now()}`
  }

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers()
    setCustomerId(generateTimestampId("CUST"))
    setPaymentId(generateTimestampId("PAY"))
    setPaymentCreationDate(new Date().toISOString())
  }, [activeSection])

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/customer/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
      const data = await response.json()
      if (data.statusCode === 200) {
        setCustomers(data.data)
      } else {
        setSubmitMessage("Error fetching customers")
        setTimeout(() => setSubmitMessage(""), 3000)
      }
    } catch (error) {
      setSubmitMessage("Error fetching customers")
      setTimeout(() => setSubmitMessage(""), 3000)
    }
  }

  // Filter customers based on search term and priority
  const filteredCustomers = customers
    .filter(
      (customer) =>
        customer.company_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customer_Id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((customer) => {
      if (customerPriorityFilter === "all") return true
      return customer.customerPriority === customerPriorityFilter
    })

  // Get all payments
  const allPayments = customers.flatMap((customer) =>
    (customer.payments || []).map((payment) => ({
      ...payment,
      customerName: customer.company_Name,
      customerId: customer.customer_Id,
    })),
  )

  const filteredPayments = allPayments.filter((payment) => {
    const matchesSearch =
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer_payment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = paymentStatusFilter === "all" || payment.status === paymentStatusFilter
    return matchesSearch && matchesStatus
  })

const handleCustomerSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitMessage("");

  const customerData = {
    company_Name: companyName,
    address,
    company_Email: email,
    customer_Types: customerTypes,
    contact_Person: {
      name: contactPersonName,
      email: contactPersonEmail,
      number: contactPersonNumber,
    },
    customer_Location: customerLocation,
    industry_Sector: industry,
    billing_Address: billingAddress,
    receiver_Name: receiverName,
    receiver_ContactNo: receiverContact,
    shipping_Addresses: shippingAddresses
      .map((addr) => addr.address?.trim())
      .filter((addr) => addr !== ""),
    customerPriority: priority,
    createdBy: LOGGED_IN_EMPLOYEE_ID,
    updatedBy: LOGGED_IN_EMPLOYEE_ID,
    ...(customerLocation === "Indian"
      ? {
        indianDetails: {
          industry_Sector: industry,
          stateProvince: state,
          preferred_Shipping_Method: shippingMethod,
          bank_AccountNumber: bankAccount,
          bank_Name: bankName,
          bank_Branch: bankBranch,
          ifsc_Code: ifscCode,
          account_HolderName: accountHolder,
          gstin,
          panNumber,
      },
    }
      : {
          internationalDetails: {
            industry_Sector: intlIndustry,
            tinVatEin,
            shippingMethod: intlShippingMethod,
            defaultCurrency: currency,
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
  };

  try {
    const response = await fetch("http://localhost:8000/api/v1/customer/registerCustomer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("employeeToken")}`,
      },
      credentials: "include",
      body: JSON.stringify(customerData),
    });
    const data = await response.json();
    if (data.statusCode === 200) {
      setCustomers((prev) => [...prev, data.data]);
      setSubmitMessage("Customer created successfully!");
      resetCustomerForm();
    } else {
      setSubmitMessage(data.message || "Error creating customer");
    }
  } catch (error) {
    setSubmitMessage("Error creating customer");
  } finally {
    setIsSubmitting(false);
    setTimeout(() => setSubmitMessage(""), 3000);
  }
};

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    const paymentData = {
      customer_id: paymentCustomerId,
      payment_amount: Number.parseFloat(paymentAmount),
      purpose,
      due_date: dueDate,
      credit_days: Number.parseInt(creditDays),
      outstanding_amount: Number.parseFloat(outstandingAmount),
      exchange_rate: Number.parseFloat(exchangeRate),
      createdBy: LOGGED_IN_EMPLOYEE_ID,
      updatedBy: LOGGED_IN_EMPLOYEE_ID,
    }

    try {
      const response = await fetch("http://localhost:8000/api/v1/customer/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("employeeToken")}`,
        },
        credentials: "include",
        body: JSON.stringify(paymentData),
      })
      const data = await response.json()
      if (data.statusCode === 200) {
        await fetchCustomers() // Refresh customers to include new payment
        setSubmitMessage("Customer payment created successfully!")
        resetPaymentForm()
      } else {
        setSubmitMessage(data.message || "Error creating payment")
      }
    } catch (error) {
      setSubmitMessage("Error creating payment")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(""), 3000)
    }
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
    setCustomerLocation("Indian")
    setIndustry("")
    setBillingAddress("")
    setState("")
    setReceiverName("")
    setReceiverContact("")
    setShippingAddresses([""])
    setPriority("")
    setShippingMethod("")
    setBankAccount("")
    setBankName("")
    setBankBranch("")
    setIfscCode("")
    setAccountHolder("")
    setGstin("")
    setPanNumber("")
    setIntlIndustry("")
    setTinVatEin("")
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
    setPaymentAmountINR("")
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

  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/customer/delete/${customerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
      const data = await response.json()
      if (data.statusCode === 200) {
        setCustomers((prev) => prev.filter((customer) => customer.customer_Id !== customerId))
        setSubmitMessage("Customer deleted successfully!")
      } else {
        setSubmitMessage(data.message || "Error deleting customer")
      }
    } catch (error) {
      setSubmitMessage("Error deleting customer")
    } finally {
      setTimeout(() => setSubmitMessage(""), 3000)
    }
  }

  const handleEditPayment = async (customerId, paymentId, updatedPayment) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/customer/payment/update/${paymentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("employeeToken")}`,
        },
        credentials: "include",
        body: JSON.stringify({
          due_date: updatedPayment.dueDate,
          status: updatedPayment.status,
          receivables_aging: updatedPayment.receivablesAging,
          credit_days: updatedPayment.creditDays,
          updatedBy: LOGGED_IN_EMPLOYEE_ID,
        }),
      })
      const data = await response.json()
      if (data.statusCode === 200) {
        await fetchCustomers() // Refresh customers to include updated payment
        setEditingPayment(null)
        setSubmitMessage("Payment updated successfully!")
      } else {
        setSubmitMessage(data.message || "Error updating payment")
      }
    } catch (error) {
      setSubmitMessage("Error updating payment")
    } finally {
      setTimeout(() => setSubmitMessage(""), 3000)
    }
  }

  const handleEditCustomer = async (customerId, updatedCustomer) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/customer/update/${customerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("employeeToken")}`,
        },
        credentials: "include",
        body: JSON.stringify({
          ...updatedCustomer,
          updatedBy: LOGGED_IN_EMPLOYEE_ID,
        }),
      })
      const data = await response.json()
      if (data.statusCode === 200) {
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.customer_Id === customerId ? data.data : customer,
          )
        )
        setEditingCustomer(null)
        setSubmitMessage("Customer updated successfully!")
      } else {
        setSubmitMessage(data.message || "Error updating customer")
      }
    } catch (error) {
      setSubmitMessage("Error updating customer")
    } finally {
      setTimeout(() => setSubmitMessage(""), 3000)
    }
  }

  const addShippingAddress = (isInternational = false) => {
    if (isInternational) {
      setShippingAddresses([...shippingAddresses, ""])
    } else {
      setShippingAddresses([...shippingAddresses, ""])
    }
  }

  const removeShippingAddress = (index, isInternational = false) => {
    if (isInternational) {
      const newAddresses = shippingAddresses.filter((_, i) => i !== index)
      setShippingAddresses(newAddresses.length > 0 ? newAddresses : [""])
    } else {
      const newAddresses = shippingAddresses.filter((_, i) => i !== index)
      setShippingAddresses(newAddresses.length > 0 ? newAddresses : [""])
    }
  }

  const updateShippingAddress = (index, value, isInternational = false) => {
    if (isInternational) {
      const newAddresses = [...shippingAddresses]
      newAddresses[index] = value
      setShippingAddresses(newAddresses)
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
                          <SelectItem value="Indian">Indian</SelectItem>
                          <SelectItem value="International">International</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {customerLocation === "Indian" ? (
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
                            <Label htmlFor="shippingMethod">Preferred Shipping Method</Label>
                            <Select value={shippingMethod} onValueChange={setShippingMethod}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select shipping method" />
                              </SelectTrigger>
                              <SelectContent>
                                {shippingMethods.Indian.map((method) => (
                                  <SelectItem key={method} value={method}>
                                    {method.charAt(0).toUpperCase() + method.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
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
                              value={billingAddress}
                              onChange={(e) => setBillingAddress(e.target.value)}
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
                              value={receiverName}
                              onChange={(e) => setReceiverName(e.target.value)}
                              placeholder="Enter receiver name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="intlReceiverContact">Receiver Contact No.</Label>
                            <Input
                              id="intlReceiverContact"
                              value={receiverContact}
                              onChange={(e) => setReceiverContact(e.target.value)}
                              placeholder="Enter receiver contact number"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="intlPriority">Customer Priority</Label>
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
                            <Select value={shippingMethod} onValueChange={setShippingMethod}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select shipping method" />
                              </SelectTrigger>
                              <SelectContent>
                                {shippingMethods.International.map((method) => (
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
                          {shippingAddresses.map((address, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={address}
                                onChange={(e) => updateShippingAddress(index, e.target.value, true)}
                                placeholder={`Shipping address ${index + 1}`}
                              />
                              {shippingAddresses.length > 1 && (
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
                      <Select
                        value={paymentCustomerId}
                        onValueChange={(value) => {
                          setPaymentCustomerId(value)
                          setPaymentAmount("")
                          setPaymentAmountINR("")
                          const selectedCustomer = customers.find((customer) => customer.customer_Id === value)
                          if (selectedCustomer) {
                            if (selectedCustomer.customer_Location === "Indian") {
                              setPaymentCurrency("INR")
                              setExchangeRate("1")
                            } else if (selectedCustomer.internationalDetails?.defaultCurrency) {
                              setPaymentCurrency(selectedCustomer.internationalDetails.defaultCurrency)
                              setExchangeRate("")
                            }
                          }
                        }}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.customer_Id} value={customer.customer_Id}>
                              {customer.customer_Id} - {customer.company_Name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Select the customer for which you're creating the payment record.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentCurrency">Currency *</Label>
                        <Input
                          id="paymentCurrency"
                          value={paymentCurrency}
                          readOnly
                          className="bg-gray-50"
                          placeholder="Currency will be auto-filled based on customer"
                        />
                        <p className="text-xs text-gray-500">
                          Currency is automatically set based on the selected customer.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exchangeRate">Exchange Rate (vs INR) *</Label>
                        <Input
                          id="exchangeRate"
                          type="number"
                          value={exchangeRate}
                          onChange={(e) => {
                            setExchangeRate(e.target.value)
                            if (paymentAmount && e.target.value) {
                              const inrAmount = Number.parseFloat(paymentAmount) * Number.parseFloat(e.target.value)
                              setPaymentAmountINR(inrAmount.toFixed(2))
                            } else {
                              setPaymentAmountINR("")
                            }
                          }}
                          placeholder="1.00"
                          min="0"
                          step="0.01"
                          required
                          readOnly={paymentCurrency === "INR"}
                          className={paymentCurrency === "INR" ? "bg-gray-50" : ""}
                        />
                        {paymentCurrency === "INR" && (
                          <p className="text-xs text-gray-500">
                            Exchange rate is automatically set to 1 for INR transactions.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentAmountCustomerCurrency">Payment Amount (in Customer Currency) *</Label>
                        <Input
                          id="paymentAmountCustomerCurrency"
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => {
                            setPaymentAmount(e.target.value)
                            if (e.target.value && exchangeRate) {
                              const inrAmount = Number.parseFloat(e.target.value) * Number.parseFloat(exchangeRate)
                              setPaymentAmountINR(inrAmount.toFixed(2))
                            } else {
                              setPaymentAmountINR("")
                            }
                          }}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentAmountINR">Payment Amount (in INR) *</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <Input
                            id="paymentAmountINR"
                            type="number"
                            value={paymentAmountINR}
                            readOnly
                            className="pl-8 bg-gray-50"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Automatically calculated based on customer currency amount and exchange rate.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose *</Label>
                      <Input
                        id="purpose"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="Enter payment purpose"
                        required
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

                    <div className="space-y-2">
                      <Label htmlFor="outstandingAmount">Outstanding Amount</Label>
                      <Input
                        id="outstandingAmount"
                        type="number"
                        value={outstandingAmount}
                        onChange={(e) => setOutstandingAmount(e.target.value)}
                        placeholder="Enter outstanding amount"
                        min="0"
                        step="0.01"
                      />
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

                  <div className="mb-4 flex items-center gap-4">
                    <Label htmlFor="priorityFilter" className="text-sm font-medium text-gray-700">
                      Filter by Priority:
                    </Label>
                    <Select value={customerPriorityFilter} onValueChange={setCustomerPriorityFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Priorities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    {filteredCustomers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {searchTerm ? "No customers found matching your search." : "No customers created yet."}
                      </div>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <Card key={customer.customer_Id} className="border-l-4 border-l-blue-500">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <CardTitle className="text-lg">{customer.company_Name}</CardTitle>
                                <CardDescription className="mt-1">
                                  ID: {customer.customer_Id} | Created by: {customer.createdBy} | Updated by: {customer.updatedBy} | Date: {customer.createdAt.split("T")[0]}
                                </CardDescription>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant={customer.customer_Location === "Indian" ? "default" : "secondary"}>
                                    {customer.customer_Location}
                                  </Badge>
                                  {customer.customer_Types.map((type) => (
                                    <Badge key={type} variant="outline" className="text-xs">
                                      {type}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="mt-3 text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-2">
                                  <p><strong>Email:</strong> {customer.company_Email}</p>
                                  <p><strong>Contact:</strong> {customer.contact_Person.name}</p>
                                  <p><strong>Contact Email:</strong> {customer.contact_Person.email}</p>
                                  <p><strong>Contact Number:</strong> {customer.contact_Person.number}</p>
                                  <p className="md:col-span-2"><strong>Address:</strong> {customer.address}</p>
                                  {customer.customer_Location === "Indian" && customer.indianDetails && (
                                    <>
                                      <p><strong>Industry:</strong> {customer.indianDetails.industry_Sector}</p>
                                      <p><strong>State:</strong> {customer.indianDetails.state}</p>
                                      <p><strong>Priority:</strong> {customer.indianDetails.customerPriority}</p>
                                      <p><strong>Shipping Method:</strong> {customer.indianDetails.shippingMethod}</p>
                                      {customer.indianDetails.gstin && (
                                        <p><strong>GSTIN:</strong> {customer.indianDetails.gstin}</p>
                                      )}
                                      {customer.indianDetails.panNumber && (
                                        <p><strong>PAN:</strong> {customer.indianDetails.panNumber}</p>
                                      )}
                                    </>
                                  )}
                                  {customer.customer_Location === "International" && customer.internationalDetails && (
                                    <>
                                      <p><strong>Industry:</strong> {customer.internationalDetails.industry_Sector}</p>
                                      <p><strong>Country:</strong> {customer.internationalDetails.country}</p>
                                      <p><strong>Priority:</strong> {customer.internationalDetails.customerPriority}</p>
                                      <p><strong>Currency:</strong> {customer.internationalDetails.defaultCurrency}</p>
                                      <p><strong>Tax Profile:</strong> {customer.internationalDetails.taxProfile}</p>
                                    </>
                                  )}
                                  {customer.customer_Location === "Indian" && customer.indianDetails && (
                                    <>
                                      {customer.indianDetails.bankName && (
                                        <p><strong>Bank Name:</strong> {customer.indianDetails.bankName}</p>
                                      )}
                                      {customer.indianDetails.bankAccount && (
                                        <p><strong>Bank Account:</strong> {customer.indianDetails.bankAccount}</p>
                                      )}
                                      {customer.indianDetails.ifscCode && (
                                        <p><strong>IFSC Code:</strong> {customer.indianDetails.ifscCode}</p>
                                      )}
                                      {customer.indianDetails.accountHolder && (
                                        <p><strong>Account Holder:</strong> {customer.indianDetails.accountHolder}</p>
                                      )}
                                      {customer.indianDetails.shipping_Addresses && customer.indianDetails.shipping_Addresses.length > 0 && (
                                        <p className="md:col-span-2">
                                          <strong>Shipping Addresses:</strong>{" "}
                                          {customer.indianDetails.shipping_Addresses.filter((addr) => addr.trim()).join(", ")}
                                        </p>
                                      )}
                                    </>
                                  )}
                                  {customer.customer_Location === "International" && customer.internationalDetails && (
                                    <>
                                      {customer.internationalDetails.bankName && (
                                        <p><strong>Bank Name:</strong> {customer.internationalDetails.bankName}</p>
                                      )}
                                      {customer.internationalDetails.ibanAccount && (
                                        <p><strong>IBAN/Account:</strong> {customer.internationalDetails.ibanAccount}</p>
                                      )}
                                      {customer.internationalDetails.swiftBic && (
                                        <p><strong>SWIFT/BIC:</strong> {customer.internationalDetails.swiftBic}</p>
                                      )}
                                      {customer.internationalDetails.beneficiaryName && (
                                        <p><strong>Beneficiary Name:</strong> {customer.internationalDetails.beneficiaryName}</p>
                                      )}
                                      {customer.internationalDetails.shipping_Addresses && customer.internationalDetails.shipping_Addresses.length > 0 && (
                                        <p className="md:col-span-2">
                                          <strong>Shipping Addresses:</strong>{" "}
                                          {customer.internationalDetails.shipping_Addresses.filter((addr) => addr.trim()).join(", ")}
                                        </p>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Dialog
                                  open={customerEditDialogStates[customer.customer_Id] || false}
                                  onOpenChange={(open) => {
                                    setCustomerEditDialogStates((prev) => ({
                                      ...prev,
                                      [customer.customer_Id]: open,
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
                                        Update customer information for {customer.company_Name}
                                      </DialogDescription>
                                    </DialogHeader>
                                    {editingCustomer && (
                                      <CustomerEditForm
                                        customer={editingCustomer}
                                        onSave={(updatedCustomer) => {
                                          handleEditCustomer(customer.customer_Id, updatedCustomer)
                                          setCustomerEditDialogStates((prev) => ({
                                            ...prev,
                                            [customer.customer_Id]: false,
                                          }))
                                        }}
                                        onCancel={() => {
                                          setCustomerEditDialogStates((prev) => ({
                                            ...prev,
                                            [customer.customer_Id]: false,
                                          }))
                                        }}
                                      />
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteCustomer(customer.customer_Id)}
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

                  <div className="space-y-4">
                    {filteredPayments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {searchTerm || paymentStatusFilter !== "all"
                          ? "No payments found matching your criteria."
                          : "No payment records created yet."}
                      </div>
                    ) : (
                      filteredPayments.map((payment) => (
                        <Card
                          key={payment.customer_payment_id}
                          className="border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{payment.customerName}</h3>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p>Payment ID: {payment.customer_payment_id}</p>
                                  <p>Customer ID: {payment.customerId}</p>
                                  <p>Created by: {payment.createdBy} | Updated by: {payment.updatedBy}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
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
                                  className="text-sm px-3 py-1"
                                >
                                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                </Badge>
                                <div className="flex gap-2">
                                  <Dialog
                                    open={editDialogStates[payment.customer_payment_id] || false}
                                    onOpenChange={(open) => {
                                      setEditDialogStates((prev) => ({
                                        ...prev,
                                        [payment.customer_payment_id]: open,
                                      }))
                                    }}
                                  >
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle>Edit Payment</DialogTitle>
                                        <DialogDescription>
                                          Update payment information for {payment.customerName}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <PaymentEditForm
                                        payment={payment}
                                        onSave={(updatedPayment) => {
                                          handleEditPayment(payment.customerId, payment.customer_payment_id, updatedPayment)
                                          setEditDialogStates((prev) => ({
                                            ...prev,
                                            [payment.customer_payment_id]: false,
                                          }))
                                        }}
                                        onCancel={() => {
                                          setEditDialogStates((prev) => ({
                                            ...prev,
                                            [payment.customer_payment_id]: false,
                                          }))
                                        }}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        const response = await fetch(`http://localhost:8000/api/v1/customer/payment/delete/${payment.customer_payment_id}`, {
                                          method: "DELETE",
                                          headers: {
                                            "Content-Type": "application/json",
                                          },
                                          credentials: "include",
                                        })
                                        const data = await response.json()
                                        if (data.statusCode === 200) {
                                          await fetchCustomers()
                                          setSubmitMessage("Payment deleted successfully!")
                                        } else {
                                          setSubmitMessage(data.message || "Error deleting payment")
                                        }
                                      } catch (error) {
                                        setSubmitMessage("Error deleting payment")
                                      } finally {
                                        setTimeout(() => setSubmitMessage(""), 3000)
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-5 gap-6 mb-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Purchase Amount</p>
                                <p className="text-lg font-semibold text-blue-600">
                                  {payment.currency === "INR" ? "₹" : payment.currency + " "}
                                  {payment.payment_amount_in_customer_currency?.toLocaleString() || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Paid Amount</p>
                                <p className="text-lg font-semibold text-green-600">
                                  {payment.currency === "INR" ? "₹" : payment.currency + " "}
                                  {payment.payment_amount_in_inr?.toLocaleString() || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Outstanding Amount</p>
                                <p className="text-lg font-semibold text-red-600">
                                  {payment.currency === "INR" ? "₹" : payment.currency + " "}
                                  {payment.outstanding_amount?.toLocaleString() || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Due Date</p>
                                <p className="text-lg font-medium text-gray-900">{payment.due_date || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                                <p className="text-lg font-medium text-gray-900">Bank Transfer</p>
                              </div>
                            </div>
                            {payment.purpose && (
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Purpose</p>
                                <p className="text-gray-900">{payment.purpose}</p>
                              </div>
                            )}
                          </CardContent>
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

function PaymentEditForm({ payment, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    payment_amount_in_customer_currency: payment.payment_amount_in_customer_currency.toString(),
    payment_amount_in_inr: payment.payment_amount_in_inr.toString(),
    purpose: payment.purpose || "",
    due_date: payment.due_date,
    status: payment.status,
    credit_days: payment.credit_days.toString(),
    outstanding_amount: payment.outstanding_amount.toString(),
    receivables_aging: payment.receivables_aging,
    currency: payment.currency,
    exchange_rate: payment.exchange_rate.toString(),
    createdBy: payment.createdBy,
    updatedBy: payment.updatedBy,
  })

  const paymentStatuses = ["pending", "completed", "overdue", "cancelled", "processing"]
  const agingCategories = ["0-30", "31-60", "61-90", "90+"]
  const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR"]

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      credit_days: Number.parseInt(formData.credit_days),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="editCreatedBy">Created By</Label>
          <Input id="editCreatedBy" value={formData.createdBy} readOnly className="bg-gray-50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="editUpdatedBy">Updated By</Label>
          <Input id="editUpdatedBy" value={LOGGED_IN_EMPLOYEE_ID} readOnly className="bg-gray-50" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="editPurchaseAmount">Purchase Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {formData.currency}
            </span>
            <Input
              id="editPurchaseAmount"
              type="number"
              value={formData.payment_amount_in_customer_currency}
              readOnly
              className="pl-10 bg-gray-50"
              min="0"
              step="0.01"
            />
          </div>
          <p className="text-xs text-gray-500">This field is read-only.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="editPaidAmount">Paid Amount (INR)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <Input
              id="editPaidAmount"
              type="number"
              value={formData.payment_amount_in_inr}
              readOnly
              className="pl-8 bg-gray-50"
              min="0"
              step="0.01"
            />
          </div>
          <p className="text-xs text-gray-500">This field is read-only.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="editOutstandingAmount">Outstanding Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {formData.currency}
            </span>
            <Input
              id="editOutstandingAmount"
              type="number"
              value={formData.outstanding_amount}
              readOnly
              className="pl-10 bg-gray-50"
              min="0"
              step="0.01"
            />
          </div>
          <p className="text-xs text-gray-500">This field is read-only.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="editAmount">Payment Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {formData.currency}
            </span>
            <Input
              id="editAmount"
              type="number"
              value={formData.payment_amount_in_customer_currency}
              readOnly
              className="pl-10 bg-gray-50"
              min="0"
              step="0.01"
              required
            />
          </div>
          <p className="text-xs text-gray-500">This field is read-only.</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="editStatus">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}>
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

      <div className="space-y-2">
        <Label htmlFor="editDueDate">Due Date</Label>
        <Input
          id="editDueDate"
          type="date"
          value={formData.due_date}
          onChange={(e) => setFormData((prev) => ({ ...prev, due_date: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="editCreditDays">Credit Days</Label>
        <Input
          id="editCreditDays"
          type="number"
          value={formData.credit_days}
          onChange={(e) => setFormData((prev) => ({ ...prev, credit_days: e.target.value }))}
          min="0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="editPurpose">Purpose</Label>
        <Input
          id="editPurpose"
          value={formData.purpose}
          readOnly
          className="bg-gray-50"
          placeholder="Enter payment purpose"
        />
        <p className="text-xs text-gray-500">This field is read-only.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="editReceivablesAging">Receivables Aging</Label>
          <Select
            value={formData.receivables_aging}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, receivables_aging: value }))}
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
            disabled
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
          <p className="text-xs text-gray-500">Currency is read-only and set by customer details.</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="editExchangeRate">Exchange Rate (vs INR)</Label>
        <Input
          id="editExchangeRate"
          type="number"
          value={formData.exchange_rate}
          readOnly
          className="bg-gray-50"
          min="0"
          step="0.01"
        />
        <p className="text-xs text-gray-500">Exchange rate is read-only.</p>
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  )
}

function CustomerEditForm({ customer, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    company_Name: customer.company_Name,
    address: customer.address,
    company_Email: customer.company_Email,
    customer_Types: customer.customer_Types,
    contact_Person: { ...customer.contact_Person },
    customer_Location: customer.customer_Location,
    indianDetails: customer.customer_Location === "Indian" ? { ...customer.indianDetails } : null,
    internationalDetails: customer.customer_Location === "International" ? { ...customer.internationalDetails } : null,
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
    "Others",
  ]
  const priorities = ["low", "medium", "high"]
  const shippingMethods = {
    Indian: ["road", "rail", "air"],
    International: ["road", "rail", "air", "ship"],
  }
  const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR"]
  const taxProfiles = ["VAT", "Sales Tax"]

  const handleCustomerTypeChange = (type, checked) => {
    setFormData((prev) => ({
      ...prev,
      customer_Types: checked
        ? [...prev.customer_Types, type]
        : prev.customer_Types.filter((t) => t !== type),
    }))
  }

  const addShippingAddress = (isInternational = false) => {
    if (isInternational) {
      setFormData((prev) => ({
        ...prev,
        internationalDetails: {
          ...prev.internationalDetails,
          shipping_Addresses: [...prev.internationalDetails.shipping_Addresses, ""],
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        indianDetails: {
          ...prev.indianDetails,
          shipping_Addresses: [...prev.indianDetails.shipping_Addresses, ""],
        },
      }))
    }
  }

  const removeShippingAddress = (index, isInternational = false) => {
    if (isInternational) {
      const newAddresses = formData.internationalDetails.shipping_Addresses.filter((_, i) => i !== index)
      setFormData((prev) => ({
        ...prev,
        internationalDetails: {
          ...prev.internationalDetails,
          shipping_Addresses: newAddresses.length > 0 ? newAddresses : [""],
        },
      }))
    } else {
      const newAddresses = formData.indianDetails.shipping_Addresses.filter((_, i) => i !== index)
      setFormData((prev) => ({
        ...prev,
        indianDetails: {
          ...prev.indianDetails,
          shipping_Addresses: newAddresses.length > 0 ? newAddresses : [""],
        },
      }))
    }
  }

  const updateShippingAddress = (index, value, isInternational = false) => {
    if (isInternational) {
      const newAddresses = [...formData.internationalDetails.shipping_Addresses]
      newAddresses[index] = value
      setFormData((prev) => ({
        ...prev,
        internationalDetails: {
          ...prev.internationalDetails,
          shipping_Addresses: newAddresses,
        },
      }))
    } else {
      const newAddresses = [...formData.indianDetails.shipping_Addresses]
      newAddresses[index] = value
      setFormData((prev) => ({
        ...prev,
        indianDetails: {
          ...prev.indianDetails,
          shipping_Addresses: newAddresses,
        },
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="editCompanyName">Company Name *</Label>
        <Input
          id="editCompanyName"
          value={formData.company_Name}
          onChange={(e) => setFormData((prev) => ({ ...prev, company_Name: e.target.value }))}
          placeholder="Enter company name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="editAddress">Address *</Label>
        <Textarea
          id="editAddress"
          value={formData.address}
          onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
          placeholder="Enter company address"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="editEmail">Company Email *</Label>
        <Input
          id="editEmail"
          type="email"
          value={formData.company_Email}
          onChange={(e) => setFormData((prev) => ({ ...prev, company_Email: e.target.value }))}
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
                id={`editType-${type}`}
                checked={formData.customer_Types.includes(type)}
                onCheckedChange={(checked) => handleCustomerTypeChange(type, checked)}
              />
              <Label htmlFor={`editType-${type}`} className="text-sm">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Contact Person Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="editContactPersonName">Contact Person Name *</Label>
            <Input
              id="editContactPersonName"
              value={formData.contact_Person.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact_Person: { ...prev.contact_Person, name: e.target.value },
                }))
              }
              placeholder="Enter contact person name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editContactPersonEmail">Contact Person Email *</Label>
            <Input
              id="editContactPersonEmail"
              type="email"
              value={formData.contact_Person.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact_Person: { ...prev.contact_Person, email: e.target.value },
                }))
              }
              placeholder="Enter contact person email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editContactPersonNumber">Contact Person Number *</Label>
            <Input
              id="editContactPersonNumber"
              value={formData.contact_Person.number}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact_Person: { ...prev.contact_Person, number: e.target.value },
                }))
              }
              placeholder="Enter contact person number"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="editCustomerLocation">Customer Location *</Label>
        <Select
          value={formData.customer_Location}
          onValueChange={(value) => {
            setFormData((prev) => ({
              ...prev,
              customer_Location: value,
              indianDetails: value === "Indian" ? prev.indianDetails || {} : null,
              internationalDetails: value === "International" ? prev.internationalDetails || {} : null,
            }))
          }}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select customer location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Indian">Indian</SelectItem>
            <SelectItem value="International">International</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.customer_Location === "Indian" && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Indian Customer Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="editIndustry">Industry/Sector</Label>
              <Input
                id="editIndustry"
                value={formData.indianDetails?.industry_Sector || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    indianDetails: { ...prev.indianDetails, industry_Sector: e.target.value },
                  }))
                }
                placeholder="Enter industry/sector"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editState">State/Province/Region</Label>
              <Input
                id="editState"
                value={formData.indianDetails?.state || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    indianDetails: { ...prev.indianDetails, state: e.target.value },
                  }))
                }
                placeholder="Enter state/province/region"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editBillingAddress">Billing Address</Label>
              <Textarea
                id="editBillingAddress"
                value={formData.indianDetails?.billing_Address || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    indianDetails: { ...prev.indianDetails, billing_Address: e.target.value },
                  }))
                }
                placeholder="Enter billing address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editReceiverName">Receiver Name</Label>
              <Input
                id="editReceiverName"
                value={formData.indianDetails?.receiver_Name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    indianDetails: { ...prev.indianDetails, receiver_Name: e.target.value },
                  }))
                }
                placeholder="Enter receiver name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editReceiverContact">Receiver Contact No.</Label>
              <Input
                id="editReceiverContact"
                value={formData.indianDetails?.receiver_ContactNo || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    indianDetails: { ...prev.indianDetails, receiver_ContactNo: e.target.value },
                  }))
                }
                placeholder="Enter receiver contact number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPriority">Customer Priority</Label>
              <Select
                value={formData.indianDetails?.customerPriority || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    indianDetails: { ...prev.indianDetails, customerPriority: value },
                  }))
                }
              >
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
              <Label htmlFor="editShippingMethod">Preferred Shipping Method</Label>
              <Select
                value={formData.indianDetails?.shippingMethod || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    indianDetails: { ...prev.indianDetails, shippingMethod: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent>
                  {shippingMethods.Indian.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
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
            {formData.indianDetails?.shipping_Addresses?.map((address, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={address}
                  onChange={(e) => updateShippingAddress(index, e.target.value, false)}
                  placeholder={`Shipping address ${index + 1}`}
                />
                {formData.indianDetails.shipping_Addresses.length > 1 && (
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
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-800">Bank Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="editBankAccount">Bank Account Number</Label>
                <Input
                  id="editBankAccount"
                  value={formData.indianDetails?.bankAccount || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      indianDetails: { ...prev.indianDetails, bankAccount: e.target.value },
                    }))
                  }
                  placeholder="Enter bank account number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editBankName">Bank Name</Label>
                <Input
                  id="editBankName"
                  value={formData.indianDetails?.bankName || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      indianDetails: { ...prev.indianDetails, bankName: e.target.value },
                    }))
                  }
                  placeholder="Enter bank name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editBankBranch">Bank Branch</Label>
                <Input
                  id="editBankBranch"
                  value={formData.indianDetails?.bankBranch || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      indianDetails: { ...prev.indianDetails, bankBranch: e.target.value },
                    }))
                  }
                  placeholder="Enter bank branch"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editIfscCode">IFSC Code</Label>
                <Input
                  id="editIfscCode"
                  value={formData.indianDetails?.ifscCode || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      indianDetails: { ...prev.indianDetails, ifscCode: e.target.value },
                    }))
                  }
                  placeholder="Enter IFSC code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAccountHolder">Account Holder Name (Optional)</Label>
                <Input
                  id="editAccountHolder"
                  value={formData.indianDetails?.accountHolder || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      indianDetails: { ...prev.indianDetails, accountHolder: e.target.value },
                    }))
                  }
                  placeholder="Enter account holder name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editGstin">GSTIN (Optional)</Label>
                <Input
                  id="editGstin"
                  value={formData.indianDetails?.gstin || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      indianDetails: { ...prev.indianDetails, gstin: e.target.value },
                    }))
                  }
                  placeholder="Enter GSTIN"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPanNumber">PAN Number (Optional)</Label>
                <Input
                  id="editPanNumber"
                  value={formData.indianDetails?.panNumber || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      indianDetails: { ...prev.indianDetails, panNumber: e.target.value },
                    }))
                  }
                  placeholder="Enter PAN number"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {formData.customer_Location === "International" && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            International Customer Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="editIntlBillingAddress">Billing Address</Label>
              <Textarea
                id="editIntlBillingAddress"
                value={formData.internationalDetails?.billing_Address || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    internationalDetails: { ...prev.internationalDetails, billing_Address: e.target.value },
                  }))
                }
                placeholder="Enter billing address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editIntlIndustry">Industry/Sector</Label>
              <Input
                id="editIntlIndustry"
                value={formData.internationalDetails?.industry_Sector || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    internationalDetails: { ...prev.internationalDetails, industry_Sector: e.target.value },
                  }))
                }
                placeholder="Enter industry/sector"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editTinVatEin">TIN/VAT/EIN/Company Reg No.</Label>
              <Input
                id="editTinVatEin"
                value={formData.internationalDetails?.tinVatEin || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    internationalDetails: { ...prev.internationalDetails, tinVatEin: e.target.value },
                  }))
                }
                placeholder="Enter TIN/VAT/EIN/Company registration number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editIntlReceiverName">Receiver Name</Label>
              <Input
                id="editIntlReceiverName"
                value={formData.internationalDetails?.receiver_Name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    internationalDetails: { ...prev.internationalDetails, receiver_Name: e.target.value },
                  }))
                }
                placeholder="Enter receiver name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editIntlReceiverContact">Receiver Contact No.</Label>
              <Input
                id="editIntlReceiverContact"
                value={formData.internationalDetails?.receiver_ContactNo || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    internationalDetails: { ...prev.internationalDetails, receiver_ContactNo: e.target.value },
                  }))
                }
                placeholder="Enter receiver contact number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editIntlPriority">Customer Priority</Label>
              <Select
                value={formData.internationalDetails?.customerPriority || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    internationalDetails: { ...prev.internationalDetails, customerPriority: value },
                  }))
                }
              >
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
              <Label htmlFor="editIntlShippingMethod">Preferred Shipping Method</Label>
              <Select
                value={formData.internationalDetails?.shippingMethod || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    internationalDetails: { ...prev.internationalDetails, shippingMethod: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent>
                  {shippingMethods.International.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCurrency">Default Currency</Label>
              <Select
                value={formData.internationalDetails?.defaultCurrency || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    internationalDetails: { ...prev.internationalDetails, defaultCurrency: value },
                  }))
                }
              >
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
              <Label htmlFor="editTaxProfile">Applicable Tax Profile</Label>
              <Select
                value={formData.internationalDetails?.taxProfile || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    internationalDetails: { ...prev.internationalDetails, taxProfile: value },
                  }))
                }
              >
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
            {formData.internationalDetails?.shipping_Addresses?.map((address, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={address}
                  onChange={(e) => updateShippingAddress(index, e.target.value, true)}
                  placeholder={`Shipping address ${index + 1}`}
                />
                {formData.internationalDetails.shipping_Addresses.length > 1 && (
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
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-800">Bank Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="editCountry">Country Name</Label>
                <Input
                  id="editCountry"
                  value={formData.internationalDetails?.country || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      internationalDetails: { ...prev.internationalDetails, country: e.target.value },
                    }))
                  }
                  placeholder="Enter country name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editIntlBankName">Bank Name</Label>
                <Input
                  id="editIntlBankName"
                  value={formData.internationalDetails?.bankName || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      internationalDetails: { ...prev.internationalDetails, bankName: e.target.value },
                    }))
                  }
                  placeholder="Enter bank name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editIbanAccount">IBAN/Bank Account Number</Label>
                <Input
                  id="editIbanAccount"
                  value={formData.internationalDetails?.ibanAccount || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      internationalDetails: { ...prev.internationalDetails, ibanAccount: e.target.value },
                    }))
                  }
                  placeholder="Enter IBAN or bank account number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editSwiftBic">SWIFT/BIC Code</Label>
                <Input
                  id="editSwiftBic"
                  value={formData.internationalDetails?.swiftBic || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      internationalDetails: { ...prev.internationalDetails, swiftBic: e.target.value },
                    }))
                  }
                  placeholder="Enter SWIFT/BIC code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editIntlBankAddress">Bank Address</Label>
                <Textarea
                  id="editIntlBankAddress"
                  value={formData.internationalDetails?.bankAddress || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      internationalDetails: { ...prev.internationalDetails, bankAddress: e.target.value },
                    }))
                  }
                  placeholder="Enter bank address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editBeneficiaryName">Beneficiary Name</Label>
                <Input
                  id="editBeneficiaryName"
                  value={formData.internationalDetails?.beneficiaryName || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      internationalDetails: { ...prev.internationalDetails, beneficiaryName: e.target.value },
                    }))
                  }
                  placeholder="Enter beneficiary name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editIec">Importer Exporter Code (IEC)</Label>
                <Input
                  id="editIec"
                  value={formData.internationalDetails?.iec || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      internationalDetails: { ...prev.internationalDetails, iec: e.target.value },
                    }))
                  }
                  placeholder="Enter IEC code"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  )
}
