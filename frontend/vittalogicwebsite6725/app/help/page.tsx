"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Phone,
  Mail,
  Users,
  Settings,
  CreditCard,
  Shield,
  Zap,
} from "lucide-react"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

export default function HelpPage() {
  const helpCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using VittaLogic",
      icon: Zap,
      articles: [
        "How to create your organization account",
        "Setting up your first department",
        "Adding employees to your system",
        "Understanding user roles and permissions",
      ],
    },
    {
      title: "User Management",
      description: "Managing users and permissions",
      icon: Users,
      articles: [
        "Creating and managing employee accounts",
        "Setting up department hierarchies",
        "Configuring user roles and access levels",
        "Employee onboarding best practices",
      ],
    },
    {
      title: "Financial Management",
      description: "Handle transactions and financial data",
      icon: CreditCard,
      articles: [
        "Recording financial transactions",
        "Managing vendor payments",
        "Customer payment processing",
        "Generating financial reports",
      ],
    },
    {
      title: "System Configuration",
      description: "Configure and customize your system",
      icon: Settings,
      articles: [
        "Organization profile setup",
        "Customizing dashboard views",
        "Setting up approval workflows",
        "Data backup and security settings",
      ],
    },
    {
      title: "Security & Privacy",
      description: "Keep your data safe and secure",
      icon: Shield,
      articles: [
        "Understanding data encryption",
        "Setting up two-factor authentication",
        "Managing data privacy settings",
        "Security best practices",
      ],
    },
  ]

  const faqs = [
    {
      question: "How do I reset my organization password?",
      answer:
        "You can reset your password by clicking the 'Forgot Password' link on the login page. You'll receive an email with instructions to create a new password.",
    },
    {
      question: "Can I add multiple departments to my organization?",
      answer:
        "Yes, VittaLogic supports unlimited departments. You can create, manage, and organize departments according to your organizational structure.",
    },
    {
      question: "How do employee permissions work?",
      answer:
        "Employee permissions are role-based. Each service has specific roles that can access it (admin, hr, finance, etc.). Employees are assigned roles based on their job functions.",
    },
    {
      question: "Is my data secure with VittaLogic?",
      answer:
        "Yes, we use enterprise-grade security measures including data encryption, secure servers, and regular security audits to protect your information.",
    },
    {
      question: "Can I export my data?",
      answer:
        "Yes, you can export your data in various formats including CSV, Excel, and PDF. This feature is available in most modules of the system.",
    },
    {
      question: "What happens if I exceed my user limit?",
      answer:
        "If you need to add more users than your current plan allows, you can upgrade your subscription at any time through your organization profile.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can contact our support team through email, phone, or live chat. Our contact information is available at the bottom of this page.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How can we help you?</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to your questions, learn how to use VittaLogic, and get the support you need.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Comprehensive guides and tutorials</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Browse Docs
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle>Live Chat</CardTitle>
                <CardDescription>Get instant help from our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle>Phone Support</CardTitle>
                <CardDescription>Speak directly with our experts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Call Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-lg text-gray-600">Find help articles organized by topic</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {category.articles.length} articles
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="mt-2">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.articles.slice(0, 3).map((article, articleIndex) => (
                        <li key={articleIndex} className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                          • {article}
                        </li>
                      ))}
                      {category.articles.length > 3 && (
                        <li className="text-sm text-blue-600 font-medium cursor-pointer">
                          + {category.articles.length - 3} more articles
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Quick answers to common questions</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Still need help?</h2>
          <p className="text-xl text-blue-100 mb-8">Our support team is here to help you succeed with VittaLogic</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <Mail className="h-8 w-8 text-white mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Email Support</h3>
              <p className="text-blue-100 text-sm">support@vittalogic.com</p>
            </div>
            <div className="text-center">
              <Phone className="h-8 w-8 text-white mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Phone Support</h3>
              <p className="text-blue-100 text-sm">+1 (555) 123-4567</p>
            </div>
            <div className="text-center">
              <MessageCircle className="h-8 w-8 text-white mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Live Chat</h3>
              <p className="text-blue-100 text-sm">Available 24/7</p>
            </div>
          </div>

          <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
            Contact Support Team
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
