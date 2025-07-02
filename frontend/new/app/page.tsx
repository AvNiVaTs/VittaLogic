import { ArrowRight, BarChart3, Shield, Users, Zap } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 mb-8">
              <Zap className="mr-2 h-4 w-4" />
              All-in-One Business Management Platform
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              TRACK • MANAGE • GROW
              <br />
              <span className="text-blue-600">ALL IN ONE PLACE!</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get a clear, real-time picture of your company's finances — all in one place. Whether it's tracking
              transactions or keeping an eye on assets, we make it simple with easy-to-understand visuals that help you
              make better decisions, faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
              >
                <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base rounded-lg flex items-center">
                  START NOW
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
              >
                <Link href="/login" className="px-5 py-3 text-lg border border-blue-600 text-black hover:text-blue-600 hover:bg-blue-50 rounded-lg">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Simplify Your Day-to-Day Operations</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We help you stay on top of everything—from managing departments, employees, assets, vendors, and
                customers to keeping your transactions and financials in perfect order. All your business essentials, in
                one simple platform.
              </p>

              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Employee & Department Management</h3>
                    <p className="text-gray-600">Organize teams and track performance effortlessly</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Financial Tracking</h3>
                    <p className="text-gray-600">Real-time insights into your company's finances</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Asset Management</h3>
                    <p className="text-gray-600">Track, maintain, and optimize your business assets</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="p-8 shadow-xl">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">₹2.4M</div>
                        <div className="text-sm text-gray-600">Monthly Revenue</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-green-600">+18%</div>
                        <div className="text-sm text-gray-600">Growth Rate</div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Asset Utilization</span>
                        <span className="text-sm text-gray-600">87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "87%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 bg-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Stay Informed, Stay in Control</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Need approvals, tracking, or reminders? Our smart system takes care of it— making sure nothing slips through
            the cracks, whether it's a pending request, asset maintenance, or a key financial update.
          </p>
          <Button asChild size="lg">
            <Link href="/signup" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg rounded-full flex items-center justify-center">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
