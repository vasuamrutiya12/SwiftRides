// import { useEffect, useState } from 'react';
// import { Car, Users, MessageSquare, DollarSign, Calendar } from 'lucide-react';
// import Navbar from './Navbar';
// import { useLoading } from '../Loader/LoadingProvider';

// const Dashboard = () => {
//   const [statsData, setStatsData] = useState({
//     totalCompanies: 0,
//     totalCustomers: 0,
//     totalBookings: 0,
//     totalRevenue: 0,
//     totalQueries: 0,
//   });
//   const token = localStorage.getItem("token");
//   const { showLoader, hideLoader } = useLoading();

//   const headers = {
//     'Content-Type': 'application/json',
//     // Add Authorization token if needed:
//     'Authorization': `Bearer ${token}`
//   };

//   useEffect(() => {
//     const fetchStats = async () => {
//       showLoader("Loading admin dashboard data...");
//       try {
//         const [
//           companiesRes,
//           customersRes,
//           bookingsRes,
//           paymentsRes,
//           queriesRes,
//         ] = await Promise.all([
//           fetch('http://localhost:9090/api/rental-company/total', { headers }),
//           fetch('http://localhost:9090/api/customers/total', { headers }),
//           fetch('http://localhost:9090/api/bookings/total', { headers }),
//           fetch('http://localhost:9090/api/payments/total-amount', { headers }),
//           fetch('http://localhost:9090/api/contact/total', { headers }),
//         ]);

//         const companies = await companiesRes.json();
//         const customers = await customersRes.json();
//         const bookings = await bookingsRes.json();
//         const payments = await paymentsRes.json();
//         const queries = await queriesRes.json();
      
        

//         setStatsData({
//           totalCompanies: companies || 0,
//           totalCustomers: customers || 0,
//           totalBookings: bookings || 0,
//           totalRevenue: payments || 0,
//           totalQueries: queries || 0,
//         });
//       } catch (error) {
//         console.error('Failed to fetch dashboard data:', error);
//       } finally {
//         hideLoader();
//       }
//     };

//     fetchStats();
//   }, []);

//   const stats = [
//     {
//       title: 'Total Companies',
//       value: statsData.totalCompanies,
//       icon: <Car className="w-8 h-8" />,
//       color: 'bg-red-500',
//     },
//     {
//       title: 'Total Customers',
//       value: statsData.totalCustomers,
//       icon: <Users className="w-8 h-8" />,
//       color: 'bg-red-600',
//     },
//     {
//       title: 'Total Bookings',
//       value: statsData.totalBookings,
//       icon: <Calendar className="w-8 h-8" />,
//       color: 'bg-red-700',
//     },
//     {
//       title: 'Revenue Generated',
//       value: `₹${statsData.totalRevenue.toLocaleString()}`,
//       icon: <DollarSign className="w-8 h-8" />,
//       color: 'bg-red-800',
//     },
//     {
//       title: 'Customer Queries',
//       value: statsData.totalQueries,
//       icon: <MessageSquare className="w-8 h-8" />,
//       color: 'bg-red-500',
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <Navbar />
//       <h2 className="text-2xl font-bold text-gray-800 mx-5">Dashboard Overview</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mx-5">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-white p-6 rounded-lg shadow-md">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                 <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//               </div>
//               <div className={`${stat.color} p-3 rounded-full text-white`}>
//                 {stat.icon}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;







// "use client"

// import { useEffect, useState } from "react"
// import { motion } from "framer-motion"
// import {
//   Car,
//   Users,
//   MessageSquare,
//   DollarSign,
//   Calendar,
//   TrendingUp,
//   Activity,
//   BarChart3,
//   PieChartIcon as PieIcon,
// } from "lucide-react"
// import {
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart as RechartsPieChart,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
//   Pie,
// } from "recharts"
// import Navbar from "./Navbar"
// import { useLoading } from "../Loader/LoadingProvider"

// // Mock data for charts (you can replace with additional API calls)
// const monthlyRevenueData = [
//   { month: "Jan", revenue: 45000, bookings: 120 },
//   { month: "Feb", revenue: 52000, bookings: 140 },
//   { month: "Mar", revenue: 48000, bookings: 130 },
//   { month: "Apr", revenue: 61000, bookings: 165 },
//   { month: "May", revenue: 55000, bookings: 150 },
//   { month: "Jun", revenue: 67000, bookings: 180 },
// ]

