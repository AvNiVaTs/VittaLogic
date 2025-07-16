"use client"

import {
  ArrowLeft,
  BarChart3,
  Building2,
  FileText,
  List,
  AlertTriangle,
  Plus,
  Save,
  Edit,
  Trash2,
  Search,
  Upload,
  History,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// Mock data for demonstration
const mockAccounts = [
  {
    id: "ACC001",
    type: "Asset",
    category: "Debit Account",
    name: "Cash in Hand",
    parentId: "",
    description: "Petty cash for daily operations",
    openingBalance: 50000,
    currentBalance: 45000,
    isActive: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    createdBy: "EMP001", // Added createdBy
  },
  {
    id: "ACC002",
    type: "Liability",
    category: "Credit Account",
    name: "Accounts Payable",
    parentId: "",
    description: "Outstanding vendor payments",
    openingBalance: 25000,
    currentBalance: 30000,
    isActive: true,
    createdAt: "2024-01-16",
    updatedAt: "2024-01-22",
    createdBy: "EMP002", // Added createdBy
  },
  {
    id: "ACC003",
    type: "Asset",
    category: "Debit Account",
    name: "Old Equipment Fund",
    parentId: "",
    description: "Deprecated equipment reserve",
    openingBalance: 15000,
    currentBalance: 15000,
    isActive: false,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-25",
    createdBy: "EMP001", // Added createdBy
  },
  {
    id: "ACC004",
    type: "Liability",
    category: "Credit Account",
    name: "Bank Loans Payable",
    parentId: "",
    description: "Outstanding bank loan obligations",
    openingBalance: 500000,
    currentBalance: 450000,
    isActive: true,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-20",
    createdBy: "EMP003", // Added createdBy
  },
  {
    id: "ACC005",
    type: "Liability",
    category: "Credit Account",
    name: "Equipment Finance Payable",
    parentId: "",
    description: "Equipment financing obligations",
    openingBalance: 200000,
    currentBalance: 180000,
    isActive: true,
    createdAt: "2024-01-14",
    updatedAt: "2024-01-22",
    createdBy: "EMP002", // Added createdBy
  },
  {
    id: "ACC006",
    type: "Liability",
    category: "Credit Account",
    name: "Credit Card Payable",
    parentId: "",
    description: "Corporate credit card outstanding balances",
    openingBalance: 50000,
    currentBalance: 35000,
    isActive: true,
    createdAt: "2024-01-16",
    updatedAt: "2024-01-24",
    createdBy: "EMP001", // Added createdBy
  },
]

// Mock financial profile history data
const mockFinancialHistory = [
  {
    financeId: "FIN123456",
    updatedBy: "EMP001 - Admin User",
    reserveCapitalCash: 500000,
    reserveCapitalBank: 1200000,
    reportDate: "2024-01-15",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    financeId: "FIN123455",
    updatedBy: "EMP002 - Finance Manager",
    reserveCapitalCash: 450000,
    reserveCapitalBank: 1150000,
    reportDate: "2024-01-01",
    createdAt: "2024-01-01T09:15:00Z",
  },
  {
    financeId: "FIN123454",
    updatedBy: "EMP001 - Admin User",
    reserveCapitalCash: 400000,
    reserveCapitalBank: 1100000,
    reportDate: "2023-12-15",
    createdAt: "2023-12-15T14:45:00Z",
  },
  {
    financeId: "FIN123453",
    updatedBy: "EMP003 - CFO",
    reserveCapitalCash: 380000,
    reserveCapitalBank: 1050000,
    reportDate: "2023-12-01",
    createdAt: "2023-12-01T11:20:00Z",
  },
  {
    financeId: "FIN123452",
    updatedBy: "EMP002 - Finance Manager",
    reserveCapitalCash: 350000,
    reserveCapitalBank: 1000000,
    reportDate: "2023-11-15",
    createdAt: "2023-11-15T16:30:00Z",
  },
]

// Function to calculate total payable amount based on interest type and payment terms
const calculateTotalPayableAmount = (principal, interestRate, interestType, paymentTerms, startDate, dueDate) => {
  if (interestType === "None" || interestRate === 0) {
    return principal
  }

  // Calculate time period in years
  const start = new Date(startDate)
  const end = new Date(dueDate)
  const timeDiffInMs = end.getTime() - start.getTime()
  const timeDiffInYears = timeDiffInMs / (1000 * 60 * 60 * 24 * 365.25)

  // Determine compounding frequency based on payment terms
  let compoundingFrequency = 1 // Default to yearly
  switch (paymentTerms) {
    case "Monthly":
      compoundingFrequency = 12
      break
    case "Quarterly":
      compoundingFrequency = 4
      break
    case "Yearly":
      compoundingFrequency = 1
      break
    case "One-time":
      compoundingFrequency = 1
      break
  }

  const rate = interestRate / 100 // Convert percentage to decimal

  if (interestType === "Simple") {
    // Simple Interest: I = P × R × T
    const interest = principal * rate * timeDiffInYears
    return principal + interest
  } else if (interestType === "Compound") {
    // Compound Interest: A = P(1 + r/n)^(nt)
    const amount = principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * timeDiffInYears)
    return amount
  }

  return principal
}

const mockLiabilities = [
  {
    id: "LIB001",
    name: "Office Equipment Loan",
    type: "Equipment Loan",
    startDate: "2024-01-01",
    dueDate: "2026-01-01",
    principalAmount: 500000,
    interestType: "Simple",
    interestRate: 8.5,
    paymentTerms: "Monthly",
    currentStatus: "Active",
    priority: "Medium",
    reminderNeeded: true,
    liabilityAccount: "ACC002",
    liabilityVendor: "TechCorp Solutions",
    createdBy: "EMP001",
    totalPayableAmount: calculateTotalPayableAmount(500000, 8.5, "Simple", "Monthly", "2024-01-01", "2026-01-01"),
    paidAmount: 120000,
    remainingAmount: 0, // Will be calculated
    approvalId: "APR004",
  },
  {
    id: "LIB002",
    name: "Bank Loan for Expansion",
    type: "Bank Loan",
    startDate: "2023-12-01",
    dueDate: "2025-12-01",
    principalAmount: 750000,
    interestType: "Compound",
    interestRate: 9.2,
    paymentTerms: "Quarterly",
    currentStatus: "Overdue",
    priority: "High",
    reminderNeeded: true,
    liabilityAccount: "ACC004",
    liabilityVendor: "National Bank Ltd",
    createdBy: "EMP002",
    totalPayableAmount: calculateTotalPayableAmount(750000, 9.2, "Compound", "Quarterly", "2023-12-01", "2025-12-01"),
    paidAmount: 200000,
    remainingAmount: 0, // Will be calculated
    approvalId: "APR009",
  },
  {
    id: "LIB003",
    name: "Credit Facility Setup",
    type: "Credit Card",
    startDate: "2024-02-01",
    dueDate: "2024-08-01",
    principalAmount: 150000,
    interestType: "Simple",
    interestRate: 12.0,
    paymentTerms: "Monthly",
    currentStatus: "Pending",
    priority: "Low",
    reminderNeeded: false,
    liabilityAccount: "ACC006",
    liabilityVendor: "City Credit Union",
    createdBy: "EMP003",
    totalPayableAmount: calculateTotalPayableAmount(150000, 12.0, "Simple", "Monthly", "2024-02-01", "2024-08-01"),
    paidAmount: 0,
    remainingAmount: 0, // Will be calculated
    approvalId: "APR011",
  },
]

