import { useState } from "react"
import { Eye, EyeOff, LogIn, Car, MapPin, Clock } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useLoading } from "../Loader/LoadingProvider"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [Error, setError] = useState("")
  const [focusedField, setFocusedField] = useState("")
  const navigate = useNavigate()
  const { showLoader, hideLoader ,isLoading} = useLoading()

  const handleSubmit = async (e) => {
    e.preventDefault()
    showLoader("Fetching available cars...")
    setError("")

    try {
      const response = await fetch("http://localhost:8084/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("email", email);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        if (data.role === "ADMIN") {
          navigate("/admin/dashboard", { replace: true });
        } else if (data.role === "RENTAL_COMPANY") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        const errorText = await response.text();
        setError(`Login failed: ${errorText}`);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.")
      console.error("Login error:", error)
    } finally {
      hideLoader()
    }
  }

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

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-50 to-yellow-50 relative overflow-hidden">
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
            x: [-100, window.innerWidth + 100],
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
              Welcome Back!
            </motion.h2>

            <motion.p className="text-gray-600" variants={itemVariants}>
              Sign in to continue your journey
            </motion.p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div className="grid grid-cols-3 gap-4 mb-8" variants={itemVariants}>
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center shadow-sm"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <Car className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">500+ Cars</p>
            </motion.div>
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center shadow-sm"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <MapPin className="w-5 h-5 text-red-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">50+ Locations</p>
            </motion.div>
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center shadow-sm"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <Clock className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">24/7 Support</p>
            </motion.div>
          </motion.div>

          {/* Login Form */}
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20"
            variants={itemVariants}
            whileHover={{ y: -2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                    placeholder="Enter your email"
                  />
                  <AnimatePresence>
                    {focusedField === "email" && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-12 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                    placeholder="Enter your password"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div animate={{ rotate: showPassword ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-500" />
                      ) : (
                        <Eye size={18} className="text-gray-500" />
                      )}
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {focusedField === "password" && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div className="flex items-center justify-between" variants={itemVariants}>
            
                <motion.a
                  href="/forgot-password"
                  className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors"
                  whileHover={{ x: 2 }}
                >
                  Forgot password?
                </motion.a>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {Error && (
                  <motion.div
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {Error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-3 text-sm font-medium text-white shadow-lg hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          className="h-5 w-5 mr-3 rounded-full border-2 border-white border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                        Starting your engine...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="signin"
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <LogIn size={18} className="mr-2" />
                        Sign In & Drive
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>

              {/* Sign Up Link */}
              <motion.div className="text-center text-sm" variants={itemVariants}>
                <span className="text-gray-600">New to DriveEasy?</span>{" "}
                <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500 transition-colors">
                  <motion.span whileHover={{ x: 2 }} className="inline-block">
                    Start your journey →
                  </motion.span>
                </Link>
              </motion.div>
              <motion.div className="text-center text-sm" variants={itemVariants}>
                <Link to="/" className="font-medium text-orange-600 hover:text-orange-500 transition-colors">
                  <motion.span whileHover={{ x: 2 }} className="inline-block">
                    ← Go Back 
                  </motion.span>
                </Link>
              </motion.div>
            </form>
          </motion.div>

          {/* Features */}
          <motion.div className="mt-8 grid grid-cols-2 gap-4 text-center" variants={itemVariants}>
            <motion.div className="bg-white/60 backdrop-blur-sm rounded-lg p-4" whileHover={{ scale: 1.05, y: -2 }}>
              <div className="text-2xl mb-2">🚗</div>
              <p className="text-xs text-gray-600">Instant Booking</p>
            </motion.div>
            <motion.div className="bg-white/60 backdrop-blur-sm rounded-lg p-4" whileHover={{ scale: 1.05, y: -2 }}>
              <div className="text-2xl mb-2">🔒</div>
              <p className="text-xs text-gray-600">Secure & Safe</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
