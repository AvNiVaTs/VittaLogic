"use client"

import { AlertCircle, ArrowLeft, Calendar, CheckCircle, Clock, FileText, Filter, Send, XCircle } from "lucide-react"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

const employee = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("loggedInEmployee")) : null
const LOGGED_IN_EMPLOYEE_ID = employee?.employeeId || null
const TOKEN = typeof window !== "undefined" ? localStorage.getItem("token") : null


// Function to get approval category display name
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

// Function to get auth headers
const getAuthHeaders = () => {
  return TOKEN ? {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${TOKEN}`
  } : { "Content-Type": "application/json" }
}

export default function ApprovalsPage() {
  const [activeSection, setActiveSection] = useState("new")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [receivedApprovals, setReceivedApprovals] = useState([])
  const [approvalHistory, setApprovalHistory] = useState([])
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [selectedApproval, setSelectedApproval] = useState("")
  const [actionType, setActionType] = useState("")
  const [eligibleApprovers, setEligibleApprovers] = useState([])

  // New Approval Form State
  const [approval_id, setapproval_id] = useState("")
  const [min_expense, setmin_expense] = useState("")
  const [max_expense, setmax_expense] = useState("")
  const [priority, setPriority] = useState("")
  const [tentative_date, settentative_date] = useState("")
  const [reason, setReason] = useState("")
  const [approval_to, setapproval_to] = useState("")
  const [approval_created_by, setapproval_created_by] = useState(LOGGED_IN_EMPLOYEE_ID)
  const [approvalfor, setApprovalfor] = useState("")

  // New state variables for approver lookup and notes
  const [actionNote, setActionNote] = useState("")
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedApprovalDetail, setSelectedApprovalDetail] = useState("")

  // Filter states for history
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const isFormValid = approval_to && approvalfor && min_expense >= 0 && max_expense >= min_expense && priority && tentative_date && reason && approval_created_by;

  // Fetch eligible approvers on component mount
  useEffect(() => {
    if (!approval_created_by) {
      setSubmitMessage("Please log in to access this feature");
      setTimeout(() => setSubmitMessage(""), 3000);
      return;
    }
    const fetchEligibleApprovers = async () => {
      try {
        console.log("Fetching eligible approvers for createdBy:", approval_created_by);
        const response = await fetch(`http://localhost:8000/api/v1/approval/eligible-approvers?createdBy=${approval_created_by}`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Full response data:", data);
        if (data.statusCode === 200 && data.success === true) {
          console.log("Raw data.data:", data.data);
          if (!Array.isArray(data.data)) {
            console.error("Invalid data format:", data.data);
            setSubmitMessage("Invalid data format from server");
            setTimeout(() => setSubmitMessage(""), 3000);
            return;
          }
          const adjustedData = (data.data || []).map(emp => ({
            employeeId: emp.employeeId || emp._id,
            label: emp.label || `${emp.employeeName || 'Unknown'} - ${emp.role || emp.designation || 'Unknown'}`
          }));
          setEligibleApprovers(adjustedData);
          console.log("Eligible approvers set:", adjustedData);
          if (adjustedData.length === 0) {
            setSubmitMessage("No eligible approvers found for your level");
            setTimeout(() => setSubmitMessage(""), 5000);
          }
        } else {
          setSubmitMessage(data.message || "Unexpected response from server");
          console.log("Unexpected response:", data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setSubmitMessage("Error fetching eligible approvers");
        setTimeout(() => setSubmitMessage(""), 3000);
      }
    };
    fetchEligibleApprovers();
  }, [approval_created_by]);

  // Fetch received approvals
  // pages/ApprovalsPage.js
