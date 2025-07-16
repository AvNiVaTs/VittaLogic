"use client"

import { LogOut, Menu, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  // This is a mock state for demonstration. In a real app, this would come from an authentication context.
  const isLoggedIn = true // Set to true to show logged in state

  const handleSignOut = () => {
    // Add your sign out logic here
    console.log("User signed out")
    // For demonstration, we'll just reload the page or redirect
    window.location.href = "/login"
  }

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            VittaLogic
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              HOME
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              SERVICES
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              CONTACT US
            </Link>
          </div>

          {/* Profile Icon or Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-600 text-white">ORG</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link href="/org-profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Organization Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Button asChild variant="ghost">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col items-start space-y-4 pt-8">
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors w-full py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    HOME
                  </Link>
                  <Link
                    href="/services"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors w-full py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    SERVICES
                  </Link>
                  <Link
                    href="#contact"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors w-full py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    CONTACT US
                  </Link>
                  <div className="w-full border-t border-gray-200 pt-4 mt-4">
                    {isLoggedIn ? (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/org-profile" className="flex items-center w-full py-2">
                            <User className="mr-2 h-4 w-4" />
                            <span>Organization Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="w-full" />
                        <DropdownMenuItem onClick={handleSignOut} className="w-full py-2">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sign Out</span>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <Button asChild variant="ghost" className="w-full justify-start">
                          <Link href="/login" onClick={() => setIsOpen(false)}>
                            Login
                          </Link>
                        </Button>
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 w-full justify-start mt-2">
                          <Link href="/signup" onClick={() => setIsOpen(false)}>
                            Sign Up
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
