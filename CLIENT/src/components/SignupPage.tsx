"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
      isValid = false
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters"
      isValid = false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("http://localhost:8000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: "USER",
        }),
      })

      if (response.ok) {
        // Handle successful signup
        setIsSuccess(true)

        // Reset form after successful submission
        setFormData({
          fullName: "",
          email: "",
          password: "",
        })
      } else {
        const data = await response.json()
        setErrors((prev) => ({
          ...prev,
          email: data.error || "An error occurred", // Update with actual error message returned
        }))
      }
    } catch (error) {
      console.error("Signup error:", error)
      setErrors((prev) => ({
        ...prev,
        email: "An error occurred while attempting to sign up.", // General error message
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-lg bg-white transition-transform hover:scale-105 duration-300">
        <CardHeader className="space-y-1 p-6">
          <CardTitle className="text-3xl font-bold text-center text-gray-800">Create an Account</CardTitle>
          <CardDescription className="text-center text-gray-600">Enter your details below to create your account</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold">Registration Successful!</h3>
              <p className="text-gray-500 mt-2">Your account has been created successfully.</p>
              <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white focus:outline-none" onClick={() => { router.push('/login') }}>
                Navigate to Login Page
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`border ${errors.fullName ? "border-red-500" : "border-gray-300"} rounded-md p-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.fullName && (
                  <div className="flex items-center text-red-500 text-sm mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>{errors.fullName}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md p-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.email && (
                  <div className="flex items-center text-red-500 text-sm mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md p-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.password && (
                  <div className="flex items-center text-red-500 text-sm mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>{errors.password}</span>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
              </div>
            </form>
          )}
        </CardContent>
        {!isSuccess && (
          <CardFooter>
            <Button
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white transition duration-300 ease-in-out ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}