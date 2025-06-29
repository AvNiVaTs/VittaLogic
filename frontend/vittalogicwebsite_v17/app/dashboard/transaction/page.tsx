"use client"

import { ArrowLeft, History, Search, Edit, Trash2, Upload, ShoppingCart, DollarSign, Building } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Mock data
const mockVendors = [
  { id: "VEND-001", name: "ABC Suppliers" },
  { id: "VEND-002", name: "XYZ Services" },
  { id: "VEND-003", name: "Office Supplies Co" },
  { id: "VEND-004", name: "Tech Solutions Ltd" },
]

const mockCustomers = [
  { id: "CUST-001", name: "ABC Corp" },
  { id: "CUST-002", name: "XYZ Ltd" },
  { id: "CUST-003", name: "Global Industries" },
  { id: "CUST-004", name: "Tech Innovations" },
]

const mockEmployees = [
  { id: "EMP-001", name: "John Doe", department: "Sales", salaryId: "SAL-001" },
  { id: "EMP-002", name: "Jane Smith", department: "Marketing", salaryId: "SAL-002" },
  { id: "EMP-003", name: "Mike Johnson", department: "Administration", salaryId: "SAL-003" },
  { id: "EMP-004", name: "Sarah Wilson", department: "Finance", salaryId: "SAL-004" },
]

const mockPayments = [
  { id: "PAY-001", status: "Pending" },
  { id: "PAY-002", status: "Processing" },
  { id: "PAY-003", status: "Approved" },
  { id: "PAY-004", status: "Completed" },
]

const mockApprovals = [
  { id: "APPR-001", name: "Manager Approval" },
  { id: "APPR-002", name: "Finance Approval" },
  { id: "APPR-003", name: "Director Approval" },
]

const departments = ["Sales", "Marketing", "Administration", "Finance", "HR", "IT", "Operations"]
const accounts = [
  "Cash Account",
  "Bank Account",
  "Sales Account",
  "Purchase Account",
  "Office Supplies Account",
  "Salary Account",
]
const statuses = ["Pending", "Approved", "Completed", "Rejected", "On Hold"]

const transactionTypes = {
  Income: ["Sales Revenue", "Service Income", "Interest Income", "Other Income"],
  Expense: ["Office Supplies", "Utilities", "Rent", "Salaries", "Travel", "Other Expense"],
  Transfer: ["Internal Transfer", "Bank Transfer", "Cash Transfer"],
  Investment: ["Equipment Purchase", "Asset Purchase", "Stock Investment"],
}

const modeCategories = {
  Digital: ["Bank Transfer", "UPI", "Credit Card", "Debit Card", "Net Banking"],
  Cash: ["Cash Payment", "Cash Receipt"],
  Cheque: ["Cheque Payment", "Cheque Receipt", "DD", "Pay Order"],
}

