"use client"

import { ArrowLeft, Building2, DollarSign, Info, Plus, Save, Search, Edit } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock logged-in user
const LOGGED_IN_EMPLOYEE_ID = "EMP001"

// Mock existing departments with budgets
const mockDepartments = [
  {
    id: "DEPT_1703123456789",
    name: "Human Resources",
    description: "Manages employee relations and organizational development",
    createdBy: "EMP001",
    createdAt: "2024-01-15",
    budgets: [
      {
        budgetId: "BUD_1703123456790",
        createdBy: "EMP001",
        timePeriodFrom: "2024-01-01",
        timePeriodTo: "2024-03-31",
        allocatedAmount: 150000,
        budgetCreationDate: "2024-01-15T10:30:00Z",
        budgetNotes: "Q1 2024 budget allocation",
      },
    ],
  },
  {
    id: "DEPT_1703123456791",
    name: "Information Technology",
    description: "Manages IT infrastructure and software development",
    createdBy: "EMP002",
    createdAt: "2024-01-20",
    budgets: [
      {
        budgetId: "BUD_1703123456792",
        createdBy: "EMP002",
        timePeriodFrom: "2024-01-01",
        timePeriodTo: "2024-06-30",
        allocatedAmount: 500000,
        budgetCreationDate: "2024-01-20T14:15:00Z",
        budgetNotes: "H1 2024 budget for infrastructure upgrade",
      },
    ],
  },
]

