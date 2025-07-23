"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Calculator,
  Clock,
  Copy,
  Edit,
  History,
  Plus,
  Recycle,
  Search,
  Trash2,
  TrendingDown,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

// Authentication check
const employee = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("loggedInEmployee")) : null
const LOGGED_IN_EMPLOYEE_ID = employee?.employeeId || null

// Assignment Form Component
function AssignmentForm({ assetId, assetName, onAssign }) {
  const [departments, setDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [employees, setEmployees] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false)

  // Fetch departments using the new dropdown API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/asset/dropdown/department", {
          headers: {
            Authorization: `Bearer ${employee?.token}`,
          },
        })
        const data = await response.json()
        if (data.success) {
          setDepartments(data.data)
        } else {
          toast.error("Failed to fetch departments")
        }
      } catch (error) {
        console.error("Error fetching departments:", error)
        toast.error("Error fetching departments")
      }
    }
    fetchDepartments()
  }, [])

  // Fetch employees when department is selected using the new dropdown API
  useEffect(() => {
    if (selectedDepartment) {
      const fetchEmployees = async () => {
        setIsLoadingEmployees(true)
        try {
          const response = await fetch(
            `http://localhost:8000/api/v1/asset/dropdown/employee/${selectedDepartment}`,
            {
              headers: {
                Authorization: `Bearer ${employee?.token}`,
              },
            }
          )
          const data = await response.json()
          if (data.success) {
            setEmployees(data.data)
          } else {
            toast.error("Failed to fetch employees")
            setEmployees([])
          }
        } catch (error) {
          console.error("Error fetching employees:", error)
          toast.error("Error fetching employees")
          setEmployees([])
        } finally {
          setIsLoadingEmployees(false)
        }
      }
      fetchEmployees()
    } else {
      setEmployees([])
    }
  }, [selectedDepartment])

  const handleSubmit = async () => {
    if (!selectedDepartment || !selectedEmployee) {
      toast.error("Please select department and employee")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`http://localhost:8000/api/v1/asset/update-assignment/${assetId}`, {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${employee?.token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          employeeId: selectedEmployee,
          departmentId: selectedDepartment,
          assignmentStatus: "Assigned", // ✅ Add this if required by your schema
          assignedBy: LOGGED_IN_EMPLOYEE_ID,
          updatedBy: LOGGED_IN_EMPLOYEE_ID,
        }),
      })  

      const data = await response.json()
      if (data.success) {
        // Find the selected department and employee names for display
        const selectedDeptName = departments.find(d => d.value === selectedDepartment)?.label || selectedDepartment
        const selectedEmpName = employees.find(e => e.value === selectedEmployee)?.label || selectedEmployee
        
        onAssign(assetId, selectedEmployee, selectedDepartment)
        toast.success(`Asset assigned successfully to ${selectedEmpName}!`)
        setSelectedDepartment("")
        setSelectedEmployee("")
      } else {
        toast.error(data.message || "Failed to assign asset")
      }
    } catch (error) {
      console.error("Error assigning asset:", error)
      toast.error("Error assigning asset")
    } finally {
      setIsSubmitting(false)
    }
  } 

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="department">Department *</Label>
        <Select
          value={selectedDepartment}
          onValueChange={(value) => {
            setSelectedDepartment(value)
            setSelectedEmployee("")
          }}
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

      <div>
        <Label htmlFor="employee">Employee *</Label>
        <Select 
          value={selectedEmployee} 
          onValueChange={setSelectedEmployee} 
          disabled={!selectedDepartment || isLoadingEmployees}
        >
          <SelectTrigger>
            <SelectValue 
              placeholder={
                !selectedDepartment 
                  ? "Select department first" 
                  : isLoadingEmployees 
                    ? "Loading employees..." 
                    : "Select employee"
              } 
            />
          </SelectTrigger>
          <SelectContent>
            {employees.length === 0 && selectedDepartment && !isLoadingEmployees ? (
              <div className="p-2 text-center text-sm text-gray-500">
                No employees found in this department
              </div>
            ) : (
              employees.map((employee) => (
                <SelectItem key={employee.value} value={employee.value}>
                  {employee.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {isLoadingEmployees && (
          <p className="text-xs text-blue-600 mt-1">Loading employees...</p>
        )}
      </div>

      {selectedDepartment && selectedEmployee && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Assignment Summary</h4>
          <div className="text-sm space-y-1">
            <div>
              <span className="font-medium">Asset:</span> {assetName}
            </div>
            <div>
              <span className="font-medium">Department:</span> {departments.find(d => d.value === selectedDepartment)?.label}
            </div>
            <div>
              <span className="font-medium">Employee:</span> {employees.find(e => e.value === selectedEmployee)?.label}
            </div>
          </div>
        </div>
      )}

      <DialogFooter>
        <Button
          onClick={handleSubmit}
          disabled={!selectedDepartment || !selectedEmployee || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Assigning..." : "Assign Asset"}
        </Button>
      </DialogFooter>
    </div>
  )
}

// Historical Maintenance Dialog Component (unchanged as it uses passed props)
function HistoricalMaintenanceDialog({ asset, maintenanceRecords }) {
  const assetMaintenanceHistory = maintenanceRecords.filter((record) => record.assetId === asset.id)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-full mt-2 bg-transparent">
          <History className="h-4 w-4 mr-2" />
          Historical Maintenance
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Maintenance History - {asset.name}</DialogTitle>
          <DialogDescription>Complete maintenance history for asset {asset.id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {assetMaintenanceHistory.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No maintenance records found for this asset.</p>
              <p className="text-sm text-gray-400">Maintenance records will appear here once services are performed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Total Records: {assetMaintenanceHistory.length}</h4>
                <Badge variant="outline">
                  Total Cost: ₹
                  {assetMaintenanceHistory.reduce((sum, record) => sum + (record.cost || 0), 0).toLocaleString()}
                </Badge>
              </div>
              {assetMaintenanceHistory
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((record) => (
                  <Card key={record.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Maintenance Details Section */}
                        <div className="space-y-3">
                          <h5 className="font-semibold text-base text-gray-800 mb-3 border-b pb-2">
                            Maintenance Details
                          </h5>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Maintenance ID</Label>
                            <p className="font-mono text-sm bg-gray-50 p-2 rounded">{record.id}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Maintenance Type</Label>
                            <div className="mt-1">
                              <Badge
                                className={
                                  record.maintenanceType === "Repair Needed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                                }
                              >
                                {record.maintenanceType}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Request Type</Label>
                            <div className="mt-1">
                              <Badge variant="outline">
                                {record.requestType === "repair" ? "Repair" : "Maintenance"}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Status</Label>
                            <div className="mt-1">
                              <Badge
                                className={
                                  record.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : record.status === "in_progress"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {record.status === "completed"
                                  ? "Completed"
                                  : record.status === "in_progress"
                                    ? "In Progress"
                                    : "Requested"}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Created Date</Label>
                            <p className="text-sm">{new Date(record.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {/* Service Information Section */}
                        <div className="space-y-3">
                          <h5 className="font-semibold text-base text-gray-800 mb-3 border-b pb-2">
                            Service Information
                          </h5>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Service Provider</Label>
                            <p className="text-sm bg-gray-50 p-2 rounded">
                              {record.serviceProvider || record.amcProvider || "Not specified"}
                            </p>
                          </div>
                          {(record.startDate || record.amcStartDate) && (
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Service Start Date</Label>
                              <p className="text-sm">{record.startDate || record.amcStartDate}</p>
                            </div>
                          )}
                          {(record.endDate || record.amcEndDate) && (
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Service End Date</Label>
                              <p className="text-sm">{record.endDate || record.amcEndDate}</p>
                            </div>
                          )}
                          {record.maintenancePeriod && (
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Maintenance Period</Label>
                              <p className="text-sm">{record.maintenancePeriod}</p>
                            </div>
                          )}
                        </div>
                        {/* Financial & Transaction Details Section */}
                        <div className="space-y-3">
                          <h5 className="font-semibold text-base text-gray-800 mb-3 border-b pb-2">
                            Financial Details
                          </h5>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Maintenance Cost</Label>
                            <p className="text-lg font-bold text-green-600">₹{(record.cost || 0).toLocaleString()}</p>
                          </div>
                          {record.transactionId && (
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Transaction ID</Label>
                              <p className="font-mono text-sm bg-gray-50 p-2 rounded">{record.transactionId}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {record.serviceNotes && (
                        <div className="mt-6 pt-4 border-t">
                          <Label className="text-sm font-medium text-gray-600 mb-2 block">Service Notes</Label>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm leading-relaxed">{record.serviceNotes}</p>
                          </div>
                        </div>
                      )}
                      {record.documents && record.documents.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <Label className="text-sm font-medium text-gray-600 mb-2 block">Documents</Label>
                          <div className="flex flex-wrap gap-2">
                            {record.documents.map((doc, index) => (
                              <Badge key={index} variant="outline" className="cursor-pointer hover:bg-blue-50">
                                📄 {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Entered Assets Tab Component
function EnteredAssetsTab({ handleAssetFromTransaction }) {
  const [enteredAssets, setEnteredAssets] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEnteredAssets = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/asset/purchase-details", {
          headers: {
            Authorization: `Bearer ${employee?.token}`,
          },
        })
        const data = await response.json()
        if (data.success) {
          // Ensure all assets have valid totalAmount and costPerUnit
          const sanitizedAssets = data.data.map(asset => ({
            ...asset,
            totalAmount: Number.isFinite(asset.totalAmount) ? asset.totalAmount : 0,
            costPerUnit: Number.isFinite(asset.costPerUnit) ? asset.costPerUnit : 0,
          }))
          setEnteredAssets(sanitizedAssets)
        } else {
          toast.error("Failed to fetch assets from purchases")
        }
      } catch (error) {
        toast.error("Error fetching assets")
      } finally {
        setIsLoading(false)
      }
    }
    fetchEnteredAssets()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Entered Assets</span>
        </CardTitle>
        <CardDescription>Assets entered from purchase transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : enteredAssets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No assets entered from transactions yet.</p>
            <p className="text-sm text-gray-400">Assets will appear here when created from purchase transactions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enteredAssets.map((asset) => (
              <Card
                key={asset.referenceId}
                className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500"
              >
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg text-blue-700">{asset.assetName}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Linked Reference ID:</span>
                      <span className="font-medium">{asset.referenceId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <Badge variant="outline">{asset.quantity || 'N/A'}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-medium text-xs">{asset.transactionId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">
                        ₹{Number.isFinite(asset.totalAmount) ? asset.totalAmount.toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost per Unit:</span>
                      <span className="font-medium text-green-600">
                        ₹{Number.isFinite(asset.costPerUnit) ? asset.costPerUnit.toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vendor:</span>
                      <span className="font-medium">{asset.vendorId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchase Date:</span>
                      <span className="text-xs">
                        {asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t">
                    <Button size="sm" className="w-full" onClick={() => handleAssetFromTransaction(asset)}>
                      Create Asset Entry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Create Asset Tab Component
function CreateAssetTab({
  assetForm,
  setAssetForm,
  handleAssetSubmit,
  isFromTransaction,
  currentUserId,
  getAssetSubtypes,
}) {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("referenceId", assetForm.linkedReferenceId)
    formData.append("assetType", assetForm.type)
    formData.append("assetSubtype", assetForm.subtype)
    formData.append("description", assetForm.description)
    formData.append("createdBy", currentUserId)
    formData.append("updatedBy", currentUserId)

    if (assetForm.documents) {
      assetForm.documents.forEach((file) => {
        formData.append("attachment", file)
      })
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/asset/create?linkedReferenceId=${assetForm.linkedReferenceId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${employee?.token}`,
        },
        credentials: "include",
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        toast.success(`${data.data.length} assets created successfully`)
        handleAssetSubmit(e)
        setAssetForm({
          name: "",
          type: "",
          subtype: "",
          description: "",
          purchaseFrom: "",
          purchaseCost: "",
          purchaseDate: "",
          duplicates: 1,
          linkedReferenceId: "",
          documents: [],
        })
      } else {
        toast.error(data.message || "Failed to create assets")
      }
    } catch (error) {
      toast.error("Error creating assets")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Asset Entry</span>
        </CardTitle>
        <CardDescription>Add new assets to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="asset-id">Asset ID</Label>
              <Input id="asset-id" value={`AST-${Date.now()}`} disabled className="bg-gray-50" />
              <p className="text-xs text-gray-500 mt-1">Auto-generated unique ID</p>
            </div>

            <div>
              <Label htmlFor="entered-by">Entered By</Label>
              <Input id="entered-by" value={currentUserId} disabled className="bg-gray-50" />
              <p className="text-xs text-gray-500 mt-1">Current user ID</p>
            </div>

            <div>
              <Label htmlFor="linked-reference-id">Linked Reference ID</Label>
              <Input
                id="linked-reference-id"
                value={assetForm.linkedReferenceId || "N/A"}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Reference from transaction</p>
            </div>


            <div>
              <Label htmlFor="asset-name">Asset Name *</Label>
              <Input
                id="asset-name"
                value={assetForm.name}
                onChange={(e) => setAssetForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter asset name"
                required
                disabled={isFromTransaction}
                className={isFromTransaction ? "bg-gray-50" : ""}
              />
              {isFromTransaction && <p className="text-xs text-blue-600 mt-1">Pre-filled from transaction</p>}
            </div>

            <div>
              <Label htmlFor="asset-type">Asset Type *</Label>
              <Select
                value={assetForm.type}
                onValueChange={(value) => setAssetForm((prev) => ({ ...prev, type: value, subtype: "" }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                  <SelectItem value="Office Furniture">Office Furniture</SelectItem>
                  <SelectItem value="Machinery">Machinery</SelectItem>
                  <SelectItem value="Vehicles">Vehicles</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                  <SelectItem value="Electrical Appliances">Electrical Appliances</SelectItem>
                  <SelectItem value="Software Licenses">Software Licenses</SelectItem>
                  <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="asset-subtype">Asset Subtype</Label>
              <Select
                value={assetForm.subtype}
                onValueChange={(value) => setAssetForm((prev) => ({ ...prev, subtype: value }))}
                disabled={!assetForm.type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset subtype" />
                </SelectTrigger>
                <SelectContent>
                  {assetForm.type &&
                    getAssetSubtypes(assetForm.type).map((subtype) => (
                      <SelectItem key={subtype} value={subtype}>
                        {subtype}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="purchase-from">Purchase From (Vendor ID) *</Label>
              <Input
                id="purchase-from"
                value={assetForm.purchaseFrom}
                onChange={(e) => setAssetForm((prev) => ({ ...prev, purchaseFrom: e.target.value }))}
                placeholder="Enter vendor ID"
                required
                disabled={isFromTransaction}
                className={isFromTransaction ? "bg-gray-50" : ""}
              />
              {isFromTransaction && <p className="text-xs text-blue-600 mt-1">Pre-filled from transaction</p>}
            </div>

            <div>
              <Label htmlFor="purchase-cost">Purchase Cost (Per Unit) *</Label>
              <Input
                id="purchase-cost"
                type="number"
                value={assetForm.purchaseCost}
                onChange={(e) => setAssetForm((prev) => ({ ...prev, purchaseCost: e.target.value }))}
                placeholder="Enter purchase cost per unit"
                required
                disabled={isFromTransaction}
                className={isFromTransaction ? "bg-gray-50" : ""}
              />
              {isFromTransaction && (
                <p className="text-xs text-blue-600 mt-1">Calculated from total amount ÷ quantity</p>
              )}
            </div>

            <div>
              <Label htmlFor="purchase-date">Purchase Date *</Label>
              <Input
                id="purchase-date"
                type="date"
                value={assetForm.purchaseDate}
                onChange={(e) => setAssetForm((prev) => ({ ...prev, purchaseDate: e.target.value }))}
                required
                disabled={isFromTransaction}
                className={isFromTransaction ? "bg-gray-50" : ""}
              />
              {isFromTransaction && <p className="text-xs text-blue-600 mt-1">Pre-filled from transaction</p>}
            </div>

            <div>
              <Label htmlFor="duplicates">Number of Assets</Label>
              <Input
                id="duplicates"
                type="number"
                min="1"
                max="100"
                value={assetForm.duplicates}
                onChange={(e) =>
                  setAssetForm((prev) => ({ ...prev, duplicates: Number.parseInt(e.target.value) || 1 }))
                }
                placeholder="Number of identical assets"
                disabled={isFromTransaction}
                className={isFromTransaction ? "bg-gray-50" : ""}
              />
              <p className="text-xs text-gray-500 mt-1">
                {isFromTransaction
                  ? "Quantity from transaction - cannot be modified"
                  : "Create multiple identical assets with unique IDs"}
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={assetForm.description}
              onChange={(e) => setAssetForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter asset description (optional)"
              rows={3}
            />
          </div>

          <div>
            <Label>Documents Upload</Label>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => {
                setAssetForm((prev) => ({
                  ...prev,
                  documents: e.target.files ? Array.from(e.target.files) : [],
                }))
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {assetForm.documents && assetForm.documents.length > 0 && (
              <ul className="mt-2 text-xs text-gray-600">
                {assetForm.documents.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}
            <p className="text-xs text-gray-400 mt-1">PDF, DOC, JPG, PNG up to 10MB each</p>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Add Asset{assetForm.duplicates > 1 ? `s (${assetForm.duplicates})` : ""}
            </Button>
            {isFromTransaction ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAssetForm({
                    name: "",
                    type: "",
                    subtype: "",
                    description: "",
                    purchaseFrom: "",
                    purchaseCost: "",
                    purchaseDate: "",
                    duplicates: 1,
                    linkedReferenceId: "",
                    documents: [],
                  })
                }}
                className="flex items-center space-x-2"
              >
                <span>Clear Form</span>
              </Button>
            ) : (
              <Button type="button" variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Copy className="h-4 w-4" />
                <span>Duplicate</span>
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Asset List Tab Component
function AssetListTab({
  assetSearch,
  setAssetSearch,
  assetTypeFilter,
  setAssetTypeFilter,
  assetAssignmentFilter,
  setAssetAssignmentFilter,
  getStatusBadge,
  getAssignmentStatusBadge,
}) {
  const [assets, setAssets] = useState([]);
  const [editingAsset, setEditingAsset] = useState(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const employee = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("loggedInEmployee")) : null;
  const LOGGED_IN_EMPLOYEE_ID = employee?.employeeId || null;

  // Fetch assets on component mount and when filters change
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (assetSearch) queryParams.append('assetName', assetSearch);
        if (assetTypeFilter !== 'all') queryParams.append('assetType', assetTypeFilter);
        if (assetAssignmentFilter !== 'all') {
          queryParams.append('assignmentStatus', assetAssignmentFilter === 'assigned' ? 'Assigned' : 'Unassigned');
        }
        queryParams.append('status', 'active');

        const response = await fetch(`http://localhost:8000/api/v1/asset/list`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch assets');
        const result = await response.json();
        setAssets(result.data || []);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAssets();
  }, [assetSearch, assetTypeFilter, assetAssignmentFilter]);

  const handleAssetEdit = async (asset) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/asset/${asset.assetId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch asset details');
      const result = await response.json();
      setEditingAsset({
        id: result.data.assetId,
        name: result.data.assetName,
        type: result.data.assetType,
        purchaseCost: result.data.unitCost || 0, // Provide default value
        status: result.data.status,
        assignedTo: result.data.assignedToEmployee,
        assignedDepartment: result.data.assignedToDepartment,
      });
    } catch (error) {
      console.error('Error fetching asset for edit:', error);
    }
  };

  const handleAssetDelete = async (assetId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/asset/delete/${assetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to delete asset');
      setAssets(assets.filter((asset) => asset.assetId !== assetId));
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

const handleAssetAssignment = async (assetId, employeeId, departmentId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/asset/update-assignment/${assetId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`,
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({
        employeeId, // ✅ FIXED
        departmentId, // ✅ FIXED
        assignmentStatus: employeeId ? 'Assigned' : 'Unassigned',
        updatedBy: LOGGED_IN_EMPLOYEE_ID,
        assignedBy: LOGGED_IN_EMPLOYEE_ID,
      }),
    });

    if (!response.ok) throw new Error('Failed to update assignment');
    const result = await response.json();
    setAssets(assets.map((asset) =>
      asset.assetId === assetId
        ? {
            ...asset,
            assignedToEmployee: result.data.assignedToEmployee,
            assignedDepartment: result.data.assignedDepartment,
            assignmentStatus: result.data.assignmentStatus,
          }
        : asset
    ));
  } catch (error) {
    console.error('Error updating assignment:', error);
  }
};


  const handleAssetUpdate = async (updatedAsset) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/asset/update-assignment/${updatedAsset.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employeeId: updatedAsset.assignedTo, // ✅ FIXED
        departmentId: updatedAsset.assignedDepartment, // ✅ FIXED
        assignmentStatus: updatedAsset.assignedTo ? 'Assigned' : 'Unassigned',
        updatedBy: LOGGED_IN_EMPLOYEE_ID,
        assignedBy: LOGGED_IN_EMPLOYEE_ID,
      }),
    });

    if (!response.ok) throw new Error('Failed to update asset');

    const result = await response.json();
    setAssets(assets.map((asset) =>
      asset.assetId === updatedAsset.id
        ? {
            ...asset,
            assignedToEmployee: result.data.assignedToEmployee,
            assignedDepartment: result.data.assignedDepartment,
            assignmentStatus: result.data.assignmentStatus,
          }
        : asset
    ));
    setEditingAsset(null);
  } catch (error) {
    console.error('Error updating asset:', error);
  }
};
; 

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Asset List</span>
        </CardTitle>
        <CardDescription>View and manage all registered assets</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by asset name or ID..."
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="IT Equipment">IT Equipment</SelectItem>
              <SelectItem value="Office Furniture">Office Furniture</SelectItem>
              <SelectItem value="Machinery">Machinery</SelectItem>
              <SelectItem value="Vehicles">Vehicles</SelectItem>
              <SelectItem value="Real Estate">Real Estate</SelectItem>
              <SelectItem value="Electrical Appliances">Electrical Appliances</SelectItem>
              <SelectItem value="Software Licenses">Software Licenses</SelectItem>
              <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
            </SelectContent>
          </Select>
          <Select value={assetAssignmentFilter} onValueChange={setAssetAssignmentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assets</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <Card key={asset.assetId} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{asset.assetName}</CardTitle>
                    <p className="text-sm text-gray-500">{asset.assetId}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => handleAssetEdit(asset)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Asset</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this asset? This will also remove all related maintenance,
                            depreciation, and disposal records.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleAssetDelete(asset.assetId)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Type:</span>
                  <Badge variant="outline">{asset.assetType}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  {getStatusBadge(asset.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Assignment:</span>
                  {getAssignmentStatusBadge(asset)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Purchase Cost:</span>
                  {/* FIXED: Check if unitCost exists before calling toLocaleString */}
                  <span className="font-semibold">
                    ₹{asset.purchaseCost != null ? asset.purchaseCost.toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Updated By:</span>
                  <span className="text-sm font-mono">{asset.updatedBy}</span>
                </div>
                {asset.assignedToEmployee && (
                  <div className="text-sm">
                    <p>
                      <span className="text-gray-600">Assigned to:</span> {asset.assignedToEmployee}
                    </p>
                    <p>
                      <span className="text-gray-600">Department:</span> {asset.assignedToDepartment}
                    </p>
                  </div>
                )}

                {/* Assignment Button */}
                {!asset.assignedToEmployee && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="w-full mt-2">
                        Assign Asset
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign Asset</DialogTitle>
                        <DialogDescription>
                          Assign {asset.assetName} ({asset.assetId}) to an employee
                        </DialogDescription>
                      </DialogHeader>
                      <AssignmentForm assetId={asset.assetId} assetName={asset.assetName} onAssign={handleAssetAssignment} />
                    </DialogContent>
                  </Dialog>
                )}

                {/* Historical Maintenance Button */}
                <HistoricalMaintenanceDialog asset={asset} maintenanceRecords={maintenanceRecords} />
              </CardContent>
            </Card>
          ))}
        </div>

        {assets.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No assets found matching your criteria.</p>
          </div>
        )}
      </CardContent>

      {editingAsset && (
        <Dialog open={!!editingAsset} onOpenChange={() => setEditingAsset(null)}>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Asset</DialogTitle>
              <DialogDescription>Update asset information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Asset ID</Label>
                <Input value={editingAsset.id} disabled className="bg-gray-50" />
              </div>
              <div>
                <Label>Asset Name</Label>
                <Input value={editingAsset.name} disabled className="bg-gray-50" />
              </div>
              <div>
                <Label>Asset Type</Label>
                <Input value={editingAsset.type} disabled className="bg-gray-50" />
              </div>
              <div>
                <Label>Purchase Cost</Label>
                {/* FIXED: Check if purchaseCost exists before calling toLocaleString */}
                <Input 
                  value={`₹${editingAsset.purchaseCost != null ? editingAsset.purchaseCost.toLocaleString() : 'N/A'}`} 
                  disabled 
                  className="bg-gray-50" 
                />
              </div>
              <div>
                <Label>Status</Label>
                <Input
                  value={editingAsset.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label>Assignment Status</Label>
                <div className="flex items-center space-x-2 mt-2">
                  {editingAsset.assignedTo ? (
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Assigned to:</span> {editingAsset.assignedTo}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Department:</span> {editingAsset.assignedDepartment}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 bg-transparent"
                        onClick={() =>
                          setEditingAsset((prev) =>
                            prev ? { ...prev, assignedTo: undefined, assignedDepartment: undefined } : null,
                          )
                        }
                      >
                        Unassign
                      </Button>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Not assigned</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="mt-2">
                            Assign Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Asset</DialogTitle>
                            <DialogDescription>
                              Assign {editingAsset.name} ({editingAsset.id}) to an employee
                            </DialogDescription>
                          </DialogHeader>
                          <AssignmentForm
                            assetId={editingAsset.id}
                            assetName={editingAsset.name}
                            onAssign={(assetId, assignedTo, department) => {
                              setEditingAsset((prev) =>
                                prev ? { ...prev, assignedTo, assignedDepartment: department, status: "active" } : null,
                              )
                              handleAssetAssignment(assetId, assignedTo, department)
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingAsset(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (editingAsset) {
                    handleAssetUpdate(editingAsset)
                  }
                }
                }>
                Update Asset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

// Maintenance List Tab Component
function MaintenanceListTab({
  getStatusBadge,
}) {
  const [assets, setAssets] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [assetSearch, setAssetSearch] = useState('');
  const [maintenanceTypeFilter, setMaintenanceTypeFilter] = useState('all');
  const [maintenanceStatusFilter, setMaintenanceStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch assets and maintenance records
  useEffect(() => {
    const fetchMaintenanceData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/v1/asset/maintenance/search', {
          headers: {
            'Authorization': `Bearer ${employee?.token}`,
            'Content-Type': 'application/json',
          },
        });
        
        const result = await response.json();
        if (result.statusCode === 200) {
          setAssets(result.data);
          
          // Fetch maintenance card details for each asset
          const maintenanceDetails = await Promise.all(
            result.data.map(async (asset) => {
              try {
                const cardResponse = await fetch(
                  ` http://localhost:8000/api/v1/asset/maintenance/card-details?assetId=${assets.assetId}&maintenanceId=${assets.maintenanceId}`,
                  {
                    headers: {
                      'Authorization': `Bearer ${employee?.token}`,
                      'Content-Type': 'application/json',
                    },
                  }
                );
                const cardResult = await cardResponse.json();
                return cardResult.statusCode === 200 ? cardResult.data : null;
              } catch (error) {
                console.error(`Error fetching maintenance details for asset ${asset.asset_Id}:`, error);
                return null;
              }
            })
          );
          
          setMaintenanceRecords(maintenanceDetails.filter(Boolean));
        }
      } catch (error) {
        console.error('Error fetching maintenance data:', error);
        toast.error('Failed to load maintenance data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaintenanceData();
  }, []);

  const filteredMaintenanceAssets = assets.filter((asset) => {
    if (!["maintenance_needed", "repair_needed", "under_maintenance", "under_repair"].includes(asset.status))
      return false;

    const matchesSearch =
      asset.asset_Name.toLowerCase().includes(assetSearch.toLowerCase()) ||
      asset.asset_Id.toLowerCase().includes(assetSearch.toLowerCase());

    const matchesType = maintenanceTypeFilter === "all" || asset.assetType === maintenanceTypeFilter;

    const matchesStatus = maintenanceStatusFilter === "all" || asset.status === maintenanceStatusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleUpdateServiceDates = async (maintenanceId, assetId, startDate, endDate) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/asset/sync-maintenance', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${employee?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assetId,
          serviceStartDate: startDate,
          serviceEndDate: endDate,
          updatedBy: LOGGED_IN_EMPLOYEE_ID,
        }),
      });

      const result = await response.json();
      if (result.statusCode === 200) {
        setMaintenanceRecords((records) =>
          records.map((r) =>
            r.maintenanceId === maintenanceId
              ? { ...r, serviceStartDate: startDate, serviceEndDate: endDate, updatedBy: LOGGED_IN_EMPLOYEE_ID }
              : r
          )
        );
        toast.success('Service dates updated successfully!');
      } else {
        throw new Error(result.message || 'Failed to update service dates');
      }
    } catch (error) {
      console.error('Error updating service dates:', error);
      toast.error('Failed to update service dates');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Maintenance List</span>
        </CardTitle>
        <CardDescription>Assets currently under maintenance or repair</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by asset name or ID..."
                    value={assetSearch}
                    onChange={(e) => setAssetSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={maintenanceTypeFilter} onValueChange={setMaintenanceTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                  <SelectItem value="Office Furniture">Office Furniture</SelectItem>
                  <SelectItem value="Machinery">Machinery</SelectItem>
                  <SelectItem value="Vehicles">Vehicles</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                  <SelectItem value="Electrical Appliances">Electrical Appliances</SelectItem>
                  <SelectItem value="Software Licenses">Software Licenses</SelectItem>
                  <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                </SelectContent>
              </Select>
              <Select value={maintenanceStatusFilter} onValueChange={setMaintenanceStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="maintenance_needed">Maintenance Needed</SelectItem>
                  <SelectItem value="repair_needed">Repair Needed</SelectItem>
                  <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                  <SelectItem value="under_repair">Under Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMaintenanceAssets.filter(Boolean).map((asset) => {
                if (!asset || !asset.asset_Id) return null;
                const maintenanceRecord = maintenanceRecords.find((r) => r.assetId === asset.asset_Id);
                if (!maintenanceRecord) return null;
                return (
                  <Card
                    key={asset.asset_Id}
                    className={`hover:shadow-md transition-shadow border-l-4 ${
                      asset.status === "under_maintenance"
                        ? "border-l-blue-500"
                        : asset.status === "under_repair"
                          ? "border-l-red-500"
                          : asset.status === "repair_needed"
                            ? "border-l-red-500"
                            : "border-l-yellow-500"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{asset.asset_Name}</CardTitle>
                          <p className="text-sm text-gray-500">{asset.asset_Id}</p>
                        </div>
                        {getStatusBadge(asset.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Request Type:</span>
                        <Badge
                          className={
                            maintenanceRecord.requestType === "Repair"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }
                        >
                          {maintenanceRecord.requestType}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Request Status:</span>
                        <Badge
                          className={
                            maintenanceRecord.requestStatus === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : maintenanceRecord.requestStatus === "Requested"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {maintenanceRecord.requestStatus}
                        </Badge>
                      </div>

                      {maintenanceRecord.serviceProvider && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Service Provider:</span>
                          <span className="text-sm">{maintenanceRecord.serviceProvider}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Updated By:</span>
                        <span className="text-sm font-mono">{maintenanceRecord.updatedBy}</span>
                      </div>

                      <div className="flex justify-end mt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-xs h-7 px-2 bg-transparent">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Maintenance Dates</DialogTitle>
                              <DialogDescription>Update service start and end dates for {asset.asset_Name}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Service Start Date</Label>
                                <Input
                                  type="date"
                                  value={maintenanceRecord.serviceStartDate || ""}
                                  onChange={(e) => {
                                    handleUpdateServiceDates(
                                      maintenanceRecord.maintenanceId,
                                      asset.asset_Id,
                                      e.target.value,
                                      maintenanceRecord.serviceEndDate
                                    );
                                  }}
                                />
                              </div>
                              <div>
                                <Label>Service End Date</Label>
                                <Input
                                  type="date"
                                  value={maintenanceRecord.serviceEndDate || ""}
                                  onChange={(e) => {
                                    handleUpdateServiceDates(
                                      maintenanceRecord.maintenanceId,
                                      asset.asset_Id,
                                      maintenanceRecord.serviceStartDate,
                                      e.target.value
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                onClick={() => {
                                  toast.success("Service dates updated successfully!");
                                }}
                              >
                                Save Changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {maintenanceRecord.serviceStartDate && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Start Date:</span>
                          <span className="text-sm">{new Date(maintenanceRecord.serviceStartDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {maintenanceRecord.serviceEndDate && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">End Date:</span>
                          <span className="text-sm">{new Date(maintenanceRecord.serviceEndDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {maintenanceRecord.serviceNote && (
                        <div className="mt-3">
                          <span className="text-sm font-medium text-gray-600">Service Notes:</span>
                          <p className="text-sm bg-gray-50 p-2 rounded mt-1">{maintenanceRecord.serviceNote}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredMaintenanceAssets.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No assets found matching your criteria.</p>
                <p className="text-sm text-gray-400">Assets will appear here when maintenance requests are submitted.</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function AssetMaintenanceTab() {
  const [assets, setAssets] = useState([]);
  const [maintenanceForm, setMaintenanceForm] = useState({
    assetType: '',
    assetId: '',
    maintenanceType: '',
    maintenancePeriod: '',
    serviceProvider: '',
    startDate: '',
    endDate: '',
    serviceNotes: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch assets
  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/v1/asset/list', {
          headers: {
            'Authorization': `Bearer ${employee?.token}`,
            'Content-Type': 'application/json',
          },
          credentials: "include",
        });
        const result = await response.json();
        if (result.statusCode === 200) {
          setAssets(result.data);
        }
      } catch (error) {
        console.error('Error fetching assets:', error);
        toast.error('Failed to load assets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const handleMaintenanceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/v1/asset/sync-maintenance', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${employee?.token}`,
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          assetId: maintenanceForm.assetId,
          maintenanceType: maintenanceForm.maintenanceType,
          maintenancePeriod: maintenanceForm.maintenancePeriod,
          serviceStartDate: maintenanceForm.startDate,
          serviceEndDate: maintenanceForm.endDate,
          serviceProvider: maintenanceForm.serviceProvider,
          serviceNote: maintenanceForm.serviceNotes,
          createdBy: LOGGED_IN_EMPLOYEE_ID,
          updatedBy: LOGGED_IN_EMPLOYEE_ID,
        }),
      });

      const result = await response.json();
      if (result.statusCode === 200) {
        toast.success('Maintenance request submitted successfully!');
        setMaintenanceForm({
          assetType: '',
          assetId: '',
          maintenanceType: '',
          maintenancePeriod: '',
          serviceProvider: '',
          startDate: '',
          endDate: '',
          serviceNotes: '',
        });
      } else {
        throw new Error(result.message || 'Failed to submit maintenance request');
      }
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      toast.error('Failed to submit maintenance request');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Edit className="h-5 w-5" />
          <span>Asset Maintenance</span>
        </CardTitle>
        <CardDescription>Record and track asset maintenance activities</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <form onSubmit={handleMaintenanceSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maintenance-id">Maintenance ID</Label>
                <Input id="maintenance-id" value={`MNT-${Date.now()}`} disabled className="bg-gray-50" />
              </div>

              <div>
                <Label htmlFor="created-by">Created By</Label>
                <Input id="created-by" value={LOGGED_IN_EMPLOYEE_ID} disabled className="bg-gray-50" />
                <p className="text-xs text-gray-500 mt-1">Current user ID</p>
              </div>

              <div>
                <Label htmlFor="maintenance-asset-type">Asset Type *</Label>
                <Select
                  value={maintenanceForm.assetType}
                  onValueChange={(value) => {
                    setMaintenanceForm((prev) => ({ ...prev, assetType: value, assetId: '' }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                    <SelectItem value="Office Furniture">Office Furniture</SelectItem>
                    <SelectItem value="Machinery">Machinery</SelectItem>
                    <SelectItem value="Vehicles">Vehicles</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Electrical Appliances">Electrical Appliances</SelectItem>
                    <SelectItem value="Software Licenses">Software Licenses</SelectItem>
                    <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="maintenance-asset-id">Asset ID *</Label>
                <Select
                  value={maintenanceForm.assetId}
                  onValueChange={(value) => setMaintenanceForm((prev) => ({ ...prev, assetId: value }))}
                  disabled={!maintenanceForm.assetType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets
                      .filter((asset) => asset.assetType === maintenanceForm.assetType)
                      .map((asset) => (
                        <SelectItem key={asset.assetId} value={asset.assetId}>
                          {asset.assetId} - {asset.assetName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="maintenance-type">Maintenance Type *</Label>
                <Select
                  value={maintenanceForm.maintenanceType}
                  onValueChange={(value) => setMaintenanceForm((prev) => ({ ...prev, maintenanceType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select maintenance type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maintenance Needed">Maintenance Needed</SelectItem>
                    <SelectItem value="Repair Needed">Repair Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="maintenance-period">Maintenance Period</Label>
                <Select
                  value={maintenanceForm.maintenancePeriod}
                  onValueChange={(value) => setMaintenanceForm((prev) => ({ ...prev, maintenancePeriod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15 Days">15 Days</SelectItem>
                    <SelectItem value="30 Days">30 Days</SelectItem>
                    <SelectItem value="45 Days">45 Days</SelectItem>
                    <SelectItem value="60 Days">60 Days</SelectItem>
                    <SelectItem value="90 Days">90 Days</SelectItem>
                    <SelectItem value="180 Days">180 Days</SelectItem>
                    <SelectItem value="365 Days">365 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="service-provider">Service Provider Name</Label>
                <Input
                  id="service-provider"
                  value={maintenanceForm.serviceProvider}
                  onChange={(e) => setMaintenanceForm((prev) => ({ ...prev, serviceProvider: e.target.value }))}
                  placeholder="Enter service provider name"
                />
              </div>

              <div>
                <Label htmlFor="start-date">Service Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={maintenanceForm.startDate}
                  onChange={(e) => setMaintenanceForm((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="end-date">Service End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={maintenanceForm.endDate}
                  onChange={(e) => setMaintenanceForm((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="service-notes">Service Notes</Label>
              <Textarea
                id="service-notes"
                value={maintenanceForm.serviceNotes}
                onChange={(e) => setMaintenanceForm((prev) => ({ ...prev, serviceNotes: e.target.value }))}
                placeholder="Enter service notes and details"
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Submit Maintenance Request
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

// Asset Disposal Tab Component
const assetService = {
  // Fetch all assets eligible for disposal
  async fetchAssets(assetType, assetSubtype) {
    if (!assetType || !assetSubtype) {
      console.error("Both assetType and assetSubtype are required");
      return;
    }

//    const query = new URLSearchParams({
//      assetType,
 //     assetSubtype,
 //    }).toString();
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/asset/eligible-for-disposal?assetType=${assetType}&assetSubtype=${assetSubtype}(
          assetType
        )}&assetSubtype=${encodeURIComponent(assetSubtype)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // ✅ FIX: Use the correct employee.token variable
            Authorization: `Bearer ${employee?.token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        // More descriptive error for debugging
        const errorData = await response.json().catch(() => ({ message: "Failed to fetch assets" }));
        throw new Error(errorData.message || "Failed to fetch assets");
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast.error(error.message); // Show error to the user
      throw error;
    }
  },

  // Submit disposal request
  async submitDisposalRequest(disposalData) {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/asset/asset-for-disposal`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // ✅ FIX: Use the correct employee.token variable
          Authorization: `Bearer ${employee?.token}`,
        },
        body: JSON.stringify({
          assetId: disposalData.assetId,
          disposalReason: disposalData.reason,
          createdBy: LOGGED_IN_EMPLOYEE_ID,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit disposal request");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error submitting disposal request:", error);
      throw error;
    }
  },

  // Fetch disposed assets details
  async fetchDisposedAssets() {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/asset/update-disposal`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
           // ✅ FIX: Use the correct employee.token variable
          Authorization: `Bearer ${employee?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch disposed assets");
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching disposed assets:", error);
      throw error;
    }
  },
};

function AssetDisposalTab({
  assets,
  disposalForm,
  setDisposalForm,
  handleDisposalSubmit,
  currentUserId,
  getAssetSubtypes,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Recycle className="h-5 w-5" />
          <span>Asset Disposal</span>
        </CardTitle>
        <CardDescription>Submit asset disposal requests</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleDisposalSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="disposal-id">Disposal Request ID</Label>
              <Input id="disposal-id" value={`DIS-${Date.now()}`} disabled className="bg-gray-50" />
            </div>

            <div>
              <Label htmlFor="disposal-created-by">Created By</Label>
              <Input id="disposal-created-by" value={currentUserId} disabled className="bg-gray-50" />
              <p className="text-xs text-gray-500 mt-1">Current user ID</p>
            </div>

            <div>
              <Label htmlFor="disposal-asset-type">Asset Type *</Label>
              <Select
                value={disposalForm.assetType}
                onValueChange={(value) => {
                  console.log("✅ assetType changed to", value); // ADD THIS
                  setDisposalForm((prev) => ({
                    ...prev,
                    assetType: value,
                    assetSubtype: "",
                    assetId: "",
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                  <SelectItem value="Office Furniture">Office Furniture</SelectItem>
                  <SelectItem value="Machinery">Machinery</SelectItem>
                  <SelectItem value="Vehicles">Vehicles</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                  <SelectItem value="Electrical Appliances">Electrical Appliances</SelectItem>
                  <SelectItem value="Software Licenses">Software Licenses</SelectItem>
                  <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="disposal-asset-subtype">Asset Subtype</Label>
              <Select
                value={disposalForm.assetSubtype}
                onValueChange={(value) => {
                  console.log("✅ assetSubtype changed to", value); // ADD THIS
                  setDisposalForm((prev) => ({
                    ...prev,
                    assetSubtype: value,
                    assetId: "",
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset subtype" />
                </SelectTrigger>
                <SelectContent>
                  {disposalForm.assetType &&
                    getAssetSubtypes(disposalForm.assetType).map((subtype) => (
                      <SelectItem key={subtype} value={subtype}>
                        {subtype}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="disposal-asset-id">Asset ID *</Label>
              <Select
                value={disposalForm.assetId}
                onValueChange={(value) => setDisposalForm((prev) => ({ ...prev, assetId: value }))}
                disabled={!disposalForm.assetType || !disposalForm.assetSubtype}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.value} value={asset.value}>
                      {asset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="disposal-reason">Reason for Disposal *</Label>
            <Textarea
              id="disposal-reason"
              value={disposalForm.reason}
              onChange={(e) => setDisposalForm((prev) => ({ ...prev, reason: e.target.value }))}
              placeholder="Enter reason for asset disposal"
              rows={3}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            <Recycle className="h-4 w-4 mr-2" />
            Submit Disposal Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function DisposalListTab({
  disposedAssets,
  disposalSearch,
  setDisposalSearch,
  disposalStatusFilter,
  setDisposalStatusFilter,
  disposalTypeFilter,
  setDisposalTypeFilter,
  getStatusBadge,
}) {
  const filteredDisposalAssets = disposedAssets.filter((asset) => {
    const matchesSearch =
      asset.assetName.toLowerCase().includes(disposalSearch.toLowerCase()) ||
      asset.assetId.toLowerCase().includes(disposalSearch.toLowerCase());

    const matchesStatus = disposalStatusFilter === "all" ||
      (disposalStatusFilter === "awaiting_disposal" && asset.status === "Awaiting Disposal") ||
      (disposalStatusFilter === "disposed" && asset.status === "Disposed");

    const matchesType = disposalTypeFilter === "all" || asset.assetType === disposalTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Disposal List</span>
        </CardTitle>
        <CardDescription>Assets awaiting disposal or already disposed</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by asset name or ID..."
                value={disposalSearch}
                onChange={(e) => setDisposalSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={disposalStatusFilter} onValueChange={setDisposalStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="awaiting_disposal">Awaiting Disposal</SelectItem>
              <SelectItem value="disposed">Disposed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={disposalTypeFilter} onValueChange={setDisposalTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="IT Equipment">IT Equipment</SelectItem>
              <SelectItem value="Office Furniture">Office Furniture</SelectItem>
              <SelectItem value="Machinery">Machinery</SelectItem>
              <SelectItem value="Vehicles">Vehicles</SelectItem>
              <SelectItem value="Real Estate">Real Estate</SelectItem>
              <SelectItem value="Electrical Appliances">Electrical Appliances</SelectItem>
              <SelectItem value="Software Licenses">Software Licenses</SelectItem>
              <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDisposalAssets.map((asset) => (
            <Card
              key={asset.assetId}
              className={`hover:shadow-md transition-shadow border-l-4 ${
                asset.status === "Disposed" ? "border-l-red-500" : "border-l-orange-500"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{asset.assetName}</CardTitle>
                    <p className="text-sm text-gray-500">{asset.assetId}</p>
                  </div>
                  {getStatusBadge(asset.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Type:</span>
                  <Badge variant="outline">{asset.assetType}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Purchase Cost:</span>
                  <span className="font-semibold">₹{asset.purchaseCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Created By:</span>
                  <span className="text-sm font-mono">{asset.createdBy}</span>
                </div>
                <div className="mt-3">
                  <span className="text-sm font-medium text-gray-600">Disposal Reason:</span>
                  <p className="text-sm bg-gray-50 p-2 rounded mt-1">{asset.disposalReason}</p>
                </div>
                {asset.status === "Disposed" && asset.saleAmount && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sale Amount:</span>
                    <span className="font-semibold text-green-600">
                      ₹{asset.saleAmount.toLocaleString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDisposalAssets.length === 0 && (
          <div className="text-center py-8">
            <Recycle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No assets found matching your criteria.</p>
            <p className="text-sm text-gray-400">Assets will appear here when disposal requests are submitted.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AssetDisposalManager() {
  const [assets, setAssets] = useState([]);
  const [disposedAssets, setDisposedAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [disposalForm, setDisposalForm] = useState({
    assetType: "",
    assetSubtype: "",
    assetId: "",
    reason: "",
  });

  const [disposalSearch, setDisposalSearch] = useState("");
  const [disposalStatusFilter, setDisposalStatusFilter] = useState("all");
  const [disposalTypeFilter, setDisposalTypeFilter] = useState("all");

  // Load eligible assets when assetType and assetSubtype are selected
  useEffect(() => {
    // 1. Move the data-loading logic *inside* the useEffect hook.
    // This ensures it always has access to the latest state and avoids dependency issues.
    const loadAssets = async () => {
      console.log("🔄 Triggering asset fetch for:", disposalForm.assetType, disposalForm.assetSubtype);
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const assetsData = await assetService.fetchAssets(disposalForm.assetType, disposalForm.assetSubtype);
        console.log("✅ Raw assets from API:", assetsData);

        const dropdownAssets = assetsData.map((asset) => ({
          value: asset.assetId,
          label: `${asset.assetId} - ${asset.assetName}`,
        }));

        console.log("📦 Transformed dropdown assets:", dropdownAssets);
        setAssets(dropdownAssets);
      } catch (err) {
        console.error("❌ Failed to load assets:", err);
        setError("Failed to load assets");
        setAssets([]); // Clear assets on error
      } finally {
        setLoading(false);
      }
    };

    // 2. Check if both values are present before fetching.
    if (disposalForm.assetType && disposalForm.assetSubtype) {
      loadAssets();
    } else {
      // 3. Clear the assets list if the conditions are not met.
      // This prevents showing stale data (e.g., old asset IDs after changing the asset type).
      setAssets([]);
    }
  }, [disposalForm.assetType, disposalForm.assetSubtype]);

  const loadDisposedAssets = async () => {
    try {
      const disposedData = await assetService.fetchDisposedAssets();
      console.log("📁 Disposed assets:", disposedData);
      setDisposedAssets(disposedData);
    } catch (err) {
      console.error("❌ Failed to load disposed assets:", err);
      setError("Failed to load disposed assets");
    }
  };

  const handleDisposalSubmit = async (e) => {
    e.preventDefault();

    if (!disposalForm.assetId || !disposalForm.reason) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await assetService.submitDisposalRequest(disposalForm);

      alert("✅ Disposal request submitted successfully!");

      // Reset the form AFTER the submission is successful
      setDisposalForm({
        assetType: "",
        assetSubtype: "",
        assetId: "",
        reason: "",
      });

      // Refresh the list of disposed assets
      await loadDisposedAssets();

    } catch (err) {
      console.error("❌ Failed to submit disposal request:", err);
      setError("Failed to submit disposal request");
    } finally {
      setLoading(false);
    }
  };

  const getAssetSubtypes = (type) => {
    const subtypes = {
      "IT Equipment": ["Laptop", "Desktop", "Server", "Network Equipment"],
      "Office Furniture": ["Desk", "Chair", "Cabinet", "Table"],
      "Machinery": ["Manufacturing Equipment", "Tools", "Heavy Machinery"],
      "Vehicles": ["Car", "Truck", "Motorcycle", "Commercial Vehicle"],
      "Real Estate": ["Office Space", "Warehouse", "Land"],
      "Electrical Appliances": ["Air Conditioner", "Refrigerator", "Printer"],
      "Software Licenses": ["Operating System", "Application Software", "Antivirus"],
      "Miscellaneous": ["Other Equipment", "Supplies"],
    };
    return subtypes[type] || [];
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: { variant: "default", text: "Active" },
      "Awaiting Disposal": { variant: "secondary", text: "Awaiting Disposal" },
      Disposed: { variant: "destructive", text: "Disposed" },
    };

    const config = statusConfig[status] || { variant: "default", text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Debug UI */}
      <div className="bg-yellow-50 p-2 rounded text-xs text-gray-700 border border-yellow-300">
        <p>Debug: assetType = <strong>{disposalForm.assetType}</strong></p>
        <p>Debug: assetSubtype = <strong>{disposalForm.assetSubtype}</strong></p>
        <p>Debug: assetId = <strong>{disposalForm.assetId}</strong></p>
      </div>

      <AssetDisposalTab
        assets={assets}
        disposalForm={disposalForm}
        setDisposalForm={setDisposalForm}
        handleDisposalSubmit={handleDisposalSubmit}
        currentUserId={LOGGED_IN_EMPLOYEE_ID}
        getAssetSubtypes={getAssetSubtypes}
      />

      <DisposalListTab
        disposedAssets={disposedAssets}
        disposalSearch={disposalSearch}
        setDisposalSearch={setDisposalSearch}
        disposalStatusFilter={disposalStatusFilter}
        setDisposalStatusFilter={setDisposalStatusFilter}
        disposalTypeFilter={disposalTypeFilter}
        setDisposalTypeFilter={setDisposalTypeFilter}
        getStatusBadge={getStatusBadge}
      />
    </div>
  );
}

// Asset Depreciation Tab Component
function AssetDepreciationTab({
  depreciationForm,
  setDepreciationForm,
  handleDepreciationSubmit,
  currentUserId,
  calculateDepreciation,
}) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const employee = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("loggedInEmployee")) : null;
  const LOGGED_IN_EMPLOYEE_ID = employee?.employeeId || null;

  // Fetch assets based on selected asset type
  useEffect(() => {
    if (depreciationForm.assetType) {
      const fetchAssets = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:8000/api/v1/asset/depreciation/dropdown/asset?assetType=${depreciationForm.assetType}`, {
            headers: {
              Authorization: `Bearer ${employee?.token}`,
            },
          });
          const result = await response.json();
          if (result.statusCode === 200) {
            setAssets(result.data);
          } else {
            setError(result.message || 'Failed to fetch assets');
          }
        } catch (err) {
          setError('Error fetching assets');
        } finally {
          setLoading(false);
        }
      };
      fetchAssets();
    } else {
      setAssets([]);
    }
  }, [depreciationForm.assetType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        assetId: depreciationForm.assetId,
        depreciationMethod: depreciationForm.depreciationType,
        depreciationRate: depreciationForm.depreciationRate,
        usefulLifeYears: depreciationForm.usefulLife,
        totalUnitsProduced: depreciationForm.totalExpectedUnits,
        unitsUsedThisYear: depreciationForm.actualUnitsUsed,
        depreciationStartDate: depreciationForm.depreciationStartDate,
        notes: depreciationForm.notes,
        createdBy: LOGGED_IN_EMPLOYEE_ID,
      };

      const response = await fetch('http://localhost:8000/api/v1/asset/depreciation/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${employee?.token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.status === 201) {
        handleDepreciationSubmit(result.data);
        setDepreciationForm({
          assetType: '',
          assetId: '',
          depreciationType: '',
          depreciationStartDate: '',
          salvageValue: '',
          usefulLife: '',
          depreciationRate: '',
          totalExpectedUnits: '',
          actualUnitsUsed: '',
          notes: '',
        });
      } else {
        setError(result.message || 'Failed to create depreciation entry');
      }
    } catch (err) {
      setError('Error submitting depreciation entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span>Asset Depreciation</span>
        </CardTitle>
        <CardDescription>Calculate and record asset depreciation</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="depreciation-id">Depreciation ID</Label>
              <Input id="depreciation-id" value={`DEP-${Date.now()}`} disabled className="bg-gray-50" />
            </div>

            <div>
              <Label htmlFor="depreciation-entered-by">Entered By</Label>
              <Input id="depreciation-entered-by" value={LOGGED_IN_EMPLOYEE_ID || currentUserId} disabled className="bg-gray-50" />
              <p className="text-xs text-gray-500 mt-1">Current user ID</p>
            </div>

            <div>
              <Label htmlFor="depreciation-asset-type">Asset Type *</Label>
              <Select
                value={depreciationForm.assetType}
                onValueChange={(value) => {
                  setDepreciationForm((prev) => ({ ...prev, assetType: value, assetId: '' }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                  <SelectItem value="Office Furniture">Office Furniture</SelectItem>
                  <SelectItem value="Machinery">Machinery</SelectItem>
                  <SelectItem value="Vehicles">Vehicles</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                  <SelectItem value="Electrical Appliances">Electrical Appliances</SelectItem>
                  <SelectItem value="Software Licenses">Software Licenses</SelectItem>
                  <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="depreciation-asset-id">Asset ID *</Label>
              <Select
                value={depreciationForm.assetId}
                onValueChange={(value) => setDepreciationForm((prev) => ({ ...prev, assetId: value }))}
                disabled={!depreciationForm.assetType || loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Loading assets..." : "Select asset"} />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.value} value={asset.value}>
                      {asset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="depreciation-type">Depreciation Type *</Label>
              <Select
                value={depreciationForm.depreciationType}
                onValueChange={(value) => setDepreciationForm((prev) => ({ ...prev, depreciationType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select depreciation method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Straight Line Method">Straight Line Method</SelectItem>
                  <SelectItem value="Written Down Method">Written Down Method</SelectItem>
                  <SelectItem value="Units of Production Method">Units of Production Method</SelectItem>
                  <SelectItem value="Double Declining Method">Double Declining Method</SelectItem>
                  <SelectItem value="Sum-of-the-Years Digits Method">Sum-of-the-Years Digits Method</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="depreciation-start-date">Depreciation Start Date *</Label>
              <Input
                id="depreciation-start-date"
                type="date"
                value={depreciationForm.depreciationStartDate}
                onChange={(e) => setDepreciationForm((prev) => ({ ...prev, depreciationStartDate: e.target.value }))}
                required
              />
            </div>

            {(depreciationForm.depreciationType === "Straight Line Method" ||
              depreciationForm.depreciationType === "Sum-of-the-Years Digits Method") && (
              <>
                <div>
                  <Label htmlFor="salvage-value">Salvage Value</Label>
                  <Input
                    id="salvage-value"
                    type="number"
                    value={depreciationForm.salvageValue}
                    onChange={(e) => setDepreciationForm((prev) => ({ ...prev, salvageValue: e.target.value }))}
                    placeholder="Enter salvage value"
                  />
                </div>
                <div>
                  <Label htmlFor="useful-life">Useful Life (Years)</Label>
                  <Input
                    id="useful-life"
                    type="number"
                    value={depreciationForm.usefulLife}
                    onChange={(e) => setDepreciationForm((prev) => ({ ...prev, usefulLife: e.target.value }))}
                    placeholder="Enter useful life in years"
                  />
                </div>
              </>
            )}

            {depreciationForm.depreciationType === "Written Down Method" && (
              <div>
                <Label htmlFor="depreciation-rate">Depreciation Rate (%)</Label>
                <Input
                  id="depreciation-rate"
                  type="number"
                  value={depreciationForm.depreciationRate}
                  onChange={(e) => setDepreciationForm((prev) => ({ ...prev, depreciationRate: e.target.value }))}
                  placeholder="Enter depreciation rate"
                />
              </div>
            )}

            {depreciationForm.depreciationType === "Double Declining Method" && (
              <div>
                <Label htmlFor="useful-life-dd">Useful Life (Years)</Label>
                <Input
                  id="useful-life-dd"
                  type="number"
                  value={depreciationForm.usefulLife}
                  onChange={(e) => setDepreciationForm((prev) => ({ ...prev, usefulLife: e.target.value }))}
                  placeholder="Enter useful life in years"
                />
              </div>
            )}

            {depreciationForm.depreciationType === "Units of Production Method" && (
              <>
                <div>
                  <Label htmlFor="salvage-value-up">Salvage Value</Label>
                  <Input
                    id="salvage-value-up"
                    type="number"
                    value={depreciationForm.salvageValue}
                    onChange={(e) => setDepreciationForm((prev) => ({ ...prev, salvageValue: e.target.value }))}
                    placeholder="Enter salvage value"
                  />
                </div>
                <div>
                  <Label htmlFor="total-expected-units">Total Expected Units</Label>
                  <Input
                    id="total-expected-units"
                    type="number"
                    value={depreciationForm.totalExpectedUnits}
                    onChange={(e) => setDepreciationForm((prev) => ({ ...prev, totalExpectedUnits: e.target.value }))}
                    placeholder="Enter total expected units"
                  />
                </div>
                <div>
                  <Label htmlFor="actual-units-used">Actual Units Used</Label>
                  <Input
                    id="actual-units-used"
                    type="number"
                    value={depreciationForm.actualUnitsUsed}
                    onChange={(e) => setDepreciationForm((prev) => ({ ...prev, actualUnitsUsed: e.target.value }))}
                    placeholder="Enter actual units used"
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <Label htmlFor="depreciation-notes">Notes</Label>
            <Textarea
              id="depreciation-notes"
              value={depreciationForm.notes}
              onChange={(e) => setDepreciationForm((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter any additional notes"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            <Calculator className="h-4 w-4 mr-2" />
            {loading ? 'Processing...' : 'Calculate & Record Depreciation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function DepreciationTrackingTab({
  depreciationSearch,
  setDepreciationSearch,
  depreciationTypeFilter,
  setDepreciationTypeFilter,
  depreciationMethodFilter,
  setDepreciationMethodFilter,
}) {
  const [depreciationRecords, setDepreciationRecords] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const employee = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("loggedInEmployee")) : null;

  // Fetch all assets and their depreciation details
  useEffect(() => {
    const fetchDepreciationData = async () => {
      setLoading(true);
      try {
        const assetsResponse = await fetch(`http://localhost:8000/api/v1/asset/depreciation/dropdown/asset`, {
          headers: {
            Authorization: `Bearer ${employee?.token}`,
          },
        });
        const assetsResult = await assetsResponse.json();
        if (assetsResult.status === 200) {
          const assetsData = assetsResult.data;

          // Fetch depreciation details for each asset
          const depreciationPromises = assetsData
            .filter(asset => asset.depreciationDetails)
            .map(asset =>
              fetch(`http://localhost:8000/api/v1/asset/depreciation/tracking/${asset.assetId}`, {
                headers: {
                  Authorization: `Bearer ${employee?.token}`,
                },
              }).then(res => res.json())
            );

          const depreciationResults = await Promise.all(depreciationPromises);
          const validDepreciations = depreciationResults
            .filter(result => result.status === 200)
            .map(result => result.data);

          setAssets(assetsData);
          setDepreciationRecords(validDepreciations);
        } else {
          setError(assetsResult.message || 'Failed to fetch assets');
        }
      } catch (err) {
        setError('Error fetching depreciation data');
      } finally {
        setLoading(false);
      }
    };
    fetchDepreciationData();
  }, []);

  const filteredDepreciation = depreciationRecords.filter((record) => {
    const asset = assets.find((a) => a.assetId === record.assetId);
    if (!asset) return false;

    const matchesSearch =
      asset.assetName.toLowerCase().includes(depreciationSearch.toLowerCase()) ||
      record.assetId.toLowerCase().includes(depreciationSearch.toLowerCase());

    const matchesType = depreciationTypeFilter === "all" || asset.assetType === depreciationTypeFilter;

    const matchesMethod =
      depreciationMethodFilter === "all" || record.depreciationMethod === depreciationMethodFilter;

    return matchesSearch && matchesType && matchesMethod;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingDown className="h-5 w-5" />
          <span>Depreciation Tracking</span>
        </CardTitle>
        <CardDescription>Track asset depreciation over time</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by asset name or ID..."
                value={depreciationSearch}
                onChange={(e) => setDepreciationSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={depreciationTypeFilter} onValueChange={setDepreciationTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="IT Equipment">IT Equipment</SelectItem>
              <SelectItem value="Office Furniture">Office Furniture</SelectItem>
              <SelectItem value="Machinery">Machinery</SelectItem>
              <SelectItem value="Vehicles">Vehicles</SelectItem>
              <SelectItem value="Real Estate">Real Estate</SelectItem>
              <SelectItem value="Electrical Appliances">Electrical Appliances</SelectItem>
              <SelectItem value="Software Licenses">Software Licenses</SelectItem>
              <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
            </SelectContent>
          </Select>
          <Select value={depreciationMethodFilter} onValueChange={setDepreciationMethodFilter}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="Straight Line Method">Straight Line Method</SelectItem>
              <SelectItem value="Written Down Method">Written Down Method</SelectItem>
              <SelectItem value="Units of Production Method">Units of Production Method</SelectItem>
              <SelectItem value="Double Declining Method">Double Declining Method</SelectItem>
              <SelectItem value="Sum-of-the-Years Digits Method">Sum-of-the-Years Digits Method</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <p>Loading depreciation records...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepreciation.map((record) => {
              const asset = assets.find((a) => a.assetId === record.assetId);
              if (!asset) return null;

              return (
                <Card key={record.assetId} className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{record.assetName}</CardTitle>
                        <p className="text-sm text-gray-500">{record.assetId}</p>
                      </div>
                      <Badge variant="outline">{record.assetType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Depreciation Method:</span>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">{record.depreciationMethod}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Purchase Cost:</span>
                      <span className="font-semibold">₹{record.purchaseCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current Book Value:</span>
                      <span className="font-semibold text-green-600">₹{record.bookValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Annual Depreciation:</span>
                      <span className="font-semibold text-red-600">₹{record.annualDepreciation.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Entered By:</span>
                      <span className="text-sm font-mono">{record.enteredBy}</span>
                    </div>
                    {record.salvageValue && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Salvage Value:</span>
                        <span className="text-sm">₹{record.salvageValue.toLocaleString()}</span>
                      </div>
                    )}
                    {record.usefulLifeYears && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Useful Life:</span>
                        <span className="text-sm">{record.usefulLifeYears} years</span>
                      </div>
                    )}
                    {record.depreciationRate && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Depreciation Rate:</span>
                        <span className="text-sm">{record.depreciationRate}%</span>
                      </div>
                    )}
                    {record.totalUnitsProduced && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Units Produced:</span>
                        <span className="text-sm">{record.totalUnitsProduced}</span>
                      </div>
                    )}
                    {record.unitsUsedThisYear && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Units Used This Year:</span>
                        <span className="text-sm">{record.unitsUsedThisYear}</span>
                      </div>
                    )}
                    {record.notes && (
                      <div className="mt-3">
                        <span className="text-sm font-medium text-gray-600">Notes:</span>
                        <p className="text-sm bg-gray-50 p-2 rounded mt-1">{record.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && filteredDepreciation.length === 0 && (
          <div className="text-center py-8">
            <Calculator className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No depreciation records found matching your criteria.</p>
            <p className="text-sm text-gray-400">
              Records will appear here when depreciation calculations are performed.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AssetService() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("entry")

  // States for all data
  const [assets, setAssets] = useState([])
  const [maintenanceRecords, setMaintenanceRecords] = useState([])
  const [depreciationRecords, setDepreciationRecords] = useState([])
  const [disposalRequests, setDisposalRequests] = useState([])

  // Search and filter states
  const [assetSearch, setAssetSearch] = useState("")
  const [assetAssignmentFilter, setAssetAssignmentFilter] = useState("all")
  const [depreciationSearch, setDepreciationSearch] = useState("")
  const [disposalSearch, setDisposalSearch] = useState("")
  const [disposalStatusFilter, setDisposalStatusFilter] = useState("all")
  const [disposalTypeFilter, setDisposalTypeFilter] = useState("all")
  const [maintenanceStatusFilter, setMaintenanceStatusFilter] = useState("all")
  const [maintenanceTypeFilter, setMaintenanceTypeFilter] = useState("all")
  const [depreciationTypeFilter, setDepreciationTypeFilter] = useState("all")
  const [depreciationMethodFilter, setDepreciationMethodFilter] = useState("all")

  // Add this new state after the other states
  const [assetTypeFilter, setAssetTypeFilter] = useState("all")

  // Form states
  const [assetForm, setAssetForm] = useState({
    name: "",
    type: "",
    subtype: "",
    description: "",
    purchaseFrom: "",
    purchaseCost: "",
    purchaseDate: "",
    duplicates: 1,
    linkedReferenceId: "",
    documents: [],
  })

  const [maintenanceForm, setMaintenanceForm] = useState({
    assetType: "",
    assetId: "",
    maintenanceType: "",
    maintenancePeriod: "",
    serviceProvider: "",
    startDate: "",
    endDate: "",
    serviceNotes: "",
  })

  const [depreciationForm, setDepreciationForm] = useState({
    assetType: "",
    assetId: "",
    depreciationType: "",
    depreciationStartDate: "",
    salvageValue: "",
    usefulLife: "",
    depreciationRate: "",
    totalExpectedUnits: "",
    actualUnitsUsed: "",
    notes: "",
  })

  const [disposalForm, setDisposalForm] = useState({
    assetType: "",
    assetSubtype: "",
    assetId: "",
    reason: "",
  })

  // Edit states
  const [editingAsset, setEditingAsset] = useState(null)
  // Add this new state for editing maintenance dates
  const [editingMaintenanceDates, setEditingMaintenanceDates] = useState(null)

  // New state for entered assets
  const [enteredAssets, setEnteredAssets] = useState([])

  // Add this new state after the other states
  const [isFromTransaction, setIsFromTransaction] = useState(false)

  // Mock current user ID
  const currentUserId = LOGGED_IN_EMPLOYEE_ID

  // Mock data initialization
  useEffect(() => {
    const mockAssets = [
      {
        id: "AST-1703123456789",
        name: "Dell Laptop",
        type: "IT Equipment",
        subtype: "Laptop",
        description: "Dell Inspiron 15 3000 Series",
        purchaseFrom: "VEN-001",
        purchaseCost: 45000,
        purchaseDate: "2024-01-15",
        expectedUsefulLife: 5,
        status: "active",
        assignedTo: "EMP-001",
        assignedDepartment: "Information Technology",
        createdBy: "EMP-ADMIN",
        updatedBy: "USR-UPDATE-001",
        createdAt: "2024-01-15T10:30:00Z",
      },
    ]

    const mockMaintenance = [
      {
        id: "MNT-1703123456789",
        assetId: "AST-1703123456791",
        maintenanceType: "Maintenance Needed",
        lastServiceDate: "2024-01-20",
        maintenancePeriod: "90 days",
        updatedMaintenanceDate: "2024-04-20",
        serviceProvider: "HP Service Center",
        amcProvider: "HP Service Center",
        startDate: "2024-01-20",
        endDate: "2025-01-20",
        amcStartDate: "2024-01-20",
        amcEndDate: "2025-01-20",
        cost: 2500,
        serviceNotes: "Regular maintenance and toner replacement. Cleaned internal components and updated firmware.",
        createdAt: "2024-01-20T10:00:00Z",
        createdBy: "USR-MAINT-001",
        updatedBy: "USR-MAINT-UPDATE-001",
        requestType: "maintenance",
        status: "completed",
        transactionId: "TXN-MNT-2024-001",
        paymentMethod: "Bank Transfer",
        paymentDate: "2024-01-20",
        invoiceNumber: "INV-HP-2024-001",
        documents: ["maintenance_report.pdf", "invoice.pdf"],
      },
    ]

    const mockDepreciation = [
      {
        id: "DEP-1703123456789",
        assetId: "AST-1703123456789",
        purchaseCost: 45000,
        purchaseDate: "2024-01-15",
        depreciationStartDate: "2024-01-15",
        depreciationType: "straight_line",
        salvageValue: 5000,
        usefulLife: 5,
        bookValue: 37000,
        annualDepreciation: 8000,
        notes: "Standard laptop depreciation",
        enteredBy: "USR-DEP-001",
        createdAt: "2024-01-15T11:00:00Z",
      },
    ]

    const mockDisposalRequests = [
      {
        id: "DIS-1703123456789",
        assetId: "AST-1703123456792",
        assetType: "IT Equipment",
        assetSubtype: "Desktop",
        reason: "End of useful life, outdated technology",
        status: "awaiting_disposal",
        createdBy: "USR-DISP-001",
        createdAt: "2024-12-01T10:00:00Z",
      },
      {
        id: "DIS-1703123456790",
        assetId: "AST-1703123456793",
        assetType: "IT Equipment",
        assetSubtype: "Laptop",
        reason: "End of useful life, sold to recover value",
        status: "disposed",
        createdBy: "USR-DISP-002",
        createdAt: "2024-11-15T10:00:00Z",
        saleAmount: 45000, // Sale amount from transaction
        saleDate: "2024-11-20",
        saleTransactionId: "TXN-SALE-001",
      },
    ]

    setAssets(mockAssets)
    setMaintenanceRecords(mockMaintenance)
    setDepreciationRecords(mockDepreciation)
    setDisposalRequests(mockDisposalRequests)

    // Load entered assets from localStorage
    const savedEnteredAssets = JSON.parse(localStorage.getItem("enteredAssets") || "[]")
    setEnteredAssets(savedEnteredAssets)
  }, [])

  // Add this useEffect after the existing useEffect
  useEffect(() => {
    const updateMaintenanceStatuses = () => {
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)

      setAssets((prevAssets) =>
        prevAssets.map((asset) => {
          const maintenanceRecord = maintenanceRecords.find(
            (record) => record.assetId === asset.id && record.status !== "completed",
          )

          if (!maintenanceRecord) return asset

          const startDate = maintenanceRecord.startDate ? new Date(maintenanceRecord.startDate) : null
          const endDate = maintenanceRecord.endDate ? new Date(maintenanceRecord.endDate) : null

          if (startDate) startDate.setHours(0, 0, 0, 0)
          if (endDate) endDate.setHours(0, 0, 0, 0)

          // If service has started but not ended
          if (startDate && currentDate >= startDate && (!endDate || currentDate <= endDate)) {
            const newStatus =
              maintenanceRecord.maintenanceType === "Repair Needed" ? "under_repair" : "under_maintenance"
            if (asset.status !== newStatus) {
              // Update maintenance record status
              setMaintenanceRecords((prevRecords) =>
                prevRecords.map((record) =>
                  record.id === maintenanceRecord.id ? { ...record, status: "in_progress" } : record,
                ),
              )
              return { ...asset, status: newStatus }
            }
          }

          // If service has ended
          if (endDate && currentDate > endDate && maintenanceRecord.status !== "completed") {
            // Update maintenance record status
            setMaintenanceRecords((prevRecords) =>
              prevRecords.map((record) =>
                record.id === maintenanceRecord.id ? { ...record, status: "completed" } : record,
              ),
            )
            return { ...asset, status: "active" }
          }

          return asset
        }),
      )
    }

    // Run immediately and then every hour
    updateMaintenanceStatuses()
    const interval = setInterval(updateMaintenanceStatuses, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [maintenanceRecords])

  // Utility functions
  const generateId = (prefix, suffix) => {
    const timestamp = Date.now()
    return suffix ? `${prefix}-${timestamp}-${suffix}` : `${prefix}-${timestamp}`
  }

  const calculateDepreciation = (form, purchaseCost, depreciationStartDate) => {
    const cost = purchaseCost
    const salvage = Number.parseFloat(form.salvageValue) || 0
    const life = Number.parseFloat(form.usefulLife) || 1
    const rate = Number.parseFloat(form.depreciationRate) || 0
    const totalUnits = Number.parseFloat(form.totalExpectedUnits) || 1
    const usedUnits = Number.parseFloat(form.actualUnitsUsed) || 0

    let annualDepreciation = 0
    let bookValue = cost

    // Calculate years since depreciation start date
    const depreciationStartDateObj = new Date(depreciationStartDate)
    const currentDate = new Date()
    const yearsSinceStart = (currentDate.getTime() - depreciationStartDateObj.getTime()) / (1000 * 60 * 60 * 24 * 365)

    switch (form.depreciationType) {
      case "straight_line":
        annualDepreciation = (cost - salvage) / life
        bookValue = cost - annualDepreciation * yearsSinceStart
        break
      case "written_down":
        // Compound depreciation
        bookValue = cost * Math.pow(1 - rate / 100, yearsSinceStart)
        annualDepreciation = bookValue * (rate / 100)
        break
      case "unit_production":
        const depreciationPerUnit = (cost - salvage) / totalUnits
        annualDepreciation = usedUnits * depreciationPerUnit
        bookValue = cost - annualDepreciation
        break
      case "double_declining":
        const decliningRate = 2 / life
        bookValue = cost * Math.pow(1 - decliningRate, yearsSinceStart)
        annualDepreciation = bookValue * decliningRate
        break
      case "sum_of_years":
        const sumOfYears = (life * (life + 1)) / 2
        const remainingLife = Math.max(life - Math.floor(yearsSinceStart), 1)
        annualDepreciation = (remainingLife / sumOfYears) * (cost - salvage)
        bookValue = cost - annualDepreciation * yearsSinceStart
        break
    }

    return {
      annualDepreciation: Math.max(annualDepreciation, 0),
      bookValue: Math.max(bookValue, salvage),
    }
  }

  // Asset Entry Functions
const handleAssetSubmit = (e) => {
  e.preventDefault();

  const requiredFields = [
    assetForm.name,
    assetForm.type,
    assetForm.purchaseFrom,
    assetForm.purchaseCost,
    assetForm.purchaseDate,
  ];

  if (requiredFields.includes("") || requiredFields.includes(null)) {
    toast.error("Please fill in all required fields");
    return;
  }

  const baseAsset = {
    name: assetForm.name,
    type: assetForm.type,
    subtype: assetForm.subtype,
    description: assetForm.description,
    purchaseFrom: assetForm.purchaseFrom,
    purchaseCost: parseFloat(assetForm.purchaseCost),
    purchaseDate: assetForm.purchaseDate,
    expectedUsefulLife: 5,
    status: "active",
    createdBy: currentUserId,
    updatedBy: currentUserId,
    createdAt: new Date().toISOString(),
    documents: assetForm.documents,
  };

  const newAssets = [];
  for (let i = 0; i < assetForm.duplicates; i++) {
    const uniqueId = `AST-${Date.now()}-${i + 1}`;
    newAssets.push({
      ...baseAsset,
      id: uniqueId,
    });
  }

  setAssets((prev) => [...prev, ...newAssets]);

  // ✅ If asset came from a transaction, remove it from enteredAssets
  if (isFromTransaction && assetForm.linkedReferenceId) {
    const filteredAssets = enteredAssets.filter(
      (asset) => asset.assetId !== assetForm.linkedReferenceId
    );

    console.log("Before filter:", enteredAssets);
    console.log("Removing assetId:", assetForm.linkedReferenceId);
    console.log("After filter:", filteredAssets);

    setEnteredAssets(filteredAssets);
    localStorage.setItem("enteredAssets", JSON.stringify(filteredAssets));
  }



  // ✅ Reset form
  setAssetForm({
    name: "",
    type: "",
    subtype: "",
    description: "",
    purchaseFrom: "",
    purchaseCost: "",
    purchaseDate: "",
    duplicates: 1,
    linkedReferenceId: "",
    documents: [],
  });

  setIsFromTransaction(false);
  toast.success(`${newAssets.length} asset(s) added successfully!`);
};

  // Function to handle asset entry from transaction
const handleAssetFromTransaction = (assetData) => {
  setAssetForm({
    name: assetData.assetName || "",
    type: "", // Manually selected later
    subtype: "", // Manually selected later
    description: `Asset from transaction ${assetData.transactionId || assetData.referenceId}`,
    purchaseFrom: assetData.vendorId || "",
    purchaseCost: assetData.costPerUnit?.toString() || "",
    purchaseDate: assetData.purchaseDate ? assetData.purchaseDate.split("T")[0] : "",
    duplicates: assetData.quantity || 1,
    linkedReferenceId: assetData.referenceId || "", // ✅ Correct field
    documents: [],
  })

  setIsFromTransaction(true)
  setActiveTab("create") // Assumes tab switch instead of route push
}

  // Function to remove an asset from entered assets after it's been processed
  const handleRemoveEnteredAsset = (assetId) => {
    const updatedAssets = enteredAssets.filter((asset) => asset.id !== assetId)
    setEnteredAssets(updatedAssets)
    localStorage.setItem("enteredAssets", JSON.stringify(updatedAssets))
  }

  // Asset List Functions
  const handleAssetAssignment = (assetId, assignedTo, department) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === assetId
          ? { ...asset, assignedTo, assignedDepartment: department, status: "active", updatedBy: currentUserId }
          : asset,
      ),
    )
    toast.success("Asset assigned successfully!")
  }

  const handleAssetEdit = (asset) => {
    setEditingAsset(asset)
  }

  const handleAssetUpdate = (updatedAsset) => {
    setAssets((prev) =>
      prev.map((asset) => (asset.id === updatedAsset.id ? { ...updatedAsset, updatedBy: currentUserId } : asset)),
    )
    setEditingAsset(null)
    toast.success("Asset updated successfully!")
  }

  const handleAssetDelete = (assetId) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== assetId))
    // Also remove related records
    setMaintenanceRecords((prev) => prev.filter((record) => record.assetId !== assetId))
    setDepreciationRecords((prev) => prev.filter((record) => record.assetId !== assetId))
    setDisposalRequests((prev) => prev.filter((record) => record.assetId !== assetId))
    toast.success("Asset and related records deleted successfully!")
  }

  const handleMaintenanceSubmit = (e) => {
    e.preventDefault()

    if (!maintenanceForm.assetId || !maintenanceForm.maintenanceType) {
      toast.error("Please fill in all required fields")
      return
    }

    const asset = assets.find((a) => a.id === maintenanceForm.assetId)
    if (!asset) {
      toast.error("Asset not found")
      return
    }

    // Determine request type and new status based on maintenance type
    const requestType = maintenanceForm.maintenanceType === "Repair Needed" ? "repair" : "maintenance"
    const newStatus = maintenanceForm.maintenanceType === "Repair Needed" ? "repair_needed" : "maintenance_needed"

    const newMaintenance = {
      id: generateId("MNT"),
      assetId: maintenanceForm.assetId,
      maintenanceType: maintenanceForm.maintenanceType,
      lastServiceDate: new Date().toISOString().split("T")[0], // Set to current date
      maintenancePeriod: maintenanceForm.maintenancePeriod,
      updatedMaintenanceDate: calculateNextMaintenanceDate(
        new Date().toISOString().split("T")[0],
        maintenanceForm.maintenancePeriod,
      ),
      serviceProvider: maintenanceForm.serviceProvider,
      startDate: maintenanceForm.startDate,
      endDate: maintenanceForm.endDate,
      serviceNotes: maintenanceForm.serviceNotes,
      createdAt: new Date().toISOString(),
      createdBy: currentUserId,
      updatedBy: currentUserId,
      requestType,
      status: "requested",
    }

    setMaintenanceRecords((prev) => [...prev, newMaintenance])

    // Update asset status
    setAssets((prev) => prev.map((a) => (a.id === maintenanceForm.assetId ? { ...a, status: newStatus } : a)))

    setMaintenanceForm({
      assetType: "",
      assetId: "",
      maintenanceType: "",
      maintenancePeriod: "",
      serviceProvider: "",
      startDate: "",
      endDate: "",
      serviceNotes: "",
    })

    toast.success(`${maintenanceForm.maintenanceType} request submitted successfully!`)
  }

  const calculateNextMaintenanceDate = (lastDate, period) => {
    const date = new Date(lastDate)
    const days = Number.parseInt(period.split(" ")[0])
    date.setDate(date.getDate() + days)
    return date.toISOString().split("T")[0]
  }

  // Depreciation Functions
  const handleDepreciationSubmit = (e) => {
    e.preventDefault()

    if (!depreciationForm.assetId || !depreciationForm.depreciationType || !depreciationForm.depreciationStartDate) {
      toast.error("Please fill in all required fields")
      return
    }

    const asset = assets.find((a) => a.id === depreciationForm.assetId)
    if (!asset) {
      toast.error("Asset not found")
      return
    }

    const { annualDepreciation, bookValue } = calculateDepreciation(
      depreciationForm,
      asset.purchaseCost,
      depreciationForm.depreciationStartDate,
    )

    const newDepreciation = {
      id: generateId("DEP"),
      assetId: depreciationForm.assetId,
      purchaseCost: asset.purchaseCost,
      purchaseDate: asset.purchaseDate,
      depreciationStartDate: depreciationForm.depreciationStartDate,
      depreciationType: depreciationForm.depreciationType,
      salvageValue: Number.parseFloat(depreciationForm.salvageValue) || undefined,
      usefulLife: Number.parseFloat(depreciationForm.usefulLife) || undefined,
      depreciationRate: Number.parseFloat(depreciationForm.depreciationRate) || undefined,
      totalExpectedUnits: Number.parseFloat(depreciationForm.totalExpectedUnits) || undefined,
      actualUnitsUsed: Number.parseFloat(depreciationForm.actualUnitsUsed) || undefined,
      bookValue,
      annualDepreciation,
      notes: depreciationForm.notes,
      enteredBy: currentUserId,
      createdAt: new Date().toISOString(),
    }

    setDepreciationRecords((prev) => [...prev, newDepreciation])

    setDepreciationForm({
      assetType: "",
      assetId: "",
      depreciationType: "",
      depreciationStartDate: "",
      salvageValue: "",
      usefulLife: "",
      depreciationRate: "",
      totalExpectedUnits: "",
      actualUnitsUsed: "",
      notes: "",
    })

    toast.success("Depreciation record added successfully!")
  }

  // Disposal Functions
  const handleDisposalSubmit = (e) => {
    e.preventDefault()

    if (!disposalForm.assetType || !disposalForm.assetId || !disposalForm.reason) {
      toast.error("Please fill in all required fields")
      return
    }

    const asset = assets.find((a) => a.id === disposalForm.assetId)
    if (!asset) {
      toast.error("Asset not found")
      return
    }

    const newDisposalRequest = {
      id: generateId("DIS"),
      assetId: disposalForm.assetId,
      assetType: disposalForm.assetType,
      assetSubtype: disposalForm.assetSubtype,
      reason: disposalForm.reason,
      status: "awaiting_disposal",
      createdBy: currentUserId,
      createdAt: new Date().toISOString(),
    }

    setDisposalRequests((prev) => [...prev, newDisposalRequest])

    // Update asset status to awaiting disposal
    setAssets((prev) => prev.map((a) => (a.id === disposalForm.assetId ? { ...a, status: "awaiting_disposal" } : a)))

    setDisposalForm({
      assetType: "",
      assetSubtype: "",
      assetId: "",
      reason: "",
    })

    toast.success("Asset disposal request submitted successfully!")
  }

  // Get asset subtypes based on type
  const getAssetSubtypes = (type) => {
    const subtypes = {
      "IT Equipment": [
        "Laptop",
        "Desktop",
        "Monitor",
        "Printer",
        "Scanner",
        "Router",
        "Server",
        "Tablet",
        "Projector",
        "Other",
      ],
      "Office Furniture": [
        "Chair",
        "Desk",
        "Conference Table",
        "Cabinet",
        "Bookshelf",
        "Partition",
        "Reception Desk",
        "Other",
      ],
      Machinery: [
        "CNC Machine",
        "Lathe Machine",
        "Compressor",
        "Drill Press",
        "Packaging Machine",
        "3D Printer",
        "Other",
      ],
      Vehicles: ["Car", "Motorcycle", "Truck", "Forklift", "Electric Scooter", "Other"],
      "Real Estate": ["Office Building", "Warehouse", "Factory", "Retail Space", "Land", "Other"],
      "Electrical Appliances": ["Air Conditioner", "Refrigerator", "Microwave", "Water Purifier", "Heater", "Other"],
      "Software Licenses": [
        "Operating System License",
        "Accounting Software",
        "Design Software",
        "Productivity Suite",
        "ERP License",
        "Antivirus Subscription",
        "Other",
      ],
      Miscellaneous: ["Security Camera", "Fire Extinguisher", "Whiteboard", "Tool Kit", "Other"],
    }
    return subtypes[type] || []
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      unassigned: { color: "bg-gray-500", text: "Unassigned" },
      active: { color: "bg-green-500", text: "Active" },
      maintenance_needed: { color: "bg-yellow-500", text: "Maintenance Needed" },
      repair_needed: { color: "bg-orange-500", text: "Repair Needed" },
      under_maintenance: { color: "bg-purple-500", text: "Under Maintenance" },
      under_repair: { color: "bg-red-500", text: "Under Repair" },
      disposed: { color: "bg-red-500", text: "Disposed" },
      unoperational: { color: "bg-gray-700", text: "Unoperational" },
      awaiting_disposal: { color: "bg-orange-600", text: "Awaiting Disposal" },
    }

    const config = statusConfig[status] || statusConfig.unassigned
    return <Badge className={`${config.color} text-white`}>{config.text}</Badge>
  }

  const getAssignmentStatusBadge = (asset) => {
    if (asset.assignedTo) {
      return <Badge className="bg-blue-500 text-white">Assigned</Badge>
    } else {
      return <Badge className="bg-gray-500 text-white">Unassigned</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/services")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Services</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Asset Service</h1>
                <p className="text-sm text-gray-500">Comprehensive asset management system</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Asset Management</CardTitle>
                <CardDescription>Manage all asset operations</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                  <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent p-1">
                    <TabsTrigger value="entry" className="justify-start data-[state=active]:bg-blue-100">
                      <Plus className="h-4 w-4 mr-2" />
                      Entered Assets
                    </TabsTrigger>
                    <TabsTrigger
                      value="create"
                      className="justify-start data-[state=active]:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!isFromTransaction}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Asset
                    </TabsTrigger>
                    <TabsTrigger value="list" className="justify-start data-[state=active]:bg-blue-100">
                      <Search className="h-4 w-4 mr-2" />
                      Asset List
                    </TabsTrigger>
                    <TabsTrigger value="maintenance-list" className="justify-start data-[state=active]:bg-blue-100">
                      <Clock className="h-4 w-4 mr-2" />
                      Maintenance List
                    </TabsTrigger>
                    <TabsTrigger value="maintenance" className="justify-start data-[state=active]:bg-blue-100">
                      <Edit className="h-4 w-4 mr-2" />
                      Asset Maintenance
                    </TabsTrigger>
                    <TabsTrigger value="disposal" className="justify-start data-[state=active]:bg-blue-100">
                      <Recycle className="h-4 w-4 mr-2" />
                      Asset Disposal
                    </TabsTrigger>
                    <TabsTrigger value="disposal-list" className="justify-start data-[state=active]:bg-blue-100">
                      <Clock className="h-4 w-4 mr-2" />
                      Disposal List
                    </TabsTrigger>
                    <TabsTrigger value="depreciation" className="justify-start data-[state=active]:bg-blue-100">
                      <Calculator className="h-4 w-4 mr-2" />
                      Asset Depreciation
                    </TabsTrigger>
                    <TabsTrigger value="tracking" className="justify-start data-[state=active]:bg-blue-100">
                      <TrendingDown className="h-4 w-4 mr-2" />
                      Depreciation Tracking
                    </TabsTrigger>
                  </TabsList>
                  {!isFromTransaction && (
                    <div className="px-3 py-2 text-xs text-gray-500 border-t">
                      <p>
                        Create Asset tab is only accessible when creating assets from transactions in the Entered Assets
                        tab.
                      </p>
                    </div>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="entry">
                <EnteredAssetsTab
                  enteredAssets={enteredAssets}
                  handleAssetFromTransaction={handleAssetFromTransaction}
                />
              </TabsContent>

              <TabsContent value="create">
                <CreateAssetTab
                  assetForm={assetForm}
                  setAssetForm={setAssetForm}
                  handleAssetSubmit={handleAssetSubmit}
                  isFromTransaction={isFromTransaction}
                  currentUserId={currentUserId}
                  getAssetSubtypes={getAssetSubtypes}
                />
              </TabsContent>

              <TabsContent value="list">
                <AssetListTab
                  assets={assets}
                  assetSearch={assetSearch}
                  setAssetSearch={setAssetSearch}
                  assetTypeFilter={assetTypeFilter}
                  setAssetTypeFilter={setAssetTypeFilter}
                  assetAssignmentFilter={assetAssignmentFilter}
                  setAssetAssignmentFilter={setAssetAssignmentFilter}
                  handleAssetEdit={handleAssetEdit}
                  handleAssetDelete={handleAssetDelete}
                  handleAssetAssignment={handleAssetAssignment}
                  editingAsset={editingAsset}
                  setEditingAsset={setEditingAsset}
                  handleAssetUpdate={handleAssetUpdate}
                  maintenanceRecords={maintenanceRecords}
                  getStatusBadge={getStatusBadge}
                  getAssignmentStatusBadge={getAssignmentStatusBadge}
                  currentUserId={currentUserId}
                />
              </TabsContent>

              <TabsContent value="maintenance-list">
                <MaintenanceListTab
                  assets={assets}
                  maintenanceRecords={maintenanceRecords}
                  assetSearch={assetSearch}
                  setAssetSearch={setAssetSearch}
                  maintenanceTypeFilter={maintenanceTypeFilter}
                  setMaintenanceTypeFilter={setMaintenanceTypeFilter}
                  maintenanceStatusFilter={maintenanceStatusFilter}
                  setMaintenanceStatusFilter={setMaintenanceStatusFilter}
                  getStatusBadge={getStatusBadge}
                  currentUserId={currentUserId}
                  setMaintenanceRecords={setMaintenanceRecords}
                />
              </TabsContent>

              <TabsContent value="maintenance">
                <AssetMaintenanceTab
                  assets={assets}
                  maintenanceForm={maintenanceForm}
                  setMaintenanceForm={setMaintenanceForm}
                  handleMaintenanceSubmit={handleMaintenanceSubmit}
                  currentUserId={currentUserId}
                />
              </TabsContent>

              <TabsContent value="disposal">
                <AssetDisposalTab
                  assets={assets}
                  disposalForm={disposalForm}
                  setDisposalForm={setDisposalForm}
                  handleDisposalSubmit={handleDisposalSubmit}
                  currentUserId={currentUserId}
                  getAssetSubtypes={getAssetSubtypes}
                />
              </TabsContent>

              <TabsContent value="disposal-list">
                <DisposalListTab
                  assets={assets}
                  disposalRequests={disposalRequests}
                  disposalSearch={disposalSearch}
                  setDisposalSearch={setDisposalSearch}
                  disposalStatusFilter={disposalStatusFilter}
                  setDisposalStatusFilter={setDisposalStatusFilter}
                  disposalTypeFilter={disposalTypeFilter}
                  setDisposalTypeFilter={setDisposalTypeFilter}
                  getStatusBadge={getStatusBadge}
                />
              </TabsContent>

              <TabsContent value="depreciation">
                <AssetDepreciationTab
                  assets={assets}
                  depreciationForm={depreciationForm}
                  setDepreciationForm={setDepreciationForm}
                  handleDepreciationSubmit={handleDepreciationSubmit}
                  currentUserId={currentUserId}
                  calculateDepreciation={calculateDepreciation}
                />
              </TabsContent>

              <TabsContent value="tracking">
                <DepreciationTrackingTab
                  assets={assets}
                  depreciationRecords={depreciationRecords}
                  depreciationSearch={depreciationSearch}
                  setDepreciationSearch={setDepreciationSearch}
                  depreciationTypeFilter={depreciationTypeFilter}
                  setDepreciationTypeFilter={setDepreciationTypeFilter}
                  depreciationMethodFilter={depreciationMethodFilter}
                  setDepreciationMethodFilter={setDepreciationMethodFilter}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
