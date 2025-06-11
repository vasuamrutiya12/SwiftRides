"use client"

import { useNavigate, Link } from "react-router-dom"
import { Car, UserCircle, Menu, X, LogOut, User, Settings } from "lucide-react"
import { useEffect, useState } from "react"

const Navbar = () => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    setIsLoggedIn(false)
    setIsProfileDropdownOpen(false)
    navigate("/login")
  }

  const handleProfileClick = () => {
    navigate("/customer-dashboard")
    setIsProfileDropdownOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target
      if (!target.closest(".profile-dropdown") && !target.closest(".profile-button")) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>

      {/* Fixed Navbar */}
      <header className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-md border border-red-100/50 rounded-2xl shadow-lg shadow-red-500/10">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                    DrivEasy
                  </span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-8">
                  <Link
                    to="/"
                    className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group"
                  >
                    Home
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
                  </Link>
                  <Link
                    to="/all-car"
                    className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group"
                  >
                    Cars
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
                  </Link>
                  <Link
                    to="/about-us"
                    className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group"
                  >
                    About Us
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
                  </Link>
                  <Link
                    to="/contact-us"
                    className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group"
                  >
                    Contact Us
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
                  </Link>
                </nav>

                {/* Desktop Auth Section */}
                <div className="hidden lg:flex items-center space-x-4">
                  {isLoggedIn ? (
                    <div className="relative">
                      <button
                        onClick={toggleProfileDropdown}
                        className="profile-button flex items-center space-x-2 p-2 rounded-xl bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all duration-200 border border-red-200/50"
                      >
                        <div className="p-1 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                          <UserCircle className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-red-700 font-medium">Profile</span>
                      </button>

                      {/* Profile Dropdown */}
                      {isProfileDropdownOpen && (
                        <div className="profile-dropdown absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-red-100/50 py-2">
                          <button
                            onClick={handleProfileClick}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center space-x-2"
                          >
                            <User className="w-4 h-4" />
                            <span>Dashboard</span>
                          </button>
                          <button
                            onClick={() => {
                              /* Add settings handler */
                            }}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center space-x-2"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </button>
                          <hr className="my-2 border-red-100" />
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => navigate("/register")}
                        className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl shadow-lg shadow-red-500/25 transition-all duration-200 transform hover:scale-105"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMobileMenu}
                  className="lg:hidden p-2 rounded-xl bg-red-50 hover:bg-red-100 transition-colors duration-200"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6 text-red-600" />
                  ) : (
                    <Menu className="h-6 w-6 text-red-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden border-t border-red-100/50 bg-white/90 backdrop-blur-md rounded-b-2xl">
                <div className="px-6 py-4 space-y-4">
                  {/* Mobile Navigation Links */}
                  <div className="space-y-3">
                    <Link
                      to="/"
                      onClick={closeMobileMenu}
                      className="block text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 py-2"
                    >
                      Home
                    </Link>
                    <Link
                      to="/all-car"
                      onClick={closeMobileMenu}
                      className="block text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 py-2"
                    >
                      Cars
                    </Link>
                    <Link
                      to="/about-us"
                      onClick={closeMobileMenu}
                      className="block text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 py-2"
                    >
                      About Us
                    </Link>
                    <Link
                      to="/contact-us"
                      onClick={closeMobileMenu}
                      className="block text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 py-2"
                    >
                      Contact Us
                    </Link>
                  </div>

                  {/* Mobile Auth Section */}
                  <div className="pt-4 border-t border-red-100/50">
                    {isLoggedIn ? (
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            handleProfileClick()
                            closeMobileMenu()
                          }}
                          className="w-full flex items-center space-x-3 p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors duration-200"
                        >
                          <div className="p-1 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-red-700 font-medium">Dashboard</span>
                        </button>
                        <button
                          onClick={() => {
                            handleLogout()
                            closeMobileMenu()
                          }}
                          className="w-full flex items-center space-x-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            navigate("/login")
                            closeMobileMenu()
                          }}
                          className="w-full p-3 text-red-600 hover:bg-red-50 font-medium rounded-xl transition-colors duration-200"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => {
                            navigate("/register")
                            closeMobileMenu()
                          }}
                          className="w-full p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl shadow-lg shadow-red-500/25 transition-all duration-200"
                        >
                          Sign Up
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar