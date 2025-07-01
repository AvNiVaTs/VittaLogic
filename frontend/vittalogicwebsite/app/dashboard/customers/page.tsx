"use client"

import { ArrowLeft, Users, Plus, Save, Edit, Trash2, Search, MapPin, Phone, Mail, Building } from "lucide-react"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock existing customers
const mockCustomers = [
  {
    id: "CUST001",
    name: "Acme Corporation",
    email: "contact@acme.com",
    contact: "+91 9876543210",
    location: "indian",
    priority: "high",
    address: "123 Business Park, Mumbai, Maharashtra",
    createdBy: "EMP000 - Admin User",
    updatedBy: "EMP000 - Admin User",
    lastUpdated: "2024-01-15T10:30:00Z",
  },
  {
    id: "CUST002",
    name: "Global Tech Solutions",
    email: "info@globaltech.com",
    contact: "+1 555-123-4567",
    location: "international",
    priority: "medium",
    address: "456 Tech Avenue, San Francisco, CA, USA",
    createdBy: "EMP000 - Admin User",
    updatedBy: "EMP000 - Admin User",
    lastUpdated: "2024-01-20T14:15:00Z",
  },
  {
    id: "CUST003",
    name: "Indian Enterprises",
    email: "contact@indianent.com",
    contact: "+91 9876543211",
    location: "indian",
    priority: "low",
    address: "789 Industrial Area, Delhi, India",
    createdBy: "EMP000 - Admin User",
    updatedBy: "EMP000 - Admin User",
    lastUpdated: "2024-01-10T09:45:00Z",
  },
]