useEffect(() => {
  if (activeSection === "received") {
    const fetchReceivedApprovals = async () => {
      try {
        if (!LOGGED_IN_EMPLOYEE_ID) {
          setSubmitMessage("Please log in to view received approvals");
          setTimeout(() => setSubmitMessage(""), 3000);
          return;
        }
        const response = await fetch(
          `http://localhost:8000/api/v1/approval/received/${LOGGED_IN_EMPLOYEE_ID}?priority=${priorityFilter === 'all' ? '' : priorityFilter}`,
          {
            method: "GET",
            credentials: "include",
            headers: getAuthHeaders(),
          }
        );
        const data = await response.json();
        console.log("Received approvals data:", data);
        if (data.statusCode === 200) {
          const transformedApprovals = data.data.map(approval => ({
            id: approval._id,
            approval_id: approval.approval_id,
            approvalfor: approval.approvalfor,
            reason: approval.reason,
            priority: approval.priority,
            expenseRange: `${approval.min_expense.toFixed(2)} - ${approval.max_expense.toFixed(2)}`,
            tentative_date: new Date(approval.tentative_date).toISOString().split('T')[0],
            receiveDate: new Date(approval.createdAt).toISOString().split('T')[0],
            status: approval.status,
            senderName: approval.approval_created_by?.name || 'Unknown',
            senderDepartment: approval.approval_created_by?.department || 'N/A',
            senderDesignation: approval.approval_created_by?.role || 'Unknown',
            senderId: approval.approval_created_by?.employeeId || '',
            approval_to: approval.approval_to?.employeeId || '',
            approverName: approval.approval_to?.name || 'Unknown',
            actionDate: approval.decision_date ? new Date(approval.decision_date).toISOString().split('T')[0] : '',
            actionNote: approval.approver_note || '',
            decisionTime: approval.decision_time ? new Date(approval.decision_time).toLocaleTimeString() : '',
            decisionDateP: approval.decision_date ? new Date(approval.decision_date).toISOString().split('T')[0] : ''
          }));
          setReceivedApprovals(transformedApprovals);
        } else {
          setSubmitMessage(data.message || "Error fetching received approvals");
          setTimeout(() => setSubmitMessage(""), 3000);
        }
      } catch (error) {
        console.error("Fetch received approvals error:", error);
        setSubmitMessage("Error fetching received approvals");
        setTimeout(() => setSubmitMessage(""), 3000);
      }
    };
    fetchReceivedApprovals();
  }
}, [activeSection, priorityFilter, LOGGED_IN_EMPLOYEE_ID]);

  // Fetch approval history
  useEffect(() => {
    if (activeSection === "history" && approval_created_by) {
      const fetchApprovalHistory = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/v1/approval/history/${approval_created_by}?status=${statusFilter}&sort=${sortBy === "newest" ? "desc" : "asc"}`,
            { headers: getAuthHeaders() }
          )
          const data = await response.json()
          if (data.status === 200) {
            setApprovalHistory(data.data.map(approval => ({
              id: approval._id,
              approval_id: approval.approval_id,
              approvalfor: approval.approvalfor,
              reason: approval.reason,
              priority: approval.priority,
              expenseRange: `${approval.min_expense} - ${approval.max_expense}`,
              tentative_date: approval.tentative_date,
              submittedDate: approval.createdAt,
              status: approval.status.toLowerCase(),
              approvedBy: approval.approvedBy ? `${approval.approvedBy.employeeId} - ${approval.approvedBy.name}` : "",
              rejectedBy: approval.rejectedBy ? `${approval.rejectedBy.employeeId} - ${approval.rejectedBy.name}` : "",
              actionDate: approval.decision_date,
              actionNote: approval.approver_note,
              senderName: approval.approval_created_by.name,
              senderDepartment: approval.approval_created_by.department || "N/A",
              senderDesignation: approval.approval_created_by.role,
              senderId: approval.approval_created_by.employeeId,
              approval_to: approval.approval_to.employeeId,
              approverName: approval.approval_to.name,
              decisionTime: approval.decision_time ? new Date(approval.decision_time).toLocaleTimeString() : "",
              decisionDate: approval.decision_date,
            })))
          } else {
            setSubmitMessage(data.message || "Error fetching approval history")
            setTimeout(() => setSubmitMessage(""), 3000)
          }
        } catch (error) {
          setSubmitMessage("Error fetching approval history")
          setTimeout(() => setSubmitMessage(""), 3000)
        }
      }
      fetchApprovalHistory()
    }
  }, [activeSection, statusFilter, sortBy, approval_created_by])

  // Generate approval ID on component mount
  useEffect(() => {
    const generateapproval_id = async () => {
      const timestamp = Date.now()
      const id = `APP-${timestamp.toString().slice(-5).padStart(5, "0")}`
      setapproval_id(id)
    }
    generateapproval_id()
  }, [])

  // Handle new approval form submission
  const handleNewApprovalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting form with:", { approval_id, approval_to, approval_created_by, approvalfor, min_expense, max_expense, priority, tentative_date, reason });
    try {
      const response = await fetch("http://localhost:8000/api/v1/approval/createApproval", { // Fixed endpoint to match controller
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          approval_id,
          approval_to,
          approval_created_by,
          approvalfor,
          min_expense,
          max_expense,
          priority,
          tentative_date,
          reason,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitMessage("Approval request submitted successfully");
        setTimeout(() => setSubmitMessage(""), 3000);
        setapproval_to("");
        setApprovalfor("");
        setmin_expense("");
        setmax_expense("");
        setPriority("");
        settentative_date("");
        setReason("");
      } else {
        setSubmitMessage(data.message || `Failed to submit: ${response.status} ${response.statusText}`);
        console.log("Error response:", data);
      }
    } catch (error) {
      console.error("Submission error:", error);
      if (error.name === "SyntaxError") {
        setSubmitMessage("Server error: Endpoint not found or invalid response");
      } else {
        setSubmitMessage("Error submitting approval request");
      }
      setTimeout(() => setSubmitMessage(""), 3000);
    }
    setIsSubmitting(false);
  };

  // Handle approval action
  const handleApprovalAction = (approval, action) => {
    setSelectedApproval(approval)
    setActionType(action)
    setActionDialogOpen(true)
  }

const confirmApprovalAction = async () => {
  // Read fresh values from localStorage
  const loggedInEmployee = typeof window !== "undefined" ? localStorage.getItem("loggedInEmployee") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  let employeeId = null;
  
  if (loggedInEmployee) {
    try {
      const parsedEmployee = JSON.parse(loggedInEmployee);
      employeeId = parsedEmployee?.employeeId;
    } catch (e) {
      console.error("Error parsing employee from localStorage:", e);
    }
  }
  
  if (!employeeId) {
    setSubmitMessage("Please log in to perform this action - Employee not found");
    setActionDialogOpen(false);
    setActionNote("");
    setTimeout(() => setSubmitMessage(""), 3000);
    return;
  }
  
  try {
    const headers = {
      "Content-Type": "application/json",
      "X-Employee-ID": employeeId, // ✅ Send employee ID in header
    };
    
    // Add token if available
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const response = await fetch(`http://localhost:8000/api/v1/approval/update-status/${selectedApproval.approval_id}`, {
      method: "PATCH",
      headers: headers,
      credentials: "include",
      body: JSON.stringify({
        status: actionType === "accept" ? "Approved" : actionType === "reject" ? "Rejected" : "On Hold",
        approver_note: actionNote,
        employeeId: employeeId, // ✅ Also send in body as fallback
      }),
    });
    
    const data = await response.json();
    console.log("Response:", data);
    
    if (data.status === 200 || data.statusCode === 200) {
      setReceivedApprovals(receivedApprovals.map((approval) =>
        approval.id === selectedApproval.id
          ? {
              ...approval,
              status: actionType === "accept" ? "approved" : actionType === "reject" ? "rejected" : "on-hold",
              actionNote: actionNote,
              actionDate: new Date().toISOString().split("T")[0],
              actionBy: employeeId,
            }
          : approval
      ));
      setSubmitMessage(`Approval ${actionType === "accept" ? "accepted" : actionType === "reject" ? "rejected" : "put on hold"} successfully!`);
    } else {
      setSubmitMessage(data.message || "Error updating approval status");
    }
  } catch (error) {
    console.error("Request error:", error);
    setSubmitMessage("Error updating approval status");
  } finally {
    setActionDialogOpen(false);
    setActionNote("");
    setTimeout(() => setSubmitMessage(""), 3000);
  }
};
  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
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

  // Handle approval detail view
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
              <Alert className={`mb-6 ${submitMessage.includes("Error") ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
                <AlertDescription className={submitMessage.includes("Error") ? "text-red-800" : "text-green-800"}>
                  {submitMessage}
                </AlertDescription>
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
                      <Label htmlFor="approval_id">Approval ID</Label>
                      <Input id="approval_id" value={approval_id} className="bg-gray-50" readOnly />
                      <p className="text-xs text-gray-500">Auto-generated unique ID</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="approval_to">Approval To *</Label>
                      <Select value={approval_to} onValueChange={setapproval_to} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select approver" />
                        </SelectTrigger>
                        <SelectContent>
                          {eligibleApprovers.map((employee) => (
                            <SelectItem key={employee.employeeId} value={employee.employeeId}>
                              {employee.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">Select the employee who will approve this request</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="approval_created_by">Approval Created By</Label>
                      <Input
                        id="approval_created_by"
                        value={approval_created_by || ""}
                        onChange={(e) => setapproval_created_by(e.target.value)}
                        className="bg-gray-50"
                        placeholder="Current user employee ID"
                        readOnly
                      />
                      <p className="text-xs text-gray-500">Employee ID of the person creating this request</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="approvalfor">Approval for *</Label>
                      <Select value={approvalfor} onValueChange={setApprovalfor} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select approval category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asset">Asset</SelectItem>
                          <SelectItem value="Liability">Liability</SelectItem>
                          <SelectItem value="Customer Payment">Customer Payment</SelectItem>
                          <SelectItem value="Vendor Payment">Vendor Payment</SelectItem>
                          <SelectItem value="Salary">Salary</SelectItem>
                          <SelectItem value="Department Budget">Department Budget</SelectItem>
                          <SelectItem value="Service">Service</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">Select the category this approval request is for</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="min_expense">Min Expense (INR) *</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                            <Input
                              id="min_expense"
                              type="number"
                              value={min_expense}
                              onChange={(e) => setmin_expense(e.target.value)}
                              placeholder="0.00"
                              className="pl-8"
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="max_expense">Max Expense (INR) *</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                            <Input
                              id="max_expense"
                              type="number"
                              value={max_expense}
                              onChange={(e) => setmax_expense(e.target.value)}
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
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tentative_date">Tentative Date *</Label>
                      <Input
                        id="tentative_date"
                        type="date"
                        value={tentative_date}
                        onChange={(e) => settentative_date(e.target.value)}
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

                    <Button type="submit" className="w-full" disabled={isSubmitting || !isFormValid}>
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
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
                {receivedApprovals.map((approval) => (
                  <Card key={approval.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-blue-600" />
                          Approval Request - {approval.approval_id}
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
                          <p className="text-sm text-gray-900">{approval.approval_id}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Approval For</Label>
                          <p className="text-sm text-gray-900">{getApprovalCategoryName(approval.approvalfor)}</p>
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
                            {new Date(approval.tentative_date).toLocaleDateString()}
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
                {receivedApprovals.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Approvals Received</h3>
                    <p className="text-gray-500">No approval requests match your current filters.</p>
                  </div>
                )}
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
                        {approvalHistory.map((approval) => (
                          <TableRow key={approval.id}>
                            <TableCell className="font-medium">
                              <Button
                                variant="link"
                                className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800"
                                onClick={() => handleApprovalDetail(approval)}
                              >
                                {approval.approval_id}
                              </Button>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{approval.reason}</TableCell>
                            <TableCell>{getApprovalCategoryName(approval.approvalfor)}</TableCell>
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

                    {approvalHistory.length === 0 && (
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
            <DialogTitle>Approval Details - {selectedApprovalDetail?.approval_id}</DialogTitle>
            <DialogDescription>Complete information about this approval request</DialogDescription>
          </DialogHeader>
          {selectedApprovalDetail && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Approval ID</Label>
                  <p className="text-sm text-gray-900">{selectedApprovalDetail.approval_id3}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Approval For</Label>
                  <p className="text-sm text-gray-900">{getApprovalCategoryName(selectedApprovalDetail.approvalfor)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Approval To</Label>
                  <p className="text-sm text-gray-900">
                    {selectedApprovalDetail.approverName || selectedApprovalDetail.approval_to}
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
                      {new Date(selectedApprovalDetail.tentative_date).toLocaleDateString()}
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