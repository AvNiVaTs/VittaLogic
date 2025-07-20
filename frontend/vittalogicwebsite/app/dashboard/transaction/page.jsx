"use client"

import { ArrowLeft, Building, DollarSign, History, RefreshCw, Search, ShoppingCart, Upload } from "lucide-react"
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
import { toast } from "@/components/ui/use-toast"

// Authentication
const employee = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("loggedInEmployee")) : null
const LOGGED_IN_EMPLOYEE_ID = employee?.employeeId || null

// Static data
const vendorTypes = [
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

const statuses = ["Pending", "Partially Paid", "Completed", "Cancelled"]

const transactionTypes = {
  Asset: ["Raw Material", "Machinery", "Vehicles", "IT Equipment", "Office Supplies", "Others"],
  Service: ["Consulting", "Legal", "IT Services", "Training", "Security", "Subscriptions", "Others"],
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

function PurchaseTab({ addTransaction }) {
  const [formData, setFormData] = useState({
    transactionId: `TXN-${Date.now()}`,
    enteredBy: LOGGED_IN_EMPLOYEE_ID || "Unknown",
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

  const [departments, setDepartments] = useState([])
  const [vendors, setVendors] = useState([])
  const [vendorPayments, setVendorPayments] = useState([])
  const [approvals, setApprovals] = useState([])
  const [debitAccounts, setDebitAccounts] = useState([])
  const [creditAccounts, setCreditAccounts] = useState([])

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Fetch departments
        const deptResponse = await fetch("http://localhost:8000/api/v1/transaction/dropdown/dept", {
          headers: { Authorization: `Bearer ${employee?.token}` },
        })
        const deptData = await deptResponse.json()
        if (deptData.statusCode === 200) {
          setDepartments(deptData.data)
        }

        // Fetch debit accounts
        const debitResponse = await fetch("http://localhost:8000/api/v1/transaction/dropdown/purchase-debit", {
          headers: { Authorization: `Bearer ${employee?.token}` },
        })
        const debitData = await debitResponse.json()
        if (debitData.statusCode === 200) {
          setDebitAccounts(debitData.data.debitAccounts)
        }

        // Fetch credit accounts
        const creditResponse = await fetch("http://localhost:8000/api/v1/transaction/dropdown/purchase-credit", {
          headers: { Authorization: `Bearer ${employee?.token}` },
        })
        const creditData = await creditResponse.json()
        if (creditData.statusCode === 200) {
          setCreditAccounts(creditData.data.creditAccounts)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch dropdown data",
          variant: "destructive",
        })
      }
    }

    if (LOGGED_IN_EMPLOYEE_ID) {
      fetchDropdownData()
    }
  }, [])

  // Fetch vendors when vendorType changes
  useEffect(() => {
    if (formData.vendorType) {
      const fetchVendors = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/v1/transaction/dropdown/venType?vendorType=${formData.vendorType}`,
            {
              headers: { Authorization: `Bearer ${employee?.token}` },
            }
          )
          const data = await response.json()
          if (data.statusCode === 200) {
            setVendors(data.data)
            setFormData((prev) => ({ ...prev, vendorId: "", paymentId: "" }))
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch vendors",
            variant: "destructive",
          })
        }
      }
      fetchVendors()
    }
  }, [formData.vendorType])

  // Fetch vendor payments when vendorId changes
  useEffect(() => {
    if (formData.vendorId) {
      const fetchPayments = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/v1/transaction/dropdown/venPay?vendorId=${formData.vendorId}`,
            {
              headers: { Authorization: `Bearer ${employee?.token}` },
            }
          )
          const data = await response.json()
          if (data.statusCode === 200) {
            setVendorPayments(data.data)
            setFormData((prev) => ({ ...prev, paymentId: "" }))
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch vendor payments",
            variant: "destructive",
          })
        }
      }
      fetchPayments()
    }
  }, [formData.vendorId])

  // Fetch approvals when component mounts
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/transaction/dropdown/approved", {
          headers: { Authorization: `Bearer ${employee?.token}` },
        })
        const data = await response.json()
        if (data.statusCode === 200) {
          setApprovals(data.data)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch approvals",
          variant: "destructive",
        })
      }
    }
    if (LOGGED_IN_EMPLOYEE_ID) {
      fetchApprovals()
    }
  }, [])

  // Update transactionId and referenceId
  useEffect(() => {
    setFormData((prev) => ({ ...prev, transactionId: `TXN-${Date.now()}` }))
    if (formData.referenceType === "Asset") {
      setFormData((prev) => ({ ...prev, referenceId: `AST-${Date.now()}`, transactionType: "" }))
    } else if (formData.referenceType === "Service") {
      setFormData((prev) => ({ ...prev, referenceId: `SVC-${Date.now()}`, transactionType: "" }))
    } else {
      setFormData((prev) => ({ ...prev, referenceId: "", transactionType: "" }))
    }
  }, [formData.referenceType])

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!LOGGED_IN_EMPLOYEE_ID) {
    toast({
      title: "Error",
      description: "Please log in to create a transaction",
      variant: "destructive",
    });
    return;
  }

  const baseData = {
    departmentWhoPurchased: formData.department,
    purchaseDate: formData.purchaseDate,
    vendorType: formData.vendorType,
    vendorId: formData.vendorId,
    paymentId: formData.paymentId,
    approvalId: formData.approvalId,
    referenceType: formData.referenceType,
    purchaseAmount: formData.purchaseAmount,
    transactionType: formData.transactionType,
    transactionMode: formData.transactionMode,
    transactionSubmode: formData.transactionSubMode,
    debitAccount: formData.debitAccount,
    creditAccount: formData.creditAccount,
    status: formData.status,
    narration: formData.narration,
    createdBy: LOGGED_IN_EMPLOYEE_ID,
  };

  if (formData.referenceType === "Asset") {
    baseData.assetDetails = JSON.stringify({
      name: formData.assetName,
      quantity: Number(formData.quantity),
    });
  } else if (formData.referenceType === "Service") {
    baseData.serviceDetails = JSON.stringify({
      name: formData.serviceName,
      duration: Number(formData.serviceDuration),
    });
  }

  let requestOptions;

  // ✅ If there is a file, use FormData
  if (formData.attachments) {
    const formDataToSend = new FormData();
    Object.entries(baseData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    formDataToSend.append("attachment", formData.attachments);

    requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${employee?.token}`,
      },
      credentials: "include",
      body: formDataToSend,
    };
  } else {
    // ✅ Use plain JSON — avoids the backend's req.body issue
    requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${employee?.token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(baseData),
    };
  }

  try {
    const response = await fetch(
      "http://localhost:8000/api/v1/transaction/purchase/create",
      requestOptions
    );

    const result = await response.json();

    if (result.statusCode === 201) {
      // Success logic...
      toast({
        title: "Success",
        description: "Purchase transaction created successfully!",
      });

      // Reset form here...
    } else {
      throw new Error(result.message || "Failed to create transaction");
    }
  } catch (error) {
    toast({
      title: "Error",
      description: error.message || "Failed to create transaction",
      variant: "destructive",
    });
  }
};


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
              {departments.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
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
              {vendorTypes.map((type) => (
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
              {vendors.map((vendor) => (
                <SelectItem key={vendor.value} value={vendor.value}>
                  {vendor.label}
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
              {vendorPayments.map((payment) => (
                <SelectItem key={payment.value} value={payment.value}>
                  {payment.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.vendorId && vendorPayments.length === 0 && (
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
              {approvals.map((approval) => (
                <SelectItem key={approval.value} value={approval.value}>
                  {approval.label}
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
              {formData.referenceType &&
                transactionTypes[formData.referenceType]?.map((type) => (
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
              {debitAccounts.map((account) => (
                <SelectItem key={account.value} value={account.value}>
                  {account.label}
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
              {creditAccounts.map((account) => (
                <SelectItem key={account.value} value={account.value}>
                  {account.label}
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

const inttransactionTypes = [
    "Income", 
    "Expense", 
    "Transfer", 
    "Investment"
];

// Internal Transaction Tab Component
function InternalTransactionTab({ addTransaction }) {
  const [formData, setFormData] = useState({
    transactionId: `TXN-${Date.now()}`,
    enteredBy: LOGGED_IN_EMPLOYEE_ID || "EMP-001",
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
    payMonth: ""
  })

  const [departments, setDepartments] = useState([])
  const [employees, setEmployees] = useState([])
  const [liabilities, setLiabilities] = useState([])
  const [assets, setAssets] = useState([])
  const [debitAccounts, setDebitAccounts] = useState([])
  const [creditAccounts, setCreditAccounts] = useState([])
  const [approvals, setApprovals] = useState([])

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Fetch departments
        const deptResponse = await fetch("http://localhost:8000/api/v1/transaction/dropdown/salaryDept", {
          headers: { Authorization: `Bearer ${localStorage.getItem("employeeToken")}` }
        })
        const deptData = await deptResponse.json()
        setDepartments(deptData.data || [])

        // Fetch debit accounts
        const debitResponse = await fetch("http://localhost:8000/api/v1/transaction/dropdown/internal-debit", {
          headers: { Authorization: `Bearer ${localStorage.getItem("employeeToken")}` }
        })
        const debitData = await debitResponse.json()
        setDebitAccounts(debitData.data || [])

        // Fetch credit accounts
        const creditResponse = await fetch("http://localhost:8000/api/v1/transaction/dropdown/internal-credit", {
          headers: { Authorization: `Bearer ${localStorage.getItem("employeeToken")}` }
        })
        const creditData = await creditResponse.json()
        setCreditAccounts(creditData.data || [])

        // Note: Approvals endpoint isn't provided, so we'll assume a similar structure
        // You may need to add an endpoint for approvals in your backend
        const approvalResponse = await fetch("http://localhost:8000/api/v1/transaction/dropdown/approve", {
          headers: { Authorization: `Bearer ${localStorage.getItem("employeeToken")}` }
        })
        const approvalData = await approvalResponse.json()
        setApprovals(approvalData.data || [])
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch dropdown data", variant: "destructive" })
      }
    }
    fetchDropdownData()
  }, [])

  // Fetch employees when department or payMonth changes
  useEffect(() => {
    if (formData.referenceType === "Salary" && formData.departmentId && formData.payMonth) {
      const fetchEmployees = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/v1/transaction/dropdown/emp-dept-salary?departmentId=${formData.departmentId}&payMonth=${formData.payMonth}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("employeeToken")}` } }
          )
          const data = await response.json()
          setEmployees(data.data || [])
        } catch (error) {
          toast({ title: "Error", description: "Failed to fetch employees", variant: "destructive" })
        }
      }
      fetchEmployees()
    }
  }, [formData.referenceType, formData.departmentId, formData.payMonth])

  // Fetch liabilities when liabilityType changes
  useEffect(() => {
    if (formData.referenceType === "Liability" && formData.liabilityType) {
      const fetchLiabilities = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/v1/transaction/dropdown/liabilityType?liabilityType=${formData.liabilityType}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("employeeToken")}` } }
          )
          const data = await response.json()
          setLiabilities(data.data || [])
        } catch (error) {
          toast({ title: "Error", description: "Failed to fetch liabilities", variant: "destructive" })
        }
      }
      fetchLiabilities()
    }
  }, [formData.referenceType, formData.liabilityType])

  // Fetch assets when maintenanceAssetType changes
  useEffect(() => {
    if (formData.referenceType === "Maintenance / Repair" && formData.maintenanceAssetType) {
      const fetchAssets = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/v1/transaction/dropdown/asset-repair?assetType=${formData.maintenanceAssetType}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("employeeToken")}` } }
          )
          const data = await response.json()
          setAssets(data.data || [])
        } catch (error) {
          toast({ title: "Error", description: "Failed to fetch assets", variant: "destructive" })
        }
      }
      fetchAssets()
    }
  }, [formData.referenceType, formData.maintenanceAssetType])

  // Update referenceId and amount based on selections
  useEffect(() => {
    if (formData.referenceType === "Salary" && formData.employeeId) {
      const selectedEmployee = employees.find(emp => emp.value === formData.employeeId)
      if (selectedEmployee) {
        setFormData(prev => ({
          ...prev,
          referenceId: selectedEmployee.salaryId,
          amount: selectedEmployee.netSalary?.toString() || ""
        }))
      }
    } else if (formData.referenceType === "Liability" && formData.liabilityId) {
      const selectedLiability = liabilities.find(lib => lib.value === formData.liabilityId)
      if (selectedLiability) {
        setFormData(prev => ({
          ...prev,
          referenceId: selectedLiability.value,
          liabilityName: selectedLiability.label.split(" - ")[0],
          liabilityAmount: selectedLiability.label.match(/₹([\d.]+)/)?.[1] || "",
          amount: selectedLiability.label.match(/₹([\d.]+)/)?.[1] || ""
        }))
      }
    } else if (formData.referenceType === "Refund/Investment") {
      setFormData(prev => ({ ...prev, referenceId: `REF-${Date.now()}` }))
    } else if (formData.referenceType === "Maintenance / Repair" && formData.maintenanceAssetId) {
      const selectedAsset = assets.find(asset => asset.value === formData.maintenanceAssetId)
      if (selectedAsset) {
        setFormData(prev => ({ ...prev, referenceId: selectedAsset.maintenanceId || "" }))
      }
    } else {
      setFormData(prev => ({ ...prev, referenceId: "", amount: "" }))
    }
  }, [formData.referenceType, formData.employeeId, formData.liabilityId, formData.maintenanceAssetId, employees, liabilities, assets])

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!LOGGED_IN_EMPLOYEE_ID) {
    toast({
      title: "Error",
      description: "Please log in to create a transaction",
      variant: "destructive",
    });
    return;
  }

  const baseData = {
    transactionDate: formData.transactionDate,
    approvalId: formData.approvalId,
    referenceType: formData.referenceType,
    amount: formData.amount,
    transactionTypes: formData.transactionType,
    transactionMode: formData.transactionMode,
    transactionSubmode: formData.transactionSubMode,
    debitAccount: formData.debitAccount,
    creditAccount: formData.creditAccount,
    status: formData.status,
    narration: formData.narration,
    createdBy: LOGGED_IN_EMPLOYEE_ID,
  };

  // ✅ Add nested fields as objects, NOT JSON strings
  if (formData.referenceType === "Salary") {
    baseData.salaryDetails = {
      department: formData.departmentId,
      employeeId: formData.employeeId,
      payMonth: formData.payMonth,
    };
  } else if (formData.referenceType === "Liability") {
    baseData.liabilityDetails = {
      liabilityType: formData.liabilityType,
      liabilityName: formData.liabilityName,
    };
  } else if (formData.referenceType === "Refund/Investment") {
    baseData.refundInvestmentDetails = {
      description: formData.expenseName,
    };
  } else if (formData.referenceType === "Maintenance / Repair") {
    baseData.maintenanceRepairDetails = {
      assetType: formData.maintenanceAssetType,
      assetId: formData.maintenanceAssetId,
    };
  }

  let requestOptions;

  if (formData.attachments) {
    const formDataToSend = new FormData();

    Object.entries(baseData).forEach(([key, value]) => {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // Nested objects need to be stringified for FormData
        formDataToSend.append(key, JSON.stringify(value));
      } else {
        formDataToSend.append(key, value);
      }
    });

    formDataToSend.append("attachment", formData.attachments);

    requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${employee?.token}`,
      },
      credentials: "include",
      body: formDataToSend,
    };
  } else {
    requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${employee?.token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(baseData),
    };
  }

  try {
    const response = await fetch(
      "http://localhost:8000/api/v1/transaction/internal/create",
      requestOptions
    );

    const result = await response.json();

    if (result.statusCode === 201) {
      toast({
        title: "Success",
        description: "Internal transaction created successfully!",
      });

      // Optional: Reset form
    } else {
      throw new Error(result.message || "Failed to create transaction");
    }
  } catch (error) {
    toast({
      title: "Error",
      description: error.message || "Something went wrong",
      variant: "destructive",
    });
  }
};

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
              {approvals.map((approval) => (
                <SelectItem key={approval.value} value={approval.value}>
                  {approval.label}
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
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payMonth">Pay Month *</Label>
              <Input
                id="payMonth"
                type="month"
                value={formData.payMonth}
                onChange={(e) => setFormData((prev) => ({ ...prev, payMonth: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, employeeId: value }))}
                disabled={!formData.departmentId || !formData.payMonth}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.departmentId && formData.payMonth ? "Select employee" : "Select department and pay month first"} />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.value} value={employee.value}>
                      {employee.label}
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
                onValueChange={(value) => setFormData((prev) => ({ ...prev, liabilityType: value, liabilityId: "", liabilityName: "", liabilityAmount: "" }))}
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
                  <SelectValue placeholder={formData.liabilityType ? "Select liability" : "Select liability type first"} />
                </SelectTrigger>
                <SelectContent>
                  {liabilities.map((liability) => (
                    <SelectItem key={liability.value} value={liability.value}>
                      {liability.label}
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
                value={formData.maintenanceAssetType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, maintenanceAssetType: value, maintenanceAssetId: "", maintenanceId: "" }))}
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
                value={formData.maintenanceAssetId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, maintenanceAssetId: value }))}
                disabled={!formData.maintenanceAssetType}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.maintenanceAssetType ? "Select asset" : "Select asset type first"} />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.value} value={asset.value}>
                      {asset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.maintenanceAssetType && assets.length === 0 && (
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
              {inttransactionTypes.map((type) => (
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
            onValueChange={(value) => setFormData((prev) => ({ ...prev, transactionMode: value, transactionSubMode: "" }))}
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
              {debitAccounts.map((account) => (
                <SelectItem key={account.value} value={account.value}>
                  {account.label}
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
              {creditAccounts.map((account) => (
                <SelectItem key={account.value} value={account.value}>
                  {account.label}
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

const saleTransactionTypes = [
  "Product Sale", 
  "Service Sale", 
  "Asset Sale",
  "Scrap Sale", 
  "Software/License Sale", 
  "Other Sale"
];

// Sale Tab Component
function SaleTab({ addTransaction }) {
  // State for form data
  const [formData, setFormData] = useState({
    transactionId: `TXN-${Date.now()}`,
    enteredBy: `${LOGGED_IN_EMPLOYEE_ID} (Current User)`,
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

  // State for dropdown options
  const [customerTypes, setCustomerTypes] = useState([
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
  ])
  const [customers, setCustomers] = useState([])
  const [customerPayments, setCustomerPayments] = useState([])
  const [approvals, setApprovals] = useState([])
  const [assets, setAssets] = useState([])
  const [debitAccounts, setDebitAccounts] = useState([])
  const [creditAccounts, setCreditAccounts] = useState([])

  // Loading states
  const [loading, setLoading] = useState({
    customers: false,
    payments: false,
    approvals: false,
    assets: false,
    accounts: false,
    submitting: false
  })

  // Load initial data
  useEffect(() => {
    loadApprovals()
    loadAccounts()
  }, [])

  // Load approvals
  const loadApprovals = async () => {
    try {
      setLoading(prev => ({ ...prev, approvals: true }))
      const token = employee?.token || localStorage.getItem("authToken")
      
      const response = await fetch('http://localhost:8000/api/v1/transaction/dropdown/approvals', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: "include",
      })
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      const data = await response.json()
      setApprovals(data.data || data)
    } catch (error) {
      console.error('Failed to load approvals:', error)
    } finally {
      setLoading(prev => ({ ...prev, approvals: false }))
    }
  }

  // Load debit and credit accounts
  const loadAccounts = async () => {
    try {
      setLoading(prev => ({ ...prev, accounts: true }))
      const token = employee?.token || localStorage.getItem("authToken")
      
      const [debitResponse, creditResponse] = await Promise.all([
        fetch('http://localhost:8000/api/v1/transaction/dropdown/debit-account', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:8000/api/v1/transaction/dropdown/credit-account', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ])
      
      if (!debitResponse.ok || !creditResponse.ok) {
        throw new Error('Failed to load accounts')
      }
      
      const debitData = await debitResponse.json()
      const creditData = await creditResponse.json()
      
      setDebitAccounts([{ label: "N/A", value: "N/A" }, ...(debitData.data || debitData)])
      setCreditAccounts([{ label: "N/A", value: "N/A" }, ...(creditData.data || creditData)])
    } catch (error) {
      console.error('Failed to load accounts:', error)
    } finally {
      setLoading(prev => ({ ...prev, accounts: false }))
    }
  }

  // Load customers by type
  const loadCustomers = async (customerType) => {
    if (!customerType) return
    
    try {
      setLoading(prev => ({ ...prev, customers: true }))
      const token = employee?.token || localStorage.getItem("authToken")
      
      const response = await fetch(`http://localhost:8000/api/v1/transaction/dropdown/customers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: "include",
      })
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      const data = await response.json()
      setCustomers(data.data || data)
    } catch (error) {
      console.error('Failed to load customers:', error)
      setCustomers([])
    } finally {
      setLoading(prev => ({ ...prev, customers: false }))
    }
  }

  // Load customer payments
  const loadCustomerPayments = async (customerId) => {
    if (!customerId) return
    
    try {
      setLoading(prev => ({ ...prev, payments: true }))
      const token = employee?.token || localStorage.getItem("authToken")
      
      const response = await fetch(`http://localhost:8000/api/v1/transaction/dropdown/pending-payment?customerId=${customerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      const data = await response.json()
      setCustomerPayments(data.data || data)
    } catch (error) {
      console.error('Failed to load customer payments:', error)
      setCustomerPayments([])
    } finally {
      setLoading(prev => ({ ...prev, payments: false }))
    }
  }

  // Load assets for sale
  const loadAssets = async (assetType) => {
    if (!assetType) return
    
    try {
      setLoading(prev => ({ ...prev, assets: true }))
      const token = employee?.token || localStorage.getItem("authToken")
      
      const response = await fetch(`http://localhost:8000/api/v1/transaction/dropdown/assets?assetType=${assetType}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      const data = await response.json()
      setAssets(data.data || data)
    } catch (error) {
      console.error('Failed to load assets:', error)
      setAssets([])
    } finally {
      setLoading(prev => ({ ...prev, assets: false }))
    }
  }

  // Load asset details
  const loadAssetDetails = async (assetId) => {
    if (!assetId) return
    
    try {
      const token = employee?.token || localStorage.getItem("authToken")
      
      const response = await fetch(`http://localhost:8000/api/v1/transaction/dropdown/asset-details?assetId=${assetId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      const data = await response.json()
      const assetDetails = data.data || data
      
      setFormData(prev => ({
        ...prev,
        assetName: assetDetails.assetName || '',
        assetStatus: assetDetails.assetStatus || 'Awaiting Disposal',
        disposalId: assetDetails.disposalId || ''
      }))
    } catch (error) {
      console.error('Failed to load asset details:', error)
    }
  }

  // Effect for customer type change
  useEffect(() => {
    if (formData.customerType) {
      loadCustomers(formData.customerType)
      setFormData(prev => ({ ...prev, customerId: "", customerPaymentId: "" }))
      setCustomerPayments([])
    }
  }, [formData.customerType])

  // Effect for customer change
  useEffect(() => {
    if (formData.customerId) {
      loadCustomerPayments(formData.customerId)
      setFormData(prev => ({ ...prev, customerPaymentId: "" }))
    }
  }, [formData.customerId])

  // Effect for transaction type change
  useEffect(() => {
    if (formData.transactionType !== "Asset Sale") {
      setFormData(prev => ({
        ...prev,
        assetType: "",
        assetId: "",
        assetName: "",
        disposalId: "",
      }))
      setAssets([])
    }
  }, [formData.transactionType])

  // Effect for asset type change
  useEffect(() => {
    if (formData.assetType) {
      loadAssets(formData.assetType)
      setFormData(prev => ({ ...prev, assetId: "", assetName: "", disposalId: "" }))
    }
  }, [formData.assetType])

  // Effect for asset ID change
  useEffect(() => {
    if (formData.assetId) {
      loadAssetDetails(formData.assetId)
    }
  }, [formData.assetId])

  // Reset transaction IDs
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      transactionId: `TXN-${Date.now()}`,
      referenceId: `REF-${Date.now()}`,
    }))
  }, [])

  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(prev => ({ ...prev, submitting: true }));

    const payload = {
      saleDate: formData.saleDate,
      customerType: formData.customerType,
      customerId: formData.customerId,
      paymentId: formData.customerPaymentId,
      approvalId: formData.approvalId,
      saleName: formData.saleName,
      saleAmount: formData.saleAmount,
      transactionType: formData.transactionType,
      transactionMode: formData.transactionMode,
      transactionSubmode: formData.transactionSubMode,
      debitAccount: formData.debitAccount,
      creditAccount: formData.creditAccount,
      status: formData.status,
      narration: formData.narration,
      createdBy: employee?.employeeId,
      updatedBy: employee?.employeeId,
    };

    if (formData.transactionType === "Asset Sale") {
      payload.assetDetails = {
        assetType: formData.assetType,
        assetId: formData.assetId,
        assetName: formData.assetName,
        disposalId: formData.disposalId
      };
    }

    const token = employee?.token || localStorage.getItem("authToken");

    const response = await fetch('http://localhost:8000/api/v1/transaction/registerSale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Failed to create sale transaction: ${response.status}`);
    }

    const result = await response.json();
    alert("Sale transaction created successfully!");
    console.log(result);
  } catch (err) {
    console.error("Submission failed:", err);
    alert(err.message);
  } finally {
    setLoading(prev => ({ ...prev, submitting: false }));
  }
};


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
              {customerTypes.map((type) => (
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
            disabled={!formData.customerType || loading.customers}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                loading.customers ? "Loading customers..." : 
                formData.customerType ? "Select customer" : 
                "Select customer type first"
              } />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.value} value={customer.value}>
                  {customer.label}
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
            disabled={!formData.customerId || loading.payments}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                loading.payments ? "Loading payments..." :
                formData.customerId ? "Select payment ID" : 
                "Select customer first"
              } />
            </SelectTrigger>
            <SelectContent>
              {customerPayments.map((payment) => (
                <SelectItem key={payment.value} value={payment.value}>
                  {payment.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.customerId && customerPayments.length === 0 && !loading.payments && (
            <p className="text-xs text-amber-600">No pending payments found for this customer</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="approvalId">Approval ID *</Label>
          <Select
            value={formData.approvalId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, approvalId: value }))}
            disabled={loading.approvals}
          >
            <SelectTrigger>
              <SelectValue placeholder={loading.approvals ? "Loading approvals..." : "Select approval"} />
            </SelectTrigger>
            <SelectContent>
              {approvals.map((approval) => (
                <SelectItem key={approval.value} value={approval.value}>
                  {approval.label}
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
                disabled={!formData.assetType || loading.assets}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    loading.assets ? "Loading assets..." :
                    formData.assetType ? "Select asset" : 
                    "Select asset type first"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.value} value={asset.value}>
                      {asset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.assetType && assets.length === 0 && !loading.assets && (
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
            disabled={loading.accounts}
          >
            <SelectTrigger>
              <SelectValue placeholder={loading.accounts ? "Loading accounts..." : "Select debit account"} />
            </SelectTrigger>
            <SelectContent>
              {debitAccounts.map((account) => (
                <SelectItem key={account.value} value={account.value}>
                  {account.label}
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
            disabled={loading.accounts}
          >
            <SelectTrigger>
              <SelectValue placeholder={loading.accounts ? "Loading accounts..." : "Select credit account"} />
            </SelectTrigger>
            <SelectContent>
              {creditAccounts.map((account) => (
                <SelectItem key={account.value} value={account.value}>
                  {account.label}
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

      <Button type="submit" className="w-full" disabled={loading.submitting}>
        {loading.submitting ? "Creating Sale Transaction..." : "Create Sale Transaction"}
      </Button>
    </form>
  )
}

export default function TransactionPage() {
  const [activeTab, setActiveTab] = useState("purchase");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // States for Transaction History
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    if (!LOGGED_IN_EMPLOYEE_ID) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      
      // Add search term if exists
      if (searchTerm.trim()) {
        queryParams.append('transactionId', searchTerm.trim());
      }
      
      // Add status filter if not "all"
      if (statusFilter !== "all") {
        queryParams.append('status', statusFilter);
      }
      
      // Add type filter if not "all"
      if (typeFilter !== "all") {
        queryParams.append('type', typeFilter);
      }

      const url = `http://localhost:8000/api/v1/transaction/history${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if you have authentication tokens
          // 'Authorization': `Bearer ${token}`,
        },
        credentials: 'include', // Include cookies if using session-based auth
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Transform backend data to match frontend format
        const transformedTransactions = data.data.map(tx => ({
          id: tx.transactionId,
          enteredBy: tx.enteredBy || 'N/A',
          approvedBy: tx.approvalId || 'N/A',
          date: formatDate(tx.transactionDate),
          type: tx.source, // "Purchase", "Sale", "Internal"
          subtype: tx.transactionType.split(' - ')[1] || tx.transactionType,
          modeCategory: tx.mode.split(' - ')[0] || 'Digital',
          mode: tx.mode.split(' - ')[1] || tx.mode,
          transactionFor: tx.referenceId || 'N/A',
          amount: tx.amount,
          debitAccount: tx.debitAccount || 'N/A',
          creditAccount: tx.creditAccount || 'N/A',
          narration: tx.narration || '',
          status: tx.status,
          department: 'N/A', // This might need to be added to backend
          referenceType: tx.transactionType.split(' - ')[1] || 'N/A',
          // Add specific IDs based on transaction type
          vendorId: tx.source === 'Purchase' ? tx.referenceId : undefined,
          customerId: tx.source === 'Sale' ? tx.referenceId : undefined,
          employeeId: tx.source === 'Internal' ? tx.referenceId : undefined,
        }));
        
        setTransactions(transformedTransactions);
      } else {
        throw new Error(data.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Failed to fetch transactions');
      setTransactions([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    } catch (error) {
      return dateString;
    }
  };

  // Fetch transactions when component mounts or filters change
  useEffect(() => {
    if (activeTab === "history") {
      fetchTransactions();
    }
  }, [activeTab, searchTerm, statusFilter, typeFilter, LOGGED_IN_EMPLOYEE_ID]);

  // Add a new transaction and refresh the list
  const addTransaction = async (transaction) => {
    // This would typically be handled by individual tab components
    // After successfully creating a transaction, refresh the list
    await fetchTransactions();
  };

  // Client-side filtering (you can remove this if backend handles all filtering)
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = !searchTerm || (
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.narration.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-blue-100 text-blue-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Partially Paid":
        return "bg-orange-100 text-orange-800";
      case "On Hold":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Available statuses for the filter dropdown
  const statuses = ["Completed", "Pending", "Approved", "Rejected", "Cancelled", "Partially Paid", "On Hold"];

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
                            placeholder="Search by Transaction ID..."
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

                      {/* Refresh Button */}
                      <Button 
                        onClick={fetchTransactions} 
                        disabled={loading}
                        variant="outline"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Authentication Error */}
                    {!LOGGED_IN_EMPLOYEE_ID && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        Please log in to view transaction history.
                      </div>
                    )}

                    {/* Error Display */}
                    {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        Error: {error}
                        <Button 
                          onClick={fetchTransactions} 
                          size="sm" 
                          variant="outline" 
                          className="ml-2"
                        >
                          Retry
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Loading State */}
                {loading && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading transactions...</p>
                    </CardContent>
                  </Card>
                )}

                {/* Transaction Cards */}
                {!loading && (
                  <div className="grid gap-6">
                    {filteredTransactions.length === 0 ? (
                      <Card>
                        <CardContent className="text-center py-8">
                          <p className="text-gray-500">
                            {error ? "Failed to load transactions." : "No transactions found matching your criteria."}
                          </p>
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
                                <p className="text-lg font-semibold">₹{transaction.amount?.toLocaleString()}</p>
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
                                <span className="font-medium text-gray-700">Entered By:</span>
                                <p>{transaction.enteredBy}</p>
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
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}