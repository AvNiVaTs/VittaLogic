"use client"

import { ArrowLeft, FileText, Clock, CheckCircle, XCircle, AlertCircle, Send, Filter, Calendar } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock data for received approvals
const mockReceivedApprovals = [
  {
    id: "APR001",
    senderId: "EMP002",
    senderName: "Jane Smith",
    senderDesignation: "Senior Finance Manager",
    senderDepartment: "Finance",
    approvalId: "APR001",
    approvalFor: "asset",
    reason:
      "Need approval for new software licenses for the development team. This will help improve productivity and ensure compliance with licensing requirements.",
    priority: "high",
    expenseRange: "100000 - 150000",
    tentativeDate: "2024-02-15",
    receiveDate: "2024-01-20",
    status: "pending",
  },
  {
    id: "APR002",
    senderId: "EMP003",
    senderName: "Mike Johnson",
    senderDesignation: "Senior IT Manager",
    senderDepartment: "Information Technology",
    approvalId: "APR002",
    approvalFor: "vendor_payment",
    reason:
      "Approval required for server infrastructure upgrade to handle increased load and improve system performance.",
    priority: "medium",
    expenseRange: "250000 - 300000",
    tentativeDate: "2024-02-20",
    receiveDate: "2024-01-18",
    status: "pending",
  },
]

// Mock data for approval history
const mockApprovalHistory = [
  {
    id: "APR003",
    approvalId: "APR003",
    approvalFor: "department_budget",
    reason: "Marketing campaign budget for Q1 2024",
    priority: "high",
    expenseRange: "150000 - 200000",
    tentativeDate: "2024-01-30",
    submittedDate: "2024-01-10",
    status: "approved",
    approvedBy: "EMP000 - Admin User",
    approverName: "Sarah Wilson - HR Director",
    actionDate: "2024-01-12",
    actionNote: "Approved for Q1 marketing initiatives. Budget allocation looks reasonable for the proposed campaigns.",
    senderName: "John Doe",
    senderDepartment: "Marketing",
    senderDesignation: "Marketing Manager",
    senderId: "EMP001",
    approvalTo: "EMP004",
    decisionTime: "14:30:00",
    decisionDate: "2024-01-12",
  },
  {
    id: "APR004",
    approvalId: "APR004",
    approvalFor: "asset",
    reason: "Office furniture replacement",
    priority: "low",
    expenseRange: "50000 - 75000",
    tentativeDate: "2024-02-10",
    submittedDate: "2024-01-08",
    status: "rejected",
    rejectedBy: "EMP000 - Admin User",
    approverName: "David Brown - Operations Manager",
    actionDate: "2024-01-09",
    rejectionReason: "Budget constraints for this quarter",
    actionNote: "Rejected due to current budget constraints. Please resubmit in Q2 with revised budget.",
    senderName: "Alice Brown",
    senderDepartment: "Facilities",
    senderDesignation: "Facilities Coordinator",
    senderId: "EMP002",
    approvalTo: "EMP005",
    decisionTime: "09:15:00",
    decisionDate: "2024-01-09",
  },
  {
    id: "APR005",
    approvalId: "APR005",
    approvalFor: "salary",
    reason: "Team building event expenses",
    priority: "medium",
    expenseRange: "40000 - 50000",
    tentativeDate: "2024-02-25",
    submittedDate: "2024-01-15",
    status: "pending",
    senderName: "Bob Williams",
    senderDepartment: "Human Resources",
    senderDesignation: "HR Specialist",
    senderId: "EMP003",
    approvalTo: "EMP004",
    approverName: "Sarah Wilson - HR Director",
  },
  {
    id: "APR006",
    approvalId: "APR006",
    approvalFor: "customer_payment",
    reason: "New equipment purchase for development team",
    priority: "medium",
    expenseRange: "80000 - 120000",
    tentativeDate: "2024-03-01",
    submittedDate: "2024-01-20",
    status: "on-hold",
    actionNote: "Put on hold pending budget review. Will reassess after Q1 financial results.",
    senderName: "Eve Taylor",
    senderDepartment: "Engineering",
    senderDesignation: "Software Engineer",
    senderId: "EMP004",
    approvalTo: "EMP007",
    approverName: "Robert Taylor - CTO",
    decisionTime: "16:45:00",
    decisionDate: "2024-01-22",
  },
]

