"use client"

import { useState, useEffect } from "react"
import {
  Building2,
  CreditCard,
  Package,
  Users,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Mock data for dashboard
  const stats = [
    {
      title: "Total Employees",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Departments",
      value: "24",
      change: "+2",
      trend: "up",
      icon: Building2,
      color: "text-green-600",
    },
    {
      title: "Monthly Revenue",
      value: "₹45.2L",
      change: "+8.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-600",
    },
    {
      title: "Pending Approvals",
      value: "18",
      change: "-5",
      trend: "down",
      icon: CheckCircle,
      color: "text-orange-600",
    },
  ]

  const recentTransactions = [
    {
      id: "TXN-001",
      description: "Office Supplies Purchase",
      amount: "₹12,500",
      date: "2024-01-15",
      status: "completed",
      department: "Administration",
    },
    {
      id: "TXN-002",
      description: "Software License Renewal",
      amount: "₹85,000",
      date: "2024-01-14",
      status: "pending",
      department: "IT",
    },
    {
      id: "TXN-003",
      description: "Marketing Campaign",
      amount: "₹2,50,000",
      date: "2024-01-13",
      status: "completed",
      department: "Marketing",
    },
    {
      id: "TXN-004",
      description: "Equipment Maintenance",
      amount: "₹18,750",
      date: "2024-01-12",
      status: "processing",
      department: "Operations",
    },
  ]

  const pendingApprovals = [
    {
      id: "APP-001",
      requester: "John Smith",
      department: "Sales",
      amount: "₹75,000",
      priority: "high",
      date: "2024-01-15",
      reason: "Client meeting expenses",
    },
    {
      id: "APP-002",
      requester: "Sarah Johnson",
      department: "HR",
      amount: "₹25,000",
      priority: "medium",
      date: "2024-01-14",
      reason: "Team building event",
    },
    {
      id: "APP-003",
      requester: "Mike Wilson",
      department: "IT",
      amount: "₹1,20,000",
      priority: "high",
      date: "2024-01-13",
      reason: "Server upgrade requirements",
    },
  ]

  const departmentPerformance = [
    { name: "Sales", performance: 92, employees: 45, target: 95 },
    { name: "Marketing", performance: 88, employees: 28, target: 90 },
    { name: "IT", performance: 95, employees: 32, target: 93 },
    { name: "HR", performance: 85, employees: 15, target: 88 },
    { name: "Finance", performance: 90, employees: 20, target: 92 },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Dashboard</h1>
          <p className="text-gray-600">Overview of your business operations and key metrics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="flex items-center text-xs text-gray-600 mt-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                    )}
                    <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Frequently used operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Add New Employee
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Create Transaction
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    New Approval Request
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    Add Asset
                  </Button>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-green-600" />
                    System Health
                  </CardTitle>
                  <CardDescription>Current system status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Database Performance</span>
                      <span className="text-green-600">98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Server Uptime</span>
                      <span className="text-green-600">99.9%</span>
                    </div>
                    <Progress value={99.9} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>API Response Time</span>
                      <span className="text-yellow-600">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest financial transactions across all departments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.department}</TableCell>
                        <TableCell className="font-semibold">{transaction.amount}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.status === "completed"
                                ? "default"
                                : transaction.status === "pending"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Approval requests requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Approval ID</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApprovals.map((approval) => (
                      <TableRow key={approval.id}>
                        <TableCell className="font-medium">{approval.id}</TableCell>
                        <TableCell>{approval.requester}</TableCell>
                        <TableCell>{approval.department}</TableCell>
                        <TableCell className="font-semibold">{approval.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              approval.priority === "high"
                                ? "destructive"
                                : approval.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {approval.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{approval.date}</TableCell>
                        <TableCell className="max-w-xs truncate">{approval.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments">
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Performance metrics for each department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {departmentPerformance.map((dept) => (
                    <div key={dept.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{dept.name}</h4>
                          <p className="text-sm text-gray-600">{dept.employees} employees</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{dept.performance}%</p>
                          <p className="text-sm text-gray-600">Target: {dept.target}%</p>
                        </div>
                      </div>
                      <Progress value={dept.performance} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
