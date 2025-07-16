"use client"

import { ArrowRight, Check } from "lucide-react"
<<<<<<< HEAD

import { useState } from "react"

import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
=======
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

<<<<<<< HEAD
  const [formData, setFormData] = useState({
    orgName: "",
    panNo: "",
    website: "",
    orgEmail: "",
    contactNo: "",
    gstin: "",
    address: "",
    country: "",
    pincode: "",
    firstName: "",
    lastName: "",
    email: "",
    designation: "",
    personContact: "",
    password: "",
    confirmPassword: "",
    bankName: "",
    ifsc: "",
    bankAccount: "",
    agreedToTerms: false,
  })

=======
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1
  const steps = [
    { number: 1, title: "Organization Details", active: currentStep === 1 },
    { number: 2, title: "Authorized Person Details", active: currentStep === 2 },
    { number: 3, title: "Bank Details", active: currentStep === 3 },
  ]

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

<<<<<<< HEAD
  const handleFinalSubmit = async (e) => {
  e.preventDefault();

  const finalPayload = {
    organizationName: formData.orgName,
    panNumber: formData.panNo,
    website: formData.website,
    email: formData.orgEmail,
    contactNumber: formData.contactNo,
    gstin: formData.gstin,
    address: formData.address,
    country: formData.country,
    pincode: formData.pincode,
    bankName: formData.bankName,
    ifscCode: formData.ifsc,
    bankAccountNumber: formData.bankAccount,
    authorizedPerson: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      designation: formData.designation,
      contactNumber: formData.personContact,
      password: formData.password,
      confirmpassword: formData.confirmPassword
    }
  }

  try {
    const response = await fetch("http://localhost:8000/api/v1/org/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalPayload),
    });

    const result = await response.json();
    console.log("✅ Server Response:", result);

    if (response.ok) {
      alert("✅ Organization registered successfully!");
      // Optional: Reset form or redirect
    } else {
      alert(`❌ Registration failed: ${result?.message || "Unknown error"}`);
    }
  } catch (err) {
    console.error("❌ Error submitting form:", err);
    alert("Something went wrong. Check console.");
  }
};