// const bookingStatusData = [
//   { name: "Completed", value: 65, color: "#dc2626" },
//   { name: "Active", value: 25, color: "#ef4444" },
//   { name: "Cancelled", value: 10, color: "#fca5a5" },
// ]

// const companyPerformanceData = [
//   { name: "Company A", bookings: 45, revenue: 23000 },
//   { name: "Company B", bookings: 38, revenue: 19000 },
//   { name: "Company C", bookings: 52, revenue: 28000 },
//   { name: "Company D", bookings: 31, revenue: 16000 },
//   { name: "Company E", bookings: 42, revenue: 21000 },
// ]

// const Dashboard = () => {
//   const [statsData, setStatsData] = useState({
//     totalCompanies: 0,
//     totalCustomers: 0,
//     totalBookings: 0,
//     totalRevenue: 0,
//     totalQueries: 0,
//   })

//   const token = localStorage.getItem("token")
//   const { showLoader, hideLoader } = useLoading()

//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   }

//   useEffect(() => {
//     const fetchStats = async () => {
//       showLoader("Loading admin dashboard data...")
//       try {
//         const [companiesRes, customersRes, bookingsRes, paymentsRes, queriesRes] = await Promise.all([
//           fetch("http://localhost:9090/api/rental-company/total", { headers }),
//           fetch("http://localhost:9090/api/customers/total", { headers }),
//           fetch("http://localhost:9090/api/bookings/total", { headers }),
//           fetch("http://localhost:9090/api/payments/total-amount", { headers }),
//           fetch("http://localhost:9090/api/contact/total", { headers }),
//         ])

//         const companies = await companiesRes.json()
//         const customers = await customersRes.json()
//         const bookings = await bookingsRes.json()
//         const payments = await paymentsRes.json()
//         const queries = await queriesRes.json()

//         setStatsData({
//           totalCompanies: companies || 0,
//           totalCustomers: customers || 0,
//           totalBookings: bookings || 0,
//           totalRevenue: payments || 0,
//           totalQueries: queries || 0,
//         })
//       } catch (error) {
//         console.error("Failed to fetch dashboard data:", error)
//       } finally {
//         hideLoader()
//       }
//     }

//     fetchStats()
//   }, [])

//   const stats = [
//     {
//       title: "Total Companies",
//       value: statsData.totalCompanies,
//       icon: <Car className="w-6 h-6" />,
//       color: "from-red-500 to-red-600",
//       change: "+12%",
//       changeType: "positive",
//     },
//     {
//       title: "Total Customers",
//       value: statsData.totalCustomers.toLocaleString(),
//       icon: <Users className="w-6 h-6" />,
//       color: "from-red-600 to-red-700",
//       change: "+8%",
//       changeType: "positive",
//     },
//     {
//       title: "Total Bookings",
//       value: statsData.totalBookings.toLocaleString(),
//       icon: <Calendar className="w-6 h-6" />,
//       color: "from-red-700 to-red-800",
//       change: "+15%",
//       changeType: "positive",
//     },
//     {
//       title: "Revenue Generated",
//       value: `₹${statsData.totalRevenue.toLocaleString()}`,
//       icon: <DollarSign className="w-6 h-6" />,
//       color: "from-red-800 to-red-900",
//       change: "+23%",
//       changeType: "positive",
//     },
//     {
//       title: "Customer Queries",
//       value: statsData.totalQueries,
//       icon: <MessageSquare className="w-6 h-6" />,
//       color: "from-red-500 to-red-600",
//       change: "-5%",
//       changeType: "negative",
//     },
//   ]

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   }

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         duration: 0.5,
//       },
//     },
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <Navbar />

//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//         className="max-w-7xl mx-auto p-6 space-y-6"
//       >
//         {/* Header */}
//         <motion.div variants={itemVariants} className="text-center mb-8">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
//             Rental Company Dashboard
//           </h1>
//           <p className="text-gray-600 mt-2">Monitor your business performance in real-time</p>
//         </motion.div>