export default function DepartmentPage() {
  const [activeSection, setActiveSection] = useState("entry")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [departments, setDepartments] = useState(
    mockDepartments.map((dept) => ({
      ...dept,
      updatedBy: null,
      lastUpdated: null,
    })),
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [editingBudget, setEditingBudget] = useState(null)
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [editDialogStates, setEditDialogStates] = useState({})

  // Department Entry Form State
  const [departmentName, setDepartmentName] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [departmentDescription, setDepartmentDescription] = useState("")

  // Department Budget Form State
  const [budgetId, setBudgetId] = useState("")
  const [budgetDepartmentId, setBudgetDepartmentId] = useState("")
  const [timePeriodFrom, setTimePeriodFrom] = useState("")
  const [timePeriodTo, setTimePeriodTo] = useState("")
  const [allocatedAmount, setAllocatedAmount] = useState("")
  const [budgetCreationDate, setBudgetCreationDate] = useState("")
  const [budgetNotes, setBudgetNotes] = useState("")

  // Generate unique ID based on timestamp
  const generateTimestampId = (prefix) => {
    return `${prefix}_${Date.now()}`
  }

  // Generate IDs when component mounts or when creating new entries
  useEffect(() => {
    setDepartmentId(generateTimestampId("DEPT"))
    setBudgetId(generateTimestampId("BUD"))
    setBudgetCreationDate(new Date().toISOString())
  }, [activeSection])

  // Filter departments based on search term
  const filteredDepartments = departments.filter((dept) => dept.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleDepartmentSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    const newDepartment = {
      id: departmentId,
      name: departmentName,
      description: departmentDescription,
      createdBy: LOGGED_IN_EMPLOYEE_ID,
      createdAt: new Date().toISOString().split("T")[0],
      budgets: [],
      updatedBy: null,
      lastUpdated: null,
    }

    // Simulate API call
    setTimeout(() => {
      setDepartments((prev) => [...prev, newDepartment])
      setSubmitMessage("Department created successfully!")

      // Reset form
      setDepartmentName("")
      setDepartmentDescription("")
      setDepartmentId(generateTimestampId("DEPT"))
      setIsSubmitting(false)

      // Clear message after 3 seconds
      setTimeout(() => setSubmitMessage(""), 3000)
    }, 1000)
  }

  const handleBudgetSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    const newBudget = {
      budgetId,
      createdBy: LOGGED_IN_EMPLOYEE_ID,
      timePeriodFrom,
      timePeriodTo,
      allocatedAmount: Number.parseFloat(allocatedAmount),
      budgetCreationDate,
      budgetNotes,
    }

    // Simulate API call
    setTimeout(() => {
      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === budgetDepartmentId ? { ...dept, budgets: [...dept.budgets, newBudget] } : dept,
        ),
      )

      setSubmitMessage("Budget allocation created successfully!")

      // Reset form
      setBudgetId(generateTimestampId("BUD"))
      setBudgetDepartmentId("")
      setTimePeriodFrom("")
      setTimePeriodTo("")
      setAllocatedAmount("")
      setBudgetCreationDate(new Date().toISOString())
      setBudgetNotes("")
      setIsSubmitting(false)

      // Clear message after 3 seconds
      setTimeout(() => setSubmitMessage(""), 3000)
    }, 1000)
  }

  const handleEditBudget = (departmentId, budgetId, updatedBudget) => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === departmentId
          ? {
              ...dept,
              budgets: dept.budgets.map((budget) =>
                budget.budgetId === budgetId ? { ...budget, ...updatedBudget } : budget,
              ),
              updatedBy: LOGGED_IN_EMPLOYEE_ID,
              lastUpdated: new Date().toISOString(),
            }
          : dept,
      ),
    )
    setEditingBudget(null)
    setSubmitMessage("Budget updated successfully!")
    setTimeout(() => setSubmitMessage(""), 3000)
  }

  const handleEditDepartment = (departmentId, updatedData) => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === departmentId
          ? {
              ...dept,
              name: updatedData.name,
              description: updatedData.description,
              updatedBy: LOGGED_IN_EMPLOYEE_ID,
              lastUpdated: new Date().toISOString(),
            }
          : dept,
      ),
    )
    setEditingDepartment(null)
    setSubmitMessage("Department updated successfully!")
    setTimeout(() => setSubmitMessage(""), 3000)
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
              <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
              <p className="text-gray-600">Manage departments and budget allocations</p>
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
                <CardTitle className="text-lg">Department Services</CardTitle>
                <CardDescription>Select a service to manage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeSection === "entry" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("entry")}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Department Entry
                </Button>
                <Button
                  variant={activeSection === "budget" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("budget")}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Department Budget
                </Button>
                <Button
                  variant={activeSection === "info" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("info")}
                >
                  <Info className="h-4 w-4 mr-2" />
                  Department Info
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

            {activeSection === "entry" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                    Department Entry
                  </CardTitle>
                  <CardDescription>Create a new department in your organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDepartmentSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="departmentName">Department Name *</Label>
                      <Input
                        id="departmentName"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        placeholder="Enter department name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="departmentId">Department ID *</Label>
                      <Input id="departmentId" value={departmentId} readOnly className="bg-gray-50" />
                      <p className="text-xs text-gray-500">
                        Department ID is auto-generated based on timestamp and is unique.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="departmentDescription">Department Description (Optional)</Label>
                      <Textarea
                        id="departmentDescription"
                        value={departmentDescription}
                        onChange={(e) => setDepartmentDescription(e.target.value)}
                        placeholder="Enter department description"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="createdBy">Created By *</Label>
                      <Input id="createdBy" value={LOGGED_IN_EMPLOYEE_ID} readOnly className="bg-gray-50" />
                      <p className="text-xs text-gray-500">Automatically filled with your employee ID.</p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Creating Department..."
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Department
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeSection === "budget" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Department Budget
                  </CardTitle>
                  <CardDescription>Allocate budget to departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBudgetSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="budgetId">Budget ID *</Label>
                      <Input id="budgetId" value={budgetId} readOnly className="bg-gray-50" />
                      <p className="text-xs text-gray-500">
                        Budget ID is auto-generated based on timestamp and is unique.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budgetCreatedBy">Created By *</Label>
                      <Input id="budgetCreatedBy" value={LOGGED_IN_EMPLOYEE_ID} readOnly className="bg-gray-50" />
                      <p className="text-xs text-gray-500">Automatically filled with your employee ID.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budgetDepartmentId">Department ID *</Label>
                      <Select value={budgetDepartmentId} onValueChange={setBudgetDepartmentId} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.id} - {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Select the department for which you're allocating the budget.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timePeriodFrom">Time Period From *</Label>
                        <Input
                          id="timePeriodFrom"
                          type="date"
                          value={timePeriodFrom}
                          onChange={(e) => setTimePeriodFrom(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timePeriodTo">Time Period To *</Label>
                        <Input
                          id="timePeriodTo"
                          type="date"
                          value={timePeriodTo}
                          onChange={(e) => setTimePeriodTo(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="allocatedAmount">Allocated Amount *</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <Input
                          id="allocatedAmount"
                          type="number"
                          value={allocatedAmount}
                          onChange={(e) => setAllocatedAmount(e.target.value)}
                          placeholder="0.00"
                          className="pl-8"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budgetCreationDate">Budget Creation Date *</Label>
                      <Input
                        id="budgetCreationDate"
                        type="datetime-local"
                        value={budgetCreationDate.slice(0, 16)}
                        readOnly
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">Automatically set to current timestamp.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budgetNotes">Budget Notes (Optional)</Label>
                      <Textarea
                        id="budgetNotes"
                        value={budgetNotes}
                        onChange={(e) => setBudgetNotes(e.target.value)}
                        placeholder="Add any additional notes about this budget allocation"
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Allocating Budget..."
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Allocate Budget
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeSection === "info" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="h-5 w-5 mr-2 text-purple-600" />
                    Department Information
                  </CardTitle>
                  <CardDescription>View and manage existing departments and their budgets</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Search Bar */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search departments by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Department Cards */}
                  <div className="space-y-4">
                    {filteredDepartments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {searchTerm ? "No departments found matching your search." : "No departments created yet."}
                      </div>
                    ) : (
                      filteredDepartments.map((department) => (
                        <Card key={department.id} className="border-l-4 border-l-blue-500">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{department.name}</CardTitle>
                                <CardDescription className="mt-1">
                                  ID: {department.id} | Created by: {department.createdBy} | Date:{" "}
                                  {department.createdAt}
                                  {department.updatedBy && (
                                    <>
                                      {" "}
                                      | Updated by: {department.updatedBy} | Last updated:{" "}
                                      {new Date(department.lastUpdated).toLocaleString()}
                                    </>
                                  )}
                                </CardDescription>
                                {department.description && (
                                  <p className="text-sm text-gray-600 mt-2">{department.description}</p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Dialog
                                  open={editingDepartment === department.id}
                                  onOpenChange={(open) => {
                                    if (open) {
                                      setEditingDepartment(department.id)
                                    } else {
                                      setEditingDepartment(null)
                                    }
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Edit className="h-4 w-4 mr-1" />
                                      Edit Department
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Edit Department</DialogTitle>
                                      <DialogDescription>Update department information</DialogDescription>
                                    </DialogHeader>
                                    <DepartmentEditForm
                                      department={department}
                                      onSave={(updatedData) => {
                                        handleEditDepartment(department.id, updatedData)
                                      }}
                                      onCancel={() => setEditingDepartment(null)}
                                    />
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">Budget Allocations</h4>
                                <Badge variant="secondary">
                                  {department.budgets.length} Budget{department.budgets.length !== 1 ? "s" : ""}
                                </Badge>
                              </div>

                              {department.budgets.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">No budgets allocated yet.</p>
                              ) : (
                                <div className="grid gap-3">
                                  {department.budgets.map((budget) => (
                                    <div key={budget.budgetId} className="bg-gray-50 p-3 rounded-lg">
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline">{budget.budgetId}</Badge>
                                            <span className="text-sm text-gray-600">by {budget.createdBy}</span>
                                          </div>
                                          <div className="text-sm space-y-1">
                                            <div>
                                              <strong>Amount:</strong> ₹{budget.allocatedAmount.toLocaleString()}
                                            </div>
                                            <div>
                                              <strong>Period:</strong> {budget.timePeriodFrom} to {budget.timePeriodTo}
                                            </div>
                                            <div>
                                              <strong>Created:</strong>{" "}
                                              {new Date(budget.budgetCreationDate).toLocaleString()}
                                            </div>
                                            {budget.budgetNotes && (
                                              <div>
                                                <strong>Notes:</strong> {budget.budgetNotes}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <Dialog
                                          open={editDialogStates[budget.budgetId] || false}
                                          onOpenChange={(open) => {
                                            setEditDialogStates((prev) => ({
                                              ...prev,
                                              [budget.budgetId]: open,
                                            }))
                                          }}
                                        >
                                          <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                              <Edit className="h-4 w-4 mr-1" />
                                              Edit
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent className="max-w-md">
                                            <DialogHeader>
                                              <DialogTitle>Edit Budget</DialogTitle>
                                              <DialogDescription>
                                                Update budget information for {department.name}
                                              </DialogDescription>
                                            </DialogHeader>
                                            <BudgetEditForm
                                              budget={budget}
                                              onSave={(updatedBudget) => {
                                                handleEditBudget(department.id, budget.budgetId, updatedBudget)
                                                setEditDialogStates((prev) => ({
                                                  ...prev,
                                                  [budget.budgetId]: false,
                                                }))
                                              }}
                                              onCancel={() => {
                                                setEditDialogStates((prev) => ({
                                                  ...prev,
                                                  [budget.budgetId]: false,
                                                }))
                                              }}
                                            />
                                          </DialogContent>
                                        </Dialog>
                                      </div>
                                    </div>
                                  ))}
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
          </div>
        </div>
      </div>
    </div>
  )
}

// Budget Edit Form Component
function BudgetEditForm({ budget, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    timePeriodFrom: budget.timePeriodFrom,
    timePeriodTo: budget.timePeriodTo,
    allocatedAmount: budget.allocatedAmount.toString(),
    budgetNotes: budget.budgetNotes || "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      allocatedAmount: Number.parseFloat(formData.allocatedAmount),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="editTimePeriodFrom">From Date</Label>
          <Input
            id="editTimePeriodFrom"
            type="date"
            value={formData.timePeriodFrom}
            onChange={(e) => setFormData((prev) => ({ ...prev, timePeriodFrom: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="editTimePeriodTo">To Date</Label>
          <Input
            id="editTimePeriodTo"
            type="date"
            value={formData.timePeriodTo}
            onChange={(e) => setFormData((prev) => ({ ...prev, timePeriodTo: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="editAllocatedAmount">Allocated Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
          <Input
            id="editAllocatedAmount"
            type="number"
            value={formData.allocatedAmount}
            onChange={(e) => setFormData((prev) => ({ ...prev, allocatedAmount: e.target.value }))}
            className="pl-8"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="editBudgetNotes">Budget Notes</Label>
        <Textarea
          id="editBudgetNotes"
          value={formData.budgetNotes}
          onChange={(e) => setFormData((prev) => ({ ...prev, budgetNotes: e.target.value }))}
          placeholder="Add any additional notes"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </form>
  )
}

// Department Edit Form Component
function DepartmentEditForm({ department, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: department.name,
    description: department.description || "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="editDepartmentName">Department Name</Label>
        <Input
          id="editDepartmentName"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="editDepartmentDescription">Department Description</Label>
        <Textarea
          id="editDepartmentDescription"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Department description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Updated By</Label>
        <Input value={LOGGED_IN_EMPLOYEE_ID} readOnly className="bg-gray-50" />
        <p className="text-xs text-gray-500">Automatically filled with your employee ID.</p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </form>
  )
}