// Mock employee database for lookup
const mockEmployees = [
  { id: "EMP001", name: "John Doe", designation: "Manager", department: "Finance", level: 2 },
  { id: "EMP002", name: "Jane Smith", designation: "Senior Finance Manager", department: "Finance", level: 3 },
  {
    id: "EMP003",
    name: "Mike Johnson",
    designation: "Senior IT Manager",
    department: "Information Technology",
    level: 3,
  },
  { id: "EMP004", name: "Sarah Wilson", designation: "HR Director", department: "Human Resources", level: 4 },
  { id: "EMP005", name: "David Brown", designation: "Operations Manager", department: "Operations", level: 3 },
  { id: "EMP006", name: "Lisa Chen", designation: "VP Finance", department: "Finance", level: 4 },
  { id: "EMP007", name: "Robert Taylor", designation: "CTO", department: "Information Technology", level: 4 },
  {
    id: "EMP008",
    name: "Emily Davis",
    designation: "Senior Developer",
    department: "Information Technology",
    level: 2,
  },
]

// Function to simulate fetching employee ID from name
const fetchEmployeeId = (name) => {
  const employee = mockEmployees.find((emp) => emp.name.toLowerCase().includes(name.toLowerCase()) && name.length > 2)
  return employee ? employee.id : ""
}

// Function to get eligible approvers based on hierarchy
const getEligibleApprovers = (currentUserLevel) => {
  if (currentUserLevel === 1) {
    return [] // Level 1 cannot send approvals to Level 2
  } else if (currentUserLevel === 2) {
    return mockEmployees.filter((emp) => emp.level === 3)
  } else if (currentUserLevel === 3) {
    return mockEmployees.filter((emp) => emp.level === 4)
  }
  return []
}

// Get approval category display name
const getApprovalCategoryName = (category) => {
  switch (category) {
    case "asset":
      return "Asset"
    case "liability":
      return "Liability"
    case "customer_payment":
      return "Customer Payment"
    case "vendor_payment":
      return "Vendor Payment"
    case "salary":
      return "Salary"
    case "department_budget":
      return "Department Budget"
    case "service":
      return "Service"
    default:
      return category
  }
}