//         {/* Stats Cards */}
//         <motion.div
//           variants={itemVariants}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
//         >
//           {stats.map((stat, index) => (
//             <motion.div
//               key={index}
//               whileHover={{ scale: 1.05, y: -5 }}
//               whileTap={{ scale: 0.95 }}
//               className="relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
//               <div className="relative z-10 p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
//                     {stat.icon}
//                   </div>
//                   <div
//                     className={`text-sm font-semibold ${
//                       stat.changeType === "positive" ? "text-green-600" : "text-red-600"
//                     }`}
//                   >
//                     {stat.change}
//                   </div>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
//                   <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Revenue Trend Chart */}
//           <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center gap-2 mb-6">
//               <TrendingUp className="w-5 h-5 text-red-600" />
//               <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
//             </div>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={monthlyRevenueData}>
//                 <defs>
//                   <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                 <XAxis dataKey="month" stroke="#64748b" />
//                 <YAxis stroke="#64748b" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "white",
//                     border: "1px solid #e2e8f0",
//                     borderRadius: "8px",
//                     boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                   }}
//                 />
//                 <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={3} fill="url(#revenueGradient)" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </motion.div>

//           {/* Booking Status Pie Chart */}
//           <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center gap-2 mb-6">
//               <PieIcon className="w-5 h-5 text-red-600" />
//               <h3 className="text-lg font-semibold text-gray-800">Booking Status Distribution</h3>
//             </div>
//             <ResponsiveContainer width="100%" height={300}>
//               <RechartsPieChart>
//                 <Pie
//                   data={bookingStatusData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={100}
//                   paddingAngle={5}
//                   dataKey="value"
//                 >
//                   {bookingStatusData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </RechartsPieChart>
//             </ResponsiveContainer>
//           </motion.div>

//           {/* Company Performance Bar Chart */}
//           <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center gap-2 mb-6">
//               <BarChart3 className="w-5 h-5 text-red-600" />
//               <h3 className="text-lg font-semibold text-gray-800">Company Performance</h3>
//             </div>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={companyPerformanceData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                 <XAxis dataKey="name" stroke="#64748b" />
//                 <YAxis stroke="#64748b" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "white",
//                     border: "1px solid #e2e8f0",
//                     borderRadius: "8px",
//                     boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                   }}
//                 />
//                 <Bar dataKey="bookings" fill="#dc2626" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </motion.div>

//           {/* Monthly Bookings Line Chart */}
//           <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center gap-2 mb-6">
//               <Activity className="w-5 h-5 text-red-600" />
//               <h3 className="text-lg font-semibold text-gray-800">Monthly Bookings</h3>
//             </div>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={monthlyRevenueData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                 <XAxis dataKey="month" stroke="#64748b" />
//                 <YAxis stroke="#64748b" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "white",
//                     border: "1px solid #e2e8f0",
//                     borderRadius: "8px",
//                     boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                   }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="bookings"
//                   stroke="#dc2626"
//                   strokeWidth={3}
//                   dot={{ fill: "#dc2626", strokeWidth: 2, r: 6 }}
//                   activeDot={{ r: 8, fill: "#dc2626" }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </motion.div>
//         </div>

//         {/* Quick Actions */}
//         <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[
//               { label: "Add Company", icon: <Car className="w-5 h-5" />, color: "bg-red-500" },
//               { label: "View Bookings", icon: <Calendar className="w-5 h-5" />, color: "bg-red-600" },
//               { label: "Customer Support", icon: <MessageSquare className="w-5 h-5" />, color: "bg-red-700" },
//               { label: "Generate Report", icon: <BarChart3 className="w-5 h-5" />, color: "bg-red-800" },
//             ].map((action, index) => (
//               <motion.button
//                 key={index}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className={`${action.color} text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-2`}
//               >
//                 {action.icon}
//                 <span className="text-sm font-medium">{action.label}</span>
//               </motion.button>
//             ))}
//           </div>
//         </motion.div>
//       </motion.div>
//     </div>
//   )
// }

// export default Dashboard









"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Car,
  Users,
  MessageSquare,
  DollarSign,
  Calendar,
  TrendingUp,
  Activity,
  BarChart3,
  PieChartIcon as PieIcon,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Pie,
} from "recharts"
import Navbar from "./Navbar"
import { useLoading } from "../Loader/LoadingProvider"

