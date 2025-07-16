"use client"

import { ArrowLeft, Building, DollarSign, History, Search, ShoppingCart, Upload } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

// Mock data
const mockVendorTypes = [
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

const mockVendors = [
  { id: "VEND-001", name: "ABC Suppliers", type: "Office Supplies" },
  { id: "VEND-002", name: "XYZ Services", type: "Services" },
  { id: "VEND-003", name: "Office Supplies Co", type: "Office Supplies" },
  { id: "VEND-004", name: "Tech Solutions Ltd", type: "Technology" },
  { id: "VEND-005", name: "Global Manufacturing", type: "Manufacturing" },
  { id: "VEND-006", name: "Business Consultants", type: "Consulting" },
  { id: "VEND-007", name: "Power & Utilities", type: "Utilities" },
  { id: "VEND-008", name: "IT Services Inc", type: "Technology" },
]

const mockCustomers = [
  { id: "CUST-001", name: "ABC Corp", type: "Corporate" },
  { id: "CUST-002", name: "XYZ Ltd", type: "Corporate" },
  { id: "CUST-003", name: "Global Industries", type: "Enterprise" },
  { id: "CUST-004", name: "Tech Innovations", type: "SME" },
  { id: "CUST-005", name: "John Smith", type: "Individual" },
  { id: "CUST-006", name: "City Council", type: "Government" },
]

const mockEmployees = [
  { id: "EMP-001", name: "John Doe", department: "Sales", salaryId: "SAL-001", netSalary: 50000 },
  { id: "EMP-002", name: "Jane Smith", department: "Marketing", salaryId: "SAL-002", netSalary: 45000 },
  { id: "EMP-003", name: "Mike Johnson", department: "Administration", salaryId: "SAL-003", netSalary: 40000 },
  { id: "EMP-004", name: "Sarah Wilson", department: "Finance", salaryId: "SAL-004", netSalary: 55000 },
  { id: "EMP-005", name: "David Brown", department: "Sales", salaryId: "SAL-005", netSalary: 48000 },
  { id: "EMP-006", name: "Lisa Davis", department: "HR", salaryId: "SAL-006", netSalary: 42000 },
  { id: "EMP-007", name: "Tom Wilson", department: "IT", salaryId: "SAL-007", netSalary: 60000 },
  { id: "EMP-008", name: "Amy Johnson", department: "Operations", salaryId: "SAL-008", netSalary: 38000 },
]

const mockLiabilities = [
  { id: "LIB-001", type: "Bank Loan", name: "Business Loan - HDFC", amount: 500000 },
  { id: "LIB-002", type: "Equipment Loan", name: "Equipment Loan - SBI", amount: 250000 },
  { id: "LIB-003", type: "Credit Card", name: "Corporate Credit Card - ICICI", amount: 75000 },
  { id: "LIB-004", type: "Credit Card", name: "Business Credit Card - Axis", amount: 45000 },
  { id: "LIB-005", type: "Trade Payable", name: "Office Supplies Payable", amount: 25000 },
  { id: "LIB-006", type: "Trade Payable", name: "IT Services Payable", amount: 85000 },
  { id: "LIB-007", type: "Tax Liability", name: "GST Payable", amount: 125000 },
  { id: "LIB-008", type: "Tax Liability", name: "Income Tax Payable", amount: 200000 },
  { id: "LIB-009", type: "Mortgage", name: "Office Building Mortgage - HDFC", amount: 2500000 },
  { id: "LIB-010", type: "Accrued Expenses", name: "Accrued Salary Expenses", amount: 180000 },
  { id: "LIB-011", type: "Deferred Revenue", name: "Advance Payment from Client", amount: 150000 },
  { id: "LIB-012", type: "Lease Obligation", name: "Office Space Lease", amount: 300000 },
  { id: "LIB-013", type: "Bond Payable", name: "Corporate Bond Series A", amount: 1000000 },
  { id: "LIB-014", type: "Notes Payable", name: "Short Term Notes", amount: 400000 },
  { id: "LIB-015", type: "Other", name: "Miscellaneous Liability", amount: 50000 },
]

const liabilityTypes = [
  "Bank Loan",
  "Equipment Loan",
  "Mortgage",
  "Credit Card",
  "Trade Payable",
  "Accrued Expenses",
  "Deferred Revenue",
  "Tax Liability",
  "Lease Obligation",
  "Bond Payable",
  "Notes Payable",
  "Other",
]

const mockPayments = [
  { id: "PAY-001", status: "Pending", vendorId: "VEND-001", amount: 15000 },
  { id: "PAY-002", status: "Processing", vendorId: "VEND-001", amount: 8000 },
  { id: "PAY-003", status: "Approved", vendorId: "VEND-002", amount: 25000 },
  { id: "PAY-004", status: "Completed", vendorId: "VEND-002", amount: 12000 },
  { id: "PAY-005", status: "Pending", vendorId: "VEND-003", amount: 5000 },
  { id: "PAY-006", status: "Processing", vendorId: "VEND-004", amount: 35000 },
  { id: "PAY-007", status: "Approved", vendorId: "VEND-004", amount: 18000 },
  { id: "PAY-008", status: "On Hold", vendorId: "VEND-005", amount: 22000 },
  { id: "PAY-009", status: "Pending", vendorId: "VEND-006", amount: 9500 },
  { id: "PAY-010", status: "Completed", vendorId: "VEND-007", amount: 14000 },
]

const mockApprovals = [
  { id: "APPR-001", name: "Manager Approval" },
  { id: "APPR-002", name: "Finance Approval" },
  { id: "APPR-003", name: "Director Approval" },
]

const departments = ["Sales", "Marketing", "Administration", "Finance", "HR", "IT", "Operations"]

const mockDepartments = [
  { id: "DEPT-001", name: "Sales" },
  { id: "DEPT-002", name: "Marketing" },
  { id: "DEPT-003", name: "Finance" },
  { id: "DEPT-004", name: "IT" },
  { id: "DEPT-005", name: "HR" },
  { id: "DEPT-006", name: "Operations" },
  { id: "DEPT-007", name: "Administration" },
]

const accounts = [
  "N/A",
  "Cash Account",
  "Bank Account",
  "Sales Account",
  "Purchase Account",
  "Office Supplies Account",
  "Salary Account",
]
const statuses = ["Pending", "Partially Paid", "Completed", "Cancelled"]

const transactionTypes = {
  Income: ["Sales Revenue", "Service Income", "Interest Income", "Other Income"],
  Expense: ["Office Supplies", "Utilities", "Rent", "Salaries", "Travel", "Other Expense"],
  Transfer: ["Internal Transfer", "Bank Transfer", "Cash Transfer"],
  Investment: ["Equipment Purchase", "Asset Purchase", "Stock Investment"],
}

const modeCategories = {
  Digital: [
    "NEFT",
    "RTGS",
    "IMPS",
    "UPI",
    "Bank Transfer",
    "Credit Card",
    "Debit Card",
    "Online Wallet",
    "Net Banking",
  ],
  Cash: ["Cash Payment", "Cash Deposit", "Cash Withdrawal"],
  Cheque: ["Cheque Issued", "Cheque Received", "Post-Dated Cheque", "Cancelled Cheque"],
}

const mockCustomerTypes = [
  "Technology",
  "Manufacturing",
  "Retail",
  "Healthcare",
  "Education",
  "B2B",
  "B2C",
  "Enterprise",
  "SME",
  "Others",
]

const mockCustomerPayments = [
  { id: "CPAY-001", status: "Pending", customerId: "CUST-001", amount: 25000, outstandingAmount: 25000 },
  { id: "CPAY-002", status: "Partially Paid", customerId: "CUST-001", amount: 15000, outstandingAmount: 8000 },
  { id: "CPAY-003", status: "Pending", customerId: "CUST-002", amount: 35000, outstandingAmount: 35000 },
  { id: "CPAY-004", status: "Completed", customerId: "CUST-002", amount: 20000, outstandingAmount: 0 },
  { id: "CPAY-005", status: "Pending", customerId: "CUST-003", amount: 45000, outstandingAmount: 45000 },
  { id: "CPAY-006", status: "Cancelled", customerId: "CUST-004", amount: 12000, outstandingAmount: 0 },
  { id: "CPAY-007", status: "Partially Paid", customerId: "CUST-005", amount: 8000, outstandingAmount: 3000 },
  { id: "CPAY-008", status: "Pending", customerId: "CUST-006", amount: 30000, outstandingAmount: 30000 },
]

const saleTransactionTypes = [
  "Product Sale",
  "Service Sale",
  "Asset Sale",
  "Scrap Sale",
  "Software/License Sale",
  "Other Sale",
]

const assetTransactionTypes = ["Raw Material", "Machinery", "Vehicles", "IT Equipment", "Office Supplies", "Others"]

const serviceTransactionTypes = [
  "Consulting",
  "Legal",
  "IT Services",
  "Training",
  "Security",
  "Subscriptions",
  "Others",
]

// Mock assets awaiting disposal
const mockAssetsAwaitingDisposal = [
  {
    id: "AST-001",
    name: "Dell Laptop",
    type: "IT Equipment",
    subtype: "Laptop",
    status: "awaiting_disposal",
    disposalId: "DISP-001",
  },
  {
    id: "AST-002",
    name: "Office Chair",
    type: "Office Furniture",
    subtype: "Furniture",
    status: "awaiting_disposal",
    disposalId: "DISP-002",
  },
  {
    id: "AST-003",
    name: "Toyota Camry",
    type: "Vehicles",
    subtype: "Car",
    status: "awaiting_disposal",
    disposalId: "DISP-003",
  },
  {
    id: "AST-004",
    name: "HP Printer",
    type: "IT Equipment",
    subtype: "Printer",
    status: "awaiting_disposal",
    disposalId: "DISP-004",
  },
  {
    id: "AST-005",
    name: "Conference Table",
    type: "Office Furniture",
    subtype: "Furniture",
    status: "awaiting_disposal",
    disposalId: "DISP-005",
  },
]

const assetTypes = ["IT Equipment", "Office Supplies", "Vehicles", "Machinery", "Raw Material", "Others"]

// Asset types specifically for Asset Sale transactions
const saleAssetTypes = [
  "IT Equipment",
  "Office Furniture",
  "Machinery",
  "Vehicles",
  "Real Estate",
  "Electrical Appliances",
  "Software Licenses",
  "Miscellaneous",
]

// Mock assets data for maintenance/repair transactions
const mockAssets = [
  {
    id: "AST-1703123456789",
    name: "Dell Laptop",
    type: "IT Equipment",
    status: "maintenance_needed",
  },
  {
    id: "AST-1703123456790",
    name: "Office Chair",
    type: "Furniture",
    status: "repair_needed",
  },
  {
    id: "AST-1703123456791",
    name: "HP Printer",
    type: "IT Equipment",
    status: "under_maintenance",
  },
  {
    id: "AST-1703123456792",
    name: "Conference Table",
    type: "Furniture",
    status: "under_repair",
  },
  {
    id: "AST-1703123456793",
    name: "Server Rack",
    type: "IT Equipment",
    status: "maintenance_needed",
  },
  {
    id: "AST-1703123456794",
    name: "Air Conditioner",
    type: "Other",
    status: "repair_needed",
  },
]

// Mock maintenance records
const mockMaintenanceRecords = [
  {
    id: "MNT-1703123456789",
    assetId: "AST-1703123456789",
    status: "requested",
  },
  {
    id: "MNT-1703123456790",
    assetId: "AST-1703123456790",
    status: "requested",
  },
  {
    id: "MNT-1703123456791",
    assetId: "AST-1703123456791",
    status: "in_progress",
  },
  {
    id: "MNT-1703123456792",
    assetId: "AST-1703123456792",
    status: "in_progress",
  },
  {
    id: "MNT-1703123456793",
    assetId: "AST-1703123456793",
    status: "requested",
  },
  {
    id: "MNT-1703123456794",
    assetId: "AST-1703123456794",
    status: "requested",
  },
]

// Purchase Tab Component
function PurchaseTab({ addTransaction }) {
  const [formData, setFormData] = useState({
    transactionId: `TXN-${Date.now()}`,
    enteredBy: "EMP-001 (Current User)",
    department: "",
    vendorType: "",
    vendorId: "",
    paymentId: "",
    approvalId: "",
    referenceType: "",
    assetName: "",
    quantity: "",
    serviceName: "",
    serviceDuration: "",
    referenceId: "",
    purchaseAmount: "",
    transactionType: "",
    transactionMode: "",
    transactionSubMode: "",
    debitAccount: "",
    creditAccount: "",
    status: "",
    narration: "",
    attachments: null,
    purchaseDate: "",
  })

  useEffect(() => {
    setFormData((prev) => ({ ...prev, transactionId: `TXN-${Date.now()}` }))
  }, [])

  useEffect(() => {
    if (formData.vendorType) {
      setFormData((prev) => ({ ...prev, vendorId: "", paymentId: "" }))
    }
  }, [formData.vendorType])

  useEffect(() => {
    if (formData.vendorId) {
      setFormData((prev) => ({ ...prev, paymentId: "" }))
    }
  }, [formData.vendorId])

  useEffect(() => {
    if (formData.referenceType === "Asset") {
      setFormData((prev) => ({ ...prev, referenceId: `AST-${Date.now()}`, transactionType: "" }))
    } else if (formData.referenceType === "Service") {
      setFormData((prev) => ({ ...prev, referenceId: `SVC-${Date.now()}`, transactionType: "" }))
    } else {
      setFormData((prev) => ({ ...prev, referenceId: "", transactionType: "" }))
    }
  }, [formData.referenceType])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Purchase transaction created successfully!", formData)

    // Save asset data to localStorage for Asset Service
    if (formData.referenceType === "Asset" && formData.assetName && formData.quantity) {
      const assetData = {
        id: `ENTERED-${Date.now()}`,
        assetName: formData.assetName,
        quantity: Number.parseInt(formData.quantity),
        assetId: formData.referenceId,
        transactionId: formData.transactionId,
        purchaseAmount: Number.parseFloat(formData.purchaseAmount),
        vendorId: formData.vendorId,
        createdAt: new Date().toISOString(),
      }
      const existingAssets = JSON.parse(localStorage.getItem("enteredAssets") || "[]")
      existingAssets.push(assetData)
      localStorage.setItem("enteredAssets", JSON.stringify(existingAssets))
    }

    // Map formData to transaction object expected by history
    const transaction = {
      id: formData.transactionId,
      enteredBy: formData.enteredBy,
      approvedBy: formData.approvalId || "",
      date: formData.purchaseDate,
      type: "Purchase",
      subtype: formData.referenceType === "Asset" ? "Asset Purchase" : formData.referenceType === "Service" ? "Service Purchase" : "",
      modeCategory: formData.transactionMode || "",
      mode: formData.transactionSubMode || "",
      transactionFor: formData.vendorId,
      amount: Number(formData.purchaseAmount) || 0,
      debitAccount: formData.debitAccount,
      creditAccount: formData.creditAccount,
      narration: formData.narration,
      status: formData.status,
      department: formData.department,
      referenceType: formData.referenceType,
      vendorId: formData.vendorId,
    }
    addTransaction(transaction)

    // Reset form after successful submission
    setFormData({
      transactionId: `TXN-${Date.now()}`,
      enteredBy: "EMP-001 (Current User)",
      department: "",
      vendorType: "",
      vendorId: "",
      paymentId: "",
      approvalId: "",
      referenceType: "",
      assetName: "",
      quantity: "",
      serviceName: "",
      serviceDuration: "",
      referenceId: "",
      purchaseAmount: "",
      transactionType: "",
      transactionMode: "",
      transactionSubMode: "",
      debitAccount: "",
      creditAccount: "",
      status: "",
      narration: "",
      attachments: null,
      purchaseDate: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="transactionId">Transaction ID</Label>
          <Input id="transactionId" value={formData.transactionId} disabled className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="enteredBy">Entered By</Label>
          <Input id="enteredBy" value={formData.enteredBy} disabled className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {mockDepartments.map((dept) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name} ({dept.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date *</Label>
          <Input
            id="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, purchaseDate: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vendorType">Vendor Type *</Label>
          <Select
            value={formData.vendorType}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, vendorType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select vendor type" />
            </SelectTrigger>
            <SelectContent>
              {mockVendorTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vendorId">Vendor ID *</Label>
          <Select
            value={formData.vendorId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, vendorId: value }))}
            disabled={!formData.vendorType}
          >
            <SelectTrigger>
              <SelectValue placeholder={formData.vendorType ? "Select vendor" : "Select vendor type first"} />
            </SelectTrigger>
            <SelectContent>
              {mockVendors
                .filter((vendor) => vendor.type === formData.vendorType)
                .map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name} ({vendor.id})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentId">Payment ID *</Label>
          <Select
            value={formData.paymentId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentId: value }))}
            disabled={!formData.vendorId}
          >
            <SelectTrigger>
              <SelectValue placeholder={formData.vendorId ? "Select payment ID" : "Select vendor first"} />
            </SelectTrigger>
            <SelectContent>
              {mockPayments
                .filter((payment) => payment.vendorId === formData.vendorId && payment.status !== "Completed")
                .map((payment) => (
                  <SelectItem key={payment.id} value={payment.id}>
                    {payment.id} ({payment.status}) - ₹{payment.amount.toLocaleString()}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {formData.vendorId &&
            mockPayments.filter((p) => p.vendorId === formData.vendorId && p.status !== "Completed").length === 0 && (
              <p className="text-xs text-amber-600">No pending payments found for this vendor</p>
            )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="approvalId">Approval ID *</Label>
          <Select
            value={formData.approvalId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, approvalId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select approval" />
            </SelectTrigger>
            <SelectContent>
              {mockApprovals.map((approval) => (
                <SelectItem key={approval.id} value={approval.id}>
                  {approval.name} ({approval.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="referenceType">Reference Type *</Label>
          <Select
            value={formData.referenceType}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, referenceType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select reference type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asset">Asset</SelectItem>
              <SelectItem value="Service">Service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.referenceType === "Asset" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="assetName">Asset Name *</Label>
              <Input
                id="assetName"
                value={formData.assetName}
                onChange={(e) => setFormData((prev) => ({ ...prev, assetName: e.target.value }))}
                placeholder="Enter asset name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                placeholder="Enter quantity"
                required
              />
            </div>
          </>
        )}

        {formData.referenceType === "Service" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="serviceName">Service Name *</Label>
              <Input
                id="serviceName"
                value={formData.serviceName}
                onChange={(e) => setFormData((prev) => ({ ...prev, serviceName: e.target.value }))}
                placeholder="Enter service name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceDuration">Service Duration (months) *</Label>
              <Input
                id="serviceDuration"
                type="number"
                value={formData.serviceDuration}
                onChange={(e) => setFormData((prev) => ({ ...prev, serviceDuration: e.target.value }))}
                placeholder="Enter duration in months"
                required
              />
              <p className="text-xs text-gray-500">If it's a one-time service, use '1'</p>
              <p className="text-xs text-gray-500">Duration is in months</p>
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="referenceId">Reference ID</Label>
          <Input id="referenceId" value={formData.referenceId} disabled className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseAmount">Purchase Amount *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <Input
              id="purchaseAmount"
              type="number"
              value={formData.purchaseAmount}
              onChange={(e) => setFormData((prev) => ({ ...prev, purchaseAmount: e.target.value }))}
              className="pl-8"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionType">Transaction Type *</Label>
          <Select
            value={formData.transactionType}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, transactionType: value }))}
            disabled={!formData.referenceType}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={formData.referenceType ? "Select transaction type" : "Select reference type first"}
              />
            </SelectTrigger>
            <SelectContent>
              {formData.referenceType === "Asset" &&
                assetTransactionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              {formData.referenceType === "Service" &&
                serviceTransactionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionMode">Transaction Mode *</Label>
          <Select
            value={formData.transactionMode}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, transactionMode: value, transactionSubMode: "" }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transaction mode" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(modeCategories).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionSubMode">Transaction Sub Mode *</Label>
          <Select
            value={formData.transactionSubMode}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, transactionSubMode: value }))}
            disabled={!formData.transactionMode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transaction sub mode" />
            </SelectTrigger>
            <SelectContent>
              {formData.transactionMode &&
                modeCategories[formData.transactionMode]?.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {mode}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="debitAccount">Debit Account *</Label>
          <Select
            value={formData.debitAccount}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, debitAccount: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select debit account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account} value={account}>
                  {account}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="creditAccount">Credit Account *</Label>
          <Select
            value={formData.creditAccount}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, creditAccount: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select credit account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account} value={account}>
                  {account}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="narration">Narration</Label>
        <Textarea
          id="narration"
          value={formData.narration}
          onChange={(e) => setFormData((prev) => ({ ...prev, narration: e.target.value }))}
          placeholder="Enter transaction description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="attachments">Attachments</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="attachments"
            type="file"
            onChange={(e) => setFormData((prev) => ({ ...prev, attachments: e.target.files?.[0] || null }))}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <Upload className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create Purchase Transaction
      </Button>
    </form>
  )
}

// Internal Transaction Tab Component
function InternalTransactionTab({ addTransaction }) {
  const [formData, setFormData] = useState({
    transactionId: `TXN-${Date.now()}`,
    enteredBy: "EMP-001 (Current User)",
    approvalId: "",
    referenceType: "",
    departmentId: "",
    employeeId: "",
    liabilityType: "",
    liabilityId: "",
    liabilityName: "",
    liabilityAmount: "",
    expenseName: "",
    maintenanceAssetType: "",
    maintenanceAssetId: "",
    maintenanceId: "",
    referenceId: "",
    amount: "",
    transactionType: "",
    transactionMode: "",
    transactionSubMode: "",
    debitAccount: "",
    creditAccount: "",
    status: "",
    narration: "",
    attachments: null,
    transactionDate: "",
  })

  useEffect(() => {
    setFormData((prev) => ({ ...prev, transactionId: `TXN-${Date.now()}` }))
  }, [])

  useEffect(() => {
    if (formData.referenceType === "Salary" && formData.employeeId) {
      const employee = mockEmployees.find((emp) => emp.id === formData.employeeId)
      if (employee) {
        setFormData((prev) => ({
          ...prev,
          referenceId: employee.salaryId,
          amount: employee.netSalary.toString(),
        }))
      }
    } else if (formData.referenceType === "Liability" && formData.liabilityId) {
      const liability = mockLiabilities.find((lib) => lib.id === formData.liabilityId)
      if (liability) {
        setFormData((prev) => ({
          ...prev,
          referenceId: liability.id,
          liabilityName: liability.name,
          liabilityAmount: liability.amount.toString(),
          amount: liability.amount.toString(),
        }))
      }
    } else if (formData.referenceType === "Refund/Investment") {
      setFormData((prev) => ({ ...prev, referenceId: `REF-${Date.now()}` }))
    } else if (formData.referenceType === "Maintenance / Repair" && formData.maintenanceAssetId) {
      const maintenanceRecord = mockMaintenanceRecords.find(
        (record) => record.assetId === formData.maintenanceAssetId && record.status !== "completed",
      )
      setFormData((prev) => ({
        ...prev,
        referenceId: maintenanceRecord ? maintenanceRecord.id : "",
      }))
    } else {
      setFormData((prev) => ({ ...prev, referenceId: "", amount: "" }))
    }
  }, [formData.referenceType, formData.employeeId, formData.liabilityId, formData.maintenanceAssetId])

  useEffect(() => {
    if (formData.liabilityType) {
      setFormData((prev) => ({ ...prev, liabilityId: "", liabilityName: "", liabilityAmount: "" }))
    }
  }, [formData.liabilityType])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Internal transaction created successfully!", formData)

    // Map formData to transaction object expected by history
    const transaction = {
      id: formData.transactionId,
      enteredBy: formData.enteredBy,
      approvedBy: formData.approvalId || "",
      date: formData.transactionDate,
      type: "Internal",
      subtype: formData.referenceType || "",
      modeCategory: formData.transactionMode || "",
      mode: formData.transactionSubMode || "",
      transactionFor: formData.employeeId || formData.liabilityId || formData.expenseName || "",
      amount: Number(formData.amount || formData.liabilityAmount) || 0,
      debitAccount: formData.debitAccount,
      creditAccount: formData.creditAccount,
      narration: formData.narration,
      status: formData.status,
      department: formData.departmentId || "",
      referenceType: formData.referenceType,
      employeeId: formData.employeeId,
      liabilityId: formData.liabilityId,
    }
    addTransaction(transaction)

    // Reset form after successful submission
    setFormData({
      transactionId: `TXN-${Date.now()}`,
      enteredBy: "EMP-001 (Current User)",
      approvalId: "",
      referenceType: "",
      departmentId: "",
      employeeId: "",
      liabilityType: "",
      liabilityId: "",
      liabilityName: "",
      liabilityAmount: "",
      expenseName: "",
      maintenanceAssetType: "",
      maintenanceAssetId: "",
      maintenanceId: "",
      referenceId: "",
      amount: "",
      transactionType: "",
      transactionMode: "",
      transactionSubMode: "",
      debitAccount: "",
      creditAccount: "",
      status: "",
      narration: "",
      attachments: null,
      transactionDate: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="transactionId">Transaction ID</Label>
          <Input id="transactionId" value={formData.transactionId} disabled className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="enteredBy">Entered By</Label>
          <Input id="enteredBy" value={formData.enteredBy} disabled className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionDate">Transaction Date *</Label>
          <Input
            id="transactionDate"
            type="date"
            value={formData.transactionDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, transactionDate: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="approvalId">Approval ID *</Label>
          <Select
            value={formData.approvalId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, approvalId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select approval" />
            </SelectTrigger>
            <SelectContent>
              {mockApprovals.map((approval) => (
                <SelectItem key={approval.id} value={approval.id}>
                  {approval.name} ({approval.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="referenceType">Reference Type *</Label>
          <Select
            value={formData.referenceType}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, referenceType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select reference type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Salary">Salary</SelectItem>
              <SelectItem value="Liability">Liability</SelectItem>
              <SelectItem value="Refund/Investment">Refund/Investment</SelectItem>
              <SelectItem value="Maintenance / Repair">Maintenance / Repair</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.referenceType === "Salary" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="departmentId">Department *</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, departmentId: value, employeeId: "" }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, employeeId: value }))}
                disabled={!formData.departmentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.departmentId ? "Select employee" : "Select department first"} />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees
                    .filter((emp) => emp.department === formData.departmentId)
                    .map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.id} - {employee.name} - ₹{employee.netSalary.toLocaleString()}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {formData.referenceType === "Liability" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="liabilityType">Liability Type *</Label>
              <Select
                value={formData.liabilityType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, liabilityType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select liability type" />
                </SelectTrigger>
                <SelectContent>
                  {liabilityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="liabilityId">Liability Name *</Label>
              <Select
                value={formData.liabilityId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, liabilityId: value }))}
                disabled={!formData.liabilityType}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={formData.liabilityType ? "Select liability" : "Select liability type first"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {mockLiabilities
                    .filter((liability) => liability.type === formData.liabilityType)
                    .map((liability) => (
                      <SelectItem key={liability.id} value={liability.id}>
                        {liability.name} - ₹{liability.amount.toLocaleString()}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="referenceId">Reference ID</Label>
              <Input id="referenceId" value={formData.referenceId} disabled className="bg-gray-50" />
            </div>
          </>
        )}

        {formData.referenceType === "Refund/Investment" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="expenseName">Description *</Label>
              <Input
                id="expenseName"
                value={formData.expenseName}
                onChange={(e) => setFormData((prev) => ({ ...prev, expenseName: e.target.value }))}
                placeholder="Enter refund/investment description"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referenceId">Reference ID</Label>
              <Input id="referenceId" value={formData.referenceId} disabled className="bg-gray-50" />
            </div>
          </>
        )}

        {formData.referenceType === "Maintenance / Repair" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="maintenanceAssetType">Asset Type *</Label>
              <Select
                value={formData.maintenanceAssetType || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    maintenanceAssetType: value,
                    maintenanceAssetId: "",
                    maintenanceId: "",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Machinery">Machinery</SelectItem>
                  <SelectItem value="Vehicle">Vehicle</SelectItem>
                  <SelectItem value="Building">Building</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenanceAssetId">Asset ID *</Label>
              <Select
                value={formData.maintenanceAssetId || ""}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    maintenanceAssetId: value,
                  }))
                }}
                disabled={!formData.maintenanceAssetType}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={formData.maintenanceAssetType ? "Select asset" : "Select asset type first"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {mockAssets
                    .filter(
                      (asset) =>
                        asset.type === formData.maintenanceAssetType &&
                        ["maintenance_needed", "repair_needed", "under_maintenance", "under_repair"].includes(
                          asset.status,
                        ),
                    )
                    .map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.id} - {asset.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {formData.maintenanceAssetType &&
                mockAssets.filter(
                  (asset) =>
                    asset.type === formData.maintenanceAssetType &&
                    ["maintenance_needed", "repair_needed", "under_maintenance", "under_repair"].includes(asset.status),
                ).length === 0 && (
                  <p className="text-xs text-amber-600">No assets requiring maintenance/repair found for this type</p>
                )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="referenceId">Reference ID</Label>
              <Input id="referenceId" value={formData.referenceId} disabled className="bg-gray-50" />
            </div>
          </>
        )}

        {formData.referenceType !== "Liability" &&
          formData.referenceType !== "Refund/Investment" &&
          formData.referenceType !== "Maintenance / Repair" && (
            <div className="space-y-2">
              <Label htmlFor="referenceId">Reference ID</Label>
              <Input id="referenceId" value={formData.referenceId} disabled className="bg-gray-50" />
            </div>
          )}

        <div className="space-y-2">
          <Label htmlFor="amount">Amount *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              className="pl-8"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionType">Transaction Type *</Label>
          <Select
            value={formData.transactionType}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, transactionType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transaction type" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(transactionTypes).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionMode">Transaction Mode *</Label>
          <Select
            value={formData.transactionMode}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, transactionMode: value, transactionSubMode: "" }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transaction mode" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(modeCategories).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionSubMode">Transaction Sub Mode *</Label>
          <Select
            value={formData.transactionSubMode}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, transactionSubMode: value }))}
            disabled={!formData.transactionMode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transaction sub mode" />
            </SelectTrigger>
            <SelectContent>
              {formData.transactionMode &&
                modeCategories[formData.transactionMode]?.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {mode}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="debitAccount">Debit Account *</Label>
          <Select
            value={formData.debitAccount}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, debitAccount: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select debit account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account} value={account}>
                  {account}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="creditAccount">Credit Account *</Label>
          <Select
            value={formData.creditAccount}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, creditAccount: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select credit account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account} value={account}>
                  {account}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="narration">
          Narration {formData.referenceType === "Refund/Investment" && <span className="text-red-500">*</span>}
        </Label>
        <Textarea
          id="narration"
          value={formData.narration}
          onChange={(e) => setFormData((prev) => ({ ...prev, narration: e.target.value }))}
          placeholder="Enter transaction description"
          rows={3}
          required={formData.referenceType === "Refund/Investment"}
        />
        {formData.referenceType === "Refund/Investment" && (
          <p className="text-xs text-gray-500">Narration is required for Refund/Investment transactions</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="attachments">Attachments</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="attachments"
            type="file"
            onChange={(e) => setFormData((prev) => ({ ...prev, attachments: e.target.files?.[0] || null }))}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <Upload className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create Internal Transaction
      </Button>
    </form>
  )
}

