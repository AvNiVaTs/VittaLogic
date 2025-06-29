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
import { ArrowLeft, Search, Plus, Edit, Trash2, Copy, Upload, Calculator, TrendingDown, Recycle } from "lucide-react"
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
    | "under_repair"
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
  amcProvider: string
  amcStartDate: string
  amcEndDate: string
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
    assetId: "",
    maintenanceType: "",
    lastServiceDate: "",
    maintenancePeriod: "",
    amcProvider: "",
    amcStartDate: "",
    amcEndDate: "",
    cost: "",
    serviceNotes: "",
  })

  const [depreciationForm, setDepreciationForm] = useState({
    assetId: "",
    depreciationType: "",
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
        maintenanceType: "Preventive",
        lastServiceDate: "2024-01-20",
        maintenancePeriod: "90 days",
        updatedMaintenanceDate: "2024-04-20",
        amcProvider: "HP Service Center",
        amcStartDate: "2024-01-20",
        amcEndDate: "2025-01-20",
        cost: 2500,
        serviceNotes: "Regular maintenance and toner replacement",
        createdAt: "2024-01-20T10:00:00Z",
      },
    ]

    const mockDepreciation: Depreciation[] = [
      {
        id: "DEP-1703123456789",
        assetId: "AST-1703123456789",
        purchaseCost: 45000,
        purchaseDate: "2024-01-15",
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
  }, [])

  // Utility functions
  const generateId = (prefix: string, suffix?: string) => {
    const timestamp = Date.now()
    return suffix ? `${prefix}-${timestamp}-${suffix}` : `${prefix}-${timestamp}`
  }

  const calculateDepreciation = (form: any, purchaseCost: number, purchaseDate: string) => {
    const cost = purchaseCost
    const salvage = Number.parseFloat(form.salvageValue) || 0
    const life = Number.parseFloat(form.usefulLife) || 1
    const rate = Number.parseFloat(form.depreciationRate) || 0
    const totalUnits = Number.parseFloat(form.totalExpectedUnits) || 1
    const usedUnits = Number.parseFloat(form.actualUnitsUsed) || 0

    let annualDepreciation = 0
    let bookValue = cost

    // Calculate years since purchase
    const purchaseDateObj = new Date(purchaseDate)
    const currentDate = new Date()
    const yearsSincePurchase = (currentDate.getTime() - purchaseDateObj.getTime()) / (1000 * 60 * 60 * 24 * 365)

    switch (form.depreciationType) {
      case "straight_line":
        annualDepreciation = (cost - salvage) / life
        bookValue = cost - annualDepreciation * yearsSincePurchase
        break
      case "written_down":
        // Compound depreciation
        bookValue = cost * Math.pow(1 - rate / 100, yearsSincePurchase)
        annualDepreciation = bookValue * (rate / 100)
        break
      case "unit_production":
        const depreciationPerUnit = (cost - salvage) / totalUnits
        annualDepreciation = usedUnits * depreciationPerUnit
        bookValue = cost - annualDepreciation
        break
      case "double_declining":
        const decliningRate = 2 / life
        bookValue = cost * Math.pow(1 - decliningRate, yearsSincePurchase)
        annualDepreciation = bookValue * decliningRate
        break
      case "sum_of_years":
        const sumOfYears = (life * (life + 1)) / 2
        const remainingLife = Math.max(life - Math.floor(yearsSincePurchase), 1)
        annualDepreciation = (remainingLife / sumOfYears) * (cost - salvage)
        bookValue = cost - annualDepreciation * yearsSincePurchase
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
  }

  // Function to handle asset entry from transaction
  const handleAssetFromTransaction = (assetData: any) => {
    setAssetForm({
      name: assetData.assetName,
      type: "",
      subtype: "",
      description: "",
      purchaseFrom: "",
      purchaseCost: "",
      purchaseDate: "",
      expectedUsefulLife: "",
      duplicates: assetData.quantity,
      linkedReferenceId: assetData.assetId,
    })
    setActiveTab("create")
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
      amcProvider: maintenanceForm.amcProvider,
      amcStartDate: maintenanceForm.amcStartDate,
      amcEndDate: maintenanceForm.amcEndDate,
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
      assetId: "",
      maintenanceType: "",
      lastServiceDate: "",
      maintenancePeriod: "",
      amcProvider: "",
      amcStartDate: "",
      amcEndDate: "",
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

    if (!depreciationForm.assetId || !depreciationForm.depreciationType) {
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
      asset.purchaseDate,
    )

    const newDepreciation: Depreciation = {
      id: generateId("DEP"),
      assetId: depreciationForm.assetId,
      purchaseCost: asset.purchaseCost,
      purchaseDate: asset.purchaseDate,
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
      assetId: "",
      depreciationType: "",
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
      under_repair: { color: "bg-orange-500", text: "Under Repair" },
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
                    <TabsTrigger value="create" className="justify-start data-[state=active]:bg-blue-100">
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
                            className="hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleAssetFromTransaction(asset)}
                          >
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-lg mb-2">{asset.assetName}</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Asset ID:</span>
                                  <span className="font-medium">{asset.assetId}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Quantity:</span>
                                  <span className="font-medium">{asset.quantity}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Transaction ID:</span>
                                  <span className="font-medium">{asset.transactionId}</span>
                                </div>
                              </div>
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-xs text-gray-500">Click to create asset entry</p>
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
                          />
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
                          />
                        </div>

                        <div>
                          <Label htmlFor="purchase-cost">Purchase Cost *</Label>
                          <Input
                            id="purchase-cost"
                            type="number"
                            value={assetForm.purchaseCost}
                            onChange={(e) => setAssetForm((prev) => ({ ...prev, purchaseCost: e.target.value }))}
                            placeholder="Enter purchase cost"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="purchase-date">Purchase Date *</Label>
                          <Input
                            id="purchase-date"
                            type="date"
                            value={assetForm.purchaseDate}
                            onChange={(e) => setAssetForm((prev) => ({ ...prev, purchaseDate: e.target.value }))}
                            required
                          />
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
                          <Label htmlFor="duplicates">Number of Duplicates</Label>
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
                          />
                          <p className="text-xs text-gray-500 mt-1">Create multiple identical assets with unique IDs</p>
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
                        <Button type="button" variant="outline" className="flex items-center space-x-2 bg-transparent">
                          <Copy className="h-4 w-4" />
                          <span>Duplicate</span>
                        </Button>
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
                          <SelectItem value="under_repair">Under Repair</SelectItem>
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
                              <span className="text-sm font-medium">Type:</span>
                              <Badge variant="outline">{asset.type}</Badge>
                            </div>
                            {asset.subtype && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Subtype:</span>
                                <Badge variant="outline">{asset.subtype}</Badge>
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Status:</span>
                              {getStatusBadge(asset.status)}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Assignment Status:</span>
                              {getAssignmentStatusBadge(asset)}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Cost:</span>
                              <span className="font-medium">₹{asset.purchaseCost.toLocaleString()}</span>
                            </div>
                            {asset.assignedTo && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Assigned To:</span>
                                <span className="text-sm">{asset.assignedTo}</span>
                              </div>
                            )}
                            {asset.assignedDepartment && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Department:</span>
                                <span className="text-sm">{asset.assignedDepartment}</span>
                              </div>
                            )}

                            {/* Assignment Section */}
                            {!asset.assignedTo && (
                              <div className="pt-3 border-t">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" className="w-full">
                                      Assign Asset
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Assign Asset</DialogTitle>
                                      <DialogDescription>
                                        Assign {asset.name} to an employee and department
                                      </DialogDescription>
                                    </DialogHeader>
                                    <AssignmentForm
                                      assetId={asset.id}
                                      assetName={asset.name}
                                      onAssign={handleAssetAssignment}
                                    />
                                  </DialogContent>
                                </Dialog>
                              </div>
                            )}
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
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Asset</DialogTitle>
                        <DialogDescription>Update asset information</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Asset Name</Label>
                          <Input
                            value={editingAsset.name}
                            onChange={(e) =>
                              setEditingAsset((prev) => (prev ? { ...prev, name: e.target.value } : null))
                            }
                          />
                        </div>
                        <div>
                          <Label>Asset Type</Label>
                          <Select
                            value={editingAsset.type}
                            onValueChange={(value) =>
                              setEditingAsset((prev) => (prev ? { ...prev, type: value } : null))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
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
                          <Label>Purchase Cost</Label>
                          <Input
                            type="number"
                            value={editingAsset.purchaseCost}
                            onChange={(e) =>
                              setEditingAsset((prev) =>
                                prev ? { ...prev, purchaseCost: Number.parseFloat(e.target.value) } : null,
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Select
                            value={editingAsset.status}
                            onValueChange={(value: any) =>
                              setEditingAsset((prev) => (prev ? { ...prev, status: value } : null))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">Unassigned</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="maintenance_needed">Maintenance Needed</SelectItem>
                              <SelectItem value="under_repair">Under Repair</SelectItem>
                              <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                              <SelectItem value="disposed">Disposed</SelectItem>
                              <SelectItem value="unoperational">Unoperational</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={editingAsset.description || ""}
                          onChange={(e) =>
                            setEditingAsset((prev) => (prev ? { ...prev, description: e.target.value } : null))
                          }
                          rows={3}
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingAsset(null)}>
                          Cancel
                        </Button>
                        <Button onClick={() => editingAsset && handleAssetUpdate(editingAsset)}>Update Asset</Button>
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
                    <CardDescription>Schedule and track asset maintenance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleMaintenanceSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="maintenance-id">Maintenance ID</Label>
                          <Input id="maintenance-id" value={`MNT-${Date.now()}`} disabled className="bg-gray-50" />
                        </div>

                        <div>
                          <Label htmlFor="maintenance-asset-id">Asset ID *</Label>
                          <Select
                            value={maintenanceForm.assetId}
                            onValueChange={(value) => setMaintenanceForm((prev) => ({ ...prev, assetId: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select asset" />
                            </SelectTrigger>
                            <SelectContent>
                              {assets.map((asset) => (
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
                              <SelectItem value="Preventive">Preventive</SelectItem>
                              <SelectItem value="Corrective">Corrective</SelectItem>
                              <SelectItem value="Emergency">Emergency</SelectItem>
                              <SelectItem value="Routine">Routine</SelectItem>
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
                              <SelectItem value="15 days">15 days</SelectItem>
                              <SelectItem value="30 days">30 days</SelectItem>
                              <SelectItem value="45 days">45 days</SelectItem>
                              <SelectItem value="60 days">60 days</SelectItem>
                              <SelectItem value="90 days">90 days</SelectItem>
                              <SelectItem value="180 days">180 days</SelectItem>
                              <SelectItem value="365 days">365 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="updated-maintenance-date">Next Maintenance Date</Label>
                          <Input
                            id="updated-maintenance-date"
                            value={
                              maintenanceForm.lastServiceDate && maintenanceForm.maintenancePeriod
                                ? calculateNextMaintenanceDate(
                                    maintenanceForm.lastServiceDate,
                                    maintenanceForm.maintenancePeriod,
                                  )
                                : ""
                            }
                            disabled
                            className="bg-gray-50"
                          />
                        </div>

                        <div>
                          <Label htmlFor="amc-provider">AMC Provider Name</Label>
                          <Input
                            id="amc-provider"
                            value={maintenanceForm.amcProvider}
                            onChange={(e) => setMaintenanceForm((prev) => ({ ...prev, amcProvider: e.target.value }))}
                            placeholder="Enter AMC provider name"
                          />
                        </div>

                        <div>
                          <Label htmlFor="amc-start-date">AMC Start Date</Label>
                          <Input
                            id="amc-start-date"
                            type="date"
                            value={maintenanceForm.amcStartDate}
                            onChange={(e) => setMaintenanceForm((prev) => ({ ...prev, amcStartDate: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="amc-end-date">AMC End Date</Label>
                          <Input
                            id="amc-end-date"
                            type="date"
                            value={maintenanceForm.amcEndDate}
                            onChange={(e) => setMaintenanceForm((prev) => ({ ...prev, amcEndDate: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="maintenance-cost">Cost of Maintenance</Label>
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
                          placeholder="Enter service notes"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Document Attachments</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Upload maintenance documents</p>
                        </div>
                      </div>

                      <Button type="submit" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Maintenance Record
                      </Button>
                    </form>

                    {/* Maintenance Records List */}
                    {maintenanceRecords.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Maintenance Records</h3>
                        <div className="space-y-4">
                          {maintenanceRecords.map((record) => {
                            const asset = assets.find((a) => a.id === record.assetId)
                            return (
                              <Card key={record.id}>
                                <CardContent className="pt-6">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <p className="font-medium">{record.id}</p>
                                      <p className="text-sm text-gray-500">
                                        {asset?.name} ({record.assetId})
                                      </p>
                                      <Badge className="mt-1">{record.maintenanceType}</Badge>
                                    </div>
                                    <div>
                                      <p className="text-sm">
                                        <span className="font-medium">Last Service:</span> {record.lastServiceDate}
                                      </p>
                                      <p className="text-sm">
                                        <span className="font-medium">Next Service:</span>{" "}
                                        {record.updatedMaintenanceDate}
                                      </p>
                                      <p className="text-sm">
                                        <span className="font-medium">Cost:</span> ₹{record.cost.toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm">
                                        <span className="font-medium">AMC Provider:</span> {record.amcProvider}
                                      </p>
                                      <p className="text-sm">
                                        <span className="font-medium">AMC Period:</span> {record.amcStartDate} to{" "}
                                        {record.amcEndDate}
                                      </p>
                                    </div>
                                  </div>
                                  {record.serviceNotes && (
                                    <div className="mt-4 pt-4 border-t">
                                      <p className="text-sm">
                                        <span className="font-medium">Notes:</span> {record.serviceNotes}
                                      </p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      </div>
                    )}
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
                    <CardDescription>Record asset disposals and calculate profit/loss</CardDescription>
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
                            onValueChange={(value) => {
                              setDisposalForm((prev) => ({ ...prev, assetId: value }))
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select asset to dispose" />
                            </SelectTrigger>
                            <SelectContent>
                              {assets
                                .filter((asset) => asset.status !== "disposed")
                                .map((asset) => (
                                  <SelectItem key={asset.id} value={asset.id}>
                                    {asset.id} - {asset.name}
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
                          <Label htmlFor="purchase-amount-display">Purchase Amount</Label>
                          <Input
                            id="purchase-amount-display"
                            value={
                              disposalForm.assetId
                                ? `₹${assets.find((a) => a.id === disposalForm.assetId)?.purchaseCost.toLocaleString() || "0"}`
                                : ""
                            }
                            disabled
                            className="bg-gray-50"
                          />
                        </div>

                        <div>
                          <Label htmlFor="profit-loss-amount">Profit/Loss Amount</Label>
                          <Input
                            id="profit-loss-amount"
                            value={
                              disposalForm.assetId && disposalForm.disposalAmount
                                ? `₹${(Number.parseFloat(disposalForm.disposalAmount) - (assets.find((a) => a.id === disposalForm.assetId)?.purchaseCost || 0)).toLocaleString()}`
                                : ""
                            }
                            disabled
                            className="bg-gray-50"
                          />
                        </div>

                        <div>
                          <Label htmlFor="profit-loss-status">Status</Label>
                          <Input
                            id="profit-loss-status"
                            value={
                              disposalForm.assetId && disposalForm.disposalAmount
                                ? Number.parseFloat(disposalForm.disposalAmount) >=
                                  (assets.find((a) => a.id === disposalForm.assetId)?.purchaseCost || 0)
                                  ? "Profit"
                                  : "Loss"
                                : ""
                            }
                            disabled
                            className="bg-gray-50"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="buyer-info">Buyer Information</Label>
                        <Textarea
                          id="buyer-info"
                          value={disposalForm.buyerInfo}
                          onChange={(e) => setDisposalForm((prev) => ({ ...prev, buyerInfo: e.target.value }))}
                          placeholder="Enter buyer information (optional)"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="disposal-reason">Reason for Disposal</Label>
                        <Textarea
                          id="disposal-reason"
                          value={disposalForm.reason}
                          onChange={(e) => setDisposalForm((prev) => ({ ...prev, reason: e.target.value }))}
                          placeholder="Enter reason for disposal (optional)"
                          rows={3}
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        <Recycle className="h-4 w-4 mr-2" />
                        Record Asset Disposal
                      </Button>
                    </form>

                    {/* Disposal Records List */}
                    {disposalRecords.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Disposal Records</h3>
                        <div className="space-y-4">
                          {disposalRecords.map((record) => {
                            const asset = assets.find((a) => a.id === record.assetId)
                            return (
                              <Card key={record.id}>
                                <CardContent className="pt-6">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <p className="font-medium">{record.id}</p>
                                      <p className="text-sm text-gray-500">
                                        {asset?.name} ({record.assetId})
                                      </p>
                                      <Badge className={record.status === "profit" ? "bg-green-500" : "bg-red-500"}>
                                        {record.status === "profit" ? "Profit" : "Loss"}
                                      </Badge>
                                    </div>
                                    <div>
                                      <p className="text-sm">
                                        <span className="font-medium">Purchase Amount:</span> ₹
                                        {record.purchaseAmount.toLocaleString()}
                                      </p>
                                      <p className="text-sm">
                                        <span className="font-medium">Disposal Amount:</span> ₹
                                        {record.disposalAmount.toLocaleString()}
                                      </p>
                                      <p className="text-sm">
                                        <span className="font-medium">Profit/Loss:</span> ₹
                                        {Math.abs(record.profitLossAmount).toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm">
                                        <span className="font-medium">Disposal Date:</span>{" "}
                                        {new Date(record.createdAt).toLocaleDateString()}
                                      </p>
                                      {record.buyerInfo && (
                                        <p className="text-sm">
                                          <span className="font-medium">Buyer:</span> {record.buyerInfo}
                                        </p>
                                      )}
                                      {record.reason && (
                                        <p className="text-sm">
                                          <span className="font-medium">Reason:</span> {record.reason}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
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
                    <CardDescription>Calculate asset depreciation using various methods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleDepreciationSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="depreciation-id">Depreciation ID</Label>
                          <Input id="depreciation-id" value={`DEP-${Date.now()}`} disabled className="bg-gray-50" />
                        </div>

                        <div>
                          <Label htmlFor="depreciation-asset-id">Asset ID *</Label>
                          <Select
                            value={depreciationForm.assetId}
                            onValueChange={(value) => {
                              setDepreciationForm((prev) => ({ ...prev, assetId: value }))
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select asset" />
                            </SelectTrigger>
                            <SelectContent>
                              {assets
                                .filter((asset) => asset.status !== "disposed")
                                .map((asset) => (
                                  <SelectItem key={asset.id} value={asset.id}>
                                    {asset.id} - {asset.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="purchase-cost-display">Purchase Cost</Label>
                          <Input
                            id="purchase-cost-display"
                            value={
                              depreciationForm.assetId
                                ? `₹${assets.find((a) => a.id === depreciationForm.assetId)?.purchaseCost.toLocaleString() || "0"}`
                                : ""
                            }
                            disabled
                            className="bg-gray-50"
                          />
                        </div>

                        <div>
                          <Label htmlFor="purchase-date-display">Purchase Date</Label>
                          <Input
                            id="purchase-date-display"
                            value={
                              depreciationForm.assetId
                                ? assets.find((a) => a.id === depreciationForm.assetId)?.purchaseDate || ""
                                : ""
                            }
                            disabled
                            className="bg-gray-50"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor="depreciation-type">Depreciation Type *</Label>
                          <Select
                            value={depreciationForm.depreciationType}
                            onValueChange={(value) => {
                              setDepreciationForm((prev) => ({
                                ...prev,
                                depreciationType: value,
                                // Reset method-specific fields
                                salvageValue: "",
                                usefulLife: "",
                                depreciationRate: "",
                                totalExpectedUnits: "",
                                actualUnitsUsed: "",
                              }))
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select depreciation method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="straight_line">Straight Line Method</SelectItem>
                              <SelectItem value="written_down">Written Down Method</SelectItem>
                              <SelectItem value="unit_production">Unit of Production Method</SelectItem>
                              <SelectItem value="double_declining">Double Declining Method</SelectItem>
                              <SelectItem value="sum_of_years">Sum-of-the-Years Digits Method</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Method-specific fields */}
                      {depreciationForm.depreciationType && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium mb-4">
                            {depreciationForm.depreciationType === "straight_line" && "Straight Line Method Parameters"}
                            {depreciationForm.depreciationType === "written_down" && "Written Down Method Parameters"}
                            {depreciationForm.depreciationType === "unit_production" &&
                              "Unit of Production Method Parameters"}
                            {depreciationForm.depreciationType === "double_declining" &&
                              "Double Declining Method Parameters"}
                            {depreciationForm.depreciationType === "sum_of_years" &&
                              "Sum-of-Years Digits Method Parameters"}
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Straight Line Method */}
                            {depreciationForm.depreciationType === "straight_line" && (
                              <>
                                <div>
                                  <Label htmlFor="salvage-value">Salvage Value *</Label>
                                  <Input
                                    id="salvage-value"
                                    type="number"
                                    value={depreciationForm.salvageValue}
                                    onChange={(e) =>
                                      setDepreciationForm((prev) => ({ ...prev, salvageValue: e.target.value }))
                                    }
                                    placeholder="Enter salvage value"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="useful-life-dep">Useful Life (Years) *</Label>
                                  <Input
                                    id="useful-life-dep"
                                    type="number"
                                    value={depreciationForm.usefulLife}
                                    onChange={(e) =>
                                      setDepreciationForm((prev) => ({ ...prev, usefulLife: e.target.value }))
                                    }
                                    placeholder="Enter useful life in years"
                                    required
                                  />
                                </div>
                              </>
                            )}

                            {/* Written Down Method */}
                            {depreciationForm.depreciationType === "written_down" && (
                              <>
                                <div>
                                  <Label htmlFor="depreciation-rate">Depreciation Rate (%) *</Label>
                                  <Input
                                    id="depreciation-rate"
                                    type="number"
                                    value={depreciationForm.depreciationRate}
                                    onChange={(e) =>
                                      setDepreciationForm((prev) => ({ ...prev, depreciationRate: e.target.value }))
                                    }
                                    placeholder="Enter depreciation rate"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="salvage-value-wd">Salvage Value *</Label>
                                  <Input
                                    id="salvage-value-wd"
                                    type="number"
                                    value={depreciationForm.salvageValue}
                                    onChange={(e) =>
                                      setDepreciationForm((prev) => ({ ...prev, salvageValue: e.target.value }))
                                    }
                                    placeholder="Enter salvage value"
                                    required
                                  />
                                </div>
                              </>
                            )}

                            {/* Unit Production Method */}
                            {depreciationForm.depreciationType === "unit_production" && (
                              <>
                                <div>
                                  <Label htmlFor="salvage-value-up">Salvage Value *</Label>
                                  <Input
                                    id="salvage-value-up"
                                    type="number"
                                    value={depreciationForm.salvageValue}
                                    onChange={(e) =>
                                      setDepreciationForm((prev) => ({ ...prev, salvageValue: e.target.value }))
                                    }
                                    placeholder="Enter salvage value"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="total-expected-units">Total Expected Units *</Label>
                                  <Input
                                    id="total-expected-units"
                                    type="number"
                                    value={depreciationForm.totalExpectedUnits}
                                    onChange={(e) =>
                                      setDepreciationForm((prev) => ({ ...prev, totalExpectedUnits: e.target.value }))
                                    }
                                    placeholder="Enter total expected units"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="actual-units-used">Actual Units Used *</Label>
                                  <Input
                                    id="actual-units-used"
                                    type="number"
                                    value={depreciationForm.actualUnitsUsed}
                                    onChange={(e) =>
                                      setDepreciationForm((prev) => ({ ...prev, actualUnitsUsed: e.target.value }))
                                    }
                                    placeholder="Enter actual units used"
                                    required
                                  />
                                </div>
                              </>
                            )}

                            {/* Double Declining Method */}
                            {depreciationForm.depreciationType === "double_declining" && (
                              <>
                                <div>
                                  <Label htmlFor="useful-life-dd">Useful Life (Years) *</Label>
                                  <Input
                                    id="useful-life-dd"
                                    type="number"
                                    value={depreciationForm.usefulLife}
                                    onChange={(e) =>
                                      setDepreciationForm((prev) => ({ ...prev, usefulLife: e.target.value }))
                                    }
                                    placeholder="Enter useful life in years"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="salvage-value-dd">Salvage Value *</Label>
                                  <Input
                                    id="salvage-value-dd"
                                    type="number"
                                    value={depreciationForm.salvageValue}
                                    onChange={(e) =>
                                      setDepreciationForm((prev) => ({ ...prev, salvageValue: e.target.value }))
                                    }
                                    placeholder="Enter salvage value"
                                    required
                                  />
                                </div>
                              </>
                            )}

                            {/* Sum-of-Years Digits Method */}
                            {depreciationForm.depreciationType === "sum_of_years" && (
                              <>
                                <div>
                                  <Label htmlFor="salvage-value-sy">Salvage Value *</Label>
                                  <Input
                                    id="salvage-value-sy"
                                    type="number"
                                    value={depreciationForm.salvageValue}
                                    onChange={(e) =>
                                      setDepreciationForm((prev) => ({ ...prev, salvageValue: e.target.value }))
                                    }
                                    placeholder="Enter salvage value"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="useful-life-sy">Useful Life (Years) *</Label>
                                  <Input
                                    id="useful-life-sy"
                                    type="number"
                                    value={depreciationForm.usefulLife}
                                    onChange={(e) =>
                                      setDepreciationForm((prev) => ({ ...prev, usefulLife: e.target.value }))
                                    }
                                    placeholder="Enter useful life in years"
                                    required
                                  />
                                </div>
                              </>
                            )}
                          </div>

                          {/* Live Calculation Preview */}
                          {depreciationForm.assetId && depreciationForm.depreciationType && (
                            <div className="mt-4 p-4 bg-white rounded border">
                              <h5 className="font-medium mb-2">Calculation Preview</h5>
                              {(() => {
                                const asset = assets.find((a) => a.id === depreciationForm.assetId)
                                if (!asset) return null

                                try {
                                  const { annualDepreciation, bookValue } = calculateDepreciation(
                                    depreciationForm,
                                    asset.purchaseCost,
                                    asset.purchaseDate,
                                  )

                                  return (
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="font-medium">Annual Depreciation:</span>
                                        <p className="text-lg font-bold text-blue-600">
                                          ₹{annualDepreciation.toLocaleString()}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="font-medium">Current Book Value:</span>
                                        <p className="text-lg font-bold text-green-600">
                                          ₹{bookValue.toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                } catch (error) {
                                  return (
                                    <p className="text-red-500 text-sm">
                                      Please fill in all required fields for calculation
                                    </p>
                                  )
                                }
                              })()}
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <Label htmlFor="depreciation-notes">Notes</Label>
                        <Textarea
                          id="depreciation-notes"
                          value={depreciationForm.notes}
                          onChange={(e) => setDepreciationForm((prev) => ({ ...prev, notes: e.target.value }))}
                          placeholder="Enter any additional notes (optional)"
                          rows={3}
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        <Calculator className="h-4 w-4 mr-2" />
                        Calculate & Save Depreciation
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
                    <CardDescription>View and manage all asset depreciation records</CardDescription>
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
                        return (
                          <Card key={record.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="font-semibold text-lg">{asset?.name}</h4>
                                  <p className="text-sm text-gray-500">{record.id}</p>
                                  <Badge className="mt-1 capitalize">{record.depreciationType.replace("_", " ")}</Badge>
                                </div>
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="ghost" onClick={() => setEditingDepreciation(record)}>
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
                                        <AlertDialogTitle>Delete Depreciation Record</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this depreciation record? This action cannot
                                          be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => {
                                            setDepreciationRecords((prev) => prev.filter((r) => r.id !== record.id))
                                            toast.success("Depreciation record deleted successfully!")
                                          }}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Purchase Cost</p>
                                  <p className="text-lg font-semibold">₹{record.purchaseCost.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Annual Depreciation</p>
                                  <p className="text-lg font-semibold text-red-600">
                                    ₹{record.annualDepreciation.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Current Book Value</p>
                                  <p className="text-lg font-semibold text-green-600">
                                    ₹{record.bookValue.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Purchase Date</p>
                                  <p className="text-sm">{record.purchaseDate}</p>
                                </div>
                              </div>

                              {/* Method-specific details */}
                              <div className="mt-4 pt-4 border-t">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  {record.salvageValue && (
                                    <div>
                                      <span className="font-medium">Salvage Value:</span>
                                      <p>₹{record.salvageValue.toLocaleString()}</p>
                                    </div>
                                  )}
                                  {record.usefulLife && (
                                    <div>
                                      <span className="font-medium">Useful Life:</span>
                                      <p>{record.usefulLife} years</p>
                                    </div>
                                  )}
                                  {record.depreciationRate && (
                                    <div>
                                      <span className="font-medium">Depreciation Rate:</span>
                                      <p>{record.depreciationRate}%</p>
                                    </div>
                                  )}
                                  {record.totalExpectedUnits && (
                                    <div>
                                      <span className="font-medium">Total Expected Units:</span>
                                      <p>{record.totalExpectedUnits.toLocaleString()}</p>
                                    </div>
                                  )}
                                  {record.actualUnitsUsed && (
                                    <div>
                                      <span className="font-medium">Actual Units Used:</span>
                                      <p>{record.actualUnitsUsed.toLocaleString()}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {record.notes && (
                                <div className="mt-4 pt-4 border-t">
                                  <p className="text-sm">
                                    <span className="font-medium">Notes:</span> {record.notes}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>

                    {filteredDepreciation.length === 0 && (
                      <div className="text-center py-8">
                        <TrendingDown className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No depreciation records found.</p>
                        <p className="text-sm text-gray-400">
                          Add depreciation calculations in the Asset Depreciation tab.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Edit Depreciation Dialog */}
                {editingDepreciation && (
                  <Dialog open={!!editingDepreciation} onOpenChange={() => setEditingDepreciation(null)}>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Depreciation Record</DialogTitle>
                        <DialogDescription>Update depreciation calculation parameters</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Depreciation Method</Label>
                            <Input
                              value={editingDepreciation.depreciationType.replace("_", " ")}
                              disabled
                              className="bg-gray-50"
                            />
                          </div>
                          <div>
                            <Label>Asset</Label>
                            <Input
                              value={`${editingDepreciation.assetId} - ${assets.find((a) => a.id === editingDepreciation.assetId)?.name}`}
                              disabled
                              className="bg-gray-50"
                            />
                          </div>
                        </div>

                        {editingDepreciation.salvageValue !== undefined && (
                          <div>
                            <Label>Salvage Value</Label>
                            <Input
                              type="number"
                              value={editingDepreciation.salvageValue}
                              onChange={(e) =>
                                setEditingDepreciation((prev) =>
                                  prev ? { ...prev, salvageValue: Number.parseFloat(e.target.value) } : null,
                                )
                              }
                            />
                          </div>
                        )}

                        {editingDepreciation.usefulLife !== undefined && (
                          <div>
                            <Label>Useful Life (Years)</Label>
                            <Input
                              type="number"
                              value={editingDepreciation.usefulLife}
                              onChange={(e) =>
                                setEditingDepreciation((prev) =>
                                  prev ? { ...prev, usefulLife: Number.parseFloat(e.target.value) } : null,
                                )
                              }
                            />
                          </div>
                        )}

                        <div>
                          <Label>Notes</Label>
                          <Textarea
                            value={editingDepreciation.notes || ""}
                            onChange={(e) =>
                              setEditingDepreciation((prev) => (prev ? { ...prev, notes: e.target.value } : null))
                            }
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingDepreciation(null)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            if (editingDepreciation) {
                              // Recalculate depreciation with updated values
                              const asset = assets.find((a) => a.id === editingDepreciation.assetId)
                              if (asset) {
                                const { annualDepreciation, bookValue } = calculateDepreciation(
                                  {
                                    depreciationType: editingDepreciation.depreciationType,
                                    salvageValue: editingDepreciation.salvageValue?.toString() || "",
                                    usefulLife: editingDepreciation.usefulLife?.toString() || "",
                                    depreciationRate: editingDepreciation.depreciationRate?.toString() || "",
                                    totalExpectedUnits: editingDepreciation.totalExpectedUnits?.toString() || "",
                                    actualUnitsUsed: editingDepreciation.actualUnitsUsed?.toString() || "",
                                  },
                                  asset.purchaseCost,
                                  asset.purchaseDate,
                                )

                                const updatedRecord = {
                                  ...editingDepreciation,
                                  annualDepreciation,
                                  bookValue,
                                }

                                setDepreciationRecords((prev) =>
                                  prev.map((record) => (record.id === editingDepreciation.id ? updatedRecord : record)),
                                )
                              }
                              setEditingDepreciation(null)
                              toast.success("Depreciation record updated successfully!")
                            }
                          }}
                        >
                          Update Record
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