const Dashboard = () => {
  const [statsData, setStatsData] = useState({
    totalCompanies: 0,
    totalCustomers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalQueries: 0,
  })

  const token = localStorage.getItem("token")
  const { showLoader, hideLoader } = useLoading()

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => {
    const fetchStats = async () => {
      showLoader("Loading admin dashboard data...")
      try {
        const [companiesRes, customersRes, bookingsRes, paymentsRes, queriesRes] = await Promise.all([
          fetch("http://localhost:9090/api/rental-company/total", { headers }),
          fetch("http://localhost:9090/api/customers/total", { headers }),
          fetch("http://localhost:9090/api/bookings/total", { headers }),
          fetch("http://localhost:9090/api/payments/total-amount", { headers }),
          fetch("http://localhost:9090/api/contact/total", { headers }),
        ])

        const companies = await companiesRes.json()
        const customers = await customersRes.json()
        const bookings = await bookingsRes.json()
        const payments = await paymentsRes.json()
        const queries = await queriesRes.json()

        setStatsData({
          totalCompanies: companies || 0,
          totalCustomers: customers || 0,
          totalBookings: bookings || 0,
          totalRevenue: payments*0.25 || 0,
          totalQueries: queries || 0,
        })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        hideLoader()
      }
    }

    fetchStats()
  }, [])

  // Create chart data from API response
  const businessOverviewData = [
    {
      name: "Companies",
      value: statsData.totalCompanies,
      color: "#dc2626",
      icon: "🏢",
    },
    {
      name: "Customers",
      value: statsData.totalCustomers,
      color: "#ef4444",
      icon: "👥",
    },
    {
      name: "Bookings",
      value: statsData.totalBookings,
      color: "#f87171",
      icon: "📅",
    },
    {
      name: "Queries",
      value: statsData.totalQueries,
      color: "#fca5a5",
      icon: "💬",
    },
  ]

  // Revenue distribution (simulated based on actual revenue)
  // const revenueDistributionData = [
  //   {
  //     name: "Completed Bookings",
  //     value: Math.round(statsData.totalRevenue * 0.75),
  //     color: "#dc2626",
  //   },
  //   {
  //     name: "Pending Payments",
  //     value: Math.round(statsData.totalRevenue * 0.15),
  //     color: "#ef4444",
  //   },
  //   {
  //     name: "Refunds",
  //     value: Math.round(statsData.totalRevenue * 0.1),
  //     color: "#fca5a5",
  //   },
  // ]

  // Performance metrics based on actual data
  // const performanceMetricsData = [
  //   {
  //     metric: "Customer Ratio",
  //     value: statsData.totalCompanies > 0 ? Math.round(statsData.totalCustomers / statsData.totalCompanies) : 0,
  //     target: 50,
  //     color: "#dc2626",
  //   },
  //   {
  //     metric: "Booking Rate",
  //     value: statsData.totalCustomers > 0 ? Math.round((statsData.totalBookings / statsData.totalCustomers) * 100) : 0,
  //     target: 80,
  //     color: "#ef4444",
  //   },
  //   {
  //     metric: "Revenue per Booking",
  //     value: statsData.totalBookings > 0 ? Math.round(statsData.totalRevenue / statsData.totalBookings) : 0,
  //     target: 5000,
  //     color: "#f87171",
  //   },
  //   {
  //     metric: "Query Resolution",
  //     value:
  //       statsData.totalQueries > 0 ? Math.round(((statsData.totalQueries - 20) / statsData.totalQueries) * 100) : 0,
  //     target: 90,
  //     color: "#fca5a5",
  //   },
  // ]

  // Monthly trend simulation based on current totals
  // const monthlyTrendData = [
  //   {
  //     month: "Jan",
  //     revenue: Math.round(statsData.totalRevenue * 0.12),
  //     bookings: Math.round(statsData.totalBookings * 0.14),
  //     customers: Math.round(statsData.totalCustomers * 0.15),
  //   },
  //   {
  //     month: "Feb",
  //     revenue: Math.round(statsData.totalRevenue * 0.14),
  //     bookings: Math.round(statsData.totalBookings * 0.16),
  //     customers: Math.round(statsData.totalCustomers * 0.16),
  //   },
  //   {
  //     month: "Mar",
  //     revenue: Math.round(statsData.totalRevenue * 0.13),
  //     bookings: Math.round(statsData.totalBookings * 0.15),
  //     customers: Math.round(statsData.totalCustomers * 0.14),
  //   },
  //   {
  //     month: "Apr",
  //     revenue: Math.round(statsData.totalRevenue * 0.18),
  //     bookings: Math.round(statsData.totalBookings * 0.19),
  //     customers: Math.round(statsData.totalCustomers * 0.17),
  //   },
  //   {
  //     month: "May",
  //     revenue: Math.round(statsData.totalRevenue * 0.16),
  //     bookings: Math.round(statsData.totalBookings * 0.17),
  //     customers: Math.round(statsData.totalCustomers * 0.19),
  //   },
  //   {
  //     month: "Jun",
  //     revenue: Math.round(statsData.totalRevenue * 0.27),
  //     bookings: Math.round(statsData.totalBookings * 0.19),
  //     customers: Math.round(statsData.totalCustomers * 0.19),
  //   },
  // ]

  const stats = [
    {
      title: "Total Companies",
      value: statsData.totalCompanies,
      icon: <Car className="w-6 h-6" />,
      color: "from-red-500 to-red-600",
      
    },
    {
      title: "Total Customers",
      value: statsData.totalCustomers.toLocaleString(),
      icon: <Users className="w-6 h-6" />,
      color: "from-red-600 to-red-700",
      
    },
    {
      title: "Total Bookings",
      value: statsData.totalBookings.toLocaleString(),
      icon: <Calendar className="w-6 h-6" />,
      color: "from-red-700 to-red-800",
      
    },
    {
      title: "Revenue Generated",
      value: `₹${statsData.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-red-800 to-red-900",
      
    },
    {
      title: "Customer Queries",
      value: statsData.totalQueries,
      icon: <MessageSquare className="w-6 h-6" />,
      color: "from-red-500 to-red-600",
      
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto p-6 space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Rental Company Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Monitor your business performance in real-time</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                    {stat.icon}
                  </div>
   
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6">
          {/* Business Overview Bar Chart */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-800">Business Overview</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={businessOverviewData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Revenue Distribution Pie Chart */}
          {/* <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieIcon className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-800">Revenue Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={revenueDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Amount"]} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </motion.div> */}

          {/* Monthly Trends Area Chart */}
          {/* <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-800">Monthly Trends</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={3} fill="url(#revenueGradient)" />
                <Line type="monotone" dataKey="bookings" stroke="#ef4444" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div> */}

          {/* Performance Metrics Line Chart */}
         {/* <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-800">Performance Metrics</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceMetricsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="metric" type="category" stroke="#64748b" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="value" fill="#dc2626" radius={[0, 4, 4, 0]} />
                <Bar dataKey="target" fill="#fca5a5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div> */}
        </div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg. Revenue per Company</span>
                <span className="font-semibold text-red-600">
                  ₹
                  {statsData.totalCompanies > 0
                    ? Math.round(statsData.totalRevenue / statsData.totalCompanies).toLocaleString()
                    : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Customers per Company</span>
                <span className="font-semibold text-red-600">
                  {statsData.totalCompanies > 0 ? Math.round(statsData.totalCustomers / statsData.totalCompanies) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Booking Success Rate</span>
                <span className="font-semibold text-red-600">
                  {statsData.totalCustomers > 0
                    ? Math.round((statsData.totalBookings / statsData.totalCustomers) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Revenue Analysis</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Revenue</span>
                <span className="font-semibold text-red-600">₹{statsData.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Revenue per Booking</span>
                <span className="font-semibold text-red-600">
                  ₹
                  {statsData.totalBookings > 0
                    ? Math.round(statsData.totalRevenue / statsData.totalBookings).toLocaleString()
                    : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Revenue per Customer</span>
                <span className="font-semibold text-red-600">
                  ₹
                  {statsData.totalCustomers > 0
                    ? Math.round(statsData.totalRevenue / statsData.totalCustomers).toLocaleString()
                    : 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Customer Engagement</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Customers</span>
                <span className="font-semibold text-red-600">{statsData.totalCustomers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Queries</span>
                <span className="font-semibold text-red-600">{statsData.totalQueries}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Query Rate</span>
                <span className="font-semibold text-red-600">
                  {statsData.totalCustomers > 0
                    ? ((statsData.totalQueries / statsData.totalCustomers) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Add Company", icon: <Car className="w-5 h-5" />, color: "bg-red-500" },
              { label: "View Bookings", icon: <Calendar className="w-5 h-5" />, color: "bg-red-600" },
              { label: "Customer Support", icon: <MessageSquare className="w-5 h-5" />, color: "bg-red-700" },
              { label: "Generate Report", icon: <BarChart3 className="w-5 h-5" />, color: "bg-red-800" },
            ].map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${action.color} text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-2`}
              >
                {action.icon}
                <span className="text-sm font-medium">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div> */}
      </motion.div>
    </div>
  )
}

export default Dashboard