// Sale Tab Component
function SaleTab({ addTransaction }) {
  const [formData, setFormData] = useState({
    transactionId: `TXN-${Date.now()}`,
    enteredBy: "EMP-001 (Current User)",
    customerType: "",
    customerId: "",
    customerPaymentId: "",
    approvalId: "",
    saleName: "",
    referenceId: `REF-${Date.now()}`,
    saleAmount: "",
    transactionType: "",
    assetType: "",
    assetId: "",
    assetName: "",
    assetStatus: "Awaiting Disposal",
    disposalId: "",
    transactionMode: "",
    transactionSubMode: "",
    debitAccount: "",
    creditAccount: "",
    status: "",
    narration: "",
    attachments: null,
    saleDate: "",
  })

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      transactionId: `TXN-${Date.now()}`,
      referenceId: `REF-${Date.now()}`,
    }))
  }, [])

  useEffect(() => {
    if (formData.customerType) {
      setFormData((prev) => ({ ...prev, customerId: "", customerPaymentId: "" }))
    }
  }, [formData.customerType])

  useEffect(() => {
    if (formData.customerId) {
      setFormData((prev) => ({ ...prev, customerPaymentId: "" }))
    }
  }, [formData.customerId])

  useEffect(() => {
    if (formData.transactionType !== "Asset Sale") {
      setFormData((prev) => ({
        ...prev,
        assetType: "",
        assetId: "",
        assetName: "",
        disposalId: "",
      }))
    }
  }, [formData.transactionType])

  useEffect(() => {
    if (formData.assetType) {
      setFormData((prev) => ({ ...prev, assetId: "", assetName: "", disposalId: "" }))
    }
  }, [formData.assetType])

  useEffect(() => {
    if (formData.assetId) {
      const selectedAsset = mockAssetsAwaitingDisposal.find(
        (asset) => asset.id === formData.assetId && asset.status === "awaiting_disposal",
      )
      if (selectedAsset) {
        setFormData((prev) => ({
          ...prev,
          assetName: selectedAsset.name,
          disposalId: selectedAsset.disposalId,
        }))
      }
    }
  }, [formData.assetId])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Sale transaction created successfully!", formData)

    // Map formData to transaction object expected by history
    const transaction = {
      id: formData.transactionId,
      enteredBy: formData.enteredBy,
      approvedBy: formData.approvalId || "",
      date: formData.saleDate,
      type: "Sale",
      subtype: formData.transactionType || "",
      modeCategory: formData.transactionMode || "",
      mode: formData.transactionSubMode || "",
      transactionFor: formData.customerId,
      amount: Number(formData.saleAmount) || 0,
      debitAccount: formData.debitAccount,
      creditAccount: formData.creditAccount,
      narration: formData.narration,
      status: formData.status,
      department: "",
      referenceType: formData.assetType || "",
      customerId: formData.customerId,
    }
    addTransaction(transaction)

    // Reset form after successful submission
    setFormData({
      transactionId: `TXN-${Date.now()}`,
      enteredBy: "EMP-001 (Current User)",
      customerType: "",
      customerId: "",
      customerPaymentId: "",
      approvalId: "",
      saleName: "",
      referenceId: `REF-${Date.now()}`,
      saleAmount: "",
      transactionType: "",
      assetType: "",
      assetId: "",
      assetName: "",
      assetStatus: "Awaiting Disposal",
      disposalId: "",
      transactionMode: "",
      transactionSubMode: "",
      debitAccount: "",
      creditAccount: "",
      status: "",
      narration: "",
      attachments: null,
      saleDate: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="transactionId">Transaction ID</Label>
          <Input id="transactionId" value={formData.transactionId} disabled className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="enteredBy">Entered By</Label>
          <Input id="enteredBy" value={formData.enteredBy} disabled className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="saleDate">Sale Date *</Label>
          <Input
            id="saleDate"
            type="date"
            value={formData.saleDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, saleDate: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerType">Customer Type *</Label>
          <Select
            value={formData.customerType}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, customerType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select customer type" />
            </SelectTrigger>
            <SelectContent>
              {mockCustomerTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerId">Customer ID *</Label>
          <Select
            value={formData.customerId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, customerId: value }))}
            disabled={!formData.customerType}
          >
            <SelectTrigger>
              <SelectValue placeholder={formData.customerType ? "Select customer" : "Select customer type first"} />
            </SelectTrigger>
            <SelectContent>
              {mockCustomers
                .filter((customer) => customer.type === formData.customerType)
                .map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} ({customer.id})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerPaymentId">Customer Payment ID *</Label>
          <Select
            value={formData.customerPaymentId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, customerPaymentId: value }))}
            disabled={!formData.customerId}
          >
            <SelectTrigger>
              <SelectValue placeholder={formData.customerId ? "Select payment ID" : "Select customer first"} />
            </SelectTrigger>
            <SelectContent>
              {mockCustomerPayments
                .filter((payment) => payment.customerId === formData.customerId && payment.status !== "Completed")
                .map((payment) => (
                  <SelectItem key={payment.id} value={payment.id}>
                    {payment.id} ({payment.status}) - ₹{payment.amount.toLocaleString()} (Outstanding: ₹
                    {payment.outstandingAmount.toLocaleString()})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {formData.customerId &&
            mockCustomerPayments.filter((p) => p.customerId === formData.customerId && p.status !== "Completed")
              .length === 0 && <p className="text-xs text-amber-600">No pending payments found for this customer</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="approvalId">Approval ID *</Label>
          <Select
            value={formData.approvalId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, approvalId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select approval" />
            </SelectTrigger>
            <SelectContent>
              {mockApprovals.map((approval) => (
                <SelectItem key={approval.id} value={approval.id}>
                  {approval.name} ({approval.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="saleName">Sale Name *</Label>
          <Input
            id="saleName"
            value={formData.saleName}
            onChange={(e) => setFormData((prev) => ({ ...prev, saleName: e.target.value }))}
            placeholder="Enter sale name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="referenceId">Reference ID</Label>
          <Input id="referenceId" value={formData.referenceId} disabled className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="saleAmount">Sale Amount *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <Input
              id="saleAmount"
              type="number"
              value={formData.saleAmount}
              onChange={(e) => setFormData((prev) => ({ ...prev, saleAmount: e.target.value }))}
              className="pl-8"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionType">Transaction Type *</Label>
          <Select
            value={formData.transactionType}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, transactionType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transaction type" />
            </SelectTrigger>
            <SelectContent>
              {saleTransactionTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.transactionType === "Asset Sale" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="assetType">Asset Type *</Label>
              <Select
                value={formData.assetType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, assetType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  {saleAssetTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assetId">Asset ID *</Label>
              <Select
                value={formData.assetId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, assetId: value }))}
                disabled={!formData.assetType}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.assetType ? "Select asset" : "Select asset type first"} />
                </SelectTrigger>
                <SelectContent>
                  {mockAssetsAwaitingDisposal
                    .filter((asset) => asset.type === formData.assetType && asset.status === "awaiting_disposal")
                    .map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.id} - {asset.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {formData.assetType &&
                mockAssetsAwaitingDisposal.filter(
                  (asset) => asset.type === formData.assetType && asset.status === "awaiting_disposal",
                ).length === 0 && (
                  <p className="text-xs text-amber-600">No assets awaiting disposal found for this type</p>
                )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assetName">Asset Name</Label>
              <Input id="assetName" value={formData.assetName} disabled className="bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assetStatus">Asset Status</Label>
              <Input id="assetStatus" value={formData.assetStatus} disabled className="bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="disposalId">Disposal ID</Label>
              <Input id="disposalId" value={formData.disposalId} disabled className="bg-gray-50" />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="transactionMode">Transaction Mode *</Label>
          <Select
            value={formData.transactionMode}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, transactionMode: value, transactionSubMode: "" }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transaction mode" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(modeCategories).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionSubMode">Transaction Sub Mode *</Label>
          <Select
            value={formData.transactionSubMode}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, transactionSubMode: value }))}
            disabled={!formData.transactionMode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transaction sub mode" />
            </SelectTrigger>
            <SelectContent>
              {formData.transactionMode &&
                modeCategories[formData.transactionMode]?.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {mode}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="debitAccount">Debit Account *</Label>
          <Select
            value={formData.debitAccount}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, debitAccount: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select debit account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account} value={account}>
                  {account}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="creditAccount">Credit Account *</Label>
          <Select
            value={formData.creditAccount}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, creditAccount: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select credit account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account} value={account}>
                  {account}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="narration">Narration</Label>
        <Textarea
          id="narration"
          value={formData.narration}
          onChange={(e) => setFormData((prev) => ({ ...prev, narration: e.target.value }))}
          placeholder="Enter transaction description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="attachments">Attachments</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="attachments"
            type="file"
            onChange={(e) => setFormData((prev) => ({ ...prev, attachments: e.target.files?.[0] || null }))}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <Upload className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create Sale Transaction
      </Button>
    </form>
  )
}

export default function TransactionPage() {
  const [activeTab, setActiveTab] = useState("purchase");
  const defaultTransactions = [
    // Purchase Transactions
    {
      id: "TXN-1734307584123",
      enteredBy: "EMP-001 (John Doe)",
      approvedBy: "EMP-002 (Jane Smith)",
      date: "2024-12-15",
      type: "Purchase",
      subtype: "Asset Purchase",
      modeCategory: "Digital",
      mode: "Bank Transfer",
      transactionFor: "VEND-001",
      amount: 75000,
      debitAccount: "Asset Account",
      creditAccount: "Bank Account",
      narration: "Dell Laptop purchase for IT department",
      status: "Completed",
      department: "IT",
      referenceType: "Asset",
      vendorId: "VEND-004",
    },
    {
      id: "TXN-1734307584124",
      enteredBy: "EMP-003 (Mike Johnson)",
      approvedBy: "EMP-001 (John Doe)",
      date: "2024-12-14",
      type: "Purchase",
      subtype: "Service Purchase",
      modeCategory: "Digital",
      mode: "Credit Card",
      transactionFor: "VEND-002",
      amount: 25000,
      debitAccount: "Service Account",
      creditAccount: "Bank Account",
      narration: "IT consulting services",
      status: "Pending",
      department: "IT",
      referenceType: "Service",
      vendorId: "VEND-002",
    },
    {
      id: "TXN-1734307584125",
      enteredBy: "EMP-002 (Jane Smith)",
      approvedBy: "EMP-004 (Sarah Wilson)",
      date: "2024-12-13",
      type: "Purchase",
      subtype: "Office Supplies",
      modeCategory: "Digital",
      mode: "NEFT",
      transactionFor: "VEND-001",
      amount: 15000,
      debitAccount: "Office Supplies Account",
      creditAccount: "Bank Account",
      narration: "Monthly office supplies purchase",
      status: "Partially Paid",
      department: "Administration",
      referenceType: "Asset",
      vendorId: "VEND-001",
    },
    // Sale Transactions
    {
      id: "TXN-1734307584126",
      enteredBy: "EMP-005 (David Brown)",
      approvedBy: "EMP-002 (Jane Smith)",
      date: "2024-12-12",
      type: "Sale",
      subtype: "Product Sale",
      modeCategory: "Digital",
      mode: "UPI",
      transactionFor: "CUST-001",
      amount: 85000,
      debitAccount: "Cash Account",
      creditAccount: "Sales Account",
      narration: "Software license sale to ABC Corp",
      status: "Completed",
      department: "Sales",
      referenceType: "Product",
      customerId: "CUST-001",
    },
    {
      id: "TXN-1734307584127",
      enteredBy: "EMP-005 (David Brown)",
      approvedBy: "EMP-003 (Mike Johnson)",
      date: "2024-12-11",
      type: "Sale",
      subtype: "Asset Sale",
      modeCategory: "Cheque",
      mode: "Cheque Received",
      transactionFor: "CUST-003",
      amount: 45000,
      debitAccount: "Cash Account",
      creditAccount: "Asset Sale Account",
      narration: "Old office furniture disposal",
      status: "Pending",
      department: "Administration",
      referenceType: "Asset",
      customerId: "CUST-003",
    },
    {
      id: "TXN-1734307584128",
      enteredBy: "EMP-005 (David Brown)",
      approvedBy: "EMP-001 (John Doe)",
      date: "2024-12-10",
      type: "Sale",
      subtype: "Service Sale",
      modeCategory: "Digital",
      mode: "Bank Transfer",
      transactionFor: "CUST-002",
      amount: 120000,
      debitAccount: "Cash Account",
      creditAccount: "Service Revenue Account",
      narration: "Consulting services provided",
      status: "Cancelled",
      department: "Consulting",
      referenceType: "Service",
      customerId: "CUST-002",
    },
    // Internal Transactions
    {
      id: "TXN-1734307584129",
      enteredBy: "EMP-004 (Sarah Wilson)",
      approvedBy: "EMP-001 (John Doe)",
      date: "2024-12-09",
      type: "Internal",
      subtype: "Salary Payment",
      modeCategory: "Digital",
      mode: "NEFT",
      transactionFor: "EMP-007",
      amount: 60000,
      debitAccount: "Salary Account",
      creditAccount: "Bank Account",
      narration: "Monthly salary payment for Tom Wilson",
      status: "Completed",
      department: "HR",
      referenceType: "Salary",
      employeeId: "EMP-007",
    },
    {
      id: "TXN-1734307584130",
      enteredBy: "EMP-004 (Sarah Wilson)",
      approvedBy: "EMP-002 (Jane Smith)",
      date: "2024-12-08",
      type: "Internal",
      subtype: "Liability Payment",
      modeCategory: "Digital",
      mode: "RTGS",
      transactionFor: "LIB-001",
      amount: 50000,
      debitAccount: "Liability Account",
      creditAccount: "Bank Account",
      narration: "Business loan EMI payment",
      status: "Pending",
      department: "Finance",
      referenceType: "Liability",
      liabilityId: "LIB-001",
    },
    {
      id: "TXN-1734307584131",
      enteredBy: "EMP-003 (Mike Johnson)",
      approvedBy: "EMP-004 (Sarah Wilson)",
      date: "2024-12-07",
      type: "Internal",
      subtype: "Investment",
      modeCategory: "Digital",
      mode: "Bank Transfer",
      transactionFor: "REF-001",
      amount: 200000,
      debitAccount: "Investment Account",
      creditAccount: "Bank Account",
      narration: "Equipment investment for expansion",
      status: "Partially Paid",
      department: "Operations",
      referenceType: "Refund/Investment",
    },
    {
      id: "TXN-1734307584132",
      enteredBy: "EMP-006 (Lisa Davis)",
      approvedBy: "EMP-001 (John Doe)",
      date: "2024-12-06",
      type: "Internal",
      subtype: "Salary Payment",
      modeCategory: "Digital",
      mode: "UPI",
      transactionFor: "EMP-002",
      amount: 45000,
      debitAccount: "Salary Account",
      creditAccount: "Bank Account",
      narration: "Monthly salary payment for Jane Smith",
      status: "Completed",
      department: "HR",
      referenceType: "Salary",
      employeeId: "EMP-002",
    },
  ]

  // Load from localStorage if available
  const [transactions, setTransactions] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("transactions")
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          return defaultTransactions
        }
      }
    }
    return defaultTransactions
  })

  // Save to localStorage whenever transactions changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("transactions", JSON.stringify(transactions))
    }
  }, [transactions])

  // Add a new transaction to the top of the list
  const addTransaction = (transaction) => {
    setTransactions((prev) => [transaction, ...prev])
  }

  // States for Transaction History
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Update the filtering logic
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.narration.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Approved":
        return "bg-blue-100 text-blue-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "On Hold":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
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
              <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
              <p className="text-gray-600">Manage financial transactions and records</p>
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
                <CardTitle className="text-lg">Transaction Services</CardTitle>
                <CardDescription>Select a service to access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeTab === "purchase" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("purchase")}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Purchase
                </Button>
                <Button
                  variant={activeTab === "sale" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("sale")}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Sale
                </Button>
                <Button
                  variant={activeTab === "internal" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("internal")}
                >
                  <Building className="h-4 w-4 mr-2" />
                  Internal Transaction
                </Button>
                <Button
                  variant={activeTab === "history" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("history")}
                >
                  <History className="h-4 w-4 mr-2" />
                  Transaction History
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "purchase" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Purchase Transaction
                  </CardTitle>
                  <CardDescription>Create a new purchase transaction</CardDescription>
                </CardHeader>
                <CardContent>
                  <PurchaseTab addTransaction={addTransaction} />
                </CardContent>
              </Card>
            )}

            {activeTab === "sale" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Sale Transaction
                  </CardTitle>
                  <CardDescription>Create a new sale transaction</CardDescription>
                </CardHeader>
                <CardContent>
                  <SaleTab addTransaction={addTransaction} />
                </CardContent>
              </Card>
            )}

            {activeTab === "internal" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Internal Transaction
                  </CardTitle>
                  <CardDescription>Create a new internal transaction</CardDescription>
                </CardHeader>
                <CardContent>
                  <InternalTransactionTab addTransaction={addTransaction} />
                </CardContent>
              </Card>
            )}

            {activeTab === "history" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <History className="h-5 w-5 mr-2" />
                      Transaction History
                    </CardTitle>
                    <CardDescription>View all transaction records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      {/* Search */}
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search by Transaction ID or Transaction For..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      {/* Status Filter */}
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Type Filter */}
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Filter by Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Purchase">Purchase</SelectItem>
                          <SelectItem value="Sale">Sale</SelectItem>
                          <SelectItem value="Internal">Internal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Transaction Cards */}
                <div className="grid gap-6">
                  {filteredTransactions.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p className="text-gray-500">No transactions found matching your criteria.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{transaction.id}</h3>
                              <p className="text-sm text-gray-600">{transaction.date}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Type:</span>
                              <p>
                                {transaction.type} - {transaction.subtype}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Amount:</span>
                              <p className="text-lg font-semibold">₹{transaction.amount.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Mode:</span>
                              <p>
                                {transaction.modeCategory} - {transaction.mode}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Transaction For:</span>
                              <p>{transaction.transactionFor}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Approved By:</span>
                              <p>{transaction.approvedBy}</p>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Debit Account:</span>
                              <p>{transaction.debitAccount}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Credit Account:</span>
                              <p>{transaction.creditAccount}</p>
                            </div>
                          </div>

                          {transaction.narration && (
                            <div className="mt-4">
                              <span className="font-medium text-gray-700">Narration:</span>
                              <p className="text-sm text-gray-600 mt-1">{transaction.narration}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