// Calculate remaining amounts
mockLiabilities.forEach((liability) => {
  liability.remainingAmount = liability.totalPayableAmount - liability.paidAmount
})

// Mock vendor data for dropdown
const mockVendors = [
  "TechCorp Solutions",
  "National Bank Ltd",
  "City Credit Union",
  "Equipment Finance Co",
  "Business Loans Inc",
  "Capital Partners",
  "Finance First Ltd",
  "Quick Credit Solutions",
]

// Mock approval data - simulating approvals with "liability" category
const mockLiabilityApprovals = [
  {
    id: "APR004",
    approvalId: "APR004",
    approvalFor: "liability",
    reason: "Office furniture replacement",
    priority: "low",
    expenseRange: "50000 - 75000",
    status: "approved",
    senderName: "Alice Brown",
    submittedDate: "2024-01-08",
  },
  {
    id: "APR007",
    approvalId: "APR007",
    approvalFor: "liability",
    reason: "Equipment lease agreement",
    priority: "medium",
    expenseRange: "200000 - 300000",
    status: "approved",
    senderName: "John Smith",
    submittedDate: "2024-01-12",
  },
  {
    id: "APR009",
    approvalId: "APR009",
    approvalFor: "liability",
    reason: "Bank loan for expansion",
    priority: "high",
    expenseRange: "500000 - 750000",
    status: "approved",
    senderName: "Sarah Wilson",
    submittedDate: "2024-01-15",
  },
  {
    id: "APR011",
    approvalId: "APR011",
    approvalFor: "liability",
    reason: "Credit facility setup",
    priority: "medium",
    expenseRange: "100000 - 200000",
    status: "approved",
    senderName: "Mike Johnson",
    submittedDate: "2024-01-18",
  },
]