=======
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Navbar />

      <div className="flex items-center justify-center min-h-screen pt-20 pb-12 px-4">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">Create Account</CardTitle>
            <CardDescription className="text-gray-600">
              Join VittaLogic and start managing your business efficiently
            </CardDescription>

            {/* Progress Steps */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        step.active
                          ? "bg-blue-600 text-white"
                          : currentStep > step.number
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {currentStep > step.number ? <Check className="w-4 h-4" /> : step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 h-0.5 mx-2 ${currentStep > step.number ? "bg-green-600" : "bg-gray-200"}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-600 mt-2">
              Step {currentStep} of {totalSteps}: {steps[currentStep - 1].title}
            </div>
          </CardHeader>

          <CardContent>
            {currentStep === 1 && (
<<<<<<< HEAD
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name *</Label>
                    <Input
                      id="orgName"
                      value={formData.orgName}
                      onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                      placeholder="Enter organization name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panNo">PAN No. (Optional)</Label>
                    <Input 
                      id="panNo" 
                      value={formData.panNo}
                      onChange={(e) => setFormData({ ...formData, panNo: e.target.value })}
                      placeholder="Enter PAN number" 
                    />
=======
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name *</Label>
                    <Input id="orgName" placeholder="Enter organization name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panNo">PAN No. (Optional)</Label>
                    <Input id="panNo" placeholder="Enter PAN number" />
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Organization Website Link (Optional)</Label>
<<<<<<< HEAD
                  <Input 
                    id="website" 
                    type="url" 
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com" 
                  />
=======
                  <Input id="website" type="url" placeholder="https://example.com" />
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgEmail">Organization Email *</Label>
<<<<<<< HEAD
                    <Input 
                      id="orgEmail" 
                      type="email" 
                      value={formData.orgEmail}
                      onChange={(e) => setFormData({ ...formData, orgEmail: e.target.value })}
                      placeholder="org@example.com" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNo">Contact Number *</Label>
                    <Input 
                      id="contactNo" 
                      type="tel" 
                      value={formData.contactNo}
                      onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                      placeholder="+91 234 567 8900" 
                      required 
                    />
=======
                    <Input id="orgEmail" type="email" placeholder="org@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNo">Contact Number *</Label>
                    <Input id="contactNo" type="tel" placeholder="+1 234 567 8900" required />
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN (Required for B2B dealing in India) *</Label>
<<<<<<< HEAD
                  <Input 
                    id="gstin" 
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    placeholder="Enter GSTIN" 
                    required 
                  />
=======
                  <Input id="gstin" placeholder="Enter GSTIN" required />
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Organization Address *</Label>
<<<<<<< HEAD
                  <Textarea 
                    id="address" 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter complete address" 
                    required 
                  />
=======
                  <Textarea id="address" placeholder="Enter complete address" required />
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
<<<<<<< HEAD
                    <Input 
                      id="country" 
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Enter country" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pin Code *</Label>
                    <Input 
                      id="pincode" 
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="Enter pin code" 
                      required 
                    />
                  </div>
                </div>

                <Button 
                  type="button" 
                  onClick={nextStep}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Save and Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input 
                      id="firstName" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Enter first name" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input 
                      id="lastName" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Enter last name" 
                      required 
                    />
=======
                    <Input id="country" placeholder="Enter country" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pin Code *</Label>
                    <Input id="pincode" placeholder="Enter pin code" required />
                  </div>
                </div>

                <Button onClick={nextStep} className="w-full bg-blue-600 hover:bg-blue-700">
                  Save and Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}

            {currentStep === 2 && (
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="Enter first name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Enter last name" required />
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Id *</Label>
<<<<<<< HEAD
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="person@example.com" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation *</Label>
                    <Input 
                      id="designation" 
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="Enter designation" 
                      required 
                    />
=======
                    <Input id="email" type="email" placeholder="person@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation *</Label>
                    <Input id="designation" placeholder="Enter designation" required />
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personContact">Contact Number *</Label>
<<<<<<< HEAD
                  <Input 
                    id="personContact" 
                    type="tel" 
                    value={formData.personContact}
                    onChange={(e) => setFormData({ ...formData, personContact: e.target.value })}
                    placeholder="+91 234 567 8900" 
                    required 
                  />
=======
                  <Input id="personContact" type="tel" placeholder="+1 234 567 8900" required />
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
<<<<<<< HEAD
                    <Input 
                      id="password" 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Create password" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Confirm password" 
                      required 
                    />
=======
                    <Input id="password" type="password" placeholder="Create password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input id="confirmPassword" type="password" placeholder="Confirm password" required />
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                    Back
                  </Button>
<<<<<<< HEAD
                  <Button type="button" onClick={nextStep} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Save and Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      placeholder="Enter bank name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifsc">IFSC Code *</Label>
                    <Input
                      id="ifsc"
                      value={formData.ifsc}
                      onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                      placeholder="Enter IFSC code"
                      required
                    />
=======
                  <Button onClick={nextStep} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Save and Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}

            {currentStep === 3 && (
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input id="bankName" placeholder="Enter bank name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifsc">IFSC Code *</Label>
                    <Input id="ifsc" placeholder="Enter IFSC code" required />
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankAccount">Bank Account No. *</Label>
<<<<<<< HEAD
                  <Input
                    id="bankAccount"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    placeholder="Enter bank account number"
                    required
                  />
                </div>


=======
                  <Input id="bankAccount" placeholder="Enter bank account number" required />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm">
                    Agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                      Terms and Conditions
                    </Link>{" "}
                    by clicking on this Checkbox
                  </Label>
                </div>
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                    Save and Submit <Check className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
