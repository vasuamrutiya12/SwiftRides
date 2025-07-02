import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import StatsCard from "./StatsCard"
import { Car, Calendar, Star, CreditCard, TrendingUp, Users, BarChart3, Activity } from "lucide-react"
import Navbar from "./Navbar"
import Footer from "../LandingPages/Footer"
import { useLoading } from "../Loader/LoadingProvider"

export default function Dashboard() {
  const [stats, setStats] = useState([])
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("email")
  const { showLoader, hideLoader } = useLoading()

  useEffect(() => {
    const fetchStats = async () => {
      showLoader("Loading dashboard data...")
      try {
        const resId = await fetch("http://localhost:8084/auth/user/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        })

        const id = await resId.json()

        const res = await fetch(`http://localhost:9090/api/reviews/companyId/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const reviewsData = await res.json()

        const enrichedReviews = await Promise.all(
          reviewsData.map(async (review) => {
            const [carRes, customerRes] = await Promise.all([
              fetch(`http://localhost:9090/api/cars/${review.carId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }).then((res) => res.json()),
              fetch(`http://localhost:9090/api/customers/${review.customerId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }).then((res) => res.json()),
            ])

            return {
              id: review.reviewId,
              customerName: customerRes.fullName,
              carName: `${carRes.make} ${carRes.model}`,
              rating: review.rating,
              comment: review.comment,
              date: new Date(review.createdAt).toISOString().split("T")[0],
              customerAvatar: "/placeholder.svg?height=40&width=40",
            }
          }),
        )
        const averageRating =
          reviewsData.length > 0
            ? reviewsData.reduce((sum, reviewsData) => sum + reviewsData.rating, 0) / reviewsData.length
            : 0

        const [carsRes, bookingsRes, reviewsRes, revenueRes, ratingRes, customersRes] = await Promise.all([
          fetch(`http://localhost:9090/api/cars/total/companyId/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => (res.ok ? res.json() : Promise.reject("Total Cars fetch failed"))),

          fetch("http://localhost:9090/api/cars/count/status/booked", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => (res.ok ? res.json() : Promise.reject("Bookings fetch failed"))),

          reviewsData.length,

          fetch("http://localhost:9090/api/cars/count/status/booked", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json()),

          averageRating,

          fetch(`http://localhost:9090/api/bookings/companyId/${id}/bookingCustomers`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json()),
        ])

        setStats([
          {
            title: "Total Cars",
            value: typeof carsRes === 'object' && carsRes !== null && 'count' in carsRes ? carsRes.count : carsRes,
            icon: Car,
            color: "from-red-500 to-rose-600",
            change: "+12%",
            changeType: "positive",
            description: "Fleet vehicles",
          },
          {
            title: "Active Bookings",
            value: bookingsRes,
            icon: Calendar,
            color: "from-red-400 to-pink-500",
            change: "+8%",
            changeType: "positive",
            description: "Current rentals",
          },
          {
            title: "Total Reviews",
            value: reviewsRes,
            icon: Star,
            color: "from-amber-500 to-orange-500",
            change: "+15%",
            changeType: "positive",
            description: "Customer feedback",
          },
          {
            title: "Monthly Revenue",
            value: `$${revenueRes}`,
            icon: CreditCard,
            color: "from-emerald-500 to-green-600",
            change: "+23%",
            changeType: "positive",
            description: "This month",
          },
          {
            title: "Customer Satisfaction",
            value: `${ratingRes.toFixed(1)}/5`,
            icon: TrendingUp,
            color: "from-purple-500 to-violet-600",
            change: "+0.2",
            changeType: "positive",
            description: "Average rating",
          },
          {
            title: "Total Customers",
            value: customersRes,
            icon: Users,
            color: "from-blue-500 to-indigo-600",
            change: "+18%",
            changeType: "positive",
            description: "Registered users",
          },
        ])
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        hideLoader()
      }
    }

    fetchStats()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-rose-50">
      <Navbar />

      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="top-4 relative overflow-hidden bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl lg:text-5xl font-bold mb-4"
              >
                Dashboard Overview
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-red-100 mb-6"
              >
                Monitor your rental business performance in real-time
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex items-center space-x-4 text-red-100"
              >
                <Activity className="h-5 w-5" />
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 lg:mt-0"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <BarChart3 className="h-16 w-16 text-white mx-auto" />
                  <p className="text-center mt-2 text-red-100">Analytics Hub</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="absolute top-1/2 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg" />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} index={index} />
          ))}
        </motion.div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Quick Insights</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-3">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Growth Rate</h3>
                <p className="text-sm text-gray-600">Your business is growing at 15% monthly</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Top Rated</h3>
                <p className="text-sm text-gray-600">Excellent customer satisfaction scores</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Active Fleet</h3>
                <p className="text-sm text-gray-600">High utilization rate across all vehicles</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
