"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Key, ArrowLeft, CheckCircle, AlertCircle, Car, Shield, Clock, Eye, EyeOff } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function ForgotPassword() {
  const [currentStep, setCurrentStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const navigate = useNavigate()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        repeatType: "reverse",
      },
    },
  }

  // Step 1: Send OTP to email
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!email.trim()) {
      setError("Email is required")
      setIsLoading(false)
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }


    try {
      // Sample API call for sending OTP
      const response = await fetch("http://localhost:8084/auth/forgot-password/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setCurrentStep(2)
        startResendTimer()
      } else {
        const errorText = await response.text()
        setError(`Failed to send OTP: ${errorText}`)
      }
    } catch (error) {
      setError("Network error. Please try again.")
      console.error("Send OTP error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const otpString = otp.join("")
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP")
      setIsLoading(false)
      return
    }

    try {
      // Sample API call for verifying OTP
      const response = await fetch("http://localhost:8084/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpString }),
      })

      if (response.ok) {
        setCurrentStep(3)
      } else {
        const errorText = await response.text()
        setError(`Invalid OTP`)
      }
    } catch (error) {
      setError("Network error. Please try again.")
      console.error("Verify OTP error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!newPassword) {
      setError("Password is required")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // Sample API call for resetting password
      const response = await fetch("http://localhost:8084/auth/forgot-password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newPassword,
          isVerified: true,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        navigate("/login")
      } else {
        const errorText = await response.text()
        setError(`Failed to reset password: ${errorText}`)
      }
    } catch (error) {
      setError("Network error. Please try again.")
      console.error("Reset password error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:8084/auth/forgot-password/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setOtp(["", "", "", "", "", ""])
        startResendTimer()
      } else {
        const errorText = await response.text()
        setError(`Failed to resend OTP`)
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Timer for resend OTP
  const startResendTimer = () => {
    setResendTimer(60)
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Handle OTP input
  const handleOTPChange = (index, value) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  // Handle OTP backspace
  const handleOTPKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError("")
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Forgot Password?"
      case 2:
        return "Enter Verification Code"
      case 3:
        return "Create New Password"
      default:
        return "Forgot Password?"
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Enter your email address and we'll send you a verification code"
      case 2:
        return `We've sent a 6-digit code to ${email}`
      case 3:
        return "Choose a strong password for your account"
      default:
        return ""
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div
            className="absolute top-40 right-20 w-16 h-16 bg-red-200 rounded-full opacity-20"
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 1 }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-24 h-24 bg-yellow-200 rounded-full opacity-20"
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 2 }}
          />
        </div>

        <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 text-center"
              whileHover={{ y: -2 }}
            >
              <motion.div
                className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, 0] }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <CheckCircle className="h-8 w-8 text-green-600" />
              </motion.div>

              <motion.h2
                className="text-2xl font-bold text-gray-900 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Password Reset Successful!
              </motion.h2>

              <motion.p
                className="text-gray-600 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Your password has been successfully reset. You can now sign in with your new password.
              </motion.p>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-800">Redirecting to login page in 3 seconds...</p>
                </div>

                <Link
                  to="/login"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                >
                  Go to Login
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-red-200 rounded-full opacity-20"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-24 h-24 bg-yellow-200 rounded-full opacity-20"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />
      </div>

      {/* Road Animation */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-800 to-transparent opacity-10">
        <motion.div
          className="absolute bottom-4 left-0 right-0 h-1 bg-white opacity-50"
          animate={{
            x: [-100, typeof window !== "undefined" ? window.innerWidth + 100 : 1000],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div className="w-full max-w-md" variants={containerVariants} initial="hidden" animate="visible">
          {/* Header Section */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <motion.div
              className="mx-auto h-20 w-20 rounded-full bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white flex items-center justify-center shadow-lg mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Car size={32} />
            </motion.div>

            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2"
              variants={itemVariants}
            >
              DriveEasy
            </motion.h1>

            <motion.h2 className="text-2xl font-semibold text-gray-800 mb-2" variants={itemVariants}>
              {getStepTitle()}
            </motion.h2>

            <motion.p className="text-gray-600" variants={itemVariants}>
              {getStepDescription()}
            </motion.p>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div className="mb-8" variants={itemVariants}>
            <div className="flex justify-between items-center mb-2">
              {[1, 2, 3].map((step) => (
                <motion.div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? "bg-gradient-to-r from-red-400 to-red-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                  animate={{
                    scale: step === currentStep ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {step}
                </motion.div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-red-400 to-red-500 h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${(currentStep / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Form Content */}
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20"
            variants={itemVariants}
            whileHover={{ y: -2 }}
          >
            <AnimatePresence mode="wait" custom={currentStep}>
              {/* Step 1: Email Input */}
              {currentStep === 1 && (
                <motion.form
                  key="step1"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSendOTP}
                  className="space-y-6"
                >
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pl-10 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                        placeholder="Enter your email address"
                      />
                    </motion.div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <motion.div className="flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <motion.div
                          className="h-5 w-5 mr-3 rounded-full border-2 border-white border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                        Sending Code...
                      </motion.div>
                    ) : (
                      "Send Verification Code"
                    )}
                  </motion.button>
                </motion.form>
              )}

              {/* Step 2: OTP Verification */}
              {currentStep === 2 && (
                <motion.form
                  key="step2"
                  custom={2}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  onSubmit={handleVerifyOTP}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                      Enter the 6-digit code
                    </label>
                    <div className="flex justify-center space-x-2">
                      {otp.map((digit, index) => (
                        <motion.input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOTPChange(index, e.target.value)}
                          onKeyDown={(e) => handleOTPKeyDown(index, e)}
                          className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                          whileFocus={{ scale: 1.1 }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                    <motion.button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0 || isLoading}
                      className="text-sm font-medium text-red-600 hover:text-orange-500 disabled:text-gray-400 transition-colors"
                      whileHover={{ scale: resendTimer === 0 ? 1.05 : 1 }}
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                    </motion.button>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <motion.div className="flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <motion.div
                          className="h-5 w-5 mr-3 rounded-full border-2 border-white border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                        Verifying...
                      </motion.div>
                    ) : (
                      "Verify Code"
                    )}
                  </motion.button>
                </motion.form>
              )}

              {/* Step 3: New Password */}
              {currentStep === 3 && (
                <motion.form
                  key="step3"
                  custom={3}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  onSubmit={handleResetPassword}
                  className="space-y-6"
                >
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pl-10 pr-12 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                        placeholder="Enter new password"
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? (
                          <EyeOff size={18} className="text-gray-500" />
                        ) : (
                          <Eye size={18} className="text-gray-500" />
                        )}
                      </motion.button>
                    </motion.div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pl-10 pr-12 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                        placeholder="Confirm new password"
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} className="text-gray-500" />
                        ) : (
                          <Eye size={18} className="text-gray-500" />
                        )}
                      </motion.button>
                    </motion.div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <motion.div className="flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <motion.div
                          className="h-5 w-5 mr-3 rounded-full border-2 border-white border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                        Resetting Password...
                      </motion.div>
                    ) : (
                      "Reset Password"
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-6 flex justify-between items-center">
              {currentStep > 1 ? (
                <motion.button
                  type="button"
                  onClick={goBack}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-500 transition-colors"
                  whileHover={{ x: -2 }}
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back
                </motion.button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to Login
                </Link>
              )}

              <div className="text-sm text-gray-500">Step {currentStep} of 3</div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div className="mt-8 grid grid-cols-3 gap-4 text-center" variants={itemVariants}>
            <motion.div className="bg-white/60 backdrop-blur-sm rounded-lg p-4" whileHover={{ scale: 1.05, y: -2 }}>
              <Shield size={24} className="mx-auto text-orange-500 mb-2" />
              <p className="text-xs text-gray-600">Secure Reset</p>
            </motion.div>
            <motion.div className="bg-white/60 backdrop-blur-sm rounded-lg p-4" whileHover={{ scale: 1.05, y: -2 }}>
              <Mail size={24} className="mx-auto text-red-500 mb-2" />
              <p className="text-xs text-gray-600">Email Verification</p>
            </motion.div>
            <motion.div className="bg-white/60 backdrop-blur-sm rounded-lg p-4" whileHover={{ scale: 1.05, y: -2 }}>
              <Clock size={24} className="mx-auto text-yellow-500 mb-2" />
              <p className="text-xs text-gray-600">Quick Process</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