export default function ApprovalsPage() {
  const [activeSection, setActiveSection] = useState("new")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [receivedApprovals, setReceivedApprovals] = useState(mockReceivedApprovals)
  const [approvalHistory, setApprovalHistory] = useState(mockApprovalHistory)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [selectedApproval, setSelectedApproval] = useState(null)
  const [actionType, setActionType] = useState("")

  // New Approval Form State
  const [approvalId, setApprovalId] = useState("")
  const [minExpense, setMinExpense] = useState("")
  const [maxExpense, setMaxExpense] = useState("")
  const [expenseRange, setExpenseRange] = useState("")
  const [priority, setPriority] = useState("")
  const [tentativeDate, setTentativeDate] = useState("")
  const [reason, setReason] = useState("")

  // New state variables
  const [approvalTo, setApprovalTo] = useState("")
  const [approvalCreatedBy, setApprovalCreatedBy] = useState("EMP001") // Default to current user
  const [approvalFor, setApprovalFor] = useState("")

  // New state variables for approver lookup and notes
  const [actionNote, setActionNote] = useState("")
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedApprovalDetail, setSelectedApprovalDetail] = useState(null)

  // Filter states for history
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const [currentUserLevel, setCurrentUserLevel] = useState(2) // Default to level 2 for demo

  // Generate approval ID on component mount
  useEffect(() => {
    const generateApprovalId = () => {
      const timestamp = Date.now()
      const id = `APR${timestamp.toString().slice(-6)}`
      setApprovalId(id)
    }
    generateApprovalId()
  }, [])

  // Auto-fetch employee ID when approval to name changes
  // useEffect(() => {
  //   if (approvalTo.length > 2) {
  //     const employeeId = fetchEmployeeId(approvalTo)
  //     setApproverId(employeeId)
  //   } else {
  //     setApproverId("")
  //   }
  // }, [approvalTo])

  // Handle new approval form submission
  const handleNewApprovalSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    const newApproval = {
      id: approvalId,
      approvalId,
      approvalTo,
      approverId: approvalTo,
      approvalCreatedBy,
      approvalFor,
      reason,
      priority,
      minExpense,
      maxExpense,
      expenseRange: `${minExpense} - ${maxExpense}`,
      tentativeDate,
      submittedDate: new Date().toISOString().split("T")[0],
      status: "pending",
    }

    // Simulate API call
    setTimeout(() => {
      setApprovalHistory([newApproval, ...approvalHistory])
      setSubmitMessage("Approval request submitted successfully!")

      // Reset form
      setApprovalTo("")
      setMinExpense("")
      setMaxExpense("")
      setPriority("")
      setTentativeDate("")
      setReason("")
      setApprovalFor("")
      // Note: approvalCreatedBy keeps its default value

      // Generate new approval ID
      const timestamp = Date.now()
      const id = `APR${timestamp.toString().slice(-6)}`
      setApprovalId(id)

      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(""), 3000)
    }, 1000)
  }

  // Handle approval action
  const handleApprovalAction = (approval, action) => {
    setSelectedApproval(approval)
    setActionType(action)
    setActionDialogOpen(true)
  }

  // Confirm approval action
  const confirmApprovalAction = () => {
    const updatedApprovals = receivedApprovals.map((approval) =>
      approval.id === selectedApproval.id
        ? {
            ...approval,
            status: actionType === "accept" ? "approved" : actionType === "reject" ? "rejected" : "on-hold",
            actionNote: actionNote,
            actionDate: new Date().toISOString().split("T")[0],
            actionBy: "EMP001", // Current user
          }
        : approval,
    )
    setReceivedApprovals(updatedApprovals)

    let message = ""
    switch (actionType) {
      case "accept":
        message = "Approval has been accepted successfully!"
        break
      case "reject":
        message = "Approval has been rejected successfully!"
        break
      case "hold":
        message = "Approval has been put on hold successfully!"
        break
    }

    setSubmitMessage(message)
    setActionDialogOpen(false)
    setActionNote("") // Reset note
    setTimeout(() => setSubmitMessage(""), 3000)
  }

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "on-hold":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Filter and sort approval history
  const filteredHistory = approvalHistory
    .filter((approval) => statusFilter === "all" || approval.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.submittedDate) - new Date(a.submittedDate)
      } else {
        return new Date(a.submittedDate) - new Date(b.submittedDate)
      }
    })

  const handleApprovalDetail = (approval) => {
    setSelectedApprovalDetail(approval)
    setDetailDialogOpen(true)
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
              <h1 className="text-2xl font-bold text-gray-900">Approval Management</h1>
              <p className="text-gray-600">Manage approval requests and workflow</p>
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
                <CardTitle className="text-lg">Approval Services</CardTitle>
                <CardDescription>Select a service to manage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeSection === "new" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("new")}
                >
                  <Send className="h-4 w-4 mr-2" />
                  New Approval
                </Button>
                <Button
                  variant={activeSection === "received" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("received")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Approval Received
                </Button>
                <Button
                  variant={activeSection === "history" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("history")}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Approval History
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

            {/* New Approval Tab */}
            {activeSection === "new" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Send className="h-5 w-5 mr-2 text-blue-600" />
                    New Approval Request
                  </CardTitle>
                  <CardDescription>Submit a new approval request</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleNewApprovalSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="approvalId">Approval ID</Label>
                      <Input id="approvalId" value={approvalId} className="bg-gray-50" readOnly />
                      <p className="text-xs text-gray-500">Auto-generated unique ID</p>
                    </div>

                    {/* New form fields */}
                    <div className="space-y-2">
                      <Label htmlFor="approvalTo">Approval To *</Label>
                      <Select value={approvalTo} onValueChange={setApprovalTo} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select approver" />
                        </SelectTrigger>
                        <SelectContent>
                          {getEligibleApprovers(currentUserLevel).map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.id} - {employee.name} ({employee.designation})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Select the employee who will approve this request (based on hierarchy)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="approvalCreatedBy">Approval Created By</Label>
                      <Input
                        id="approvalCreatedBy"
                        value={approvalCreatedBy}
                        onChange={(e) => setApprovalCreatedBy(e.target.value)}
                        className="bg-gray-50"
                        placeholder="Current user employee ID"
                      />
                      <p className="text-xs text-gray-500">Employee ID of the person creating this request</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="approvalFor">Approval for *</Label>
                      <Select value={approvalFor} onValueChange={setApprovalFor} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select approval category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asset">Asset</SelectItem>
                          <SelectItem value="liability">Liability</SelectItem>
                          <SelectItem value="customer_payment">Customer Payment</SelectItem>
                          <SelectItem value="vendor_payment">Vendor Payment</SelectItem>
                          <SelectItem value="salary">Salary</SelectItem>
                          <SelectItem value="department_budget">Department Budget</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">Select the category this approval request is for</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="minExpense">Min Expense (INR) *</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                            <Input
                              id="minExpense"
                              type="number"
                              value={minExpense}
                              onChange={(e) => setMinExpense(e.target.value)}
                              placeholder="0.00"
                              className="pl-8"
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maxExpense">Max Expense (INR) *</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                            <Input
                              id="maxExpense"
                              type="number"
                              value={maxExpense}
                              onChange={(e) => setMaxExpense(e.target.value)}
                              placeholder="0.00"
                              className="pl-8"
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority *</Label>
                        <Select value={priority} onValueChange={setPriority} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tentativeDate">Tentative Date *</Label>
                      <Input
                        id="tentativeDate"
                        type="date"
                        value={tentativeDate}
                        onChange={(e) => setTentativeDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason (Required) *</Label>
                      <Textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Please provide detailed reason for this approval request..."
                        maxLength={500}
                        rows={4}
                        required
                      />
                      <p className="text-xs text-gray-500">{reason.length}/500 characters</p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Submitting Request..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Approval Request
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Approval Received Tab */}
            {activeSection === "received" && (
              <div className="space-y-6">
                {/* Priority Filter */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <Label className="text-sm font-medium">Filter by Priority:</Label>
                      <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priorities</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
                {receivedApprovals
                  .filter((approval) => priorityFilter === "all" || approval.priority === priorityFilter)
                  .map((approval) => (
                    <Card key={approval.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-blue-600" />
                            Approval Request - {approval.approvalId}
                          </CardTitle>
                          <Badge className={getPriorityColor(approval.priority)}>
                            {approval.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <CardDescription>
                          Received on {new Date(approval.receiveDate).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Sender Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Sender's Name</Label>
                            <p className="text-sm text-gray-900">{approval.senderName}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Sender's Designation</Label>
                            <p className="text-sm text-gray-900">{approval.senderDesignation}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Sender's Department</Label>
                            <p className="text-sm text-gray-900">{approval.senderDepartment}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Approval Receive Date</Label>
                            <p className="text-sm text-gray-900">
                              {new Date(approval.receiveDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Approval Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Approval ID</Label>
                            <p className="text-sm text-gray-900">{approval.approvalId}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Approval For</Label>
                            <p className="text-sm text-gray-900">{getApprovalCategoryName(approval.approvalFor)}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Expense Range</Label>
                            <p className="text-sm text-gray-900">₹{approval.expenseRange}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Priority</Label>
                            <Badge className={getPriorityColor(approval.priority)}>
                              {approval.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Tentative Date</Label>
                            <p className="text-sm text-gray-900">
                              {new Date(approval.tentativeDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">Reason</Label>
                          <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">{approval.reason}</p>
                        </div>

                        {/* Action Buttons */}
                        {approval.status === "pending" && (
                          <div className="flex flex-wrap gap-3 pt-4 border-t">
                            <Button variant="destructive" onClick={() => handleApprovalAction(approval, "reject")}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject Approval
                            </Button>
                            <Button variant="outline" onClick={() => handleApprovalAction(approval, "hold")}>
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Put on Hold
                            </Button>
                            <Button variant="default" onClick={() => handleApprovalAction(approval, "accept")}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accept Approval
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}

            {/* Approval History Tab */}
            {activeSection === "history" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Approval History
                  </CardTitle>
                  <CardDescription>View all your submitted approval requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* History Table */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Approval ID</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Approval For</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Expense Range</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submitted Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredHistory.map((approval) => (
                          <TableRow key={approval.id}>
                            <TableCell className="font-medium">
                              <Button
                                variant="link"
                                className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800"
                                onClick={() => handleApprovalDetail(approval)}
                              >
                                {approval.approvalId}
                              </Button>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{approval.reason}</TableCell>
                            <TableCell>{getApprovalCategoryName(approval.approvalFor)}</TableCell>
                            <TableCell>
                              <Badge className={getPriorityColor(approval.priority)}>
                                {approval.priority.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>₹{approval.expenseRange}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(approval.status)}>{approval.status.toUpperCase()}</Badge>
                            </TableCell>
                            <TableCell>{new Date(approval.submittedDate).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {filteredHistory.length === 0 && (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Approval History</h3>
                        <p className="text-gray-500">No approval requests match your current filters.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>Are you sure you want to {actionType} this approval request?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="actionNote">Add a note (optional)</Label>
              <Textarea
                id="actionNote"
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Add a note about this action..."
                maxLength={100}
                rows={3}
              />
              <p className="text-xs text-gray-500">{actionNote.length}/100 characters</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionDialogOpen(false)
                setActionNote("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={confirmApprovalAction}>
              Confirm {actionType === "accept" ? "Accept" : actionType === "reject" ? "Reject" : "Hold"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Approval Details - {selectedApprovalDetail?.approvalId}</DialogTitle>
            <DialogDescription>Complete information about this approval request</DialogDescription>
          </DialogHeader>
          {selectedApprovalDetail && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Approval ID</Label>
                  <p className="text-sm text-gray-900">{selectedApprovalDetail.approvalId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Approval For</Label>
                  <p className="text-sm text-gray-900">{getApprovalCategoryName(selectedApprovalDetail.approvalFor)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Approval To</Label>
                  <p className="text-sm text-gray-900">
                    {selectedApprovalDetail.approverName || selectedApprovalDetail.approvalTo}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <Badge className={getStatusColor(selectedApprovalDetail.status)}>
                    {selectedApprovalDetail.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Priority</Label>
                  <Badge className={getPriorityColor(selectedApprovalDetail.priority)}>
                    {selectedApprovalDetail.priority.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Submitted Date</Label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedApprovalDetail.submittedDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Sender's Employee ID</Label>
                  <p className="text-sm text-gray-900">{selectedApprovalDetail.senderId}</p>
                </div>
              </div>

              {/* Sender Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Sender Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Sender's Name</Label>
                    <p className="text-sm text-gray-900">{selectedApprovalDetail.senderName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Sender's Department</Label>
                    <p className="text-sm text-gray-900">{selectedApprovalDetail.senderDepartment}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Sender's Designation</Label>
                    <p className="text-sm text-gray-900">{selectedApprovalDetail.senderDesignation}</p>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Financial Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Expense Range</Label>
                    <p className="text-sm text-gray-900">₹{selectedApprovalDetail.expenseRange}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Tentative Date</Label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedApprovalDetail.tentativeDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Reason</Label>
                <p className="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg">{selectedApprovalDetail.reason}</p>
              </div>

              {/* Action Information */}
              {(selectedApprovalDetail.approvedBy ||
                selectedApprovalDetail.rejectedBy ||
                selectedApprovalDetail.actionDate ||
                selectedApprovalDetail.actionNote) && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900">Action Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApprovalDetail.approvedBy && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Approved By</Label>
                        <p className="text-sm text-gray-900">{selectedApprovalDetail.approvedBy}</p>
                      </div>
                    )}
                    {selectedApprovalDetail.rejectedBy && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Rejected By</Label>
                        <p className="text-sm text-gray-900">{selectedApprovalDetail.rejectedBy}</p>
                      </div>
                    )}
                    {selectedApprovalDetail.actionDate && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Action Date</Label>
                        <p className="text-sm text-gray-900">
                          {new Date(selectedApprovalDetail.actionDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {selectedApprovalDetail.decisionDate && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Decision Date</Label>
                        <p className="text-sm text-gray-900">
                          {new Date(selectedApprovalDetail.decisionDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {selectedApprovalDetail.decisionTime && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Decision Time</Label>
                        <p className="text-sm text-gray-900">{selectedApprovalDetail.decisionTime}</p>
                      </div>
                    )}
                  </div>
                  {selectedApprovalDetail.rejectionReason && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Rejection Reason</Label>
                      <p className="text-sm text-gray-900 p-3 bg-red-50 rounded-lg">
                        {selectedApprovalDetail.rejectionReason}
                      </p>
                    </div>
                  )}
                  {selectedApprovalDetail.actionNote && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Approver's Note</Label>
                      <p className="text-sm text-gray-900 p-3 bg-blue-50 rounded-lg">
                        {selectedApprovalDetail.actionNote}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
