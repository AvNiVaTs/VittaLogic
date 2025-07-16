"use client"

import { ArrowLeft, Users, DollarSign, Plus, Save, Edit, Trash2, Search } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock data for departments and their roles
const departmentRoles = {
  "Human Resources": ["HR Manager", "HR Executive", "Recruiter", "HR Assistant"],
  Finance: ["Finance Manager", "Accountant", "Finance Executive", "Auditor"],
  "Information Technology": ["IT Manager", "Software Developer", "System Admin", "Support Engineer"],
  Marketing: ["Marketing Manager", "Digital Marketer", "Content Writer", "SEO Specialist"],
  Operations: ["Operations Manager", "Operations Executive", "Coordinator", "Analyst"],
}

// Available services for permissions
const availableServices = [
  { id: "department", name: "Department Service" },
  { id: "employee", name: "Employee Service" },
  { id: "transaction", name: "Transaction Service" },
  { id: "asset", name: "Asset Service" },
  { id: "financials", name: "Company Financials Service" },
  { id: "vendors", name: "Vendor Service" },
  { id: "customers", name: "Customer Service" },
  { id: "approvals", name: "Approval Service" },
  { id: "dashboard", name: "Dashboard Service" },
]

// Mock existing employees
const mockEmployees = [
  {
    id: "EMP001",
    name: "John Doe",
    email: "john.doe@company.com",
    contact: "+91 9876543210",
    department: "Human Resources",
    role: "HR Manager",
    level: "4",
    designation: "Senior HR Manager",
    dateOfJoining: "2023-01-15",
    createdBy: "EMP000 - Admin User",
    updatedBy: "EMP000 - Admin User",
    lastUpdated: "2024-01-15T10:30:00Z",
    permissions: ["department", "employee"],
  },
  {
    id: "EMP002",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    contact: "+91 9876543211",
    department: "Finance",
    role: "Finance Manager",
    level: "3",
    designation: "Senior Finance Manager",
    dateOfJoining: "2023-02-20",
    createdBy: "EMP000 - Admin User",
    updatedBy: "EMP000 - Admin User",
    lastUpdated: "2024-01-20T14:15:00Z",
    permissions: ["financials", "transaction"],
  },
  {
    id: "EMP003",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    contact: "+91 9876543212",
    department: "Information Technology",
    role: "IT Manager",
    level: "3",
    designation: "Senior IT Manager",
    dateOfJoining: "2023-03-10",
    createdBy: "EMP000 - Admin User",
    updatedBy: "EMP000 - Admin User",
    lastUpdated: "2024-01-10T09:45:00Z",
    permissions: ["asset", "transaction"],
  },
]

// Mock salary records
const mockSalaryRecords = [
  {
    id: "SAL001",
    salaryId: "SAL202401001",
    employeeId: "EMP001",
    employeeName: "John Doe",
    department: "Human Resources",
    role: "HR Manager",
    payMonth: "2024-01",
    baseSalary: 75000,
    bonus: 5000,
    deduction: 2000,
    netSalary: 78000,
    paymentDate: "2024-01-31",
    createdBy: "EMP000 - Admin User",
    updatedBy: "EMP000 - Admin User",
    lastUpdated: "2024-01-15T10:30:00Z",
  },
  {
    id: "SAL002",
    salaryId: "SAL202401002",
    employeeId: "EMP002",
    employeeName: "Jane Smith",
    department: "Finance",
    role: "Finance Manager",
    payMonth: "2024-01",
    baseSalary: 80000,
    bonus: 7000,
    deduction: 1500,
    netSalary: 85500,
    paymentDate: "2024-01-31",
    createdBy: "EMP000 - Admin User",
    updatedBy: "EMP000 - Admin User",
    lastUpdated: "2024-01-20T14:15:00Z",
  },
]

