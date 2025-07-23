"use client"

import { ArrowLeft, DollarSign, Edit, Plus, Save, Search, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const employee = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("loggedInEmployee")) : null
const LOGGED_IN_EMPLOYEE_ID = employee?.employeeId || null

// Available services for permissions
const availableServices = [
  { id: "Department Service", name: "Department Service" },
  { id: "Employee Service", name: "Employee Service" },
  { id: "Transaction Service", name: "Transaction Service" },
  { id: "Asset Service", name: "Asset Service" },
  { id: "Company Financials Service", name: "Company Financials Service" },
  { id: "Vendor Service", name: "Vendor Service" },
  { id: "Customer Service", name: "Customer Service" },
  { id: "Approval Service", name: "Approval Service" },
  { id: "Dashboard Service", name: "Dashboard Service" },
]

export default function EmployeePage() {
  const [activeSection, setActiveSection] = useState("entry")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [employees, setEmployees] = useState([])
  const [salaryRecords, setSalaryRecords] = useState([])
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
  const [departmentOptions, setDepartmentOptions] = useState([])

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
  const [availableRoles, setAvailableRoles] = useState([])
  const [availableEmployees, setAvailableEmployees] = useState([])

  // Fetch departments for dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/emp/dropdown", {
          credentials: "include",
        })
        const data = await res.json()
        if (data.success) {
          setDepartmentOptions(data.data)
        } else {
          setSubmitMessage(data.message || "Failed to fetch departments")
        }
      } catch (error) {
        console.error("Error fetching departments:", error)
        setSubmitMessage("Error fetching departments")
      }
    }
    fetchDepartments()
  }, [])

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/emp/allEmps", {
          credentials: "include",
        })
        const data = await res.json()
        if (data.success) {
          setEmployees(data.data)
        } else {
          setSubmitMessage(data.message || "Failed to fetch employees")
        }
      } catch (error) {
        console.error("Error fetching employees:", error)
        setSubmitMessage("Error fetching employees")
      }
    }
    fetchEmployees()
  }, [])

  // Fetch all salary records
  useEffect(() => {
    const fetchSalaryRecords = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/emp/salary/getAllSal", {
          credentials: "include",
        })
        const data = await res.json()
        if (data.success) {
          setSalaryRecords(data.data)
        } else {
          setSubmitMessage(data.message || "Failed to fetch salary records")
        }
      } catch (error) {
        console.error("Error fetching salary records:", error)
        setSubmitMessage("Error fetching salary records")
      }
    }
    fetchSalaryRecords()
  }, [])

  // Fetch roles by department
  useEffect(() => {
    if (!salaryDepartment) return
    const fetchRoles = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/emp/salary/dept-role-dropdown?departmentId=${salaryDepartment}`,
          { credentials: "include" }
        )
        const data = await res.json()
        if (data.success) {
          setAvailableRoles(data.data)
        } else {
          setSubmitMessage(data.message || "Failed to fetch roles")
        }
      } catch (error) {
        console.error("Error fetching roles:", error)
        setSubmitMessage("Error fetching roles")
      }
    }
    fetchRoles()
  }, [salaryDepartment])

  // Fetch employees by department and role
  useEffect(() => {
    if (!salaryDepartment || !salaryRole) return
    const fetchEmployees = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/emp/salary/emp-role-dropdown?departmentId=${salaryDepartment}&role=${encodeURIComponent(salaryRole)}`,
          { credentials: "include" }
        )
        const data = await res.json()
        console.log("Employees API response:", data) // Debugging
        if (data.success) {
          setAvailableEmployees(data.data || [])
        } else {
          setAvailableEmployees([])
          setSubmitMessage(data.message || "Failed to fetch employees")
        }
      } catch (error) {
        console.error("Error fetching employees:", error)
        setAvailableEmployees([])
        setSubmitMessage("Error fetching employees")
      }
    }
    fetchEmployees()
  }, [salaryDepartment, salaryRole])

  // Generate employee ID on component mount
  useEffect(() => {
    const generateEmployeeId = async () => {
      const timestamp = Date.now()
      setEmployeeId(`EMP${timestamp.toString().slice(-6)}`)
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
      setSalaryId(`SAL${year}${month}${timestamp}`)
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

    try {
      const res = await fetch("http://localhost:8000/api/v1/emp/registerEmp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          employeeName,
          emailAddress: email,
          contactNumber,
          password: initialPassword,
          designation,
          dateOfJoining,
          department,
          role,
          level,
          servicePermissions: selectedPermissions,
          createdBy: LOGGED_IN_EMPLOYEE_ID,
          updatedBy: LOGGED_IN_EMPLOYEE_ID,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setEmployees((prev) => [...prev, data.data])
        setSubmitMessage("Employee created successfully!")
        // Reset form fields
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
        setEmployeeId(`EMP${timestamp.toString().slice(-6)}`)
      } else {
        setSubmitMessage(data.message || "Failed to create employee")
      }
    } catch (error) {
      console.error("Error creating employee:", error)
      setSubmitMessage("Something went wrong.")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(""), 3000)
    }
  }

  // Handle salary form submission
const handleSalarySubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitMessage("");

  try {
    // Format payMonth from "YYYY-MM" to "MM-YYYY"
    const formattedPayMonth = (() => {
      if (!payMonth) return "";
      const [year, month] = payMonth.split("-");
      return `${month}-${year}`;
    })();

    const res = await fetch("http://localhost:8000/api/v1/emp/salary/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        employee: selectedEmployee,
        department: salaryDepartment,
        role: salaryRole,
        payMonth: formattedPayMonth, // ✅ Correct format
        baseSalary: Number.parseFloat(baseSalary),
        bonus: Number.parseFloat(bonus) || 0,
        deduction: Number.parseFloat(deduction) || 0,
        paymentDate,
        createdBy: LOGGED_IN_EMPLOYEE_ID,
        updatedBy: LOGGED_IN_EMPLOYEE_ID,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setSalaryRecords((prev) => [...prev, data.data]);
      setSubmitMessage("Salary record created successfully!");

      // Reset form fields
      setSalaryDepartment("");
      setSalaryRole("");
      setSelectedEmployee("");
      setPayMonth("");
      setBaseSalary("");
      setBonus("");
      setDeduction("");
      setNetSalary("");
      setPaymentDate("");

      // Generate new salary ID
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const timestamp = now.getTime().toString().slice(-3);
      setSalaryId(`SAL${year}${month}${timestamp}`);
    } else {
      setSubmitMessage(data.message || "Failed to create salary record");
    }
  } catch (error) {
    console.error("Error submitting salary:", error);
    setSubmitMessage("Something went wrong.");
  } finally {
    setIsSubmitting(false);
    setTimeout(() => setSubmitMessage(""), 3000);
  }
};

  // Handle employee edit
  const handleEditEmployee = (employee) => {
    setEditingEmployee({
      ...employee,
      department: employee.department?.department_id || employee.department,
    })
    setEditDialogOpen(true)
  }

  // Handle employee delete
  const handleDeleteEmployee = async (employeeId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/emp/delete/${employeeId}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data = await res.json()
      if (data.success) {
        setEmployees(employees.filter((emp) => emp.employeeId !== employeeId))
        setSubmitMessage("Employee deleted successfully!")
      } else {
        setSubmitMessage(data.message || "Delete failed")
      }
    } catch (error) {
      console.error("Error deleting employee:", error)
      setSubmitMessage("Something went wrong.")
    } finally {
      setTimeout(() => setSubmitMessage(""), 3000)
    }
  }

  // Handle salary edit
  const handleEditSalary = (salary) => {
    setEditingSalary({ ...salary })
    setEditingSalaryDialogOpen(true)
  }

  // Save employee changes
  const saveEmployeeChanges = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/emp/update/${editingEmployee.employeeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          employeeName: editingEmployee.employeeName,
          emailAddress: editingEmployee.emailAddress,
          contactNumber: editingEmployee.contactNumber,
          designation: editingEmployee.designation,
          department: editingEmployee.department,
          role: editingEmployee.role,
          level: editingEmployee.level,
          servicePermissions: editingEmployee.servicePermissions,
          updatedBy: LOGGED_IN_EMPLOYEE_ID,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setEmployees(employees.map((emp) =>
          emp.employeeId === editingEmployee.employeeId ? data.data : emp
        ))
        setEditDialogOpen(false)
        setSubmitMessage("Employee updated successfully!")
      } else {
        setSubmitMessage(data.message || "Failed to update employee")
      }
    } catch (error) {
      console.error("Error updating employee:", error)
      setSubmitMessage("Something went wrong.")
    } finally {
      setTimeout(() => setSubmitMessage(""), 3000)
    }
  }

  // Save salary changes
