"use client"

import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  Building2,
  Edit,
  FileText,
  Filter,
  History,
  List,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const employee = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("loggedInEmployee")) : null

const LOGGED_IN_EMPLOYEE_ID = employee?.employeeId || null

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

const accountTypes = [
  "Asset",
  "Cash",
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
  const [accounts, setAccounts] = useState([])
  const [liabilities, setLiabilities] = useState([])
  const [financialHistory, setFinancialHistory] = useState([])
  const [vendors, setVendors] = useState([])
  const [approvals, setApprovals] = useState([])
  const [paymentHistory, setPaymentHistory] = useState({}) // Store payment history by liability ID
  const [isLoadingHistory, setIsLoadingHistory] = useState({}) // Track loading state by liability ID
  const [errorHistory, setErrorHistory] = useState({}) // Track errors by liability ID

  // Sorting states for liabilities
  const [sortBy, setSortBy] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")

  // Financial Profile Form State
  const [updatedBy, setUpdatedBy] = useState(LOGGED_IN_EMPLOYEE_ID) // Should come from auth context
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
  const [createdByAccount, setCreatedByAccount] = useState(LOGGED_IN_EMPLOYEE_ID) // Should come from auth

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
  const [attachments, setAttachments] = useState(null)
  const [createdBy, setCreatedBy] = useState(LOGGED_IN_EMPLOYEE_ID) // Should come from auth
  const [selectedApprovalId, setSelectedApprovalId] = useState("")

  // API base URL (adjust based on your backend setup)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch financial profiles
        const profilesResponse = await fetch(`http://localhost:8000/api/v1/company/`, {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
        const profilesData = await profilesResponse.json()
        if (profilesData.statusCode === 200) {
          setFinancialHistory(profilesData.data)
        }

        // Fetch accounts
        const accountsResponse = await fetch(`http://localhost:8000/api/v1/company/accounts/`, {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
        const accountsData = await accountsResponse.json()
        if (accountsData.statusCode === 200) {
          setAccounts(accountsData.data)
        }

        // Fetch liabilities
        
const liabilitiesResponse = await fetch(`http://localhost:8000/api/v1/use/getAll`, {
  headers: { "Content-Type": "application/json" },
  credentials: "include",
});

const liabilitiesData = await liabilitiesResponse.json();

if (liabilitiesData.statusCode === 200) {
  const normalizedLiabilities = liabilitiesData.data.map((liability) => {
    const principalAmount = Number(liability.principle_amount?.$numberDecimal || 0);
    const interestRate = Number(liability.interest_rate?.$numberDecimal || 0);
    const paidAmount = Number(liability.paid_amount?.$numberDecimal || 0);
    const totalPayableAmount = Number(liability.calculated_payment_amount?.$numberDecimal || 0);

    return {
      id: liability.liability_id,
      name: liability.liability_name,
      type: liability.liability_type,
      approvalId: liability.approval_id,
      liabilityAccount: liability.liability_account,
      startDate: liability.start_date,
      dueDate: liability.due_date,
      principalAmount,
      interestRate,
      paidAmount,
      totalPayableAmount:
        totalPayableAmount ||
        calculateTotalPayableAmount(
          principalAmount,
          interestRate,
          liability.interest_type || "None",
          liability.payment_terms || "One-time",
          liability.start_date,
          liability.due_date
        ),
      remainingAmount:
        (totalPayableAmount ||
          calculateTotalPayableAmount(
            principalAmount,
            interestRate,
            liability.interest_type || "None",
            liability.payment_terms || "One-time",
            liability.start_date,
            liability.due_date
          )) - paidAmount,
      interestType: liability.interest_type || "None",
      paymentTerms: liability.payment_terms || "One-time",
      priority: liability.priority || "Low",
      currentStatus: liability.current_status || "Active",
    };
  });

  setLiabilities(normalizedLiabilities);
}


        // Fetch vendors
        const vendorsResponse = await fetch(`http://localhost:8000/api/v1/use/dropdown/vendors`, {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
        const vendorsData = await vendorsResponse.json()
        if (vendorsData.statusCode === 200) {
          setVendors(vendorsData.data)
        }

        // Fetch approvals
        const approvalsResponse = await fetch(`http://localhost:8000/api/v1/use/dropdown/approvals`, {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
        const approvalsData = await approvalsResponse.json()
        if (approvalsData.statusCode === 200) {
          setApprovals(approvalsData.data)
        }
      } catch (error) {
        setSubmitMessage("Error fetching initial data")
        setTimeout(() => setSubmitMessage(""), 3000)
      }
    }

    fetchInitialData()
    

    // Set current date as default
    const currentDate = new Date().toISOString().split("T")[0]
    setReportDate(currentDate)
    setCreatedAt(currentDate)
    setUpdatedAt(currentDate)
  }, [])

  // Generate unique IDs (still needed for form display, but backend generates actual IDs)
  useEffect(() => {
    const generateFinanceId = () => {
      const timestamp = Date.now().toString().slice(-6)
      return `FIN${timestamp}`
    }
    const generateLiabilityId = () => {
      const timestamp = Date.now().toString().slice(-6)
      return `LIAB${timestamp}`
    }
    setFinanceId(generateFinanceId())
    setLiabilityId(generateLiabilityId())
  }, [])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const response = await fetch(`http://localhost:8000/api/v1/company/createProfile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          reserve_capital_cash: Number(reserveCapitalCash),
          reserve_capital_bank: Number(reserveCapitalBank),
          updatedBy,
          createdBy: updatedBy,
        }),
      })
      const data = await response.json()
      if (data.statusCode === 200) {
        setFinancialHistory([data.data, ...financialHistory])
        setSubmitMessage("Financial profile created successfully!")
        // Reset form
        setReserveCapitalCash("")
        setReserveCapitalBank("")
      } else {
        setSubmitMessage(data.message || "Error creating financial profile")
      }
    } catch (error) {
      setSubmitMessage("Error creating financial profile")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(""), 3000)
    }
  }

  const handleAccountSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const response = await fetch(`http://localhost:8000/api/v1/company/createAcc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          account_type: accountType,
          account_category: accountCategory,
          account_name: accountName,
          parent_account_id: parentAccountId,
          description,
          opening_balance: Number(openingBalance),
          createdBy: createdByAccount,
          updatedBy: createdByAccount,
        }),
      })
      const data = await response.json()
      if (data.statusCode === 200) {
        setAccounts([data.data, ...accounts])
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
      } else {
        setSubmitMessage(data.message || "Error creating financial account")
      }
    } catch (error) {
      setSubmitMessage("Error creating financial account")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(""), 3000)
    }
  }

  const handleLiabilitySubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const formData = new FormData()
      formData.append("liability_name", liabilityName)
      formData.append("liability_type", liabilityType)
      formData.append("start_date", startDate)
      formData.append("due_date", dueDate)
      formData.append("principle_amount", Number(principalAmount))
      formData.append("interest_type", interestType)
      formData.append("interest_rate", Number(interestRate) || 0)
      formData.append("payment_terms", paymentTermsState)
      formData.append("current_status", currentStatus)
      formData.append("priority", priority)
      formData.append("liability_account", liabilityAccount)
      formData.append("liability_vendor", liabilityVendor)
      formData.append("approval_id", selectedApprovalId)
      formData.append("createdBy", createdBy)
      formData.append("updatedBy", createdBy)
      if (attachments) {
        formData.append("attachment", attachments)
      }

      const response = await fetch(`http://localhost:8000/api/v1/use/createLiability`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      const data = await response.json()
      if (data.statusCode === 200) {
        setLiabilities([data.data, ...liabilities])
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
        setAttachments(null)
        setSelectedApprovalId("")
      } else {
        setSubmitMessage(data.message || "Error creating liability")
      }
    } catch (error) {
      setSubmitMessage("Error creating liability")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(""), 3000)
    }
  }

  const handleDeleteAccount = async (accountId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/company/account/update-status/${accountId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ is_active: false, updatedBy: createdByAccount }),
      })
      const data = await response.json()
      if (data.statusCode === 200) {
        setAccounts(accounts.map((acc) => (acc.account_id === accountId ? data.data : acc)))
        setSubmitMessage("Account deactivated successfully!")
      } else {
        setSubmitMessage(data.message || "Error deactivating account")
      }
    } catch (error) {
      setSubmitMessage("Error deactivating account")
    } finally {
      setTimeout(() => setSubmitMessage(""), 3000)
    }
  }

  const handleDeleteLiability = async (liabilityId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/use/update/${liabilityId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ current_status: "Completed", updatedBy: createdBy }),
      })
      const data = await response.json()
      if (data.statusCode === 200) {
        setLiabilities(liabilities.map((lib) => (lib.liability_id === liabilityId ? data.data : lib)))
        setSubmitMessage("Liability marked as completed successfully!")
      } else {
        setSubmitMessage(data.message || "Error marking liability as completed")
      }
    } catch (error) {
      setSubmitMessage("Error marking liability as completed")
    } finally {
      setTimeout(() => setSubmitMessage(""), 3000)
    }
  }

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.account_id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "active" && account.is_active) ||
      (activeFilter === "inactive" && !account.is_active)

    return matchesSearch && matchesFilter
  })

  // Get liability accounts for dropdown
  const getLiabilityAccounts = () => {
    return accounts.filter((account) => account.account_type === "Liability" && account.is_active)
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
          liability.liability_name.toLowerCase().includes(liabilitySearchTerm.toLowerCase()) ||
          liability.liability_id.toLowerCase().includes(liabilitySearchTerm.toLowerCase()),
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
            aValue = new Date(a.start_date)
            bValue = new Date(b.start_date)
            break
          case "dueDate":
            aValue = new Date(a.due_date)
            bValue = new Date(b.due_date)
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


const getPaymentHistory = async (liabilityId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/use/search?id=${liabilityId}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();
    console.log(`Payment history response for ${liabilityId}:`, data); // Debug log

    if (data.statusCode === 200 && Array.isArray(data.data)) {
      const normalized = data.data.map((entry) => ({
        id: entry.liability_id,
        name: entry.liability_name,
        type: entry.liability_type,
        startDate: entry.start_date,
        dueDate: entry.due_date,
        principalAmount: Number(entry.principle_amount?.$numberDecimal || 0),
        paidAmount: Number(entry.paid_amount?.$numberDecimal || 0),
        interestType: entry.interest_type || "None",
        interestRate: Number(entry.interest_rate?.$numberDecimal || 0),
        paymentTerms: entry.payment_terms || "One-time",
        currentStatus: entry.current_status || "Pending",
        priority: entry.priority || "Low",
        liabilityAccount: entry.liability_account || null,
        liabilityVendor: entry.liability_vendor || null,
        totalPayableAmount: Number(entry.calculated_payment_amount?.$numberDecimal || 0),
        attachment: entry.attachment || null,
        createdBy: entry.createdBy || null,
        updatedBy: entry.updatedBy || null,
        approvalId: entry.approval_id || null,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      }));
      return normalized;
    }

    console.warn(`No valid payment history for liability ${liabilityId}`);
    return [];
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return [];
  }
};


  const handleOpenHistoryDialog = async (liability) => {
    console.log("Opening dialog for liability:", liability); // Debug log
    setHistoryDialogFor(liability);
    if (liability.id && !paymentHistory[liability.id]) {
      setIsLoadingHistory((prev) => ({ ...prev, [liability.id]: true }));
      try {
        const history = await getPaymentHistory(liability.id);
        console.log(`Fetched payment history for ${liability.id}:`, history); // Debug log
        setPaymentHistory((prev) => ({
          ...prev,
          [liability.id]: history,
        }));
        setErrorHistory((prev) => ({ ...prev, [liability.id]: null }));
      } catch (error) {
        console.error("Error in handleOpenHistoryDialog:", error);
        setErrorHistory((prev) => ({ ...prev, [liability.id]: error.message }));
      } finally {
        setIsLoadingHistory((prev) => ({ ...prev, [liability.id]: false }));
      }
    }
  };

  // Helper function to get interest calculation explanation
  const getInterestExplanation = (liability) => {
    if (liability.interest_type === "None" || !liability.interest_rate) {
      return "No interest applied";
    }

    const principal = Number(liability.principle_amount); // Ensure principal is a number
    const rate = Number(liability.interest_rate); // Convert interest_rate to number
    const terms = liability.payment_terms;

    if (isNaN(rate)) {
      return "Invalid interest rate";
    }

    let frequency = "";
    let periodRate = rate;

    switch (terms) {
      case "Monthly":
        frequency = "monthly";
        periodRate = rate / 12;
        break;
      case "Quarterly":
        frequency = "quarterly";
        periodRate = rate / 4;
        break;
      case "Yearly":
        frequency = "yearly";
        periodRate = rate;
        break;
      case "One-time":
        frequency = "one-time";
        periodRate = rate;
        break;
      default:
        frequency = "unknown";
    }

    if (liability.interest_type === "Simple") {
      return `${rate.toFixed(2)}% simple interest applied ${frequency} (${periodRate.toFixed(2)}% per period)`;
    } else if (liability.interest_type === "Compound") {
      return `${rate.toFixed(2)}% compound interest applied ${frequency} (${periodRate.toFixed(2)}% per period, compounded)`;
    }

    return "No interest applied";
  };
  // Helper function to get account name by ID
  const getAccountNameById = (accountId) => {
    const account = accounts.find((acc) => acc.account_id === accountId)
    return account ? account.account_name : accountId
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
                      {financialHistory.map((profile, index) => (
                        <Card key={profile.finance_id} className="border-l-4 border-l-indigo-500">
                          <CardContent className="pt-6">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <h3 className="font-semibold text-lg">Finance ID: {profile.finance_id}</h3>
                                    {index === 0 && (
                                      <Badge variant="default" className="bg-green-100 text-green-800">
                                        Latest
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">Updated by: {profile.updated_by}</p>
                                  <p className="text-sm text-gray-600">
                                    Report Date: {new Date(profile.createdAt).toLocaleDateString()}
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
                                    ₹{Number(profile.reserve_capital_cash?.$numberDecimal || 0).toLocaleString()}
                                  </p>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg">
                                  <p className="text-sm font-medium text-green-700">Reserve Capital Bank</p>
                                  <p className="text-xl font-bold text-green-800">
                                    ₹{Number(profile.reserve_capital_bank?.$numberDecimal || 0).toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-gray-700">Total Reserve Capital</p>
                                <p className="text-2xl font-bold text-gray-800">
                                  {(
                                    Number(profile.reserve_capital_cash?.$numberDecimal || 0) +
                                    Number(profile.reserve_capital_bank?.$numberDecimal || 0)
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {financialHistory.length === 0 && (
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
                          disabled // Backend generates ID
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
                            value={openingBalance} // Current balance set to opening balance initially
                            className="pl-8 bg-gray-50"
                            step="0.01"
                            readOnly
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
                        <Card key={account.account_id} className="border-l-4 border-l-purple-500">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-lg">{account.account_name}</h3>
                                  <Badge variant={account.is_active ? "default" : "secondary"}>
                                    {account.is_active ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">ID: {account.account_id}</p>
                                <p className="text-sm text-gray-600">Type: {account.account_type}</p>
                                <p className="text-sm text-gray-600">Category: {account.account_category}</p>
                                {account.description && <p className="text-sm text-gray-600">{account.description}</p>}
                                {account.enteredBy && (
                                  <p className="text-sm text-gray-600">Created By: {account.enteredBy}</p>
                                )}
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                  <div>
                                    <p className="text-sm font-medium">Opening Balance</p>
                                    <p className="text-lg font-semibold text-green-600">
                                      ₹{Number(account.opening_balance?.$numberDecimal || 0).toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Current Balance</p>
                                    <p className="text-lg font-semibold text-blue-600">
                                      ₹{Number(account.current_balance?.$numberDecimal || 0).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                {account.is_active && (
                                  <Dialog
                                    open={editingAccount?.account_id === account.account_id}
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
                                            <Input value={editingAccount.account_name} className="bg-gray-50" readOnly />
                                            <p className="text-xs text-gray-500">Account name cannot be edited</p>
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Account ID</Label>
                                            <Input value={editingAccount.account_id} className="bg-gray-50" readOnly />
                                            <p className="text-xs text-gray-500">Account ID cannot be edited</p>
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Account Type</Label>
                                            <Input value={editingAccount.account_type} className="bg-gray-50" readOnly />
                                            <p className="text-xs text-gray-500">Account type cannot be edited</p>
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Account Category</Label>
                                            <Input value={editingAccount.account_category} className="bg-gray-50" readOnly />
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
                                                value={editingAccount.opening_balance}
                                                className="pl-8"
                                                step="0.01"
                                                readOnly
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
                                                value={editingAccount.current_balance}
                                                className="pl-8"
                                                step="0.01"
                                                readOnly
                                              />
                                            </div>
                                            <p className="text-xs text-gray-500">Current Balance cannot be edited.</p>
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Is Active</Label>
                                            <Select
                                              value={editingAccount.is_active ? "yes" : "no"}
                                              onValueChange={(value) =>
                                                setEditingAccount({ ...editingAccount, is_active: value === "yes" })
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
                                            onClick={async () => {
                                              try {
                                                const response = await fetch(
                                                  `http://localhost:8000/api/v1/company/account/update-status/${editingAccount.account_id}`,
                                                  {
                                                    method: "PATCH",
                                                    headers: { "Content-Type": "application/json" },
                                                    credentials: "include",
                                                    body: JSON.stringify({
                                                      is_active: editingAccount.is_active,
                                                      updatedBy: createdByAccount,
                                                    }),
                                                  }
                                                )
                                                const data = await response.json()
                                                if (data.statusCode === 200) {
                                                  setAccounts(
                                                    accounts.map((acc) =>
                                                      acc.account_id === editingAccount.account_id ? data.data : acc
                                                    )
                                                  )
                                                  setSubmitMessage("Account updated successfully!")
                                                  setEditingAccount(null)
                                                } else {
                                                  setSubmitMessage(data.message || "Error updating account")
                                                }
                                              } catch (error) {
                                                setSubmitMessage("Error updating account")
                                              } finally {
                                                setTimeout(() => setSubmitMessage(""), 3000)
                                              }
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
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteAccount(account.account_id)}>
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
                          {approvals.map((approval) => (
                            <SelectItem key={approval.value} value={approval.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{approval.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Select from approved liability approvals only. {approvals.length} approved approvals available.
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
                              <SelectItem key={account.account_id} value={account.account_id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{account.account_name}</span>
                                  <span className="text-xs text-gray-500">
                                    {account.account_id} - Balance: ₹{account.current_balance.toLocaleString()}
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
                            {vendors.map((vendor) => (
                              <SelectItem key={vendor.value} value={vendor.value}>
                                {vendor.label}
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
                          onChange={(e) => setAttachments(e.target.files[0])}
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
                                principle_amount: Number.parseFloat(principalAmount),
                                interest_rate: Number.parseFloat(interestRate),
                                interest_type: interestType,
                                payment_terms: paymentTermsState,
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
                                ₹{(liability.principalAmount || 0).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Total Payable</p>
                              <p className="text-lg font-semibold text-red-600">
                                ₹{(liability.totalPayableAmount || 0).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Paid Amount</p>
                              <p className="text-lg font-semibold text-green-600">
                                ₹{(liability.paidAmount || 0).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Remaining</p>
                              <p className="text-lg font-semibold text-orange-600">
                                ₹{(liability.remainingAmount || 0).toLocaleString()}
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
                                    onClick={async () => {
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

                                      try {
                                        const response = await fetch(
                                          `http://localhost:8000/api/v1/use/update/${editingLiability.id}`,
                                          {
                                            method: "PATCH",
                                            headers: { "Content-Type": "application/json" },
                                            credentials: "include",
                                            body: JSON.stringify({
                                              liability_name: editingLiability.name,
                                              liability_type: editingLiability.type,
                                              start_date: editingLiability.startDate,
                                              due_date: editingLiability.dueDate,
                                              principle_amount: editingLiability.principalAmount,
                                              interest_type: editingLiability.interestType,
                                              interest_rate: editingLiability.interestRate,
                                              payment_terms: editingLiability.paymentTerms,
                                              current_status: editingLiability.currentStatus,
                                              priority: editingLiability.priority,
                                              paid_amount: editingLiability.paidAmount,
                                              updatedBy: createdBy,
                                            }),
                                          }
                                        )
                                        const data = await response.json()
                                        if (data.statusCode === 200) {
                                          setLiabilities(
                                            liabilities.map((lib) =>
                                              lib.id === editingLiability.id ? updatedLiability : lib
                                            )
                                          )
                                          setSubmitMessage("Liability updated successfully!")
                                          setEditingLiability(null)
                                        } else {
                                          setSubmitMessage(data.message || "Error updating liability")
                                        }
                                      } catch (error) {
                                        setSubmitMessage("Error updating liability")
                                      } finally {
                                        setTimeout(() => setSubmitMessage(""), 3000)
                                      }
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
                            onOpenChange={(open) => {
                              if (open) {
                                handleOpenHistoryDialog(liability)
                              } else {
                                setHistoryDialogFor(null)
                              }
                            }}
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
                                  All payments made for this liability (automatically fetched from transaction records)
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                                {/* Summary Section */}
                                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                                  <div className="text-center">
                                    <p className="text-sm font-medium text-gray-600">Principal Amount</p>
                                    <p className="text-lg font-bold text-blue-600">
                                      ₹{(Number(liability.principalAmount) || 0).toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-sm font-medium text-gray-600">Total Payable</p>
                                    <p className="text-lg font-bold text-red-600">
                                      ₹{(Number(liability.totalPayableAmount) || 0).toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-sm font-medium text-gray-600">Total Paid</p>
                                    <p className="text-lg font-bold text-green-600">
                                      ₹{(Number(liability.paidAmount) || 0).toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-sm font-medium text-gray-600">Remaining</p>
                                    <p className="text-lg font-bold text-orange-600">
                                      ₹{(Number(liability.remainingAmount) || 0).toLocaleString()}
                                    </p>
                                  </div>
                                </div>

                                {/* Interest Calculation Details */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-blue-800 mb-2">Interest Calculation Details</h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p>
                                        <span className="font-medium">Interest Type:</span> {liability.interestType || "None"}
                                      </p>
                                      <p>
                                        <span className="font-medium">Interest Rate:</span>{" "}
                                        {(Number(liability.interestRate) || 0).toFixed(2)}% per annum
                                      </p>
                                    </div>
                                    <div>
                                      <p>
                                        <span className="font-medium">Payment Terms:</span> {liability.paymentTerms || "One-time"}
                                      </p>
                                      <p>
                                        <span className="font-medium">Total Interest:</span> ₹
                                        {(
                                          (Number(liability.totalPayableAmount) || 0) - (Number(liability.principalAmount) || 0)
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-blue-600 text-xs mt-2">{getInterestExplanation(liability)}</p>
                                </div>

                                {/* Payment History Table */}
                                <div className="border rounded-lg overflow-hidden">
                                  <div className="overflow-x-auto">
                                    {isLoadingHistory[liability.id] ? (
                                      <div className="text-center py-12 text-gray-500">
                                        <p className="text-lg font-medium">Loading Payment History...</p>
                                      </div>
                                    ) : errorHistory[liability.id] ? (
                                      <div className="text-center py-12 text-red-500">
                                        <p className="text-lg font-medium">Error Loading Payment History</p>
                                        <p className="text-sm">{errorHistory[liability.id]}</p>
                                      </div>
                                    ) : (
                                      <>
                                        <table className="w-full border-collapse min-w-[800px]">
                                          <thead className="bg-gray-100 sticky top-0">
                                            <tr>
                                              <th className="text-left p-3 font-semibold border-b whitespace-nowrap">Date of Payment</th>
                                              <th className="text-left p-3 font-semibold border-b whitespace-nowrap">Amount Paid</th>
                                              <th className="text-left p-3 font-semibold border-b whitespace-nowrap">Transaction ID</th>
                                              <th className="text-left p-3 font-semibold border-b whitespace-nowrap">Payment Method</th>
                                              <th className="text-left p-3 font-semibold border-b min-w-[200px]">Note</th>
                                              <th className="text-left p-3 font-semibold border-b whitespace-nowrap">Status</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {(paymentHistory[liability.id] || []).map((payment, index) => (
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
                                                    ₹{(Number(payment.amount) || 0).toLocaleString()}
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
                                                  <div className="break-words">{payment.note || "No note available"}</div>
                                                </td>
                                                <td className="p-3 whitespace-nowrap">
                                                  <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                                    Completed
                                                  </Badge>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                        {(!paymentHistory[liability.id] || paymentHistory[liability.id].length === 0) && (
                                          <div className="text-center py-12 text-gray-500">
                                            <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p className="text-lg font-medium">No Payment History Found</p>
                                            <p className="text-sm">
                                              No payments have been recorded for this liability yet.
                                            </p>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Payment Statistics */}
                                {paymentHistory[liability.id]?.length > 0 && !isLoadingHistory[liability.id] && !errorHistory[liability.id] && (
                                  <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                                    <div>
                                      <p className="text-sm font-medium text-blue-700">Total Payments Made</p>
                                      <p className="text-xl font-bold text-blue-800">{paymentHistory[liability.id].length}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-blue-700">Average Payment Amount</p>
                                      <p className="text-xl font-bold text-blue-800">
                                        ₹{Number.isFinite(
                                          Math.round(
                                            paymentHistory[liability.id]?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) /
                                              (paymentHistory[liability.id]?.length || 1)
                                          )
                                        )
                                          ? Math.round(
                                              paymentHistory[liability.id]?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) /
                                                (paymentHistory[liability.id]?.length || 1)
                                            ).toLocaleString()
                                          : '0'}
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