// Purchase Tab Component
function PurchaseTab() {
  const [formData, setFormData] = useState({
    transactionId: `TXN-${Date.now()}`,
    enteredBy: "EMP-001 (Current User)",
    vendorId: "",
    approvalId: "",
    referenceType: "",
    assetName: "",
    quantity: "",
    serviceName: "",
    serviceDuration: "",
    referenceId: "",
    purchaseAmount: "",
    transactionType: "",
    transactionSubtype: "",
    transactionMode: "",
    transactionSubMode: "",
    paymentId: "",
    debitAccount: "",
    creditAccount: "",
    status: "",
    department: "",
    narration: "",
    attachments: null,
  })

  useEffect(() => {
    setFormData((prev) => ({ ...prev, transactionId: `TXN-${Date.now()}` }))
  }, [])

  useEffect(() => {
    if (formData.referenceType === "Asset") {
      setFormData((prev) => ({ ...prev, referenceId: `AST-${Date.now()}` }))
    } else if (formData.referenceType === "Service") {
      setFormData((prev) => ({ ...prev, referenceId: `SVC-${Date.now()}` }))
    } else {
      setFormData((prev) => ({ ...prev, referenceId: "" }))
    }
  }, [formData.referenceType])

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Purchase transaction created successfully!")
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
          <Label htmlFor="vendorId">Vendor ID *</Label>
          <Select
            value={formData.vendorId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, vendorId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select vendor" />
            </SelectTrigger>
            <SelectContent>
              {mockVendors.map((vendor) => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  {vendor.name} ({vendor.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, transactionType: value, transactionSubtype: "" }))
            }
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
          <Label htmlFor="transactionSubtype">Transaction Subtype *</Label>
          <Select
            value={formData.transactionSubtype}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, transactionSubtype: value }))}
            disabled={!formData.transactionType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transaction subtype" />
            </SelectTrigger>
            <SelectContent>
              {formData.transactionType &&
                transactionTypes[formData.transactionType]?.map((subtype) => (
                  <SelectItem key={subtype} value={subtype}>
                    {subtype}
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
          <Label htmlFor="paymentId">Payment ID *</Label>
          <Select
            value={formData.paymentId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment ID" />
            </SelectTrigger>
            <SelectContent>
              {mockPayments
                .filter((payment) => payment.status !== "Completed")
                .map((payment) => (
                  <SelectItem key={payment.id} value={payment.id}>
                    {payment.id} ({payment.status})
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

        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
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

// Sale Tab Component
function SaleTab() {
  const [formData, setFormData] = useState({
    transactionId: `TXN-${Date.now()}`,
    enteredBy: "EMP-001 (Current User)",
    customerId: "",
    approvalId: "",
    saleName: "",
    referenceId: `SAL-${Date.now()}`,
    saleAmount: "",
    transactionType: "",
    transactionSubtype: "",
    transactionMode: "",
    transactionSubMode: "",
    paymentId: "",
    debitAccount: "",
    creditAccount: "",
    status: "",
    department: "",
    narration: "",
    attachments: null,
  })

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      transactionId: `TXN-${Date.now()}`,
      referenceId: `SAL-${Date.now()}`,
    }))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.customerId || !formData.saleName || !formData.saleAmount || !formData.paymentId) {
      alert("Please fill in all required fields")
      return
    }

    alert("Sale transaction created successfully!")
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
          <Label htmlFor="customerId">Customer ID *</Label>
          <Select
            value={formData.customerId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, customerId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {mockCustomers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name} ({customer.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="approvalId">Approval ID (Optional)</Label>
          <Select
            value={formData.approvalId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, approvalId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select approval (optional)" />
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
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, transactionType: value, transactionSubtype: "" }))
            }
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
          <Label htmlFor="transactionSubtype">Transaction Subtype *</Label>
          <Select
            value={formData.transactionSubtype}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, transactionSubtype: value }))}
            disabled={!formData.transactionType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transaction subtype" />
            </SelectTrigger>
            <SelectContent>
              {formData.transactionType &&
                transactionTypes[formData.transactionType]?.map((subtype) => (
                  <SelectItem key={subtype} value={subtype}>
                    {subtype}
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
          <Label htmlFor="paymentId">Payment ID *</Label>
          <Select
            value={formData.paymentId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment ID" />
            </SelectTrigger>
            <SelectContent>
              {mockPayments
                .filter((payment) => payment.status !== "Completed")
                .map((payment) => (
                  <SelectItem key={payment.id} value={payment.id}>
                    {payment.id} ({payment.status})
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

        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
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

// Internal Transaction Tab Component
function InternalTransactionTab() {
  const [formData, setFormData] = useState({
    transactionId: `TXN-${Date.now()}`,
    enteredBy: "EMP-001 (Current User)",
    approvalId: "",
    referenceType: "",
    departmentId: "",
    employeeId: "",
    expenseName: "",
    referenceId: "",
    amount: "",
    transactionType: "",
    transactionSubtype: "",
    transactionMode: "",
    transactionSubMode: "",
    debitAccount: "",
    creditAccount: "",
    status: "",
    narration: "",
    attachments: null,
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
          amount: "50000", // Mock salary amount
        }))
      }
    } else if (formData.referenceType === "Office Expenses/Utilities") {
      setFormData((prev) => ({ ...prev, referenceId: `EXP-${Date.now()}` }))
    } else {
      setFormData((prev) => ({ ...prev, referenceId: "", amount: "" }))
    }
  }, [formData.referenceType, formData.employeeId])

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Internal transaction created successfully!")
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
              <SelectItem value="Office Expenses/Utilities">Office Expenses/Utilities</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.referenceType === "Salary" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="departmentId">Department ID *</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, departmentId: value }))}
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
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees
                    .filter((emp) => emp.department === formData.departmentId)
                    .map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} ({employee.id})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {formData.referenceType === "Office Expenses/Utilities" && (
          <div className="space-y-2">
            <Label htmlFor="expenseName">Expense Name *</Label>
            <Input
              id="expenseName"
              value={formData.expenseName}
              onChange={(e) => setFormData((prev) => ({ ...prev, expenseName: e.target.value }))}
              placeholder="Enter expense name"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="referenceId">Reference ID</Label>
          <Input id="referenceId" value={formData.referenceId} disabled className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">{formData.referenceType === "Salary" ? "Salary Amount" : "Amount"} *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              className="pl-8"
              placeholder="0.00"
              disabled={formData.referenceType === "Salary"}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionType">Transaction Type *</Label>
          <Select
            value={formData.transactionType}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, transactionType: value, transactionSubtype: "" }))
            }
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
          <Label htmlFor="transactionSubtype">Transaction Subtype *</Label>
          <Select
            value={formData.transactionSubtype}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, transactionSubtype: value }))}
            disabled={!formData.transactionType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transaction subtype" />
            </SelectTrigger>
            <SelectContent>
              {formData.transactionType &&
                transactionTypes[formData.transactionType]?.map((subtype) => (
                  <SelectItem key={subtype} value={subtype}>
                    {subtype}
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
        Create Internal Transaction
      </Button>
    </form>
  )
}

export default function TransactionPage() {
  const [activeTab, setActiveTab] = useState("purchase")
  const [transactions, setTransactions] = useState([
    {
      id: "TXN-1734307584123",
      enteredBy: "EMP-001 (John Doe)",
      approvedBy: "EMP-002 (Jane Smith)",
      date: "2024-12-15",
      type: "Income",
      subtype: "Sales Revenue",
      modeCategory: "Digital",
      mode: "Bank Transfer",
      transactionFor: "CUST-001",
      amount: 50000,
      debitAccount: "Cash Account",
      creditAccount: "Sales Account",
      narration: "Payment received from customer",
      status: "Completed",
      department: "Sales",
    },
    {
      id: "TXN-1734307584124",
      enteredBy: "EMP-003 (Mike Johnson)",
      approvedBy: "EMP-001 (John Doe)",
      date: "2024-12-14",
      type: "Expense",
      subtype: "Office Supplies",
      modeCategory: "Digital",
      mode: "Credit Card",
      transactionFor: "VEND-001",
      amount: 15000,
      debitAccount: "Office Supplies Account",
      creditAccount: "Bank Account",
      narration: "Office supplies purchase",
      status: "Pending",
      department: "Administration",
    },
  ])

  // States for Transaction History
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEdit = (transaction) => {
    setEditingTransaction({ ...transaction })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    setTransactions((prev) => prev.map((t) => (t.id === editingTransaction.id ? editingTransaction : t)))
    setIsEditDialogOpen(false)
    setEditingTransaction(null)
    alert("Transaction updated successfully!")
  }

  const handleDelete = (transactionId) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      setTransactions((prev) => prev.filter((t) => t.id !== transactionId))
      alert("Transaction deleted successfully!")
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionFor.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <PurchaseTab />
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
                  <SaleTab />
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
                  <InternalTransactionTab />
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
                    <CardDescription>View and manage all transaction records</CardDescription>
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
                          {Object.keys(transactionTypes).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
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
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(transaction)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(transaction.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
                              <span className="font-medium text-gray-700">Department:</span>
                              <p>{transaction.department}</p>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>Update transaction details</DialogDescription>
          </DialogHeader>

          {editingTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Approved By</Label>
                  <Input
                    value={editingTransaction.approvedBy}
                    onChange={(e) => setEditingTransaction((prev) => ({ ...prev, approvedBy: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Transaction Date</Label>
                  <Input
                    type="date"
                    value={editingTransaction.date}
                    onChange={(e) => setEditingTransaction((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <Input
                      type="number"
                      value={editingTransaction.amount}
                      onChange={(e) =>
                        setEditingTransaction((prev) => ({ ...prev, amount: Number.parseFloat(e.target.value) }))
                      }
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editingTransaction.status}
                    onValueChange={(value) => setEditingTransaction((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                <Label>Narration</Label>
                <Textarea
                  value={editingTransaction.narration}
                  onChange={(e) => setEditingTransaction((prev) => ({ ...prev, narration: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