const accountTypes = [
  "Asset",
  "Liability",
  "Equity",
  "Income",
  "Expense",
  "Asset (Contra)",
  "Income (Contra)",
  "Control Account (Receivables)",
  "Control Account (Payables)",
  "Other Income",
  "Other Expense",
  "Suspense Account",
  "Memo Account",
  "Statistical Account",
  "Budget Account",
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

const interestTypes = ["Simple", "Compound", "None"]
const paymentTerms = ["Monthly", "Quarterly", "Yearly", "One-time"]
const priorityLevels = ["Low", "Medium", "High"]
const statusOptions = ["Active", "Pending", "Completed", "Defaulted", "On Hold", "Overdue"]

const accountCategories = ["Credit Account", "Debit Account"]

export default function FinancialsPage() {
  const [activeSection, setActiveSection] = useState("profile")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [liabilitySearchTerm, setLiabilitySearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [editingAccount, setEditingAccount] = useState(null)
  const [historyDialogFor, setHistoryDialogFor] = useState(null)
  const [editingLiability, setEditingLiability] = useState(null)
  const [accounts, setAccounts] = useState(mockAccounts)
  const [liabilities, setLiabilities] = useState(mockLiabilities)

  // Sorting states for liabilities
  const [sortBy, setSortBy] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")

  // Financial Profile Form State
  const [updatedBy, setUpdatedBy] = useState("EMP001") // Auto-filled from auth
  const [financeId, setFinanceId] = useState("")
  const [reportDate, setReportDate] = useState("")
  const [reserveCapitalCash, setReserveCapitalCash] = useState("")
  const [reserveCapitalBank, setReserveCapitalBank] = useState("")

  // Financial Accounts Form State
  const [accountId, setAccountId] = useState("")
  const [accountType, setAccountType] = useState("")
  const [accountCategory, setAccountCategory] = useState("")
  const [currentBalance, setCurrentBalance] = useState("")
  const [accountName, setAccountName] = useState("")
  const [parentAccountId, setParentAccountId] = useState("")
  const [description, setDescription] = useState("")
  const [openingBalance, setOpeningBalance] = useState("")
  const [isActive, setIsActive] = useState("")
  const [createdAt, setCreatedAt] = useState("")
  const [updatedAt, setUpdatedAt] = useState("")
  const [createdByAccount, setCreatedByAccount] = useState("EMP001") // Added for Financial Accounts

  // Liabilities Form State
  const [liabilityId, setLiabilityId] = useState("")
  const [liabilityName, setLiabilityName] = useState("")
  const [liabilityType, setLiabilityType] = useState("")
  const [startDate, setStartDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [principalAmount, setPrincipalAmount] = useState("")
  const [interestType, setInterestType] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [paymentTermsState, setPaymentTermsState] = useState("")
  const [currentStatus, setCurrentStatus] = useState("")
  const [priority, setPriority] = useState("")
  const [liabilityAccount, setLiabilityAccount] = useState("")
  const [liabilityVendor, setLiabilityVendor] = useState("")
  const [paidAmount, setPaidAmount] = useState("")
  const [attachments, setAttachments] = useState("")
  const [createdBy, setCreatedBy] = useState("EMP001") // Auto-filled from auth
  const [selectedApprovalId, setSelectedApprovalId] = useState("")

  // Generate unique IDs
  useEffect(() => {
    const generateFinanceId = () => {
      const timestamp = Date.now().toString().slice(-6)
      return `FIN${timestamp}`
    }
    const generateLiabilityId = () => {
      const timestamp = Date.now().toString().slice(-6)
      return `LIB${timestamp}`
    }
    setFinanceId(generateFinanceId())
    setLiabilityId(generateLiabilityId())
  }, [])

  // Set current date as default
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0]
    setReportDate(currentDate)
    setCreatedAt(currentDate)
    setUpdatedAt(currentDate)
  }, [])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    setTimeout(() => {
      setSubmitMessage("Financial profile updated successfully!")
      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(""), 3000)
    }, 1000)
  }

  const handleAccountSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    const newAccount = {
      id: accountId,
      type: accountType,
      category: accountCategory,
      name: accountName,
      parentId: parentAccountId,
      description,
      openingBalance: Number.parseFloat(openingBalance),
      currentBalance: Number.parseFloat(currentBalance),
      isActive: isActive === "yes",
      createdAt,
      updatedAt,
      createdBy: createdByAccount, // Added createdByAccount here
    }

    setTimeout(() => {
      setAccounts([...accounts, newAccount])
      setSubmitMessage("Financial account created successfully!")
      // Reset form
      setAccountId("")
      setAccountType("")
      setAccountCategory("")
      setCurrentBalance("")
      setAccountName("")
      setParentAccountId("")
      setDescription("")
      setOpeningBalance("")
      setIsActive("")
      // setCreatedByAccount("EMP001") // Keep default or reset as needed
      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(""), 3000)
    }, 1000)
  }

  const handleLiabilitySubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    const principal = Number.parseFloat(principalAmount)
    const rate = Number.parseFloat(interestRate) || 0
    const paid = Number.parseFloat(paidAmount) || 0
    const totalPayable = calculateTotalPayableAmount(
      principal,
      rate,
      interestType,
      paymentTermsState,
      startDate,
      dueDate,
    )

    const newLiability = {
      id: liabilityId,
      name: liabilityName,
      type: liabilityType,
      startDate,
      dueDate,
      principalAmount: principal,
      interestType,
      interestRate: rate,
      paymentTerms: paymentTermsState,
      currentStatus,
      priority,
      liabilityAccount,
      liabilityVendor,
      createdBy,
      approvalId: selectedApprovalId,
      totalPayableAmount: totalPayable,
      paidAmount: paid,
      remainingAmount: totalPayable - paid,
    }

    setTimeout(() => {
      setLiabilities([...liabilities, newLiability])
      setSubmitMessage("Liability created successfully!")
      // Reset form
      setLiabilityName("")
      setLiabilityType("")
      setStartDate("")
      setDueDate("")
      setPrincipalAmount("")
      setInterestType("")
      setInterestRate("")
      setPaymentTermsState("")
      setCurrentStatus("")
      setPriority("")
      setLiabilityAccount("")
      setLiabilityVendor("")
      setPaidAmount("")
      setAttachments("")
      setSelectedApprovalId("")
      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(""), 3000)
    }, 1000)
  }

  const handleDeleteAccount = (accountId) => {
    setAccounts(accounts.filter((acc) => acc.id !== accountId))
    setSubmitMessage("Account deleted successfully!")
    setTimeout(() => setSubmitMessage(""), 3000)
  }

  const handleDeleteLiability = (liabilityId) => {
    setLiabilities(liabilities.filter((lib) => lib.id !== liabilityId))
    setSubmitMessage("Liability deleted successfully!")
    setTimeout(() => setSubmitMessage(""), 3000)
  }

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "active" && account.isActive) ||
      (activeFilter === "inactive" && !account.isActive)

    return matchesSearch && matchesFilter
  })

  // Get liability accounts for dropdown
  const getLiabilityAccounts = () => {
    return accounts.filter((account) => account.type === "Liability" && account.isActive)
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const getSortedLiabilities = () => {
    let sorted = [...liabilities]

    // Apply search filter
    if (liabilitySearchTerm) {
      sorted = sorted.filter(
        (liability) =>
          liability.name.toLowerCase().includes(liabilitySearchTerm.toLowerCase()) ||
          liability.id.toLowerCase().includes(liabilitySearchTerm.toLowerCase()),
      )
    }

    // Apply sorting
    if (sortBy) {
      sorted.sort((a, b) => {
        let aValue, bValue

        switch (sortBy) {
          case "totalPayable":
            aValue = a.totalPayableAmount
            bValue = b.totalPayableAmount
            break
          case "startDate":
            aValue = new Date(a.startDate)
            bValue = new Date(b.startDate)
            break
          case "dueDate":
            aValue = new Date(a.dueDate)
            bValue = new Date(b.dueDate)
            break
          default:
            return 0
        }

        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    }

    return sorted
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const getPaymentHistory = (liabilityId) => {
    // Mock data simulating transaction schema fetch with more detailed information
    const mockPaymentHistory = {
      LIB001: [
        {
          date: "2024-01-15",
          amount: 25000,
          transactionId: "TXN-1705123456789",
          paymentMethod: "Bank Transfer",
          note: "Monthly EMI payment for January 2024 - Office Equipment Loan",
          status: "Completed",
        },
        {
          date: "2024-02-15",
          amount: 25000,
          transactionId: "TXN-1707715456789",
          paymentMethod: "Bank Transfer",
          note: "Monthly EMI payment for February 2024 - Regular installment",
          status: "Completed",
        },
        {
          date: "2024-03-15",
          amount: 30000,
          transactionId: "TXN-1710307456789",
          paymentMethod: "Bank Transfer",
          note: "Monthly EMI + partial principal payment - Extra payment to reduce interest",
          status: "Completed",
        },
        {
          date: "2024-04-15",
          amount: 25000,
          transactionId: "TXN-1712985456789",
          paymentMethod: "UPI",
          note: "Regular monthly installment - Automated payment",
          status: "Completed",
        },
        {
          date: "2024-05-15",
          amount: 15000,
          transactionId: "TXN-1715577456789",
          paymentMethod: "Bank Transfer",
          note: "Partial payment due to cash flow constraints - Balance to be paid next month",
          status: "Completed",
        },
        {
          date: "2024-06-15",
          amount: 35000,
          transactionId: "TXN-1718255456789",
          paymentMethod: "Bank Transfer",
          note: "Regular EMI + previous month balance - Catching up on missed amount",
          status: "Completed",
        },
      ],
    }

    return mockPaymentHistory[liabilityId] || []
  }

  // Get approved liability approvals for dropdown
  const getApprovedLiabilityApprovals = () => {
    return mockLiabilityApprovals.filter((approval) => approval.status === "approved")
  }

  // Helper function to get interest calculation explanation
  const getInterestExplanation = (liability) => {
    if (liability.interestType === "None" || liability.interestRate === 0) {
      return "No interest applied"
    }

    const principal = liability.principalAmount
    const rate = liability.interestRate
    const terms = liability.paymentTerms

    let frequency = ""
    let periodRate = rate

    switch (terms) {
      case "Monthly":
        frequency = "monthly"
        periodRate = rate / 12
        break
      case "Quarterly":
        frequency = "quarterly"
        periodRate = rate / 4
        break
      case "Yearly":
        frequency = "yearly"
        periodRate = rate
        break
      case "One-time":
        frequency = "one-time"
        periodRate = rate
        break
    }

    if (liability.interestType === "Simple") {
      return `${rate}% simple interest applied ${frequency} (${periodRate.toFixed(2)}% per period)`
    } else if (liability.interestType === "Compound") {
      return `${rate}% compound interest applied ${frequency} (${periodRate.toFixed(2)}% per period, compounded)`
    }

    return ""
  }

  // Helper function to get account name by ID
  const getAccountNameById = (accountId) => {
    const account = accounts.find((acc) => acc.id === accountId)
    return account ? account.name : accountId
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
              <h1 className="text-2xl font-bold text-gray-900">Company Financials</h1>
              <p className="text-gray-600">Manage financial profiles, accounts, and liabilities</p>
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
                <CardTitle className="text-lg">Financial Services</CardTitle>
                <CardDescription>Select a service to manage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeSection === "profile" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("profile")}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Financial Profile
                </Button>
                <Button
                  variant={activeSection === "profileHistory" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("profileHistory")}
                >
                  <History className="h-4 w-4 mr-2" />
                  Profile History
                </Button>
                <Button
                  variant={activeSection === "accounts" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("accounts")}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Financial Accounts
                </Button>
                <Button
                  variant={activeSection === "accountsList" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("accountsList")}
                >
                  <List className="h-4 w-4 mr-2" />
                  Accounts Lists
                </Button>
                <Button
                  variant={activeSection === "liabilities" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("liabilities")}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Liabilities
                </Button>
                <Button
                  variant={activeSection === "liabilitiesList" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("liabilitiesList")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Liabilities List
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

            {/* Financial Profile */}
            {activeSection === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Financial Profile
                  </CardTitle>
                  <CardDescription>Update company financial profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="updatedBy">Updated By</Label>
                        <Input id="updatedBy" value={updatedBy} className="bg-gray-50" readOnly />
                        <p className="text-xs text-gray-500">Auto-filled from authentication</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="financeId">Finance ID</Label>
                        <Input id="financeId" value={financeId} className="bg-gray-50" readOnly />
                        <p className="text-xs text-gray-500">Auto-generated unique ID</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reportDate">Report Date</Label>
                      <Input id="reportDate" type="date" value={reportDate} className="bg-gray-50" readOnly />
                      <p className="text-xs text-gray-500">Automatically entered</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reserveCapitalCash">Reserve Capital Cash *</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <Input
                            id="reserveCapitalCash"
                            type="number"
                            value={reserveCapitalCash}
                            onChange={(e) => setReserveCapitalCash(e.target.value)}
                            placeholder="0.00"
                            className="pl-8"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reserveCapitalBank">Reserve Capital Bank *</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <Input
                            id="reserveCapitalBank"
                            type="number"
                            value={reserveCapitalBank}
                            onChange={(e) => setReserveCapitalBank(e.target.value)}
                            placeholder="0.00"
                            className="pl-8"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Updating Profile..."
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Update Financial Profile
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Financial Profile History */}
            {activeSection === "profileHistory" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="h-5 w-5 mr-2 text-indigo-600" />
                    Financial Profile History
                  </CardTitle>
                  <CardDescription>View all historical financial profile updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      {mockFinancialHistory.map((profile, index) => (
                        <Card key={profile.financeId} className="border-l-4 border-l-indigo-500">
                          <CardContent className="pt-6">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <h3 className="font-semibold text-lg">Finance ID: {profile.financeId}</h3>
                                    {index === 0 && (
                                      <Badge variant="default" className="bg-green-100 text-green-800">
                                        Latest
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">Updated by: {profile.updatedBy}</p>
                                  <p className="text-sm text-gray-600">
                                    Report Date: {new Date(profile.reportDate).toLocaleDateString()}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Created: {new Date(profile.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                  <p className="text-sm font-medium text-blue-700">Reserve Capital Cash</p>
                                  <p className="text-xl font-bold text-blue-800">
                                    ₹{profile.reserveCapitalCash.toLocaleString()}
                                  </p>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg">
                                  <p className="text-sm font-medium text-green-700">Reserve Capital Bank</p>
                                  <p className="text-xl font-bold text-green-800">
                                    ₹{profile.reserveCapitalBank.toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-gray-700">Total Reserve Capital</p>
                                <p className="text-2xl font-bold text-gray-800">
                                  ₹{(profile.reserveCapitalCash + profile.reserveCapitalBank).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {mockFinancialHistory.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No Financial History Found</p>
                        <p className="text-sm">No financial profile updates have been recorded yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Financial Accounts */}
            {activeSection === "accounts" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-green-600" />
                    Financial Accounts
                  </CardTitle>
                  <CardDescription>Create and manage financial accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAccountSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountId">Account ID *</Label>
                        <Input
                          id="accountId"
                          value={accountId}
                          onChange={(e) => setAccountId(e.target.value)}
                          placeholder="e.g., ACC001"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountType">Account Type *</Label>
                        <Select value={accountType} onValueChange={setAccountType} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            {accountTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountCategory">Account Category *</Label>
                      <Select value={accountCategory} onValueChange={setAccountCategory} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account category" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountName">Account Name *</Label>
                      <Input
                        id="accountName"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder="Enter account name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentAccountId">Parent Account ID</Label>
                      <Input
                        id="parentAccountId"
                        value={parentAccountId}
                        onChange={(e) => setParentAccountId(e.target.value)}
                        placeholder="Optional parent account ID"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional account description"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="openingBalance">Opening Balance *</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <Input
                            id="openingBalance"
                            type="number"
                            value={openingBalance}
                            onChange={(e) => setOpeningBalance(e.target.value)}
                            placeholder="0.00"
                            className="pl-8"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currentBalance">Current Balance *</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <Input
                            id="currentBalance"
                            type="number"
                            value={currentBalance}
                            onChange={(e) => setCurrentBalance(e.target.value)}
                            placeholder="0.00"
                            className="pl-8"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="isActive">Is Active *</Label>
                      <Select value={isActive} onValueChange={setIsActive} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="createdAt">Created At</Label>
                        <Input id="createdAt" type="date" value={createdAt} className="bg-gray-50" readOnly />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="updatedAt">Updated At</Label>
                        <Input id="updatedAt" type="date" value={updatedAt} className="bg-gray-50" readOnly />
                      </div>
                    </div>

                    {/* New "Created By" field for Financial Accounts */}
                    <div className="space-y-2">
                      <Label htmlFor="createdByAccount">Created By</Label>
                      <Input id="createdByAccount" value={createdByAccount} className="bg-gray-50" readOnly />
                      <p className="text-xs text-gray-500">Auto-filled from authentication</p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Creating Account..."
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Financial Account
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Accounts List */}
            {activeSection === "accountsList" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <List className="h-5 w-5 mr-2 text-purple-600" />
                    Accounts List
                  </CardTitle>
                  <CardDescription>View and manage all financial accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center space-x-2 flex-1">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search by account name or ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="max-w-sm"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <Select value={activeFilter} onValueChange={setActiveFilter}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Accounts</SelectItem>
                            <SelectItem value="active">Active Only</SelectItem>
                            <SelectItem value="inactive">Inactive Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {filteredAccounts.map((account) => (
                        <Card key={account.id} className="border-l-4 border-l-purple-500">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-lg">{account.name}</h3>
                                  <Badge variant={account.isActive ? "default" : "secondary"}>
                                    {account.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">ID: {account.id}</p>
                                <p className="text-sm text-gray-600">Type: {account.type}</p>
                                <p className="text-sm text-gray-600">Category: {account.category}</p>
                                {account.description && <p className="text-sm text-gray-600">{account.description}</p>}
                                {/* Display Created By */}
                                {account.createdBy && (
                                  <p className="text-sm text-gray-600">Created By: {account.createdBy}</p>
                                )}
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                  <div>
                                    <p className="text-sm font-medium">Opening Balance</p>
                                    <p className="text-lg font-semibold text-green-600">
                                      ₹{account.openingBalance.toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Current Balance</p>
                                    <p className="text-lg font-semibold text-blue-600">
                                      ₹{account.currentBalance.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                {account.isActive && (
                                  <Dialog
                                    open={editingAccount?.id === account.id}
                                    onOpenChange={(open) =>
                                      open ? setEditingAccount(account) : setEditingAccount(null)
                                    }
                                  >
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle>Edit Account Status</DialogTitle>
                                        <DialogDescription>Update account active status</DialogDescription>
                                      </DialogHeader>
                                      {editingAccount && (
                                        <div className="space-y-4 pr-2">
                                          <div className="space-y-2">
                                            <Label>Account Name</Label>
                                            <Input value={editingAccount.name} className="bg-gray-50" readOnly />
                                            <p className="text-xs text-gray-500">Account name cannot be edited</p>
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Account ID</Label>
                                            <Input value={editingAccount.id} className="bg-gray-50" readOnly />
                                            <p className="text-xs text-gray-500">Account ID cannot be edited</p>
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Account Type</Label>
                                            <Input value={editingAccount.type} className="bg-gray-50" readOnly />
                                            <p className="text-xs text-gray-500">Account type cannot be edited</p>
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Account Category</Label>
                                            <Input value={editingAccount.category} className="bg-gray-50" readOnly />
                                            <p className="text-xs text-gray-500">Account category cannot be edited</p>
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea
                                              value={editingAccount.description || ""}
                                              onChange={(e) =>
                                                setEditingAccount({ ...editingAccount, description: e.target.value })
                                              }
                                              rows={3}
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Opening Balance</Label>
                                            <div className="relative">
                                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                ₹
                                              </span>
                                              <Input
                                                type="number"
                                                value={editingAccount.openingBalance}
                                                className="pl-8"
                                                step="0.01"
                                                readOnly // Made read-only
                                              />
                                            </div>
                                            <p className="text-xs text-gray-500">Opening Balance cannot be edited.</p>
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Current Balance</Label>
                                            <div className="relative">
                                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                ₹
                                              </span>
                                              <Input
                                                type="number"
                                                value={editingAccount.currentBalance}
                                                className="pl-8"
                                                step="0.01"
                                                readOnly // Made read-only
                                              />
                                            </div>
                                            <p className="text-xs text-gray-500">Current Balance cannot be edited.</p>
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Is Active</Label>
                                            <Select
                                              value={editingAccount.isActive ? "yes" : "no"}
                                              onValueChange={(value) =>
                                                setEditingAccount({ ...editingAccount, isActive: value === "yes" })
                                              }
                                            >
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="yes">Active</SelectItem>
                                                <SelectItem value="no">Inactive</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <Button
                                            onClick={() => {
                                              setAccounts(
                                                accounts.map((acc) =>
                                                  acc.id === editingAccount.id ? editingAccount : acc,
                                                ),
                                              )
                                              setEditingAccount(null)
                                              setSubmitMessage("Account updated successfully!")
                                              setTimeout(() => setSubmitMessage(""), 3000)
                                            }}
                                            className="w-full"
                                          >
                                            Save Changes
                                          </Button>
                                        </div>
                                      )}
                                    </DialogContent>
                                  </Dialog>
                                )}
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteAccount(account.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {filteredAccounts.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <List className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No Accounts Found</p>
                        <p className="text-sm">
                          {searchTerm || activeFilter !== "all"
                            ? "Try adjusting your search or filter criteria."
                            : "No financial accounts have been created yet."}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Liabilities */}
            {activeSection === "liabilities" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                    Liabilities
                  </CardTitle>
                  <CardDescription>Create and manage company liabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLiabilitySubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="liabilityId">Liability ID</Label>
                        <Input id="liabilityId" value={liabilityId} className="bg-gray-50" readOnly />
                        <p className="text-xs text-gray-500">Auto-generated unique ID</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="liabilityName">Liability Name *</Label>
                        <Input
                          id="liabilityName"
                          value={liabilityName}
                          onChange={(e) => setLiabilityName(e.target.value)}
                          placeholder="Enter liability name"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="liabilityType">Liability Type *</Label>
                      <Select value={liabilityType} onValueChange={setLiabilityType} required>
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
                      <Label htmlFor="selectedApprovalId">Approval ID *</Label>
                      <Select value={selectedApprovalId} onValueChange={setSelectedApprovalId} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select approved liability approval" />
                        </SelectTrigger>
                        <SelectContent>
                          {getApprovedLiabilityApprovals().map((approval) => (
                            <SelectItem key={approval.approvalId} value={approval.approvalId}>
                              <div className="flex flex-col">
                                <span className="font-medium">{approval.approvalId}</span>
                                <span className="text-xs text-gray-500 truncate max-w-xs">
                                  {approval.reason} - ₹{approval.expenseRange}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Select from approved liability approvals only. {getApprovedLiabilityApprovals().length} approved
                        approvals available.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="principalAmount">Principal Amount *</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <Input
                          id="principalAmount"
                          type="number"
                          value={principalAmount}
                          onChange={(e) => setPrincipalAmount(e.target.value)}
                          placeholder="0.00"
                          className="pl-8"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="interestType">Interest Type *</Label>
                        <Select value={interestType} onValueChange={setInterestType} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select interest type" />
                          </SelectTrigger>
                          <SelectContent>
                            {interestTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          Simple: Interest calculated on principal only. Compound: Interest calculated on principal +
                          accumulated interest.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
                        <Input
                          id="interestRate"
                          type="number"
                          value={interestRate}
                          onChange={(e) => setInterestRate(e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          disabled={interestType === "None"}
                        />
                        <p className="text-xs text-gray-500">
                          Annual interest rate. Will be applied based on payment terms.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentTerms">Payment Terms *</Label>
                        <Select value={paymentTermsState} onValueChange={setPaymentTermsState} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentTerms.map((term) => (
                              <SelectItem key={term} value={term}>
                                {term}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          Frequency at which interest is applied. E.g., Quarterly = 4 times per year.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currentStatus">Current Status *</Label>
                        <Select value={currentStatus} onValueChange={setCurrentStatus} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority *</Label>
                      <Select value={priority} onValueChange={setPriority} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorityLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="liabilityAccount">Liability Account *</Label>
                        <Select value={liabilityAccount} onValueChange={setLiabilityAccount} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select liability account" />
                          </SelectTrigger>
                          <SelectContent>
                            {getLiabilityAccounts().map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{account.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {account.id} - Balance: ₹{account.currentBalance.toLocaleString()}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          Select from active liability accounts only. {getLiabilityAccounts().length} liability accounts
                          available.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="liabilityVendor">Liability Vendor *</Label>
                        <Select value={liabilityVendor} onValueChange={setLiabilityVendor} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vendor" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockVendors.map((vendor) => (
                              <SelectItem key={vendor} value={vendor}>
                                {vendor}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paidAmount">Paid Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <Input
                          id="paidAmount"
                          type="number"
                          value={paidAmount}
                          onChange={(e) => setPaidAmount(e.target.value)}
                          placeholder="0.00"
                          className="pl-8"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Amount already paid towards this liability. Leave blank if no payments made yet.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="attachments">Attachments (PDF only)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="attachments"
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setAttachments(e.target.value)}
                        />
                        <Upload className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="createdBy">Created By</Label>
                      <Input id="createdBy" value={createdBy} className="bg-gray-50" readOnly />
                      <p className="text-xs text-gray-500">Auto-filled from authentication</p>
                    </div>

                    {/* Interest Calculation Preview */}
                    {principalAmount &&
                      interestRate &&
                      interestType !== "None" &&
                      paymentTermsState &&
                      startDate &&
                      dueDate && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">Interest Calculation Preview</h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-medium">Principal Amount:</span> ₹
                              {Number.parseFloat(principalAmount).toLocaleString()}
                            </p>
                            <p>
                              <span className="font-medium">Interest Type:</span> {interestType}
                            </p>
                            <p>
                              <span className="font-medium">Annual Interest Rate:</span> {interestRate}%
                            </p>
                            <p>
                              <span className="font-medium">Payment Terms:</span> {paymentTermsState}
                            </p>
                            <p>
                              <span className="font-medium">Estimated Total Payable:</span> ₹
                              {calculateTotalPayableAmount(
                                Number.parseFloat(principalAmount),
                                Number.parseFloat(interestRate),
                                interestType,
                                paymentTermsState,
                                startDate,
                                dueDate,
                              ).toLocaleString()}
                            </p>
                            {paidAmount && (
                              <p>
                                <span className="font-medium">Paid Amount:</span> ₹
                                {Number.parseFloat(paidAmount).toLocaleString()}
                              </p>
                            )}
                            {paidAmount && (
                              <p>
                                <span className="font-medium">Remaining Amount:</span> ₹
                                {(
                                  calculateTotalPayableAmount(
                                    Number.parseFloat(principalAmount),
                                    Number.parseFloat(interestRate),
                                    interestType,
                                    paymentTermsState,
                                    startDate,
                                    dueDate,
                                  ) - Number.parseFloat(paidAmount)
                                ).toLocaleString()}
                              </p>
                            )}
                            <p className="text-blue-600 text-xs mt-2">
                              {getInterestExplanation({
                                principalAmount: Number.parseFloat(principalAmount),
                                interestRate: Number.parseFloat(interestRate),
                                interestType,
                                paymentTerms: paymentTermsState,
                              })}
                            </p>
                          </div>
                        </div>
                      )}

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Creating Liability..."
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Liability
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Liabilities List */}
            {activeSection === "liabilitiesList" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-orange-600" />
                    Liabilities List
                  </CardTitle>
                  <CardDescription>View and manage all company liabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center space-x-2 flex-1">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search by liability name or ID..."
                          value={liabilitySearchTerm}
                          onChange={(e) => setLiabilitySearchTerm(e.target.value)}
                          className="max-w-sm"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSort("totalPayable")}
                          className="flex items-center space-x-1"
                        >
                          {getSortIcon("totalPayable")}
                          <span>Total Payable</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSort("startDate")}
                          className="flex items-center space-x-1"
                        >
                          {getSortIcon("startDate")}
                          <span>Start Date</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSort("dueDate")}
                          className="flex items-center space-x-1"
                        >
                          {getSortIcon("dueDate")}
                          <span>Due Date</span>
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {getSortedLiabilities().map((liability) => (
                        <Card key={liability.id} className="border-l-4 border-l-red-500">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-lg">{liability.name}</h3>
                                  <Badge
                                    variant={
                                      liability.priority === "High"
                                        ? "destructive"
                                        : liability.priority === "Medium"
                                          ? "default"
                                          : "secondary"
                                    }
                                  >
                                    {liability.priority}
                                  </Badge>
                                  <Badge
                                    variant={
                                      liability.currentStatus === "Overdue"
                                        ? "destructive"
                                        : liability.currentStatus === "Active"
                                          ? "default"
                                          : "outline"
                                    }
                                  >
                                    {liability.currentStatus}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">ID: {liability.id}</p>
                                <p className="text-sm text-gray-600">Type: {liability.type}</p>
                                <p className="text-sm text-gray-600">Approval ID: {liability.approvalId}</p>
                                <p className="text-sm text-gray-600">
                                  Liability Account: {getAccountNameById(liability.liabilityAccount)} (
                                  {liability.liabilityAccount})
                                </p>
                                <p className="text-sm text-gray-600">
                                  Start Date: {new Date(liability.startDate).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Due Date: {new Date(liability.dueDate).toLocaleDateString()}
                                </p>

                                {/* Interest Information */}
                                <div className="bg-gray-50 p-3 rounded-lg mt-3">
                                  <p className="text-sm font-medium text-gray-700 mb-1">Interest Details</p>
                                  <p className="text-xs text-gray-600">{getInterestExplanation(liability)}</p>
                                </div>

                                <div className="grid grid-cols-4 gap-4 mt-4">
                                  <div>
                                    <p className="text-sm font-medium">Principal Amount</p>
                                    <p className="text-lg font-semibold text-blue-600">
                                      ₹{liability.principalAmount.toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Total Payable</p>
                                    <p className="text-lg font-semibold text-red-600">
                                      ₹{liability.totalPayableAmount.toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Paid Amount</p>
                                    <p className="text-lg font-semibold text-green-600">
                                      ₹{liability.paidAmount.toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Remaining</p>
                                    <p className="text-lg font-semibold text-orange-600">
                                      ₹{liability.remainingAmount.toLocaleString()}
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-2">
                                  <div>
                                    <p className="text-sm font-medium">Interest Rate</p>
                                    <p className="text-sm">
                                      {liability.interestRate}% ({liability.interestType})
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Payment Terms</p>
                                    <p className="text-sm">{liability.paymentTerms}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col space-y-2">
                                <Dialog
                                  open={editingLiability?.id === liability.id}
                                  onOpenChange={(open) =>
                                    open ? setEditingLiability(liability) : setEditingLiability(null)
                                  }
                                >
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={() => setEditingLiability(liability)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Edit Liability</DialogTitle>
                                      <DialogDescription>Update liability information</DialogDescription>
                                    </DialogHeader>
                                    {editingLiability && (
                                      <div className="space-y-4 pr-2">
                                        <div className="space-y-2">
                                          <Label>Liability Name</Label>
                                          <Input value={editingLiability.name} className="bg-gray-50" readOnly />
                                          <p className="text-xs text-gray-500">Liability name cannot be edited</p>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Liability Type</Label>
                                          <Input value={editingLiability.type} className="bg-gray-50" readOnly />
                                          <p className="text-xs text-gray-500">Liability type cannot be edited</p>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Principal Amount</Label>
                                          <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                              ₹
                                            </span>
                                            <Input
                                              type="number"
                                              value={editingLiability.principalAmount}
                                              onChange={(e) =>
                                                setEditingLiability({
                                                  ...editingLiability,
                                                  principalAmount: Number.parseFloat(e.target.value) || 0,
                                                })
                                              }
                                              className="pl-8"
                                              step="0.01"
                                              min="0"
                                            />
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Paid Amount</Label>
                                          <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                              ₹
                                            </span>
                                            <Input
                                              type="number"
                                              value={editingLiability.paidAmount}
                                              onChange={(e) =>
                                                setEditingLiability({
                                                  ...editingLiability,
                                                  paidAmount: Number.parseFloat(e.target.value) || 0,
                                                })
                                              }
                                              className="pl-8"
                                              step="0.01"
                                              min="0"
                                            />
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Start Date</Label>
                                          <Input
                                            type="date"
                                            value={editingLiability.startDate}
                                            onChange={(e) =>
                                              setEditingLiability({ ...editingLiability, startDate: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Due Date</Label>
                                          <Input
                                            type="date"
                                            value={editingLiability.dueDate}
                                            onChange={(e) =>
                                              setEditingLiability({ ...editingLiability, dueDate: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Interest Type</Label>
                                          <Select
                                            value={editingLiability.interestType}
                                            onValueChange={(value) =>
                                              setEditingLiability({ ...editingLiability, interestType: value })
                                            }
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {interestTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                  {type}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Interest Rate (%)</Label>
                                          <Input
                                            type="number"
                                            value={editingLiability.interestRate}
                                            onChange={(e) =>
                                              setEditingLiability({
                                                ...editingLiability,
                                                interestRate: Number.parseFloat(e.target.value),
                                              })
                                            }
                                            step="0.01"
                                            min="0"
                                            disabled={editingLiability.interestType === "None"}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Payment Terms</Label>
                                          <Select
                                            value={editingLiability.paymentTerms}
                                            onValueChange={(value) =>
                                              setEditingLiability({ ...editingLiability, paymentTerms: value })
                                            }
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {paymentTerms.map((term) => (
                                                <SelectItem key={term} value={term}>
                                                  {term}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Current Status</Label>
                                          <Select
                                            value={editingLiability.currentStatus}
                                            onValueChange={(value) =>
                                              setEditingLiability({ ...editingLiability, currentStatus: value })
                                            }
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {statusOptions.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                  {status}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Priority</Label>
                                          <Select
                                            value={editingLiability.priority}
                                            onValueChange={(value) =>
                                              setEditingLiability({ ...editingLiability, priority: value })
                                            }
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {priorityLevels.map((level) => (
                                                <SelectItem key={level} value={level}>
                                                  {level}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <Button
                                          onClick={() => {
                                            // Recalculate total payable amount with updated values
                                            const updatedLiability = {
                                              ...editingLiability,
                                              totalPayableAmount: calculateTotalPayableAmount(
                                                editingLiability.principalAmount,
                                                editingLiability.interestRate,
                                                editingLiability.interestType,
                                                editingLiability.paymentTerms,
                                                editingLiability.startDate,
                                                editingLiability.dueDate,
                                              ),
                                            }
                                            updatedLiability.remainingAmount =
                                              updatedLiability.totalPayableAmount - updatedLiability.paidAmount

                                            setLiabilities(
                                              liabilities.map((lib) =>
                                                lib.id === editingLiability.id ? updatedLiability : lib,
                                              ),
                                            )
                                            setEditingLiability(null)
                                            setSubmitMessage("Liability updated successfully!")
                                            setTimeout(() => setSubmitMessage(""), 3000)
                                          }}
                                          className="w-full"
                                        >
                                          Save Changes
                                        </Button>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>

                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteLiability(liability.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>

                                <Dialog
                                  open={historyDialogFor?.id === liability.id}
                                  onOpenChange={(open) =>
                                    open ? setHistoryDialogFor(liability) : setHistoryDialogFor(null)
                                  }
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                                    >
                                      <History className="h-4 w-4 mr-1" />
                                      Payment History
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center">
                                        <History className="h-5 w-5 mr-2 text-blue-600" />
                                        Payment History - {liability.name}
                                      </DialogTitle>
                                      <DialogDescription>
                                        All payments made for this liability (automatically fetched from transaction
                                        records)
                                      </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                                      {/* Summary Section */}
                                      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="text-center">
                                          <p className="text-sm font-medium text-gray-600">Principal Amount</p>
                                          <p className="text-lg font-bold text-blue-600">
                                            ₹{liability.principalAmount.toLocaleString()}
                                          </p>
                                        </div>
                                        <div className="text-center">
                                          <p className="text-sm font-medium text-gray-600">Total Payable</p>
                                          <p className="text-lg font-bold text-red-600">
                                            ₹{liability.totalPayableAmount.toLocaleString()}
                                          </p>
                                        </div>
                                        <div className="text-center">
                                          <p className="text-sm font-medium text-gray-600">Total Paid</p>
                                          <p className="text-lg font-bold text-green-600">
                                            ₹{liability.paidAmount.toLocaleString()}
                                          </p>
                                        </div>
                                        <div className="text-center">
                                          <p className="text-sm font-medium text-gray-600">Remaining</p>
                                          <p className="text-lg font-bold text-orange-600">
                                            ₹{liability.remainingAmount.toLocaleString()}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Interest Calculation Details */}
                                      <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-blue-800 mb-2">
                                          Interest Calculation Details
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <p>
                                              <span className="font-medium">Interest Type:</span>{" "}
                                              {liability.interestType}
                                            </p>
                                            <p>
                                              <span className="font-medium">Interest Rate:</span>{" "}
                                              {liability.interestRate}% per annum
                                            </p>
                                          </div>
                                          <div>
                                            <p>
                                              <span className="font-medium">Payment Terms:</span>{" "}
                                              {liability.paymentTerms}
                                            </p>
                                            <p>
                                              <span className="font-medium">Total Interest:</span> ₹
                                              {(
                                                liability.totalPayableAmount - liability.principalAmount
                                              ).toLocaleString()}
                                            </p>
                                          </div>
                                        </div>
                                        <p className="text-blue-600 text-xs mt-2">
                                          {getInterestExplanation(liability)}
                                        </p>
                                      </div>

                                      {/* Payment History Table */}
                                      <div className="border rounded-lg overflow-hidden">
                                        <div className="overflow-x-auto">
                                          <table className="w-full border-collapse min-w-[800px]">
                                            <thead className="bg-gray-100 sticky top-0">
                                              <tr>
                                                <th className="text-left p-3 font-semibold border-b whitespace-nowrap">
                                                  Date of Payment
                                                </th>
                                                <th className="text-left p-3 font-semibold border-b whitespace-nowrap">
                                                  Amount Paid
                                                </th>
                                                <th className="text-left p-3 font-semibold border-b whitespace-nowrap">
                                                  Transaction ID
                                                </th>
                                                <th className="text-left p-3 font-semibold border-b whitespace-nowrap">
                                                  Payment Method
                                                </th>
                                                <th className="text-left p-3 font-semibold border-b min-w-[200px]">
                                                  Note
                                                </th>
                                                <th className="text-left p-3 font-semibold border-b whitespace-nowrap">
                                                  Status
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {getPaymentHistory(liability.id).map((payment, index) => (
                                                <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                                                  <td className="p-3 text-sm whitespace-nowrap">
                                                    {new Date(payment.date).toLocaleDateString("en-IN", {
                                                      day: "2-digit",
                                                      month: "short",
                                                      year: "numeric",
                                                    })}
                                                  </td>
                                                  <td className="p-3 whitespace-nowrap">
                                                    <span className="font-semibold text-green-600 text-sm">
                                                      ₹{payment.amount.toLocaleString()}
                                                    </span>
                                                  </td>
                                                  <td className="p-3 text-sm font-mono text-blue-600 whitespace-nowrap">
                                                    {payment.transactionId || `TXN-${Date.now() + index}`}
                                                  </td>
                                                  <td className="p-3 text-sm whitespace-nowrap">
                                                    <Badge variant="outline" className="text-xs">
                                                      {payment.paymentMethod || "Bank Transfer"}
                                                    </Badge>
                                                  </td>
                                                  <td className="p-3 text-sm text-gray-600 max-w-[250px]">
                                                    <div className="break-words">{payment.note}</div>
                                                  </td>
                                                  <td className="p-3 whitespace-nowrap">
                                                    <Badge
                                                      variant="default"
                                                      className="text-xs bg-green-100 text-green-800"
                                                    >
                                                      Completed
                                                    </Badge>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>

                                        {getPaymentHistory(liability.id).length === 0 && (
                                          <div className="text-center py-12 text-gray-500">
                                            <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p className="text-lg font-medium">No Payment History Found</p>
                                            <p className="text-sm">
                                              No payments have been recorded for this liability yet.
                                            </p>
                                          </div>
                                        )}
                                      </div>

                                      {/* Payment Statistics */}
                                      {getPaymentHistory(liability.id).length > 0 && (
                                        <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                                          <div>
                                            <p className="text-sm font-medium text-blue-700">Total Payments Made</p>
                                            <p className="text-xl font-bold text-blue-800">
                                              {getPaymentHistory(liability.id).length}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-blue-700">Average Payment Amount</p>
                                            <p className="text-xl font-bold text-blue-800">
                                              ₹
                                              {Math.round(
                                                getPaymentHistory(liability.id).reduce(
                                                  (sum, payment) => sum + payment.amount,
                                                  0,
                                                ) / getPaymentHistory(liability.id).length,
                                              ).toLocaleString()}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {getSortedLiabilities().length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No Liabilities Found</p>
                        <p className="text-sm">
                          {liabilitySearchTerm
                            ? "Try adjusting your search criteria."
                            : "No company liabilities have been created yet."}
                        </p>
                      </div>
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