const saveSalaryChanges = async () => {
  try {
    // Extract the payMonth from paymentDate (format to MM-YYYY)
    const payMonthDate = new Date(editingSalary.paymentDate);
    const payMonth = `${String(payMonthDate.getMonth() + 1).padStart(2, "0")}-${payMonthDate.getFullYear()}`;

    const res = await fetch(`http://localhost:8000/api/v1/emp/salary/update/${editingSalary.salaryId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        baseSalary: Number.parseFloat(editingSalary.baseSalary),
        bonus: Number.parseFloat(editingSalary.bonus) || 0,
        deduction: Number.parseFloat(editingSalary.deduction) || 0,
        paymentDate: editingSalary.paymentDate,
        updatedBy: LOGGED_IN_EMPLOYEE_ID,
        payMonth, // ✅ correctly formatted MM-YYYY
      }),
    });

    const data = await res.json();

    if (data.success) {
      setSalaryRecords(salaryRecords.map((record) =>
        record.salaryId === editingSalary.salaryId ? data.data : record
      ));
      setEditingSalaryDialogOpen(false);
      setSubmitMessage("Salary record updated successfully!");
    } else {
      setSubmitMessage(data.message || "Failed to update salary record");
    }
  } catch (error) {
    console.error("Error updating salary:", error);
    setSubmitMessage("Something went wrong.");
  } finally {
    setTimeout(() => setSubmitMessage(""), 3000);
  }
};



  const filteredEmployees = employees.filter(
    (emp) =>
      emp?.employeeName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      emp?.employeeId?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      emp?.department?.departmentName?.toLowerCase()?.includes(searchTerm.toLowerCase())
  )

  const filteredSalaryRecords = salaryRecords.filter(
    (record) =>
      record?.employee?.employeeName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      record?.employee?.employeeId?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      record?.department?.departmentName?.toLowerCase()?.includes(searchTerm.toLowerCase())
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
                            setRole("")
                          }}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departmentOptions.map((dept) => (
                              <SelectItem key={dept.value} value={dept.value}>
                                {dept.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="Enter Role (e.g., HR Manager)"
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
                      <Input id="createdBy" value={LOGGED_IN_EMPLOYEE_ID} className="bg-gray-50" readOnly />
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
                        <Card key={employee.employeeId} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{employee.employeeName}</CardTitle>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditEmployee(employee)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteEmployee(employee.employeeId)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <CardDescription>{employee.employeeId}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium">Department:</span>{" "}
                              {employee.department?.departmentName || employee.department}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Role:</span> {employee.role}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Level:</span> Level {employee.level}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Email:</span> {employee.emailAddress}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Contact:</span> {employee.contactNumber}
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
                            setAvailableEmployees([]) // Reset employees when department changes
                          }}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departmentOptions.map((dept) => (
                              <SelectItem key={dept.value} value={dept.value}>
                                {dept.label}
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
                            setAvailableEmployees([]) // Reset employees when role changes
                          }}
                          required
                          disabled={!salaryDepartment}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableRoles.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
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
                          disabled={!salaryRole || availableEmployees.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={availableEmployees.length === 0 ? "No employees available" : "Select employee"} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableEmployees.map((emp) => (
                              <SelectItem key={emp.value} value={emp.value}>
                                {emp.label}
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
                        <Input id="createdBy" value={LOGGED_IN_EMPLOYEE_ID} className="bg-gray-50" readOnly />
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
                          <TableRow key={record.salaryId}>
                            <TableCell className="font-medium">{record.salaryId}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{record.employee?.employeeName}</div>
                                <div className="text-sm text-gray-500">{record.employee?.employeeId}</div>
                              </div>
                            </TableCell>
                            <TableCell>{record.department?.departmentName}</TableCell>
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
                    value={editingEmployee.employeeName}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, employeeName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Employee ID</Label>
                  <Input value={editingEmployee.employeeId} className="bg-gray-50" readOnly />
                  <p className="text-xs text-gray-500">Employee ID cannot be changed</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    value={editingEmployee.emailAddress}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, emailAddress: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Number</Label>
                  <Input
                    value={editingEmployee.contactNumber}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, contactNumber: e.target.value })}
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
                      {departmentOptions.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
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
                        checked={editingEmployee?.servicePermissions?.includes(service.id) || false}
                        onCheckedChange={(checked) => {
                          if (!editingEmployee) return
                          const currentPermissions = editingEmployee.servicePermissions || []
                          let newPermissions
                          if (checked) {
                            newPermissions = [...currentPermissions, service.id]
                          } else {
                            newPermissions = currentPermissions.filter((id) => id !== service.id)
                          }
                          setEditingEmployee({ ...editingEmployee, servicePermissions: newPermissions })
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
                      const newNetSalary = newBaseSalary + (editingSalary.bonus || 0) - (editingSalary.deduction || 0)
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
                      const newNetSalary = editingSalary.baseSalary + newBonus - (editingSalary.deduction || 0)
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
                      const newNetSalary = editingSalary.baseSalary + (editingSalary.bonus || 0) - newDeduction
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
                <Input value={LOGGED_IN_EMPLOYEE_ID} className="bg-gray-50" readOnly />
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