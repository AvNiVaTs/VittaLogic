"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Upload,
  Calculator,
  TrendingDown,
  Recycle,
  History,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Types
interface Asset {
  id: string
  name: string
  type: string
  subtype: string
  description?: string
  purchaseFrom: string
  purchaseCost: number
  purchaseDate: string
  expectedUsefulLife: number
  status:
    | "unassigned"
    | "active"
    | "maintenance_needed"
    | "repair_needed"
    | "under_maintenance"
    | "disposed"
    | "unoperational"
  assignedTo?: string
  assignedDepartment?: string
  documents?: string[]
  createdBy: string
  createdAt: string
}

interface Maintenance {
  id: string
  assetId: string
  maintenanceType: string
  lastServiceDate: string
  maintenancePeriod: string
  updatedMaintenanceDate: string
  serviceProvider?: string
  amcProvider?: string // Keep for backward compatibility
  startDate?: string
  endDate?: string
  amcStartDate?: string // Keep for backward compatibility
  amcEndDate?: string // Keep for backward compatibility
  cost: number
  serviceNotes?: string
  documents?: string[]
  createdAt: string
}

interface Depreciation {
  id: string
  assetId: string
  purchaseCost: number
  purchaseDate: string
  depreciationStartDate: string
  depreciationType: string
  salvageValue?: number
  usefulLife?: number
  depreciationRate?: number
  totalExpectedUnits?: number
  actualUnitsUsed?: number
  bookValue: number
  annualDepreciation: number
  notes?: string
  createdAt: string
}

interface Disposal {
  id: string
  assetId: string
  disposalAmount: number
  purchaseAmount: number
  profitLossAmount: number
  status: "profit" | "loss"
  buyerInfo?: string
  reason?: string
  attachments?: string[]
  createdAt: string
}