export default function CustomersPage() {
  const [activeSection, setActiveSection] = useState("entry")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [customers, setCustomers] = useState(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)

  // Customer Entry Form State
  const [customerName, setCustomerName] = useState("")
  const [email, setEmail] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [location, setLocation] = useState("")
  const [priority, setPriority] = useState("")
  const [intlPriority, setIntlPriority] = useState("")
  const [address, setAddress] = useState("")

  // Generate customer ID on component mount
  useEffect(() => {
    const generateCustomerId = () => {
      const timestamp = Date.now()
      const id = `CUST${timestamp.toString().slice(-6)}`
      setCustomerId(id)
    }
    generateCustomerId()
  }, [])

  // Handle customer form submission
  const handleCustomerSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    const newCustomer = {
      id: customerId,
      name: customerName,
      email,
      contact: contactNumber,
      location,
      priority: location === "indian" ? priority : intlPriority,
      address,
      createdBy: "EMP000 - Admin User", // This would come from authentication
      updatedBy: "EMP000 - Admin User",
      lastUpdated: new Date().toISOString(),
    }

    // Simulate API call
    setTimeout(() => {
      setCustomers([...customers, newCustomer])
      setSubmitMessage("Customer created successfully!")

      // Reset form
      setCustomerName("")
      setEmail("")
      setContactNumber("")
      setLocation("")
      setPriority("")
      setIntlPriority("")
      setAddress("")

      // Generate new customer ID
      const timestamp = Date.now()
      const id = `CUST${timestamp.toString().slice(-6)}`
      setCustomerId(id)

      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(""), 3000)
    }, 1000)
  }

  // Handle customer edit
  const handleEditCustomer = (customer) => {
    setEditingCustomer({ ...customer })
    setEditDialogOpen(true)
  }

  // Handle customer delete
  const handleDeleteCustomer = (customerId) => {
    setCustomers(customers.filter((cust) => cust.id !== customerId))
    setSubmitMessage("Customer deleted successfully!")
    setTimeout(() => setSubmitMessage(""), 3000)
  }

  // Save customer changes
  const saveCustomerChanges = () => {
    const updatedCustomer = {
      ...editingCustomer,
      updatedBy: "EMP000 - Admin User", // Current user
      lastUpdated: new Date().toISOString(),
    }
    setCustomers(customers.map((cust) => (cust.id === editingCustomer.id ? updatedCustomer : cust)))
    setEditDialogOpen(false)
    setSubmitMessage("Customer updated successfully!")
    setTimeout(() => setSubmitMessage(""), 3000)
  }

  // Filter customers based on search
  const filteredCustomers = customers.filter(
    (cust) =>
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.location.toLowerCase().includes(searchTerm.toLowerCase()),
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
              <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
              <p className="text-gray-600">Manage your customer database</p>
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
                <CardTitle className="text-lg">Customer Services</CardTitle>
                <CardDescription>Select a service to manage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeSection === "entry" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("entry")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
                <Button
                  variant={activeSection === "list" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("list")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Customer List
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

            {/* Customer Entry Tab */}
            {activeSection === "entry" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2 text-blue-600" />
                    Add Customer
                  </CardTitle>
                  <CardDescription>Add a new customer to your database</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCustomerSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerName">Customer Name *</Label>
                        <Input
                          id="customerName"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Enter customer name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customerId">Customer ID</Label>
                        <Input id="customerId" value={customerId} className="bg-gray-50" readOnly />
                        <p className="text-xs text-gray-500">Auto-generated unique ID</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="customer@company.com"
                          required
                        />
                      </div>

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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Customer Location *</Label>
                      <Select
                        value={location}
                        onValueChange={(value) => {
                          setLocation(value)
                          setPriority("")
                          setIntlPriority("")
                        }}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="indian">Indian</SelectItem>
                          <SelectItem value="international">International</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Customer Priority for Indian customers */}
                    {location === "indian" && (
                      <div className="space-y-2">
                        <Label htmlFor="priority">Customer Priority *</Label>
                        <Select value={priority} onValueChange={setPriority} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select customer priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Customer Priority for International customers */}
                    {location === "international" && (
                      <div className="space-y-2">
                        <Label htmlFor="intlPriority">Customer Priority *</Label>
                        <Select value={intlPriority} onValueChange={setIntlPriority} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select customer priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter complete address"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="createdBy">Created By</Label>
                      <Input id="createdBy" value="EMP000 - Admin User" className="bg-gray-50" readOnly />
                      <p className="text-xs text-gray-500">Auto-filled from authentication</p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Creating Customer..."
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Create Customer
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Customer List Tab */}
            {activeSection === "list" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Customer List
                  </CardTitle>
                  <CardDescription>View and manage all customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredCustomers.map((customer) => (
                        <Card key={customer.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg flex items-center">
                                <Building className="h-4 w-4 mr-2 text-blue-600" />
                                {customer.name}
                              </CardTitle>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditCustomer(customer)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteCustomer(customer.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <CardDescription>{customer.id}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Mail className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="font-medium">Email:</span>
                              <span className="ml-1 text-gray-600">{customer.email}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="font-medium">Contact:</span>
                              <span className="ml-1 text-gray-600">{customer.contact}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="font-medium">Location:</span>
                              <span className="ml-1 text-gray-600 capitalize">{customer.location}</span>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Priority:</span>
                              <span
                                className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                                  customer.priority === "high"
                                    ? "bg-red-100 text-red-800"
                                    : customer.priority === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                }`}
                              >
                                {customer.priority.charAt(0).toUpperCase() + customer.priority.slice(1)}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Address:</span>
                              <p className="text-gray-600 text-xs mt-1">{customer.address}</p>
                            </div>
                            {customer.updatedBy && (
                              <div className="text-xs text-gray-500 pt-2 border-t">
                                <div>Updated by: {customer.updatedBy}</div>
                                <div>Last updated: {new Date(customer.lastUpdated).toLocaleString()}</div>
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
          </div>
        </div>
      </div>

      {/* Customer Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update customer information</DialogDescription>
          </DialogHeader>
          {editingCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input
                    value={editingCustomer.name}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Customer ID</Label>
                  <Input value={editingCustomer.id} className="bg-gray-50" readOnly />
                  <p className="text-xs text-gray-500">Customer ID cannot be changed</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    value={editingCustomer.email}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Number</Label>
                  <Input
                    value={editingCustomer.contact}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, contact: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer Location</Label>
                  <Select
                    value={editingCustomer.location}
                    onValueChange={(value) => setEditingCustomer({ ...editingCustomer, location: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Customer Priority</Label>
                  <Select
                    value={editingCustomer.priority}
                    onValueChange={(value) => setEditingCustomer({ ...editingCustomer, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                <Label>Address</Label>
                <Textarea
                  value={editingCustomer.address}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCustomerChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
