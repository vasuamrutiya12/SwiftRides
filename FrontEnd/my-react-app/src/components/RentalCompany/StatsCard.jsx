// import { TrendingUp, TrendingDown } from "lucide-react"

// // eslint-disable-next-line no-unused-vars
// export default function StatsCard({ title, value, icon: Icon, color, change, changeType }) {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow font-bold">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-xl font-medium text-gray-600">{title}</p>
//           <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
//         </div>
//         <div className={`p-3 rounded-full ${color}`}>
//           <Icon className="h-6 w-6 text-white" />
//         </div>
//       </div>

//       {change && (
//         <div className="mt-4 flex items-center">
//           {changeType === "positive" ? (
//             <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//           ) : (
//             <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
//           )}
//           <span className={`text-sm font-medium ${changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
//             {change}
//           </span>
//           <span className="text-sm text-gray-500 ml-1">from last month</span>
//         </div>
//       )}
      
//     </div>
//   )
// }






"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

export default function StatsCard({ title, value, icon: Icon, color, change, changeType, description, index }) {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  const iconVariants = {
    hover: {
      rotate: 360,
      scale: 1.1,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  }

  const valueVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        delay: index * 0.1 + 0.3,
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="relative group"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300" />

      {/* Border gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-200 via-transparent to-rose-200 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative bg-white rounded-2xl p-6 border border-gray-100 group-hover:border-red-200 transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div variants={iconVariants} className={`p-3 bg-gradient-to-br ${color} rounded-xl shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
              <p className="text-xs text-gray-400">{description}</p>
            </div>
          </div>

          {/* Change indicator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              changeType === "positive" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {changeType === "positive" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{change}</span>
          </motion.div>
        </div>

        {/* Value */}
        <motion.div variants={valueVariants} className="mb-4">
          <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              transition={{ delay: index * 0.1 + 0.6, duration: 1 }}
              className={`h-full bg-gradient-to-r ${color} rounded-full`}
            />
          </div>
        </motion.div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>vs last month</span>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
              delay: index * 0.2,
            }}
            className="w-2 h-2 bg-gradient-to-r from-red-400 to-rose-500 rounded-full"
          />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  )
}