// Assignment Form Component
function AssignmentForm({
  assetId,
  assetName,
  onAssign,
}: {
  assetId: string
  assetName: string
  onAssign: (assetId: string, assignedTo: string, department: string) => void
}) {
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock departments data (this would come from your department service)
  const departments = [
    {
      id: "DEPT_1703123456789",
      name: "Human Resources",
      roles: [
        { name: "HR Manager", employees: [{ id: "EMP001", name: "John Doe" }] },
        { name: "HR Executive", employees: [{ id: "EMP002", name: "Jane Smith" }] },
        { name: "Recruiter", employees: [{ id: "EMP003", name: "Mike Johnson" }] },
      ],
    },
    {
      id: "DEPT_1703123456790",
      name: "Information Technology",
      roles: [
        { name: "IT Manager", employees: [{ id: "EMP004", name: "Sarah Wilson" }] },
        {
          name: "Software Developer",
          employees: [
            { id: "EMP005", name: "David Brown" },
            { id: "EMP006", name: "Lisa Davis" },
          ],
        },
        { name: "System Admin", employees: [{ id: "EMP007", name: "Tom Anderson" }] },
      ],
    },
    {
      id: "DEPT_1703123456791",
      name: "Finance",
      roles: [
        { name: "Finance Manager", employees: [{ id: "EMP008", name: "Emily Johnson" }] },
        {
          name: "Accountant",
          employees: [
            { id: "EMP009", name: "Robert Lee" },
            { id: "EMP010", name: "Maria Garcia" },
          ],
        },
      ],
    },
    {
      id: "DEPT_1703123456792",
      name: "Marketing",
      roles: [
        { name: "Marketing Manager", employees: [{ id: "EMP011", name: "Alex Chen" }] },
        { name: "Digital Marketer", employees: [{ id: "EMP012", name: "Jessica Taylor" }] },
      ],
    },
  ]

  const selectedDepartmentData = departments.find((dept) => dept.name === selectedDepartment)
  const selectedRoleData = selectedDepartmentData?.roles.find((role) => role.name === selectedRole)

  const handleSubmit = async () => {
    if (!selectedDepartment || !selectedRole || !selectedEmployee) {
      toast.error("Please select department, role, and employee")
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
      setSelectedRole("")
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
            setSelectedRole("")
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
        <Label htmlFor="role">Role *</Label>
        <Select
          value={selectedRole}
          onValueChange={(value) => {
            setSelectedRole(value)
            setSelectedEmployee("")
          }}
          disabled={!selectedDepartment}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {selectedDepartmentData?.roles.map((role) => (
              <SelectItem key={role.name} value={role.name}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="employee">Employee *</Label>
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee} disabled={!selectedRole}>
          <SelectTrigger>
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            {selectedRoleData?.employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.id} - {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedDepartment && selectedRole && selectedEmployee && (
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
              <span className="font-medium">Role:</span> {selectedRole}
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
          disabled={!selectedDepartment || !selectedRole || !selectedEmployee || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Assigning..." : "Assign Asset"}
        </Button>
      </DialogFooter>
    </div>
  )
}

// Historical Maintenance Dialog Component
function HistoricalMaintenanceDialog({
  asset,
  maintenanceRecords,
}: {
  asset: Asset
  maintenanceRecords: Maintenance[]
}) {
  const assetMaintenanceHistory = maintenanceRecords.filter((record) => record.assetId === asset.id)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-full mt-2 bg-transparent">
          <History className="h-4 w-4 mr-2" />
          Historical Maintenance
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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
                  Total Cost: ₹{assetMaintenanceHistory.reduce((sum, record) => sum + record.cost, 0).toLocaleString()}
                </Badge>
              </div>

              {assetMaintenanceHistory
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((record) => (
                  <Card key={record.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <h5 className="font-medium text-sm text-gray-600 mb-1">Maintenance Details</h5>
                          <p className="font-semibold">{record.id}</p>
                          <Badge className="mt-1">{record.maintenanceType}</Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            Created: {new Date(record.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div>
                          <h5 className="font-medium text-sm text-gray-600 mb-1">Service Provider</h5>
                          <p className="text-sm">{record.serviceProvider || record.amcProvider || "Not specified"}</p>
                          <h5 className="font-medium text-sm text-gray-600 mb-1 mt-3">Service Dates</h5>
                          <p className="text-sm">
                            <span className="font-medium">Last Service:</span> {record.lastServiceDate}
                          </p>
                          {(record.startDate || record.amcStartDate) && (
                            <p className="text-sm">
                              <span className="font-medium">Start Date:</span> {record.startDate || record.amcStartDate}
                            </p>
                          )}
                          {(record.endDate || record.amcEndDate) && (
                            <p className="text-sm">
                              <span className="font-medium">End Date:</span> {record.endDate || record.amcEndDate}
                            </p>
                          )}
                          {record.updatedMaintenanceDate && (
                            <p className="text-sm">
                              <span className="font-medium">Next Due:</span> {record.updatedMaintenanceDate}
                            </p>
                          )}
                        </div>

                        <div>
                          <h5 className="font-medium text-sm text-gray-600 mb-1">Cost & Period</h5>
                          <p className="text-lg font-bold text-green-600">₹{record.cost.toLocaleString()}</p>
                          {record.maintenancePeriod && (
                            <p className="text-sm">
                              <span className="font-medium">Period:</span> {record.maintenancePeriod}
                            </p>
                          )}
                        </div>
                      </div>

                      {record.serviceNotes && (
                        <div className="mt-4 pt-4 border-t">
                          <h5 className="font-medium text-sm text-gray-600 mb-1">Service Notes</h5>
                          <p className="text-sm bg-gray-50 p-3 rounded">{record.serviceNotes}</p>
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
  const [assets, setAssets] = useState<Asset[]>([])
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>([])
  const [depreciationRecords, setDepreciationRecords] = useState<Depreciation[]>([])
  const [disposalRecords, setDisposalRecords] = useState<Disposal[]>([])

  // Search and filter states
  const [assetSearch, setAssetSearch] = useState("")
  const [assetStatusFilter, setAssetStatusFilter] = useState("all")
  const [assetAssignmentFilter, setAssetAssignmentFilter] = useState("all")
  const [depreciationSearch, setDepreciationSearch] = useState("")

  // Form states
  const [assetForm, setAssetForm] = useState({
    name: "",
    type: "",
    subtype: "",
    description: "",
    purchaseFrom: "",
    purchaseCost: "",
    purchaseDate: "",
    expectedUsefulLife: "",
    duplicates: 1,
    linkedReferenceId: "",
  })

  const [maintenanceForm, setMaintenanceForm] = useState({
    assetType: "",
    assetId: "",
    maintenanceType: "",
    lastServiceDate: "",
    maintenancePeriod: "",
    serviceProvider: "",
    startDate: "",
    endDate: "",
    cost: "",
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
    assetId: "",
    disposalAmount: "",
    buyerInfo: "",
    reason: "",
  })

  // Edit states
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null)
  const [editingDepreciation, setEditingDepreciation] = useState<Depreciation | null>(null)
  const [editingDisposal, setEditingDisposal] = useState<Disposal | null>(null)

  // New state for entered assets
  const [enteredAssets, setEnteredAssets] = useState([])

  // Add this new state after the other states
  const [isFromTransaction, setIsFromTransaction] = useState(false)

  // Mock data initialization
  useEffect(() => {
    const mockAssets: Asset[] = [
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
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "AST-1703123456790",
        name: "Office Chair",
        type: "Furniture",
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
        createdAt: "2024-02-01T14:20:00Z",
      },
      {
        id: "AST-1703123456791",
        name: "Printer",
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
        createdAt: "2024-01-20T09:15:00Z",
      },
    ]

    const mockMaintenance: Maintenance[] = [
      {
        id: "MNT-1703123456789",
        assetId: "AST-1703123456791",
        maintenanceType: "AMC",
        lastServiceDate: "2024-01-20",
        maintenancePeriod: "90 days",
        updatedMaintenanceDate: "2024-04-20",
        serviceProvider: "HP Service Center",
        amcProvider: "HP Service Center", // Keep for backward compatibility
        startDate: "2024-01-20",
        endDate: "2025-01-20",
        amcStartDate: "2024-01-20", // Keep for backward compatibility
        amcEndDate: "2025-01-20", // Keep for backward compatibility
        cost: 2500,
        serviceNotes: "Regular maintenance and toner replacement. Cleaned internal components and updated firmware.",
        createdAt: "2024-01-20T10:00:00Z",
      },
      {
        id: "MNT-1703123456790",
        assetId: "AST-1703123456789",
        maintenanceType: "Routine Check",
        lastServiceDate: "2024-02-15",
        maintenancePeriod: "180 days",
        updatedMaintenanceDate: "2024-08-15",
        serviceProvider: "Dell Support Services",
        startDate: "2024-02-15",
        endDate: "2024-02-15",
        cost: 1200,
        serviceNotes: "Battery health check, system diagnostics, and software updates completed.",
        createdAt: "2024-02-15T14:30:00Z",
      },
      {
        id: "MNT-1703123456791",
        assetId: "AST-1703123456790",
        maintenanceType: "Repair",
        lastServiceDate: "2024-03-10",
        maintenancePeriod: "365 days",
        updatedMaintenanceDate: "2025-03-10",
        serviceProvider: "Office Furniture Solutions",
        startDate: "2024-03-10",
        endDate: "2024-03-12",
        cost: 800,
        serviceNotes: "Replaced hydraulic cylinder and cleaned all moving parts. Chair is now fully functional.",
        createdAt: "2024-03-10T09:45:00Z",
      },
    ]

    const mockDepreciation: Depreciation[] = [
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
        createdAt: "2024-01-15T11:00:00Z",
      },
    ]

    setAssets(mockAssets)
    setMaintenanceRecords(mockMaintenance)
    setDepreciationRecords(mockDepreciation)

    // Load entered assets from localStorage
    const savedEnteredAssets = JSON.parse(localStorage.getItem("enteredAssets") || "[]")
    setEnteredAssets(savedEnteredAssets)
  }, [])

  // Utility functions
  const generateId = (prefix: string, suffix?: string) => {
    const timestamp = Date.now()
    return suffix ? `${prefix}-${timestamp}-${suffix}` : `${prefix}-${timestamp}`
  }

  const calculateDepreciation = (form: any, purchaseCost: number, depreciationStartDate: string) => {
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
  const handleAssetSubmit = (e: React.FormEvent) => {
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
      expectedUsefulLife: Number.parseInt(assetForm.expectedUsefulLife) || 5,
      status: "unassigned" as const,
      createdBy: "EMP-CURRENT",
      createdAt: new Date().toISOString(),
    }

    const newAssets: Asset[] = []
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
      expectedUsefulLife: "",
      duplicates: 1,
      linkedReferenceId: "",
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
  const handleAssetFromTransaction = (assetData: any) => {
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
      expectedUsefulLife: "",
      duplicates: assetData.quantity,
      linkedReferenceId: assetData.assetId,
    })
    setIsFromTransaction(true)
    setActiveTab("create")
  }

  // Function to remove an asset from entered assets after it's been processed
  const handleRemoveEnteredAsset = (assetId: string) => {
    const updatedAssets = enteredAssets.filter((asset) => asset.id !== assetId)
    setEnteredAssets(updatedAssets)
    localStorage.setItem("enteredAssets", JSON.stringify(updatedAssets))
  }

  // Asset List Functions
  const handleAssetAssignment = (assetId: string, assignedTo: string, department: string) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === assetId
          ? { ...asset, assignedTo, assignedDepartment: department, status: "active" as const }
          : asset,
      ),
    )
    toast.success("Asset assigned successfully!")
  }

  const handleAssetEdit = (asset: Asset) => {
    setEditingAsset(asset)
  }

  const handleAssetUpdate = (updatedAsset: Asset) => {
    setAssets((prev) => prev.map((asset) => (asset.id === updatedAsset.id ? updatedAsset : asset)))
    setEditingAsset(null)
    toast.success("Asset updated successfully!")
  }

  const handleAssetDelete = (assetId: string) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== assetId))
    // Also remove related records
    setMaintenanceRecords((prev) => prev.filter((record) => record.assetId !== assetId))
    setDepreciationRecords((prev) => prev.filter((record) => record.assetId !== assetId))
    setDisposalRecords((prev) => prev.filter((record) => record.assetId !== assetId))
    toast.success("Asset and related records deleted successfully!")
  }

  // Maintenance Functions
  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!maintenanceForm.assetId || !maintenanceForm.maintenanceType || !maintenanceForm.lastServiceDate) {
      toast.error("Please fill in all required fields")
      return
    }

    const newMaintenance: Maintenance = {
      id: generateId("MNT"),
      assetId: maintenanceForm.assetId,
      maintenanceType: maintenanceForm.maintenanceType,
      lastServiceDate: maintenanceForm.lastServiceDate,
      maintenancePeriod: maintenanceForm.maintenancePeriod,
      updatedMaintenanceDate: calculateNextMaintenanceDate(
        maintenanceForm.lastServiceDate,
        maintenanceForm.maintenancePeriod,
      ),
      serviceProvider: maintenanceForm.serviceProvider,
      startDate: maintenanceForm.startDate,
      endDate: maintenanceForm.endDate,
      cost: Number.parseFloat(maintenanceForm.cost) || 0,
      serviceNotes: maintenanceForm.serviceNotes,
      createdAt: new Date().toISOString(),
    }

    setMaintenanceRecords((prev) => [...prev, newMaintenance])

    // Update asset status
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === maintenanceForm.assetId ? { ...asset, status: "under_maintenance" as const } : asset,
      ),
    )

    setMaintenanceForm({
      assetType: "",
      assetId: "",
      maintenanceType: "",
      lastServiceDate: "",
      maintenancePeriod: "",
      serviceProvider: "",
      startDate: "",
      endDate: "",
      cost: "",
      serviceNotes: "",
    })

    toast.success("Maintenance record added successfully!")
  }

  const calculateNextMaintenanceDate = (lastDate: string, period: string) => {
    const date = new Date(lastDate)
    const days = Number.parseInt(period.split(" ")[0])
    date.setDate(date.getDate() + days)
    return date.toISOString().split("T")[0]
  }

  // Depreciation Functions
  const handleDepreciationSubmit = (e: React.FormEvent) => {
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

    const newDepreciation: Depreciation = {
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
  const handleDisposalSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!disposalForm.assetId || !disposalForm.disposalAmount) {
      toast.error("Please fill in all required fields")
      return
    }

    const asset = assets.find((a) => a.id === disposalForm.assetId)
    if (!asset) {
      toast.error("Asset not found")
      return
    }

    const disposalAmount = Number.parseFloat(disposalForm.disposalAmount)
    const purchaseAmount = asset.purchaseCost
    const profitLossAmount = disposalAmount - purchaseAmount

    const newDisposal: Disposal = {
      id: generateId("DIS"),
      assetId: disposalForm.assetId,
      disposalAmount,
      purchaseAmount,
      profitLossAmount,
      status: profitLossAmount >= 0 ? "profit" : "loss",
      buyerInfo: disposalForm.buyerInfo,
      reason: disposalForm.reason,
      attachments: [], // This would be populated with actual file uploads
      createdAt: new Date().toISOString(),
    }

    setDisposalRecords((prev) => [...prev, newDisposal])

    // Update asset status to disposed
    setAssets((prev) => prev.map((a) => (a.id === disposalForm.assetId ? { ...a, status: "disposed" as const } : a)))

    setDisposalForm({
      assetId: "",
      disposalAmount: "",
      buyerInfo: "",
      reason: "",
    })

    toast.success("Asset disposal recorded successfully!")
  }

  // Filter functions
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
      asset.id.toLowerCase().includes(assetSearch.toLowerCase())
    const matchesStatus = assetStatusFilter === "all" || asset.status === assetStatusFilter
    const matchesAssignment =
      assetAssignmentFilter === "all" ||
      (assetAssignmentFilter === "assigned" && asset.assignedTo) ||
      (assetAssignmentFilter === "unassigned" && !asset.assignedTo)

    return matchesSearch && matchesStatus && matchesAssignment
  })

  const filteredDepreciation = depreciationRecords.filter((record) => {
    const asset = assets.find((a) => a.id === record.assetId)
    return (
      asset &&
      (asset.name.toLowerCase().includes(depreciationSearch.toLowerCase()) ||
        record.id.toLowerCase().includes(depreciationSearch.toLowerCase()) ||
        asset.id.toLowerCase().includes(depreciationSearch.toLowerCase()))
    )
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      unassigned: { color: "bg-gray-500", text: "Unassigned" },
      active: { color: "bg-green-500", text: "Active" },
      maintenance_needed: { color: "bg-yellow-500", text: "Maintenance Needed" },
      repair_needed: { color: "bg-orange-500", text: "Repair Needed" },
      under_maintenance: { color: "bg-purple-500", text: "Under Maintenance" },
      disposed: { color: "bg-red-500", text: "Disposed" },
      unoperational: { color: "bg-gray-700", text: "Unoperational" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.unassigned
    return <Badge className={`${config.color} text-white`}>{config.text}</Badge>
  }

  const getAssignmentStatusBadge = (asset: Asset) => {
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
                    <TabsTrigger value="maintenance" className="justify-start data-[state=active]:bg-blue-100">
                      <Edit className="h-4 w-4 mr-2" />
                      Asset Maintenance
                    </TabsTrigger>
                    <TabsTrigger value="disposal" className="justify-start data-[state=active]:bg-blue-100">
                      <Recycle className="h-4 w-4 mr-2" />
                      Asset Disposal
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
                                  <span className="text-gray-600">Asset ID:</span>
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
                                  <span className="text-gray-600">Created:</span>
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
                            onValueChange={(value) => setAssetForm((prev) => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select asset type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                              <SelectItem value="Furniture">Furniture</SelectItem>
                              <SelectItem value="Machinery">Machinery</SelectItem>
                              <SelectItem value="Vehicle">Vehicle</SelectItem>
                              <SelectItem value="Building">Building</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="asset-subtype">Asset Subtype</Label>
                          <Select
                            value={assetForm.subtype}
                            onValueChange={(value) => setAssetForm((prev) => ({ ...prev, subtype: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select asset subtype" />
                            </SelectTrigger>
                            <SelectContent>
                              {assetForm.type === "IT Equipment" && (
                                <>
                                  <SelectItem value="Laptop">Laptop</SelectItem>
                                  <SelectItem value="Desktop">Desktop</SelectItem>
                                  <SelectItem value="Printer">Printer</SelectItem>
                                  <SelectItem value="Server">Server</SelectItem>
                                  <SelectItem value="Network Equipment">Network Equipment</SelectItem>
                                </>
                              )}
                              {assetForm.type === "Furniture" && (
                                <>
                                  <SelectItem value="Desk">Desk</SelectItem>
                                  <SelectItem value="Chair">Chair</SelectItem>
                                  <SelectItem value="Cabinet">Cabinet</SelectItem>
                                  <SelectItem value="Table">Table</SelectItem>
                                </>
                              )}
                              {assetForm.type === "Machinery" && (
                                <>
                                  <SelectItem value="Production">Production</SelectItem>
                                  <SelectItem value="Testing">Testing</SelectItem>
                                  <SelectItem value="Packaging">Packaging</SelectItem>
                                </>
                              )}
                              {assetForm.type === "Vehicle" && (
                                <>
                                  <SelectItem value="Car">Car</SelectItem>
                                  <SelectItem value="Truck">Truck</SelectItem>
                                  <SelectItem value="Van">Van</SelectItem>
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
                          <Label htmlFor="useful-life">Expected Useful Life (Years)</Label>
                          <Input
                            id="useful-life"
                            type="number"
                            value={assetForm.expectedUsefulLife}
                            onChange={(e) => setAssetForm((prev) => ({ ...prev, expectedUsefulLife: e.target.value }))}
                            placeholder="Enter useful life in years"
                          />
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
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-400">PDF, DOC, JPG, PNG up to 10MB</p>
                        </div>
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
                                expectedUsefulLife: "",
                                duplicates: 1,
                                linkedReferenceId: "",
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
                      <Select value={assetStatusFilter} onValueChange={setAssetStatusFilter}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="maintenance_needed">Maintenance Needed</SelectItem>
                          <SelectItem value="repair_needed">Repair Needed</SelectItem>
                          <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                          <SelectItem value="disposed">Disposed</SelectItem>
                          <SelectItem value="unoperational">Unoperational</SelectItem>
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
                    <DialogContent>
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
                          <Select
                            value={editingAsset.status}
                            onValueChange={(value) =>
                              setEditingAsset((prev) => (prev ? { ...prev, status: value as Asset["status"] } : null))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">Unassigned</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="maintenance_needed">Maintenance Needed</SelectItem>
                              <SelectItem value="repair_needed">Repair Needed</SelectItem>
                              <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                              <SelectItem value="disposed">Disposed</SelectItem>
                              <SelectItem value="unoperational">Unoperational</SelectItem>
                            </SelectContent>
                          </Select>
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
                              <SelectItem value="Furniture">Furniture</SelectItem>
                              <SelectItem value="Machinery">Machinery</SelectItem>
                              <SelectItem value="Vehicle">Vehicle</SelectItem>
                              <SelectItem value="Building">Building</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
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
                              <SelectItem value="AMC">AMC (Annual Maintenance Contract)</SelectItem>
                              <SelectItem value="Routine Check">Routine Check</SelectItem>
                              <SelectItem value="Repair">Repair</SelectItem>
                              <SelectItem value="Replacement">Replacement</SelectItem>
                              <SelectItem value="Upgrade">Upgrade</SelectItem>
                              <SelectItem value="Calibration">Calibration</SelectItem>
                              <SelectItem value="Cleaning">Cleaning</SelectItem>
                              <SelectItem value="Inspection">Inspection</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="last-service-date">Last Service Date *</Label>
                          <Input
                            id="last-service-date"
                            type="date"
                            value={maintenanceForm.lastServiceDate}
                            onChange={(e) =>
                              setMaintenanceForm((prev) => ({ ...prev, lastServiceDate: e.target.value }))
                            }
                            required
                          />
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

                        <div>
                          <Label htmlFor="maintenance-cost">Maintenance Cost</Label>
                          <Input
                            id="maintenance-cost"
                            type="number"
                            value={maintenanceForm.cost}
                            onChange={(e) => setMaintenanceForm((prev) => ({ ...prev, cost: e.target.value }))}
                            placeholder="Enter maintenance cost"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="service-notes">Service Notes</Label>
                        <Textarea
                          id="service-notes"
                          value={maintenanceForm.serviceNotes}
                          onChange={(e) => setMaintenanceForm((prev) => ({ ...prev, serviceNotes: e.target.value }))}
                          placeholder="Enter service notes and observations"
                          rows={3}
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Maintenance Record
                      </Button>
                    </form>

                    {/* Maintenance Records List */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Recent Maintenance Records</h3>
                      <div className="space-y-4">
                        {maintenanceRecords
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .slice(0, 5)
                          .map((record) => {
                            const asset = assets.find((a) => a.id === record.assetId)
                            return (
                              <Card key={record.id} className="border-l-4 border-l-green-500">
                                <CardContent className="pt-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h4 className="font-semibold">{record.id}</h4>
                                      <p className="text-sm text-gray-600">
                                        {asset?.name} ({record.assetId})
                                      </p>
                                    </div>
                                    <Badge>{record.maintenanceType}</Badge>
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Service Date:</span>
                                      <p>{record.lastServiceDate}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Provider:</span>
                                      <p>{record.serviceProvider || "Not specified"}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Cost:</span>
                                      <p>₹{record.cost.toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Next Due:</span>
                                      <p>{record.updatedMaintenanceDate}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                      </div>
                    </div>
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
                    <CardDescription>Record asset disposal and calculate profit/loss</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleDisposalSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="disposal-id">Disposal ID</Label>
                          <Input id="disposal-id" value={`DIS-${Date.now()}`} disabled className="bg-gray-50" />
                        </div>

                        <div>
                          <Label htmlFor="disposal-asset-id">Asset ID *</Label>
                          <Select
                            value={disposalForm.assetId}
                            onValueChange={(value) => setDisposalForm((prev) => ({ ...prev, assetId: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select asset to dispose" />
                            </SelectTrigger>
                            <SelectContent>
                              {assets
                                .filter((asset) => asset.status !== "disposed")
                                .map((asset) => (
                                  <SelectItem key={asset.id} value={asset.id}>
                                    {asset.id} - {asset.name} (₹{asset.purchaseCost.toLocaleString()})
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="disposal-amount">Disposal Amount *</Label>
                          <Input
                            id="disposal-amount"
                            type="number"
                            value={disposalForm.disposalAmount}
                            onChange={(e) => setDisposalForm((prev) => ({ ...prev, disposalAmount: e.target.value }))}
                            placeholder="Enter disposal amount"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="buyer-info">Buyer Information</Label>
                          <Input
                            id="buyer-info"
                            value={disposalForm.buyerInfo}
                            onChange={(e) => setDisposalForm((prev) => ({ ...prev, buyerInfo: e.target.value }))}
                            placeholder="Enter buyer details"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="disposal-reason">Disposal Reason</Label>
                        <Textarea
                          id="disposal-reason"
                          value={disposalForm.reason}
                          onChange={(e) => setDisposalForm((prev) => ({ ...prev, reason: e.target.value }))}
                          placeholder="Enter reason for disposal"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Attachment (Optional)</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload disposal documents</p>
                          <p className="text-xs text-gray-400">PDF, DOC, JPG, PNG up to 10MB</p>
                        </div>
                      </div>

                      {/* Profit/Loss Preview */}
                      {disposalForm.assetId && disposalForm.disposalAmount && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2">Disposal Summary</h4>
                          {(() => {
                            const asset = assets.find((a) => a.id === disposalForm.assetId)
                            const disposalAmount = Number.parseFloat(disposalForm.disposalAmount)
                            const purchaseAmount = asset?.purchaseCost || 0
                            const profitLoss = disposalAmount - purchaseAmount
                            const isProfit = profitLoss >= 0

                            return (
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Purchase Amount:</span>
                                  <span>₹{purchaseAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Disposal Amount:</span>
                                  <span>₹{disposalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                  <span>{isProfit ? "Profit:" : "Loss:"}</span>
                                  <span className={isProfit ? "text-green-600" : "text-red-600"}>
                                    ₹{Math.abs(profitLoss).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            )
                          })()}
                        </div>
                      )}

                      <Button type="submit" className="w-full">
                        <Recycle className="h-4 w-4 mr-2" />
                        Record Disposal
                      </Button>
                    </form>

                    {/* Disposal Records List */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Recent Disposal Records</h3>
                      <div className="space-y-4">
                        {disposalRecords
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map((record) => {
                            const asset = assets.find((a) => a.id === record.assetId)
                            return (
                              <Card
                                key={record.id}
                                className={`border-l-4 ${
                                  record.status === "profit" ? "border-l-green-500" : "border-l-red-500"
                                }`}
                              >
                                <CardContent className="pt-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h4 className="font-semibold">{record.id}</h4>
                                      <p className="text-sm text-gray-600">
                                        {asset?.name} ({record.assetId})
                                      </p>
                                    </div>
                                    <Badge className={record.status === "profit" ? "bg-green-500" : "bg-red-500"}>
                                      {record.status === "profit" ? "Profit" : "Loss"}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Purchase:</span>
                                      <p>₹{record.purchaseAmount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Disposal:</span>
                                      <p>₹{record.disposalAmount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        {record.status === "profit" ? "Profit:" : "Loss:"}
                                      </span>
                                      <p className={record.status === "profit" ? "text-green-600" : "text-red-600"}>
                                        ₹{Math.abs(record.profitLossAmount).toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Date:</span>
                                      <p>{new Date(record.createdAt).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  {record.buyerInfo && (
                                    <div className="mt-2 text-sm">
                                      <span className="font-medium">Buyer:</span> {record.buyerInfo}
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            )
                          })}
                      </div>
                    </div>
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
                              <SelectItem value="Furniture">Furniture</SelectItem>
                              <SelectItem value="Machinery">Machinery</SelectItem>
                              <SelectItem value="Vehicle">Vehicle</SelectItem>
                              <SelectItem value="Building">Building</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
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
                                    {asset.id} - {asset.name} (₹{asset.purchaseCost.toLocaleString()})
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
                              <SelectItem value="written_down">Written Down Value Method</SelectItem>
                              <SelectItem value="unit_production">Unit of Production Method</SelectItem>
                              <SelectItem value="double_declining">Double Declining Balance</SelectItem>
                              <SelectItem value="sum_of_years">Sum of Years Digits</SelectItem>
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
                                placeholder="Enter useful life"
                              />
                            </div>
                          </>
                        )}

                        {(depreciationForm.depreciationType === "written_down" ||
                          depreciationForm.depreciationType === "double_declining") && (
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

                        {depreciationForm.depreciationType === "unit_production" && (
                          <>
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

                      {/* Depreciation Preview */}
                      {depreciationForm.assetId &&
                        depreciationForm.depreciationType &&
                        depreciationForm.depreciationStartDate && (
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium mb-2">Depreciation Preview</h4>
                            {(() => {
                              const asset = assets.find((a) => a.id === depreciationForm.assetId)
                              if (!asset) return null

                              const { annualDepreciation, bookValue } = calculateDepreciation(
                                depreciationForm,
                                asset.purchaseCost,
                                depreciationForm.depreciationStartDate,
                              )

                              return (
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Purchase Cost:</span>
                                    <span>₹{asset.purchaseCost.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Annual Depreciation:</span>
                                    <span>₹{annualDepreciation.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between font-semibold">
                                    <span>Current Book Value:</span>
                                    <span className="text-blue-600">₹{bookValue.toLocaleString()}</span>
                                  </div>
                                </div>
                              )
                            })()}
                          </div>
                        )}

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
                    <CardDescription>Track and monitor asset depreciation over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Search */}
                    <div className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search by asset name, ID, or depreciation ID..."
                          value={depreciationSearch}
                          onChange={(e) => setDepreciationSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Depreciation Records */}
                    <div className="space-y-4">
                      {filteredDepreciation.map((record) => {
                        const asset = assets.find((a) => a.id === record.assetId)
                        if (!asset) return null

                        return (
                          <Card key={record.id} className="border-l-4 border-l-purple-500">
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="font-semibold text-lg">{asset.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    {record.id} • {asset.id}
                                  </p>
                                  <Badge className="mt-1">
                                    {record.depreciationType.replace("_", " ").toUpperCase()}
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-purple-600">
                                    ₹{record.bookValue.toLocaleString()}
                                  </p>
                                  <p className="text-sm text-gray-500">Current Book Value</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-600">Purchase Cost:</span>
                                  <p className="font-semibold">₹{record.purchaseCost.toLocaleString()}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-600">Annual Depreciation:</span>
                                  <p className="font-semibold text-red-600">
                                    ₹{record.annualDepreciation.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-600">Purchase Date:</span>
                                  <p>{new Date(record.purchaseDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-600">Depreciation Start:</span>
                                  <p>{new Date(record.depreciationStartDate).toLocaleDateString()}</p>
                                </div>
                              </div>

                              {/* Additional details based on depreciation type */}
                              <div className="mt-4 pt-4 border-t">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  {record.salvageValue && (
                                    <div>
                                      <span className="font-medium text-gray-600">Salvage Value:</span>
                                      <p>₹{record.salvageValue.toLocaleString()}</p>
                                    </div>
                                  )}
                                  {record.usefulLife && (
                                    <div>
                                      <span className="font-medium text-gray-600">Useful Life:</span>
                                      <p>{record.usefulLife} years</p>
                                    </div>
                                  )}
                                  {record.depreciationRate && (
                                    <div>
                                      <span className="font-medium text-gray-600">Depreciation Rate:</span>
                                      <p>{record.depreciationRate}%</p>
                                    </div>
                                  )}
                                  {record.totalExpectedUnits && (
                                    <div>
                                      <span className="font-medium text-gray-600">Expected Units:</span>
                                      <p>{record.totalExpectedUnits.toLocaleString()}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {record.notes && (
                                <div className="mt-4 pt-4 border-t">
                                  <span className="font-medium text-gray-600 text-sm">Notes:</span>
                                  <p className="text-sm mt-1 bg-gray-50 p-2 rounded">{record.notes}</p>
                                </div>
                              )}

                              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                  Created: {new Date(record.createdAt).toLocaleDateString()}
                                </span>
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="outline">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Calculator className="h-4 w-4 mr-1" />
                                    Recalculate
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>

                    {filteredDepreciation.length === 0 && (
                      <div className="text-center py-8">
                        <Calculator className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No depreciation records found.</p>
                        <p className="text-sm text-gray-400">
                          Create depreciation records in the Asset Depreciation tab.
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
