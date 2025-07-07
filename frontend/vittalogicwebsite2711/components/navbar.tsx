"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "HOME", href: "/" },
    { name: "SERVICES", href: "/services" },
    { name: "CONTACT US", href: "#contact" },
    { name: "HELP", href: "/help" },
  ]

  const handleLinkClick = (href: string) => {
    setIsOpen(false)
    if (href.startsWith("#")) {
      setTimeout(() => {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }
  }

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-[100]">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              VittaLogic
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
                  onClick={(e) => {
                    if (item.href.startsWith("#")) {
                      e.preventDefault()
                      const element = document.querySelector(item.href)
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" })
                      }
                    }
                  }}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button asChild variant="ghost" className="hover:bg-blue-50 hover:text-blue-600">
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-semibold border-0"
                size="default"
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className={`relative z-[110] p-2 rounded-full transition-all duration-300 ${
                  isOpen ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg" : "hover:bg-gray-100 text-gray-700"
                }`}
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-6">
                  <Menu
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                      isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                    }`}
                  />
                  <X
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                      isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                    }`}
                  />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[105] md:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md transition-all duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`fixed top-16 right-0 w-80 max-w-[90vw] h-[calc(100vh-4rem)] bg-white shadow-2xl transition-all duration-500 ease-out flex flex-col ${
            isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          {/* Menu Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Navigation</h2>
              <div className="w-8 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-100 hover:scrollbar-thumb-blue-700">
            <div className="flex flex-col p-6 space-y-2">
              {/* Navigation Links */}
              <div className="space-y-1">
                {navItems.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center text-lg font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 py-4 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 border border-transparent hover:border-blue-200 hover:shadow-md transform hover:scale-[1.02] ${
                      isOpen ? "animate-in slide-in-from-right" : ""
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleLinkClick(item.href)}
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"></div>
                    {item.name}
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                      →
                    </div>
                  </Link>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className="flex flex-col space-y-4 pt-8 border-t border-gray-200 mt-6">
                <Button
                  asChild
                  variant="outline"
                  className="w-full py-4 text-base border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 rounded-xl font-medium"
                >
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-4 text-base shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-medium transform hover:scale-[1.02]"
                >
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>

              {/* Footer */}
              <div className="pt-6 mt-6">
                <div className="text-center text-sm text-gray-500">
                  <p className="font-medium text-blue-600">VittaLogic</p>
                  <p>All-in-One Business Platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-in-from-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-in {
          animation-duration: 0.5s;
          animation-fill-mode: both;
        }
        
        .slide-in-from-right {
          animation-name: slide-in-from-right;
        }

        /* Custom Scrollbar Styles */
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #2563eb;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #1d4ed8;
        }
        
        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background: #f3f4f6;
        }
        
        .scrollbar-thumb-blue-600::-webkit-scrollbar-thumb {
          background: #2563eb;
        }
        
        .hover\\:scrollbar-thumb-blue-700:hover::-webkit-scrollbar-thumb {
          background: #1d4ed8;
        }
      `}</style>
    </>
  )
}