export default function EmployeePage() {
  const [activeSection, setActiveSection] = useState("entry")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [employees, setEmployees] = useState(mockEmployees)
  const [salaryRecords, setSalaryRecords] = useState(mockSalaryRecords)
  const [searchTerm, setSearchTerm] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingSalaryDialogOpen, setEditingSalaryDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [editingSalary, setEditingSalary] = useState(null)

  // Employee Entry Form State
  const [employeeName, setEmployeeName] = useState("")
  const [email, setEmail] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [initialPassword, setInitialPassword] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [dateOfJoining, setDateOfJoining] = useState("")
  const [department, setDepartment] = useState("")
  const [role, setRole] = useState("")
  const [level, setLevel] = useState("")
  const [designation, setDesignation] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState([])

  // Employee Salaries Form State
  const [salaryDepartment, setSalaryDepartment] = useState("")
  const [salaryRole, setSalaryRole] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [payMonth, setPayMonth] = useState("")
  const [baseSalary, setBaseSalary] = useState("")
  const [bonus, setBonus] = useState("")
  const [deduction, setDeduction] = useState("")
  const [netSalary, setNetSalary] = useState("")
  const [paymentDate, setPaymentDate] = useState("")
  const [salaryId, setSalaryId] = useState("")

  // Generate employee ID on component mount
  useEffect(() => {
    const generateEmployeeId = () => {
      const timestamp = Date.now()
      const id = `EMP${timestamp.toString().slice(-6)}`
      setEmployeeId(id)
    }
    generateEmployeeId()
  }, [])

  // Generate salary ID on component mount
  useEffect(() => {
    const generateSalaryId = () => {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, "0")
      const timestamp = now.getTime().toString().slice(-3)
      const id = `SAL${year}${month}${timestamp}`
      setSalaryId(id)
    }
    generateSalaryId()
  }, [])

  // Calculate net salary automatically
  useEffect(() => {
    const base = Number.parseFloat(baseSalary) || 0
    const bonusAmount = Number.parseFloat(bonus) || 0
    const deductionAmount = Number.parseFloat(deduction) || 0
    const calculated = base + bonusAmount - deductionAmount
    setNetSalary(calculated.toFixed(2))
  }, [baseSalary, bonus, deduction])

  // Get available roles based on selected department
  const getAvailableRoles = (selectedDepartment) => {
    return departmentRoles[selectedDepartment] || []
  }

  // Get employees based on selected role
  const getEmployeesByRole = (selectedDepartment, selectedRole) => {
    return employees.filter((emp) => emp.department === selectedDepartment && emp.role === selectedRole)
  }

  // Handle permission selection
  const handlePermissionChange = (serviceId, checked) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, serviceId])
    } else {
      setSelectedPermissions(selectedPermissions.filter((id) => id !== serviceId))
    }
  }

  // Handle employee form submission
  const handleEmployeeSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    const newEmployee = {
      id: employeeId,
      name: employeeName,
      email,
      contact: contactNumber,
      department,
      role,
      level,
      designation,
      dateOfJoining,
      createdBy: "EMP000 - Admin User", // This would come from authentication
      permissions: selectedPermissions,
    }

    // Simulate API call
    setTimeout(() => {
      setEmployees([...employees, newEmployee])
      setSubmitMessage("Employee created successfully!")

      // Reset form
      setEmployeeName("")
      setEmail("")
      setContactNumber("")
      setInitialPassword("")
      setDateOfJoining("")
      setDepartment("")
      setRole("")
      setLevel("")
      setDesignation("")
      setSelectedPermissions([])

      // Generate new employee ID
      const timestamp = Date.now()
      const id = `EMP${timestamp.toString().slice(-6)}`
      setEmployeeId(id)

      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(""), 3000)
    }, 1000)
  }

  // Handle salary form submission
  const handleSalarySubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    const selectedEmp = employees.find((emp) => emp.id === selectedEmployee)
    const newSalaryRecord = {
      id: `SAL${Date.now().toString().slice(-6)}`,
      salaryId: salaryId,
      employeeId: selectedEmployee,
      employeeName: selectedEmp?.name || "",
      department: salaryDepartment,
      role: salaryRole,
      payMonth,
      baseSalary: Number.parseFloat(baseSalary),
      bonus: Number.parseFloat(bonus) || 0,
      deduction: Number.parseFloat(deduction) || 0,
      netSalary: Number.parseFloat(netSalary),
      paymentDate,
      createdBy: "EMP000 - Admin User", // This would come from authentication
      updatedBy: "EMP000 - Admin User",
      lastUpdated: new Date().toISOString(),
    }

    // Simulate API call
    setTimeout(() => {
      setSalaryRecords([...salaryRecords, newSalaryRecord])
      setSubmitMessage("Salary record created successfully!")

      // Reset form
      setSalaryDepartment("")
      setSalaryRole("")
      setSelectedEmployee("")
      setPayMonth("")
      setBaseSalary("")
      setBonus("")
      setDeduction("")
      setNetSalary("")
      setPaymentDate("")

      // Generate new salary ID
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, "0")
      const timestamp = now.getTime().toString().slice(-3)
      const newSalaryId = `SAL${year}${month}${timestamp}`
      setSalaryId(newSalaryId)

      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(""), 3000)
    }, 1000)
  }

  // Handle employee edit
  const handleEditEmployee = (employee) => {
    setEditingEmployee({ ...employee })
    setEditDialogOpen(true)
  }

  // Handle employee delete
  const handleDeleteEmployee = (employeeId) => {
    setEmployees(employees.filter((emp) => emp.id !== employeeId))
    setSubmitMessage("Employee deleted successfully!")
    setTimeout(() => setSubmitMessage(""), 3000)
  }

  // Handle salary edit
  const handleEditSalary = (salary) => {
    setEditingSalary({ ...salary })
    setEditingSalaryDialogOpen(true)
  }

  // Save employee changes
  const saveEmployeeChanges = () => {
    const updatedEmployee = {
      ...editingEmployee,
      updatedBy: "EMP000 - Admin User", // Current user
      lastUpdated: new Date().toISOString(),
    }
    setEmployees(employees.map((emp) => (emp.id === editingEmployee.id ? updatedEmployee : emp)))
    setEditDialogOpen(false)
    setSubmitMessage("Employee updated successfully!")
    setTimeout(() => setSubmitMessage(""), 3000)
  }

  // Save salary changes
  const saveSalaryChanges = () => {
    const updatedSalary = {
      ...editingSalary,
      updatedBy: "EMP000 - Admin User", // Current user
      lastUpdated: new Date().toISOString(),
    }
    setSalaryRecords(salaryRecords.map((record) => (record.id === editingSalary.id ? updatedSalary : record)))
    setEditingSalaryDialogOpen(false)
    setSubmitMessage("Salary record updated successfully!")
    setTimeout(() => setSubmitMessage(""), 3000)
  }

  // Filter employees based on search
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter salary records based on search
  const filteredSalaryRecords = salaryRecords.filter(
    (record) =>
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
              <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
              <p className="text-gray-600">Manage employees and salary records</p>
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
                <CardTitle className="text-lg">Employee Services</CardTitle>
                <CardDescription>Select a service to manage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeSection === "entry" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("entry")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Employee Entry
                </Button>
                <Button
                  variant={activeSection === "list" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("list")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Employee List
                </Button>
                <Button
                  variant={activeSection === "salaries" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("salaries")}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Employee Salaries
                </Button>
                <Button
                  variant={activeSection === "records" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("records")}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Salary Records
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

            {/* Employee Entry Tab */}
            {activeSection === "entry" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Employee Entry
                  </CardTitle>
                  <CardDescription>Add a new employee to your organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEmployeeSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="employeeName">Employee Name *</Label>
                        <Input
                          id="employeeName"
                          value={employeeName}
                          onChange={(e) => setEmployeeName(e.target.value)}
                          placeholder="Enter full name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="employee@company.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact Number *</Label>
                        <Input
                          id="contactNumber"
                          type="tel"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          placeholder="+91 9876543210"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="initialPassword">Initial Password *</Label>
                        <Input
                          id="initialPassword"
                          type="password"
                          value={initialPassword}
                          onChange={(e) => setInitialPassword(e.target.value)}
                          placeholder="Create initial password"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <Input id="employeeId" value={employeeId} className="bg-gray-50" readOnly />
                        <p className="text-xs text-gray-500">Auto-generated unique ID</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateOfJoining">Date of Joining *</Label>
                        <Input
                          id="dateOfJoining"
                          type="date"
                          value={dateOfJoining}
                          onChange={(e) => setDateOfJoining(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department *</Label>
                        <Select
                          value={department}
                          onValueChange={(value) => {
                            setDepartment(value)
                            setRole("") // Reset role when department changes
                          }}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(departmentRoles).map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Role *</Label>
                        <Input
                          id="role"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="Enter role (e.g., Software Developer, HR Executive)"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="level">Employee Level *</Label>
                      <Select value={level} onValueChange={setLevel} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="createdBy">Created By</Label>
                      <Input id="createdBy" value="EMP000 - Admin User" className="bg-gray-50" readOnly />
                      <p className="text-xs text-gray-500">Auto-filled from authentication</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation *</Label>
                      <Select value={designation} onValueChange={setDesignation} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="C-Level Executive">C-Level Executive</SelectItem>
                          <SelectItem value="Department Head / Director">Department Head / Director</SelectItem>
                          <SelectItem value="Finance & Accounts">Finance & Accounts</SelectItem>
                          <SelectItem value="Operations & Administration">Operations & Administration</SelectItem>
                          <SelectItem value="Software Development">Software Development</SelectItem>
                          <SelectItem value="IT & Infrastructure">IT & Infrastructure</SelectItem>
                          <SelectItem value="Data Science & AI">Data Science & AI</SelectItem>
                          <SelectItem value="Sales & Business Development">Sales & Business Development</SelectItem>
                          <SelectItem value="Marketing & Content">Marketing & Content</SelectItem>
                          <SelectItem value="Human Resources (HR)">Human Resources (HR)</SelectItem>
                          <SelectItem value="Customer & Vendor Relations">Customer & Vendor Relations</SelectItem>
                          <SelectItem value="Product & Project Management">Product & Project Management</SelectItem>
                          <SelectItem value="Legal & Compliance">Legal & Compliance</SelectItem>
                          <SelectItem value="Design & User Experience">Design & User Experience</SelectItem>
                          <SelectItem value="Support Staff / Interns">Support Staff / Interns</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Service Permissions</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-lg">
                        {availableServices.map((service) => (
                          <div key={service.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={service.id}
                              checked={selectedPermissions.includes(service.id)}
                              onCheckedChange={(checked) => handlePermissionChange(service.id, checked)}
                            />
                            <Label htmlFor={service.id} className="text-sm font-normal">
                              {service.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Creating Employee..."
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Employee
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Employee List Tab */}
            {activeSection === "list" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Employee List
                  </CardTitle>
                  <CardDescription>View and manage all employees</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredEmployees.map((employee) => (
                        <Card key={employee.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{employee.name}</CardTitle>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditEmployee(employee)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteEmployee(employee.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <CardDescription>{employee.id}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium">Department:</span> {employee.department}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Role:</span> {employee.role}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Level:</span> Level {employee.level}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Email:</span> {employee.email}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Contact:</span> {employee.contact}
                            </div>
                            {employee.updatedBy && (
                              <div className="text-xs text-gray-500 pt-2 border-t">
                                <div>Updated by: {employee.updatedBy}</div>
                                <div>Last updated: {new Date(employee.lastUpdated).toLocaleString()}</div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Employee Salaries Tab */}
            {activeSection === "salaries" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Employee Salaries
                  </CardTitle>
                  <CardDescription>Create and manage employee salary records</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSalarySubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="salaryDepartment">Department *</Label>
                        <Select
                          value={salaryDepartment}
                          onValueChange={(value) => {
                            setSalaryDepartment(value)
                            setSalaryRole("")
                            setSelectedEmployee("")
                          }}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(departmentRoles).map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salaryRole">Role *</Label>
                        <Select
                          value={salaryRole}
                          onValueChange={(value) => {
                            setSalaryRole(value)
                            setSelectedEmployee("")
                          }}
                          required
                          disabled={!salaryDepartment}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableRoles(salaryDepartment).map((roleOption) => (
                              <SelectItem key={roleOption} value={roleOption}>
                                {roleOption}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="selectedEmployee">Employee *</Label>
                        <Select
                          value={selectedEmployee}
                          onValueChange={setSelectedEmployee}
                          required
                          disabled={!salaryRole}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {getEmployeesByRole(salaryDepartment, salaryRole).map((emp) => (
                              <SelectItem key={emp.id} value={emp.id}>
                                {emp.id} - {emp.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salaryId">Salary ID</Label>
                        <Input id="salaryId" value={salaryId} className="bg-gray-50" readOnly />
                        <p className="text-xs text-gray-500">Auto-generated unique salary ID</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payMonth">Pay Month *</Label>
                      <Input
                        id="payMonth"
                        type="month"
                        value={payMonth}
                        onChange={(e) => setPayMonth(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="baseSalary">Base Salary *</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <Input
                            id="baseSalary"
                            type="number"
                            value={baseSalary}
                            onChange={(e) => setBaseSalary(e.target.value)}
                            placeholder="0.00"
                            className="pl-8"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bonus">Bonus</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <Input
                            id="bonus"
                            type="number"
                            value={bonus}
                            onChange={(e) => setBonus(e.target.value)}
                            placeholder="0.00"
                            className="pl-8"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deduction">Deduction</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <Input
                            id="deduction"
                            type="number"
                            value={deduction}
                            onChange={(e) => setDeduction(e.target.value)}
                            placeholder="0.00"
                            className="pl-8"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="netSalary">Net Salary</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <Input id="netSalary" type="number" value={netSalary} className="pl-8 bg-gray-50" readOnly />
                      </div>
                      <p className="text-xs text-gray-500">Automatically calculated: Base Salary + Bonus - Deduction</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentDate">Payment Date *</Label>
                        <Input
                          id="paymentDate"
                          type="date"
                          value={paymentDate}
                          onChange={(e) => setPaymentDate(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="createdBy">Created By</Label>
                        <Input id="createdBy" value="EMP000 - Admin User" className="bg-gray-50" readOnly />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Creating Salary Record..."
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Create Salary Record
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Salary Records Tab */}
            {activeSection === "records" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Salary Records
                  </CardTitle>
                  <CardDescription>View and manage all salary records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search salary records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Salary ID</TableHead>
                          <TableHead>Employee</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Pay Month</TableHead>
                          <TableHead>Net Salary</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSalaryRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.salaryId}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{record.employeeName}</div>
                                <div className="text-sm text-gray-500">{record.employeeId}</div>
                              </div>
                            </TableCell>
                            <TableCell>{record.department}</TableCell>
                            <TableCell>{record.payMonth}</TableCell>
                            <TableCell>₹{record.netSalary.toLocaleString()}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => handleEditSalary(record)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Employee Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>Update employee information</DialogDescription>
          </DialogHeader>
          {editingEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Employee Name</Label>
                  <Input
                    value={editingEmployee.name}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Employee ID</Label>
                  <Input value={editingEmployee.id} className="bg-gray-50" readOnly />
                  <p className="text-xs text-gray-500">Employee ID cannot be changed</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    value={editingEmployee.email}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Number</Label>
                  <Input
                    value={editingEmployee.contact}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, contact: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date of Joining</Label>
                  <Input type="date" value={editingEmployee.dateOfJoining} className="bg-gray-50" readOnly />
                  <p className="text-xs text-gray-500">Date of joining cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Select
                    value={editingEmployee.designation}
                    onValueChange={(value) => setEditingEmployee({ ...editingEmployee, designation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="C-Level Executive">C-Level Executive</SelectItem>
                      <SelectItem value="Department Head / Director">Department Head / Director</SelectItem>
                      <SelectItem value="Finance & Accounts">Finance & Accounts</SelectItem>
                      <SelectItem value="Operations & Administration">Operations & Administration</SelectItem>
                      <SelectItem value="Software Development">Software Development</SelectItem>
                      <SelectItem value="IT & Infrastructure">IT & Infrastructure</SelectItem>
                      <SelectItem value="Data Science & AI">Data Science & AI</SelectItem>
                      <SelectItem value="Sales & Business Development">Sales & Business Development</SelectItem>
                      <SelectItem value="Marketing & Content">Marketing & Content</SelectItem>
                      <SelectItem value="Human Resources (HR)">Human Resources (HR)</SelectItem>
                      <SelectItem value="Customer & Vendor Relations">Customer & Vendor Relations</SelectItem>
                      <SelectItem value="Product & Project Management">Product & Project Management</SelectItem>
                      <SelectItem value="Legal & Compliance">Legal & Compliance</SelectItem>
                      <SelectItem value="Design & User Experience">Design & User Experience</SelectItem>
                      <SelectItem value="Support Staff / Interns">Support Staff / Interns</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select
                    value={editingEmployee.department}
                    onValueChange={(value) => setEditingEmployee({ ...editingEmployee, department: value, role: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(departmentRoles).map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={editingEmployee.role}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value })}
                    placeholder="Enter role (e.g., Software Developer, HR Executive)"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Employee Level</Label>
                  <Select
                    value={editingEmployee.level}
                    onValueChange={(value) => setEditingEmployee({ ...editingEmployee, level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Service Permissions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-lg max-h-48 overflow-y-auto">
                  {availableServices.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${service.id}`}
                        checked={editingEmployee?.permissions?.includes(service.id) || false}
                        onCheckedChange={(checked) => {
                          if (!editingEmployee) return
                          const currentPermissions = editingEmployee.permissions || []
                          let newPermissions
                          if (checked) {
                            newPermissions = [...currentPermissions, service.id]
                          } else {
                            newPermissions = currentPermissions.filter((id) => id !== service.id)
                          }
                          setEditingEmployee({ ...editingEmployee, permissions: newPermissions })
                        }}
                      />
                      <Label htmlFor={`edit-${service.id}`} className="text-sm font-normal">
                        {service.name}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">Select the services this employee can access</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEmployeeChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Salary Edit Dialog */}
      <Dialog open={editingSalaryDialogOpen} onOpenChange={setEditingSalaryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Salary Record</DialogTitle>
            <DialogDescription>Update salary information</DialogDescription>
          </DialogHeader>
          {editingSalary && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label>Salary ID</Label>
                <Input value={editingSalary.salaryId} className="bg-gray-50" readOnly />
                <p className="text-xs text-gray-500">Salary ID cannot be changed</p>
              </div>
              <div className="space-y-2">
                <Label>Pay Month</Label>
                <Input
                  type="month"
                  value={editingSalary.payMonth}
                  onChange={(e) => setEditingSalary({ ...editingSalary, payMonth: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Base Salary</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    type="number"
                    className="pl-8"
                    value={editingSalary.baseSalary}
                    onChange={(e) => {
                      const newBaseSalary = Number.parseFloat(e.target.value) || 0
                      const newNetSalary = newBaseSalary + editingSalary.bonus - editingSalary.deduction
                      setEditingSalary({
                        ...editingSalary,
                        baseSalary: newBaseSalary,
                        netSalary: newNetSalary,
                      })
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bonus</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    type="number"
                    className="pl-8"
                    value={editingSalary.bonus}
                    onChange={(e) => {
                      const newBonus = Number.parseFloat(e.target.value) || 0
                      const newNetSalary = editingSalary.baseSalary + newBonus - editingSalary.deduction
                      setEditingSalary({
                        ...editingSalary,
                        bonus: newBonus,
                        netSalary: newNetSalary,
                      })
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Deduction</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    type="number"
                    className="pl-8"
                    value={editingSalary.deduction}
                    onChange={(e) => {
                      const newDeduction = Number.parseFloat(e.target.value) || 0
                      const newNetSalary = editingSalary.baseSalary + editingSalary.bonus - newDeduction
                      setEditingSalary({
                        ...editingSalary,
                        deduction: newDeduction,
                        netSalary: newNetSalary,
                      })
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Net Salary</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <Input type="number" className="pl-8 bg-gray-50" value={editingSalary.netSalary} readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Input
                  type="date"
                  value={editingSalary.paymentDate}
                  onChange={(e) => setEditingSalary({ ...editingSalary, paymentDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Updated By</Label>
                <Input value="EMP000 - Admin User" className="bg-gray-50" readOnly />
                <p className="text-xs text-gray-500">Auto-filled from current user</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSalaryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveSalaryChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
