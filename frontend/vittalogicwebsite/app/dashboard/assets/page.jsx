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

// Types

// Assignment Form Component
function AssignmentForm({ assetId, assetName, onAssign }) {
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock departments data (this would come from your department service)
  const departments = [
    {
      id: "DEPT_1703123456789",
      name: "Human Resources",
      employees: [
        { id: "EMP001", name: "John Doe" },
        { id: "EMP002", name: "Jane Smith" },
        { id: "EMP003", name: "Mike Johnson" },
      ],
    },
    {
      id: "DEPT_1703123456790",
      name: "Information Technology",
      employees: [
        { id: "EMP004", name: "Sarah Wilson" },
        { id: "EMP005", name: "David Brown" },
        { id: "EMP006", name: "Lisa Davis" },
        { id: "EMP007", name: "Tom Anderson" },
      ],
    },
    {
      id: "DEPT_1703123456791",
      name: "Finance",
      employees: [
        { id: "EMP008", name: "Emily Johnson" },
        { id: "EMP009", name: "Robert Lee" },
        { id: "EMP010", name: "Maria Garcia" },
      ],
    },
    {
      id: "DEPT_1703123456792",
      name: "Marketing",
      employees: [
        { id: "EMP0011", name: "Alex Chen" },
        { id: "EMP0012", name: "Jessica Taylor" },
      ],
    },
  ]

  const selectedDepartmentData = departments.find((dept) => dept.name === selectedDepartment)

  const handleSubmit = async () => {
    if (!selectedDepartment || !selectedEmployee) {
      toast.error("Please select department and employee")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      onAssign(assetId, selectedEmployee, selectedDepartment)
      setIsSubmitting(false)
      toast.success(`Asset assigned to ${selectedEmployee} successfully!`)

      // Reset form
      setSelectedDepartment("")
      setSelectedEmployee("")
    }, 1000)
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
              <SelectItem key={dept.id} value={dept.name}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="employee">Employee *</Label>
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee} disabled={!selectedDepartment}>
          <SelectTrigger>
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            {selectedDepartmentData?.employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.id} - {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedDepartment && selectedEmployee && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Assignment Summary</h4>
          <div className="text-sm space-y-1">
            <div>
              <span className="font-medium">Asset:</span> {assetName}
            </div>
            <div>
              <span className="font-medium">Department:</span> {selectedDepartment}
            </div>
            <div>
              <span className="font-medium">Employee:</span> {selectedEmployee}
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

// Historical Maintenance Dialog Component
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
  const currentUserId = "USR-CURRENT-001"

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
      {
        id: "AST-1703123456790",
        name: "Office Chair",
        type: "Office Furniture",
        subtype: "Seating",
        description: "Ergonomic office chair with lumbar support",
        purchaseFrom: "VEN-002",
        purchaseCost: 8500,
        purchaseDate: "2024-02-01",
        expectedUsefulLife: 8,
        status: "active",
        assignedTo: "EMP-002",
        assignedDepartment: "Human Resources",
        createdBy: "EMP-ADMIN",
        updatedBy: "USR-UPDATE-002",
        createdAt: "2024-02-01T14:20:00Z",
      },
      {
        id: "AST-1703123456791",
        name: "HP Printer",
        type: "IT Equipment",
        subtype: "Printer",
        description: "HP LaserJet Pro M404n",
        purchaseFrom: "VEN-003",
        purchaseCost: 15000,
        purchaseDate: "2024-01-20",
        expectedUsefulLife: 6,
        status: "maintenance_needed",
        assignedDepartment: "Information Technology",
        createdBy: "EMP-ADMIN",
        updatedBy: "USR-UPDATE-003",
        createdAt: "2024-01-20T09:15:00Z",
      },
      {
        id: "AST-1703123456792",
        name: "Old Desktop",
        type: "IT Equipment",
        subtype: "Desktop",
        description: "Old desktop computer for disposal",
        purchaseFrom: "VEN-004",
        purchaseCost: 25000,
        purchaseDate: "2020-01-15",
        expectedUsefulLife: 5,
        status: "awaiting_disposal",
        assignedDepartment: "Information Technology",
        createdBy: "EMP-ADMIN",
        updatedBy: "USR-UPDATE-004",
        createdAt: "2020-01-15T10:30:00Z",
      },
      {
        id: "AST-1703123456793",
        name: "Old MacBook Pro",
        type: "IT Equipment",
        subtype: "Laptop",
        description: "MacBook Pro 2019 - disposed through sale",
        purchaseFrom: "VEN-005",
        purchaseCost: 120000,
        purchaseDate: "2019-03-15",
        expectedUsefulLife: 5,
        status: "disposed",
        assignedDepartment: "Information Technology",
        createdBy: "EMP-ADMIN",
        updatedBy: "USR-UPDATE-005",
        createdAt: "2019-03-15T10:30:00Z",
      },
      {
        id: "AST-1703123456794",
        name: "Conference Table",
        type: "Office Furniture",
        subtype: "Table",
        description: "Large conference table for meeting room",
        purchaseFrom: "VEN-006",
        purchaseCost: 35000,
        purchaseDate: "2024-03-01",
        expectedUsefulLife: 10,
        status: "repair_needed",
        assignedDepartment: "Human Resources",
        createdBy: "EMP-ADMIN",
        updatedBy: "USR-UPDATE-006",
        createdAt: "2024-03-01T10:30:00Z",
      },
      {
        id: "AST-1703123456795",
        name: "Server Rack",
        type: "IT Equipment",
        subtype: "Server",
        description: "Dell PowerEdge Server Rack",
        purchaseFrom: "VEN-007",
        purchaseCost: 85000,
        purchaseDate: "2024-02-15",
        expectedUsefulLife: 7,
        status: "under_maintenance",
        assignedDepartment: "Information Technology",
        createdBy: "EMP-ADMIN",
        updatedBy: "USR-UPDATE-007",
        createdAt: "2024-02-15T10:30:00Z",
      },
      {
        id: "AST-1703123456796",
        name: "Air Conditioner",
        type: "Electrical Appliances",
        subtype: "Equipment",
        description: "Split AC unit for office cooling",
        purchaseFrom: "VEN-008",
        purchaseCost: 45000,
        purchaseDate: "2024-01-10",
        expectedUsefulLife: 8,
        status: "under_repair",
        assignedDepartment: "Administration",
        createdBy: "EMP-ADMIN",
        updatedBy: "USR-UPDATE-008",
        createdAt: "2024-01-10T10:30:00Z",
      },
      {
        id: "AST-1703123456797",
        name: "Epson Projector",
        type: "IT Equipment",
        subtype: "Equipment",
        description: "Epson projector for presentations",
        purchaseFrom: "VEN-009",
        purchaseCost: 25000,
        purchaseDate: "2024-03-05",
        expectedUsefulLife: 5,
        status: "maintenance_needed",
        assignedDepartment: "Marketing",
        createdBy: "EMP-ADMIN",
        updatedBy: "USR-UPDATE-009",
        createdAt: "2024-03-05T10:30:00Z",
      },
      // Additional dummy assets for maintenance list
      {
        id: "AST-1703123456798",
        name: "Canon Scanner",
        type: "IT Equipment",
        subtype: "Scanner",
        description: "Canon CanoScan LiDE 400",
        purchaseFrom: "VEN-010",
        purchaseCost: 8500,
        purchaseDate: "2024-02-10",
        expectedUsefulLife: 5,
        status: "maintenance_needed",
        assignedTo: "EMP-003",
        assignedDepartment: "Finance",
        createdBy: "EMP-ADMIN",
        updatedBy: "USR-UPDATE-010",
        createdAt: "2024-02-10T10:30:00Z",
      },
      {
        id: "AST-1703123456799",
        name: "Executive Desk",
        type: "Office Furniture",
        subtype: "Desk",
        description: "Wooden executive desk with drawers",
        purchaseFrom: "VEN-011",
        purchaseCost: 22000,
        purchaseDate: "2024-01-25",
        expectedUsefulLife: 10,
        status: "repair_needed",
        assignedTo: "EMP-004",
        assignedDepartment: "Human Resources",
        createdBy: "EMP-ADMIN",
        updatedBy: "USR-UPDATE-011",
        createdAt: "2024-01-25T10:30:00Z",
      },
      {
        id: "AST-1703123456800",
        name: "Network Switch",
        type: "IT Equipment",
        subtype: "Network Equipment",
        description: "24-port Gigabit Ethernet switch",
        purchaseFrom: "VEN-012",
        purchaseCost: 18000,
        purchaseDate: "2024-03-15",
        expectedUsefulLife: 7,
        status: "under_maintenance",
        assignedDepartment: "Information Technology",
        createdBy: "EMP-ADMIN",
        updatedBy: "USR-UPDATE-012",
        createdAt: "2024-03-15T10:30:00Z",
      },
      {
        id: "AST-1703123456801",
        name: "Coffee Machine",
        type: "Electrical Appliances",
        subtype: "Equipment",
        description: "Commercial coffee machine for office",
        purchaseFrom: "VEN-013",
        purchaseCost: 35000,
        purchaseDate: "2024-02-20",
        expectedUsefulLife: 8,
        status: "under_repair",
        assignedDepartment: "Administration",
        createdBy: "EMP-ADMIN",
        updatedBy: "USR-UPDATE-013",
        createdAt: "2024-02-20T10:30:00Z",
      },
      {
        id: "AST-1703123456802",
        name: "Whiteboard",
        type: "Office Furniture",
        subtype: "Board",
        description: "Large magnetic whiteboard for meeting room",
        purchaseFrom: "VEN-014",
        purchaseCost: 4500,
        purchaseDate: "2024-03-10",
        expectedUsefulLife: 10,
        status: "maintenance_needed",
        assignedDepartment: "Marketing",
        createdBy: "EMP-ADMIN",
        updatedBy: "USR-UPDATE-014",
        createdAt: "2024-03-10T10:30:00Z",
      },
      {
        id: "AST-1703123456803",
        name: "UPS System",
        type: "IT Equipment",
        subtype: "Power Equipment",
        description: "Uninterruptible Power Supply 2000VA",
        purchaseFrom: "VEN-015",
        purchaseCost: 12000,
        purchaseDate: "2024-01-30",
        expectedUsefulLife: 6,
        status: "repair_needed",
        assignedDepartment: "Information Technology",
        createdBy: "EMP-ADMIN",
        updatedBy: "USR-UPDATE-015",
        createdAt: "2024-01-30T10:30:00Z",
      },
      {
        id: "AST-1703123456804",
        name: "Shredder Machine",
        type: "Miscellaneous",
        subtype: "Equipment",
        description: "Heavy duty paper shredder",
        purchaseFrom: "VEN-016",
        purchaseCost: 15000,
        purchaseDate: "2024-02-05",
        expectedUsefulLife: 7,
        status: "under_maintenance",
        assignedDepartment: "Finance",
        createdBy: "EMP-ADMIN",
        updatedBy: "USR-UPDATE-016",
        createdAt: "2024-02-05T10:30:00Z",
      },
      {
        id: "AST-1703123456805",
        name: "Water Dispenser",
        type: "Electrical Appliances",
        subtype: "Equipment",
        description: "Hot and cold water dispenser",
        purchaseFrom: "VEN-017",
        purchaseCost: 8000,
        purchaseDate: "2024-03-01",
        expectedUsefulLife: 8,
        status: "under_repair",
        assignedDepartment: "Administration",
        createdBy: "EMP-ADMIN",
        updatedBy: "USR-UPDATE-017",
        createdAt: "2024-03-01T10:30:00Z",
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
      {
        id: "MNT-1703123456790",
        assetId: "AST-1703123456789",
        maintenanceType: "Maintenance Needed",
        lastServiceDate: "2024-02-15",
        maintenancePeriod: "180 days",
        updatedMaintenanceDate: "2024-08-15",
        serviceProvider: "Dell Support Services",
        startDate: "2024-02-15",
        endDate: "2024-02-15",
        cost: 1200,
        serviceNotes: "Battery health check, system diagnostics, and software updates completed.",
        createdAt: "2024-02-15T14:30:00Z",
        createdBy: "USR-MAINT-002",
        updatedBy: "USR-MAINT-UPDATE-002",
        requestType: "maintenance",
        status: "completed",
        transactionId: "TXN-MNT-2024-002",
        paymentMethod: "Credit Card",
        paymentDate: "2024-02-15",
        invoiceNumber: "INV-DELL-2024-002",
      },
      {
        id: "MNT-1703123456791",
        assetId: "AST-1703123456790",
        maintenanceType: "Repair Needed",
        lastServiceDate: "2024-03-10",
        maintenancePeriod: "365 days",
        updatedMaintenanceDate: "2025-03-10",
        serviceProvider: "Office Furniture Solutions",
        startDate: "2024-03-10",
        endDate: "2024-03-12",
        cost: 800,
        serviceNotes: "Replaced hydraulic cylinder and cleaned all moving parts. Chair is now fully functional.",
        createdAt: "2024-03-10T09:45:00Z",
        createdBy: "USR-MAINT-003",
        updatedBy: "USR-MAINT-UPDATE-003",
        requestType: "repair",
        status: "completed",
        transactionId: "TXN-RPR-2024-003",
        paymentMethod: "Cash",
        paymentDate: "2024-03-12",
        invoiceNumber: "INV-OFS-2024-003",
      },
      {
        id: "MNT-1703123456792",
        assetId: "AST-1703123456794",
        maintenanceType: "Repair Needed",
        lastServiceDate: "2024-12-01",
        maintenancePeriod: "30 days",
        updatedMaintenanceDate: "2024-12-31",
        serviceProvider: "Furniture Repair Co.",
        startDate: "2024-12-15",
        endDate: "2024-12-20",
        serviceNotes: "Table surface needs refinishing due to water damage. Repair scheduled.",
        createdAt: "2024-12-01T10:00:00Z",
        createdBy: "USR-MAINT-004",
        updatedBy: "USR-MAINT-UPDATE-004",
        requestType: "repair",
        status: "requested",
        cost: 1500,
        transactionId: "TXN-RPR-2024-004",
        paymentMethod: "Pending",
      },
      {
        id: "MNT-1703123456793",
        assetId: "AST-1703123456795",
        maintenanceType: "Maintenance Needed",
        lastServiceDate: "2024-12-05",
        maintenancePeriod: "90 days",
        updatedMaintenanceDate: "2025-03-05",
        serviceProvider: "Dell Enterprise Support",
        startDate: "2024-12-10",
        endDate: "2024-12-12",
        serviceNotes: "Server hardware diagnostics and firmware updates in progress.",
        createdAt: "2024-12-05T10:00:00Z",
        createdBy: "USR-MAINT-005",
        updatedBy: "USR-MAINT-UPDATE-005",
        requestType: "maintenance",
        status: "in_progress",
        cost: 3500,
        transactionId: "TXN-MNT-2024-005",
        paymentMethod: "Bank Transfer",
        paymentDate: "2024-12-05",
        invoiceNumber: "INV-DELL-ENT-2024-005",
      },
      {
        id: "MNT-1703123456794",
        assetId: "AST-1703123456796",
        maintenanceType: "Repair Needed",
        lastServiceDate: "2024-12-03",
        maintenancePeriod: "180 days",
        updatedMaintenanceDate: "2025-06-03",
        serviceProvider: "AC Service Pro",
        startDate: "2024-12-08",
        endDate: "2024-12-10",
        serviceNotes: "AC unit cooling efficiency reduced. Compressor repair required.",
        createdAt: "2024-12-03T10:00:00Z",
        createdBy: "USR-MAINT-006",
        updatedBy: "USR-MAINT-UPDATE-006",
        requestType: "repair",
        status: "in_progress",
        cost: 2800,
        transactionId: "TXN-RPR-2024-006",
        paymentMethod: "Credit Card",
        paymentDate: "2024-12-03",
        invoiceNumber: "INV-ACPRO-2024-006",
      },
      {
        id: "MNT-1703123456795",
        assetId: "AST-1703123456797",
        maintenanceType: "Maintenance Needed",
        lastServiceDate: "2024-12-06",
        maintenancePeriod: "120 days",
        updatedMaintenanceDate: "2025-04-06",
        serviceProvider: "Epson Service Center",
        startDate: "2024-12-20",
        endDate: "2024-12-22",
        serviceNotes: "Projector lamp replacement and lens cleaning required.",
        createdAt: "2024-12-06T10:00:00Z",
        createdBy: "USR-MAINT-007",
        updatedBy: "USR-MAINT-UPDATE-007",
        requestType: "maintenance",
        status: "requested",
        cost: 950,
        transactionId: "TXN-MNT-2024-007",
        paymentMethod: "Pending",
      },
      // Additional maintenance records for new dummy assets
      {
        id: "MNT-1703123456796",
        assetId: "AST-1703123456798",
        maintenanceType: "Maintenance Needed",
        lastServiceDate: "2024-12-07",
        maintenancePeriod: "90 days",
        updatedMaintenanceDate: "2025-03-07",
        serviceProvider: "Canon Service Center",
        serviceNotes: "Scanner calibration and cleaning required for optimal performance.",
        createdAt: "2024-12-07T10:00:00Z",
        createdBy: "USR-MAINT-008",
        updatedBy: "USR-MAINT-UPDATE-008",
        requestType: "maintenance",
        status: "requested",
        cost: 750,
        transactionId: "TXN-MNT-2024-008",
      },
      {
        id: "MNT-1703123456797",
        assetId: "AST-1703123456799",
        maintenanceType: "Repair Needed",
        lastServiceDate: "2024-12-08",
        maintenancePeriod: "180 days",
        updatedMaintenanceDate: "2025-06-08",
        serviceProvider: "Wood Craft Repairs",
        serviceNotes: "Desk drawer mechanism needs repair and wood surface refinishing.",
        createdAt: "2024-12-08T10:00:00Z",
        createdBy: "USR-MAINT-009",
        updatedBy: "USR-MAINT-UPDATE-009",
        requestType: "repair",
        status: "requested",
        cost: 1200,
        transactionId: "TXN-RPR-2024-009",
      },
      {
        id: "MNT-1703123456798",
        assetId: "AST-1703123456800",
        maintenanceType: "Maintenance Needed",
        lastServiceDate: "2024-12-09",
        maintenancePeriod: "120 days",
        updatedMaintenanceDate: "2025-04-09",
        serviceProvider: "Network Solutions Inc",
        startDate: "2024-12-15",
        endDate: "2024-12-16",
        serviceNotes: "Network switch firmware update and port diagnostics in progress.",
        createdAt: "2024-12-09T10:00:00Z",
        createdBy: "USR-MAINT-010",
        updatedBy: "USR-MAINT-UPDATE-010",
        requestType: "maintenance",
        status: "in_progress",
        cost: 1800,
        transactionId: "TXN-MNT-2024-010",
        paymentMethod: "Bank Transfer",
        paymentDate: "2024-12-09",
        invoiceNumber: "INV-NSI-2024-010",
      },
      {
        id: "MNT-1703123456799",
        assetId: "AST-1703123456801",
        maintenanceType: "Repair Needed",
        lastServiceDate: "2024-12-10",
        maintenancePeriod: "90 days",
        updatedMaintenanceDate: "2025-03-10",
        serviceProvider: "Coffee Tech Services",
        startDate: "2024-12-12",
        endDate: "2024-12-14",
        serviceNotes: "Coffee machine heating element replacement and descaling in progress.",
        createdAt: "2024-12-10T10:00:00Z",
        createdBy: "USR-MAINT-011",
        updatedBy: "USR-MAINT-UPDATE-011",
        requestType: "repair",
        status: "in_progress",
        cost: 2200,
        transactionId: "TXN-RPR-2024-011",
        paymentMethod: "Credit Card",
        paymentDate: "2024-12-10",
        invoiceNumber: "INV-CTS-2024-011",
      },
      {
        id: "MNT-1703123456800",
        assetId: "AST-1703123456802",
        maintenanceType: "Maintenance Needed",
        lastServiceDate: "2024-12-11",
        maintenancePeriod: "180 days",
        updatedMaintenanceDate: "2025-06-11",
        serviceProvider: "Office Supplies Co",
        serviceNotes: "Whiteboard surface cleaning and marker tray replacement needed.",
        createdAt: "2024-12-11T10:00:00Z",
        createdBy: "USR-MAINT-012",
        updatedBy: "USR-MAINT-UPDATE-012",
        requestType: "maintenance",
        status: "requested",
        cost: 300,
        transactionId: "TXN-MNT-2024-012",
      },
      {
        id: "MNT-1703123456801",
        assetId: "AST-1703123456803",
        maintenanceType: "Repair Needed",
        lastServiceDate: "2024-12-12",
        maintenancePeriod: "120 days",
        updatedMaintenanceDate: "2025-04-12",
        serviceProvider: "Power Systems Ltd",
        serviceNotes: "UPS battery replacement required, backup time significantly reduced.",
        createdAt: "2024-12-12T10:00:00Z",
        createdBy: "USR-MAINT-013",
        updatedBy: "USR-MAINT-UPDATE-013",
        requestType: "repair",
        status: "requested",
        cost: 1600,
        transactionId: "TXN-RPR-2024-013",
      },
      {
        id: "MNT-1703123456802",
        assetId: "AST-1703123456804",
        maintenanceType: "Maintenance Needed",
        lastServiceDate: "2024-12-13",
        maintenancePeriod: "90 days",
        updatedMaintenanceDate: "2025-03-13",
        serviceProvider: "Office Equipment Services",
        startDate: "2024-12-18",
        endDate: "2024-12-19",
        serviceNotes: "Shredder blade sharpening and lubrication maintenance in progress.",
        createdAt: "2024-12-13T10:00:00Z",
        createdBy: "USR-MAINT-014",
        updatedBy: "USR-MAINT-UPDATE-014",
        requestType: "maintenance",
        status: "in_progress",
        cost: 650,
        transactionId: "TXN-MNT-2024-014",
        paymentMethod: "Cash",
        paymentDate: "2024-12-13",
        invoiceNumber: "INV-OES-2024-014",
      },
      {
        id: "MNT-1703123456803",
        assetId: "AST-1703123456805",
        maintenanceType: "Repair Needed",
        lastServiceDate: "2024-12-14",
        maintenancePeriod: "120 days",
        updatedMaintenanceDate: "2025-04-14",
        serviceProvider: "Aqua Tech Solutions",
        startDate: "2024-12-16",
        endDate: "2024-12-17",
        serviceNotes: "Water dispenser cooling system repair and filter replacement in progress.",
        createdAt: "2024-12-14T10:00:00Z",
        createdBy: "USR-MAINT-015",
        updatedBy: "USR-MAINT-UPDATE-015",
        requestType: "repair",
        status: "in_progress",
        cost: 1100,
        transactionId: "TXN-RPR-2024-015",
        paymentMethod: "Bank Transfer",
        paymentDate: "2024-12-14",
        invoiceNumber: "INV-ATS-2024-015",
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
      {
        id: "DEP-1703123456790",
        assetId: "AST-1703123456793",
        purchaseCost: 120000,
        purchaseDate: "2019-03-15",
        depreciationStartDate: "2019-03-15",
        depreciationType: "straight_line",
        salvageValue: 10000,
        usefulLife: 5,
        bookValue: 25000, // Current book value after depreciation
        annualDepreciation: 22000,
        notes: "Standard laptop depreciation over 5 years",
        enteredBy: "USR-DEP-002",
        createdAt: "2019-03-15T11:00:00Z",
      },
      {
        id: "DEP-1703123456791",
        assetId: "AST-1703123456790",
        purchaseCost: 8500,
        purchaseDate: "2024-02-01",
        depreciationStartDate: "2024-02-01",
        depreciationType: "written_down",
        depreciationRate: 15,
        bookValue: 7225,
        annualDepreciation: 1275,
        notes: "Office furniture depreciation using written down method",
        enteredBy: "USR-DEP-003",
        createdAt: "2024-02-01T11:00:00Z",
      },
      {
        id: "DEP-1703123456792",
        assetId: "AST-1703123456794",
        purchaseCost: 35000,
        purchaseDate: "2024-03-01",
        depreciationStartDate: "2024-03-01",
        depreciationType: "double_declining",
        usefulLife: 10,
        bookValue: 31500,
        annualDepreciation: 7000,
        notes: "Conference table depreciation using double declining method",
        enteredBy: "USR-DEP-004",
        createdAt: "2024-03-01T11:00:00Z",
      },
      {
        id: "DEP-1703123456793",
        assetId: "AST-1703123456796",
        purchaseCost: 45000,
        purchaseDate: "2024-01-10",
        depreciationStartDate: "2024-01-10",
        depreciationType: "sum_of_years",
        salvageValue: 5000,
        usefulLife: 8,
        bookValue: 40000,
        annualDepreciation: 8889,
        notes: "Air conditioner depreciation using sum of years method",
        enteredBy: "USR-DEP-005",
        createdAt: "2024-01-10T11:00:00Z",
      },
      {
        id: "DEP-1703123456794",
        assetId: "AST-1703123456801",
        purchaseCost: 35000,
        purchaseDate: "2024-02-20",
        depreciationStartDate: "2024-02-20",
        depreciationType: "unit_production",
        salvageValue: 3000,
        totalExpectedUnits: 50000,
        actualUnitsUsed: 8000,
        bookValue: 29880,
        annualDepreciation: 5120,
        notes: "Coffee machine depreciation based on usage units",
        enteredBy: "USR-DEP-006",
        createdAt: "2024-02-20T11:00:00Z",
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
    e.preventDefault()

    if (
      !assetForm.name ||
      !assetForm.type ||
      !assetForm.purchaseFrom ||
      !assetForm.purchaseCost ||
      !assetForm.purchaseDate
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    const baseAsset = {
      name: assetForm.name,
      type: assetForm.type,
      subtype: assetForm.subtype,
      description: assetForm.description,
      purchaseFrom: assetForm.purchaseFrom,
      purchaseCost: Number.parseFloat(assetForm.purchaseCost),
      purchaseDate: assetForm.purchaseDate,
      expectedUsefulLife: 5,
      status: "active",
      createdBy: currentUserId,
      updatedBy: currentUserId,
      createdAt: new Date().toISOString(),
      documents: assetForm.documents,
    }

    const newAssets = []
    for (let i = 0; i < assetForm.duplicates; i++) {
      // Add a small delay to ensure unique timestamps for each asset ID
      const uniqueId = `AST-${Date.now()}-${i + 1}`
      newAssets.push({
        ...baseAsset,
        id: uniqueId,
      })
    }

    setAssets((prev) => [...prev, ...newAssets])
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

    toast.success(`${newAssets.length} asset(s) added successfully!`)

    // If this asset was created from a transaction, remove it from entered assets
    if (isFromTransaction && assetForm.linkedReferenceId) {
      const updatedEnteredAssets = enteredAssets.filter((asset) => asset.assetId !== assetForm.linkedReferenceId)
      setEnteredAssets(updatedEnteredAssets)
      localStorage.setItem("enteredAssets", JSON.stringify(updatedEnteredAssets))
    }

    setIsFromTransaction(false)
  }

  // Function to handle asset entry from transaction
  const handleAssetFromTransaction = (assetData) => {
    // Calculate cost per unit by dividing total purchase amount by quantity
    const costPerUnit = assetData.purchaseAmount ? assetData.purchaseAmount / assetData.quantity : 0

    setAssetForm({
      name: assetData.assetName,
      type: "",
      subtype: "",
      description: `Asset from transaction ${assetData.transactionId}`,
      purchaseFrom: assetData.vendorId || "",
      purchaseCost: costPerUnit.toString(),
      purchaseDate: new Date().toISOString().split("T")[0],
      duplicates: assetData.quantity,
      linkedReferenceId: assetData.assetId,
    })
    setIsFromTransaction(true)
    setActiveTab("create")
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

  // Filter functions
  const filteredAssets = assets.filter((asset) => {
    // Only show assets with active status
    if (asset.status !== "active") return false

    const matchesSearch =
      asset.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
      asset.id.toLowerCase().includes(assetSearch.toLowerCase())
    const matchesType = assetTypeFilter === "all" || asset.type === assetTypeFilter
    const matchesAssignment =
      assetAssignmentFilter === "all" ||
      (assetAssignmentFilter === "assigned" && asset.assignedTo) ||
      (assetAssignmentFilter === "unassigned" && !asset.assignedTo)

    return matchesSearch && matchesType && matchesAssignment
  })

  const filteredDepreciation = depreciationRecords.filter((record) => {
    const asset = assets.find((a) => a.id === record.assetId)
    if (!asset) return false

    const matchesSearch =
      asset.name.toLowerCase().includes(depreciationSearch.toLowerCase()) ||
      record.id.toLowerCase().includes(depreciationSearch.toLowerCase()) ||
      asset.id.toLowerCase().includes(depreciationSearch.toLowerCase())

    const matchesType = depreciationTypeFilter === "all" || asset.type === depreciationTypeFilter

    const matchesMethod =
      depreciationMethodFilter === "all" ||
      (depreciationMethodFilter === "Straight Line Method" && record.depreciationType === "straight_line") ||
      (depreciationMethodFilter === "Written Down Method" && record.depreciationType === "written_down") ||
      (depreciationMethodFilter === "Units of Production Method" && record.depreciationType === "unit_production") ||
      (depreciationMethodFilter === "Double Declining Method" && record.depreciationType === "double_declining") ||
      (depreciationMethodFilter === "Sum-of-the-Years Digits Method" && record.depreciationType === "sum_of_years")

    return matchesSearch && matchesType && matchesMethod
  })

  const filteredDisposalAssets = assets.filter((asset) => {
    if (asset.status !== "awaiting_disposal" && asset.status !== "disposed") return false

    const matchesSearch =
      asset.name.toLowerCase().includes(disposalSearch.toLowerCase()) ||
      asset.id.toLowerCase().includes(disposalSearch.toLowerCase())

    const matchesStatus = disposalStatusFilter === "all" || asset.status === disposalStatusFilter

    const matchesType = disposalTypeFilter === "all" || asset.type === disposalTypeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const filteredMaintenanceAssets = assets.filter((asset) => {
    if (!["maintenance_needed", "repair_needed", "under_maintenance", "under_repair"].includes(asset.status))
      return false

    const matchesSearch =
      asset.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
      asset.id.toLowerCase().includes(assetSearch.toLowerCase())

    const matchesType = maintenanceTypeFilter === "all" || asset.type === maintenanceTypeFilter

    const matchesStatus = maintenanceStatusFilter === "all" || asset.status === maintenanceStatusFilter

    return matchesSearch && matchesType && matchesStatus
  })

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
              {/* Entered Assets Tab */}
              <TabsContent value="entry">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Plus className="h-5 w-5" />
                      <span>Entered Assets</span>
                    </CardTitle>
                    <CardDescription>Assets entered from purchase transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {enteredAssets.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No assets entered from transactions yet.</p>
                        <p className="text-sm text-gray-400">
                          Assets will appear here when created from purchase transactions.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {enteredAssets.map((asset) => (
                          <Card
                            key={asset.id}
                            className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500"
                          >
                            <CardContent className="p-4">
                              <div className="mb-3">
                                <h3 className="font-semibold text-lg text-blue-700">{asset.assetName}</h3>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Linked Reference ID:</span>
                                  <span className="font-medium">{asset.assetId}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Quantity:</span>
                                  <Badge variant="outline">{asset.quantity}</Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Transaction ID:</span>
                                  <span className="font-medium text-xs">{asset.transactionId}</span>
                                </div>
                                {asset.purchaseAmount && (
                                  <>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Total Amount:</span>
                                      <span className="font-medium">₹{asset.purchaseAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Cost per Unit:</span>
                                      <span className="font-medium text-green-600">
                                        ₹{(asset.purchaseAmount / asset.quantity).toLocaleString()}
                                      </span>
                                    </div>
                                  </>
                                )}
                                {asset.vendorId && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Vendor:</span>
                                    <span className="font-medium">{asset.vendorId}</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Purchase Date:</span>
                                  <span className="text-xs">{new Date(asset.createdAt).toLocaleDateString()}</span>
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
              </TabsContent>

              {/* Asset Entry Tab */}
              <TabsContent value="create">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Plus className="h-5 w-5" />
                      <span>Asset Entry</span>
                    </CardTitle>
                    <CardDescription>Add new assets to the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAssetSubmit} className="space-y-6">
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

                        {assetForm.linkedReferenceId && (
                          <div>
                            <Label htmlFor="linked-reference-id">Linked Reference ID</Label>
                            <Input
                              id="linked-reference-id"
                              value={assetForm.linkedReferenceId}
                              disabled
                              className="bg-gray-50"
                            />
                            <p className="text-xs text-gray-500 mt-1">Reference from transaction</p>
                          </div>
                        )}

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
                          {isFromTransaction && (
                            <p className="text-xs text-blue-600 mt-1">Pre-filled from transaction</p>
                          )}
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
                              {assetForm.type === "IT Equipment" && (
                                <>
                                  <SelectItem value="Laptop">Laptop</SelectItem>
                                  <SelectItem value="Desktop">Desktop</SelectItem>
                                  <SelectItem value="Monitor">Monitor</SelectItem>
                                  <SelectItem value="Printer">Printer</SelectItem>
                                  <SelectItem value="Scanner">Scanner</SelectItem>
                                  <SelectItem value="Router">Router</SelectItem>
                                  <SelectItem value="Server">Server</SelectItem>
                                  <SelectItem value="Tablet">Tablet</SelectItem>
                                  <SelectItem value="Projector">Projector</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </>
                              )}
                              {assetForm.type === "Office Furniture" && (
                                <>
                                  <SelectItem value="Chair">Chair</SelectItem>
                                  <SelectItem value="Desk">Desk</SelectItem>
                                  <SelectItem value="Conference Table">Conference Table</SelectItem>
                                  <SelectItem value="Cabinet">Cabinet</SelectItem>
                                  <SelectItem value="Bookshelf">Bookshelf</SelectItem>
                                  <SelectItem value="Partition">Partition</SelectItem>
                                  <SelectItem value="Reception Desk">Reception Desk</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </>
                              )}
                              {assetForm.type === "Machinery" && (
                                <>
                                  <SelectItem value="CNC Machine">CNC Machine</SelectItem>
                                  <SelectItem value="Lathe Machine">Lathe Machine</SelectItem>
                                  <SelectItem value="Compressor">Compressor</SelectItem>
                                  <SelectItem value="Drill Press">Drill Press</SelectItem>
                                  <SelectItem value="Packaging Machine">Packaging Machine</SelectItem>
                                  <SelectItem value="3D Printer">3D Printer</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </>
                              )}
                              {assetForm.type === "Vehicles" && (
                                <>
                                  <SelectItem value="Car">Car</SelectItem>
                                  <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                                  <SelectItem value="Truck">Truck</SelectItem>
                                  <SelectItem value="Forklift">Forklift</SelectItem>
                                  <SelectItem value="Electric Scooter">Electric Scooter</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </>
                              )}
                              {assetForm.type === "Real Estate" && (
                                <>
                                  <SelectItem value="Office Building">Office Building</SelectItem>
                                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                                  <SelectItem value="Factory">Factory</SelectItem>
                                  <SelectItem value="Retail Space">Retail Space</SelectItem>
                                  <SelectItem value="Land">Land</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </>
                              )}
                              {assetForm.type === "Electrical Appliances" && (
                                <>
                                  <SelectItem value="Air Conditioner">Air Conditioner</SelectItem>
                                  <SelectItem value="Refrigerator">Refrigerator</SelectItem>
                                  <SelectItem value="Microwave">Microwave</SelectItem>
                                  <SelectItem value="Water Purifier">Water Purifier</SelectItem>
                                  <SelectItem value="Heater">Heater</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </>
                              )}
                              {assetForm.type === "Software Licenses" && (
                                <>
                                  <SelectItem value="Operating System License">Operating System License</SelectItem>
                                  <SelectItem value="Accounting Software">Accounting Software</SelectItem>
                                  <SelectItem value="Design Software">Design Software</SelectItem>
                                  <SelectItem value="Productivity Suite">Productivity Suite</SelectItem>
                                  <SelectItem value="ERP License">ERP License</SelectItem>
                                  <SelectItem value="Antivirus Subscription">Antivirus Subscription</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </>
                              )}
                              {assetForm.type === "Miscellaneous" && (
                                <>
                                  <SelectItem value="Security Camera">Security Camera</SelectItem>
                                  <SelectItem value="Fire Extinguisher">Fire Extinguisher</SelectItem>
                                  <SelectItem value="Whiteboard">Whiteboard</SelectItem>
                                  <SelectItem value="Tool Kit">Tool Kit</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </>
                              )}
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
                          {isFromTransaction && (
                            <p className="text-xs text-blue-600 mt-1">Pre-filled from transaction</p>
                          )}
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
                          {isFromTransaction && (
                            <p className="text-xs text-blue-600 mt-1">Pre-filled from transaction</p>
                          )}
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
                              setIsFromTransaction(false)
                            }}
                            className="flex items-center space-x-2"
                          >
                            <span>Clear Form</span>
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            className="flex items-center space-x-2 bg-transparent"
                          >
                            <Copy className="h-4 w-4" />
                            <span>Duplicate</span>
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Asset List Tab */}
              <TabsContent value="list">
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
                      {filteredAssets.map((asset) => (
                        <Card key={asset.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{asset.name}</CardTitle>
                                <p className="text-sm text-gray-500">{asset.id}</p>
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
                                        Are you sure you want to delete this asset? This will also remove all related
                                        maintenance, depreciation, and disposal records.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleAssetDelete(asset.id)}
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
                              <Badge variant="outline">{asset.type}</Badge>
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
                              <span className="font-semibold">₹{asset.purchaseCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Updated By:</span>
                              <span className="text-sm font-mono">{asset.updatedBy}</span>
                            </div>
                            {asset.assignedTo && (
                              <div className="text-sm">
                                <p>
                                  <span className="text-gray-600">Assigned to:</span> {asset.assignedTo}
                                </p>
                                <p>
                                  <span className="text-gray-600">Department:</span> {asset.assignedDepartment}
                                </p>
                              </div>
                            )}

                            {/* Assignment Button */}
                            {!asset.assignedTo && (
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
                                      Assign {asset.name} ({asset.id}) to an employee
                                    </DialogDescription>
                                  </DialogHeader>
                                  <AssignmentForm
                                    assetId={asset.id}
                                    assetName={asset.name}
                                    onAssign={handleAssetAssignment}
                                  />
                                </DialogContent>
                              </Dialog>
                            )}

                            {/* Historical Maintenance Button */}
                            <HistoricalMaintenanceDialog asset={asset} maintenanceRecords={maintenanceRecords} />
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {filteredAssets.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No assets found matching your criteria.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Edit Asset Dialog */}
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
                          <Input
                            value={`₹${editingAsset.purchaseCost.toLocaleString()}`}
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
                                          prev
                                            ? { ...prev, assignedTo, assignedDepartment: department, status: "active" }
                                            : null,
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
                          }}
                        >
                          Update Asset
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </TabsContent>

              {/* Maintenance List Tab */}
              <TabsContent value="maintenance-list">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Maintenance List</span>
                    </CardTitle>
                    <CardDescription>Assets currently under maintenance or repair</CardDescription>
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

                    {/* Maintenance Assets Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredMaintenanceAssets.filter(Boolean).map((asset) => {
                        if (!asset || !asset.id) return null
                        const maintenanceRecord = maintenanceRecords.find((r) => r.assetId === asset.id)
                        if (!maintenanceRecord) return null
                        return (
                          <Card
                            key={asset.id}
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
                                  <CardTitle className="text-lg">{asset.name}</CardTitle>
                                  <p className="text-sm text-gray-500">{asset.id}</p>
                                </div>
                                {getStatusBadge(asset.status)}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Request Type:</span>
                                <Badge
                                  className={
                                    maintenanceRecord?.requestType === "repair"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800"
                                  }
                                >
                                  {maintenanceRecord?.requestType === "repair" ? "Repair" : "Maintenance"}
                                </Badge>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Request Status:</span>
                                <Badge
                                  className={
                                    maintenanceRecord?.status === "in_progress"
                                      ? "bg-blue-100 text-blue-800"
                                      : maintenanceRecord?.status === "requested"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-green-100 text-green-800"
                                  }
                                >
                                  {maintenanceRecord?.status === "in_progress"
                                    ? "In Progress"
                                    : maintenanceRecord?.status === "requested"
                                      ? "Requested"
                                      : "Completed"}
                                </Badge>
                              </div>

                              {maintenanceRecord?.serviceProvider && (
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Service Provider:</span>
                                  <span className="text-sm">{maintenanceRecord.serviceProvider}</span>
                                </div>
                              )}

                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Updated By:</span>
                                <span className="text-sm font-mono">{maintenanceRecord.updatedBy}</span>
                              </div>

                              {/* Edit Button for Service Dates */}
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
                                      <DialogDescription>
                                        Update service start and end dates for {asset.name}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Service Start Date</Label>
                                        <Input
                                          type="date"
                                          value={maintenanceRecord.startDate || ""}
                                          onChange={(e) => {
                                            setMaintenanceRecords((records) =>
                                              records.map((r) =>
                                                r.id === maintenanceRecord.id
                                                  ? { ...r, startDate: e.target.value, updatedBy: currentUserId }
                                                  : r,
                                              ),
                                            )
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <Label>Service End Date</Label>
                                        <Input
                                          type="date"
                                          value={maintenanceRecord.endDate || ""}
                                          onChange={(e) => {
                                            setMaintenanceRecords((records) =>
                                              records.map((r) =>
                                                r.id === maintenanceRecord.id
                                                  ? { ...r, endDate: e.target.value, updatedBy: currentUserId }
                                                  : r,
                                              ),
                                            )
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        onClick={() => {
                                          toast.success("Service dates updated successfully!")
                                        }}
                                      >
                                        Save Changes
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>

                              {maintenanceRecord?.startDate && (
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Start Date:</span>
                                  <span className="text-sm">
                                    {new Date(maintenanceRecord.startDate).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              {maintenanceRecord?.endDate && (
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">End Date:</span>
                                  <span className="text-sm">
                                    {new Date(maintenanceRecord.endDate).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              {maintenanceRecord?.serviceNotes && (
                                <div className="mt-3">
                                  <span className="text-sm font-medium text-gray-600">Service Notes:</span>
                                  <p className="text-sm bg-gray-50 p-2 rounded mt-1">
                                    {maintenanceRecord.serviceNotes}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>

                    {filteredMaintenanceAssets.length === 0 && (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No assets found matching your criteria.</p>
                        <p className="text-sm text-gray-400">
                          Assets will appear here when maintenance requests are submitted.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Asset Maintenance Tab */}
              <TabsContent value="maintenance">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Edit className="h-5 w-5" />
                      <span>Asset Maintenance</span>
                    </CardTitle>
                    <CardDescription>Record and track asset maintenance activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleMaintenanceSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="maintenance-id">Maintenance ID</Label>
                          <Input id="maintenance-id" value={`MNT-${Date.now()}`} disabled className="bg-gray-50" />
                        </div>

                        <div>
                          <Label htmlFor="created-by">Created By</Label>
                          <Input id="created-by" value={currentUserId} disabled className="bg-gray-50" />
                          <p className="text-xs text-gray-500 mt-1">Current user ID</p>
                        </div>

                        <div>
                          <Label htmlFor="maintenance-asset-type">Asset Type *</Label>
                          <Select
                            value={maintenanceForm.assetType}
                            onValueChange={(value) => {
                              setMaintenanceForm((prev) => ({ ...prev, assetType: value, assetId: "" }))
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
                                .filter((asset) => asset.type === maintenanceForm.assetType)
                                .map((asset) => (
                                  <SelectItem key={asset.id} value={asset.id}>
                                    {asset.id} - {asset.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="maintenance-type">Maintenance Type *</Label>
                          <Select
                            value={maintenanceForm.maintenanceType}
                            onValueChange={(value) =>
                              setMaintenanceForm((prev) => ({ ...prev, maintenanceType: value }))
                            }
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
                            onValueChange={(value) =>
                              setMaintenanceForm((prev) => ({ ...prev, maintenancePeriod: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30 days">30 days</SelectItem>
                              <SelectItem value="60 days">60 days</SelectItem>
                              <SelectItem value="90 days">90 days</SelectItem>
                              <SelectItem value="180 days">180 days</SelectItem>
                              <SelectItem value="365 days">365 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="service-provider">Service Provider Name</Label>
                          <Input
                            id="service-provider"
                            value={maintenanceForm.serviceProvider}
                            onChange={(e) =>
                              setMaintenanceForm((prev) => ({ ...prev, serviceProvider: e.target.value }))
                            }
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
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Asset Disposal Tab */}
              <TabsContent value="disposal">
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
                              setDisposalForm((prev) => ({ ...prev, assetType: value, assetSubtype: "", assetId: "" }))
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
                            onValueChange={(value) => setDisposalForm((prev) => ({ ...prev, assetSubtype: value }))}
                            disabled={!disposalForm.assetType}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select asset subtype" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAssetSubtypes(disposalForm.assetType).map((subtype) => (
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
                            disabled={!disposalForm.assetType}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select asset" />
                            </SelectTrigger>
                            <SelectContent>
                              {assets
                                .filter(
                                  (asset) =>
                                    asset.type === disposalForm.assetType &&
                                    (!disposalForm.assetSubtype || asset.subtype === disposalForm.assetSubtype) &&
                                    asset.status === "active",
                                )
                                .map((asset) => (
                                  <SelectItem key={asset.id} value={asset.id}>
                                    {asset.id} - {asset.name}
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
              </TabsContent>

              {/* Disposal List Tab */}
              <TabsContent value="disposal-list">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Disposal List</span>
                    </CardTitle>
                    <CardDescription>Assets awaiting disposal or already disposed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Search and Filters */}
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

                    {/* Disposal Assets Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredDisposalAssets.map((asset) => {
                        const disposalRequest = disposalRequests.find((r) => r.assetId === asset.id)
                        return (
                          <Card
                            key={asset.id}
                            className={`hover:shadow-md transition-shadow border-l-4 ${
                              asset.status === "disposed" ? "border-l-red-500" : "border-l-orange-500"
                            }`}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{asset.name}</CardTitle>
                                  <p className="text-sm text-gray-500">{asset.id}</p>
                                </div>
                                {getStatusBadge(asset.status)}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Type:</span>
                                <Badge variant="outline">{asset.type}</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Purchase Cost:</span>
                                <span className="font-semibold">₹{asset.purchaseCost.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Created By:</span>
                                <span className="text-sm font-mono">{disposalRequest?.createdBy}</span>
                              </div>
                              {disposalRequest && (
                                <div className="mt-3">
                                  <span className="text-sm font-medium text-gray-600">Disposal Reason:</span>
                                  <p className="text-sm bg-gray-50 p-2 rounded mt-1">{disposalRequest.reason}</p>
                                </div>
                              )}
                              {asset.status === "disposed" && disposalRequest?.saleAmount && (
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Sale Amount:</span>
                                  <span className="font-semibold text-green-600">
                                    ₹{disposalRequest.saleAmount.toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>

                    {filteredDisposalAssets.length === 0 && (
                      <div className="text-center py-8">
                        <Recycle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No assets found matching your criteria.</p>
                        <p className="text-sm text-gray-400">
                          Assets will appear here when disposal requests are submitted.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Asset Depreciation Tab */}
              <TabsContent value="depreciation">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calculator className="h-5 w-5" />
                      <span>Asset Depreciation</span>
                    </CardTitle>
                    <CardDescription>Calculate and record asset depreciation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleDepreciationSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="depreciation-id">Depreciation ID</Label>
                          <Input id="depreciation-id" value={`DEP-${Date.now()}`} disabled className="bg-gray-50" />
                        </div>

                        <div>
                          <Label htmlFor="depreciation-entered-by">Entered By</Label>
                          <Input id="depreciation-entered-by" value={currentUserId} disabled className="bg-gray-50" />
                          <p className="text-xs text-gray-500 mt-1">Current user ID</p>
                        </div>

                        <div>
                          <Label htmlFor="depreciation-asset-type">Asset Type *</Label>
                          <Select
                            value={depreciationForm.assetType}
                            onValueChange={(value) => {
                              setDepreciationForm((prev) => ({ ...prev, assetType: value, assetId: "" }))
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
                            disabled={!depreciationForm.assetType}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select asset" />
                            </SelectTrigger>
                            <SelectContent>
                              {assets
                                .filter((asset) => asset.type === depreciationForm.assetType)
                                .map((asset) => (
                                  <SelectItem key={asset.id} value={asset.id}>
                                    {asset.id} - {asset.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="depreciation-type">Depreciation Type *</Label>
                          <Select
                            value={depreciationForm.depreciationType}
                            onValueChange={(value) =>
                              setDepreciationForm((prev) => ({ ...prev, depreciationType: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select depreciation method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="straight_line">Straight Line Method</SelectItem>
                              <SelectItem value="written_down">Written Down Method</SelectItem>
                              <SelectItem value="unit_production">Units of Production Method</SelectItem>
                              <SelectItem value="double_declining">Double Declining Method</SelectItem>
                              <SelectItem value="sum_of_years">Sum-of-the-Years Digits Method</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="depreciation-start-date">Depreciation Start Date *</Label>
                          <Input
                            id="depreciation-start-date"
                            type="date"
                            value={depreciationForm.depreciationStartDate}
                            onChange={(e) =>
                              setDepreciationForm((prev) => ({ ...prev, depreciationStartDate: e.target.value }))
                            }
                            required
                          />
                        </div>

                        {/* Conditional fields based on depreciation type */}
                        {(depreciationForm.depreciationType === "straight_line" ||
                          depreciationForm.depreciationType === "sum_of_years") && (
                          <>
                            <div>
                              <Label htmlFor="salvage-value">Salvage Value</Label>
                              <Input
                                id="salvage-value"
                                type="number"
                                value={depreciationForm.salvageValue}
                                onChange={(e) =>
                                  setDepreciationForm((prev) => ({ ...prev, salvageValue: e.target.value }))
                                }
                                placeholder="Enter salvage value"
                              />
                            </div>
                            <div>
                              <Label htmlFor="useful-life">Useful Life (Years)</Label>
                              <Input
                                id="useful-life"
                                type="number"
                                value={depreciationForm.usefulLife}
                                onChange={(e) =>
                                  setDepreciationForm((prev) => ({ ...prev, usefulLife: e.target.value }))
                                }
                                placeholder="Enter useful life in years"
                              />
                            </div>
                          </>
                        )}

                        {depreciationForm.depreciationType === "written_down" && (
                          <div>
                            <Label htmlFor="depreciation-rate">Depreciation Rate (%)</Label>
                            <Input
                              id="depreciation-rate"
                              type="number"
                              value={depreciationForm.depreciationRate}
                              onChange={(e) =>
                                setDepreciationForm((prev) => ({ ...prev, depreciationRate: e.target.value }))
                              }
                              placeholder="Enter depreciation rate"
                            />
                          </div>
                        )}

                        {depreciationForm.depreciationType === "double_declining" && (
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

                        {depreciationForm.depreciationType === "unit_production" && (
                          <>
                            <div>
                              <Label htmlFor="salvage-value-up">Salvage Value</Label>
                              <Input
                                id="salvage-value-up"
                                type="number"
                                value={depreciationForm.salvageValue}
                                onChange={(e) =>
                                  setDepreciationForm((prev) => ({ ...prev, salvageValue: e.target.value }))
                                }
                                placeholder="Enter salvage value"
                              />
                            </div>
                            <div>
                              <Label htmlFor="total-expected-units">Total Expected Units</Label>
                              <Input
                                id="total-expected-units"
                                type="number"
                                value={depreciationForm.totalExpectedUnits}
                                onChange={(e) =>
                                  setDepreciationForm((prev) => ({ ...prev, totalExpectedUnits: e.target.value }))
                                }
                                placeholder="Enter total expected units"
                              />
                            </div>
                            <div>
                              <Label htmlFor="actual-units-used">Actual Units Used</Label>
                              <Input
                                id="actual-units-used"
                                type="number"
                                value={depreciationForm.actualUnitsUsed}
                                onChange={(e) =>
                                  setDepreciationForm((prev) => ({ ...prev, actualUnitsUsed: e.target.value }))
                                }
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

                      <Button type="submit" className="w-full">
                        <Calculator className="h-4 w-4 mr-2" />
                        Calculate & Record Depreciation
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Depreciation Tracking Tab */}
              <TabsContent value="tracking">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingDown className="h-5 w-5" />
                      <span>Depreciation Tracking</span>
                    </CardTitle>
                    <CardDescription>Track asset depreciation over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Search and Filters */}
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

                    {/* Depreciation Records Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredDepreciation.map((record) => {
                        const asset = assets.find((a) => a.id === record.assetId)
                        if (!asset) return null

                        const depreciationMethodName = {
                          straight_line: "Straight Line Method",
                          written_down: "Written Down Method",
                          unit_production: "Units of Production Method",
                          double_declining: "Double Declining Method",
                          sum_of_years: "Sum-of-the-Years Digits Method",
                        }[record.depreciationType]

                        return (
                          <Card
                            key={record.id}
                            className="hover:shadow-md transition-shadow border-l-4 border-l-green-500"
                          >
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{asset.name}</CardTitle>
                                  <p className="text-sm text-gray-500">{asset.id}</p>
                                </div>
                                <Badge variant="outline">{asset.type}</Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Depreciation Method:</span>
                                <Badge className="bg-blue-100 text-blue-800 text-xs">{depreciationMethodName}</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Purchase Cost:</span>
                                <span className="font-semibold">₹{record.purchaseCost.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Current Book Value:</span>
                                <span className="font-semibold text-green-600">
                                  ₹{record.bookValue.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Annual Depreciation:</span>
                                <span className="font-semibold text-red-600">
                                  ₹{record.annualDepreciation.toLocaleString()}
                                </span>
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
                              {record.usefulLife && (
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Useful Life:</span>
                                  <span className="text-sm">{record.usefulLife} years</span>
                                </div>
                              )}
                              {record.depreciationRate && (
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Depreciation Rate:</span>
                                  <span className="text-sm">{record.depreciationRate}%</span>
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
                        )
                      })}
                    </div>

                    {filteredDepreciation.length === 0 && (
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
