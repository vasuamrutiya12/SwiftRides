// import { CreditCard, Calendar, User, Car, Hash } from "lucide-react"

// export default function PaymentCard({ payment }) {
//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "completed":
//         return "bg-green-100 text-green-800"
//       case "pending":
//         return "bg-yellow-100 text-yellow-800"
//       case "failed":
//         return "bg-red-100 text-red-800"
//       case "cancelled":
//         return "bg-gray-100 text-gray-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }
//   const getStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case "completed":
//         return "✓"
//       case "pending":
//         return "⏳"
//       case "failed":
//         return "✗"
//       case "cancelled":
//         return "⊘"
//       default:
//         return "?"
//     }
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold text-gray-900">Payment #{payment.id}</h3>
//         <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
//           <span className="mr-1">{getStatusIcon(payment.status)}</span>
//           {payment.status.charAt(0).toUpperCase() + payment.status.slice(1).toLowerCase()}
//         </div>
//       </div>
//       <div className="space-y-3">
//         <div className="flex items-center space-x-3">
//           <User className="h-4 w-4 text-gray-400" />
//           <span className="text-sm text-gray-600 font-medium">Customer Email:</span>
//           <span className="text-sm text-gray-800">{payment.customerEmail}</span>
//         </div>
//         <div className="flex items-center space-x-3">
//           <Car className="h-4 w-4 text-gray-400" />
//           <span className="text-sm text-gray-600 font-medium">Description:</span>
//           <span className="text-sm text-gray-800">{payment.description}</span>
//         </div>
//         <div className="flex items-center space-x-3">
//           <span className="text-sm text-gray-600 font-medium">Booking ID:</span>
//           <span className="text-sm text-gray-800">{payment.bookingId}</span>
//         </div>
//         <div className="flex items-center space-x-3">
//           <span className="text-sm text-gray-600 font-medium">Company ID:</span>
//           <span className="text-sm text-gray-800">{payment.companyId}</span>
//         </div>
//         <div className="flex items-center space-x-3">
//           <Calendar className="h-4 w-4 text-gray-400" />
//           <span className="text-sm text-gray-600 font-medium">Created At:</span>
//           <span className="text-sm text-gray-800">{payment.createdAt}</span>
//         </div>
//         <div className="flex items-center space-x-3">
//           <CreditCard className="h-4 w-4 text-gray-400" />
//           <span className="text-sm text-gray-600 font-medium">Payment Method:</span>
//           <span className="text-sm text-gray-800">{payment.paymentMethod}</span>
//         </div>
//         <div className="flex items-center space-x-3">
//           <span className="text-gray-400 font-bold">$</span>
//           <span className="text-sm text-gray-600 font-medium">Amount:</span>
//           <span className="text-sm text-gray-800">{payment.amount} {payment.currency?.toUpperCase()}</span>
//         </div>
//         <div className="flex items-center space-x-3">
//           <Hash className="h-4 w-4 text-gray-400" />
//           <span className="text-sm text-gray-600 font-medium">Gateway Transaction ID:</span>
//           <span className="text-sm text-gray-800">{payment.gatewayTransactionId || '-'}</span>
//         </div>
//         <div className="flex items-center space-x-3">
//           <span className="text-sm text-gray-600 font-medium">Stripe Session ID:</span>
//           <span className="text-sm text-gray-800">{payment.stripeSessionId}</span>
//         </div>
//         <div className="flex items-center space-x-3">
//           <span className="text-sm text-gray-600 font-medium">Stripe Payment Intent ID:</span>
//           <span className="text-sm text-gray-800">{payment.stripePaymentIntentId}</span>
//         </div>
//         <div className="flex items-center space-x-3">
//           <span className="text-sm text-gray-600 font-medium">Status:</span>
//           <span className={`text-sm font-bold ${getStatusColor(payment.status)}`}>{payment.status}</span>
//         </div>
//         {payment.failureReason && (
//           <div className="flex items-center space-x-3">
//             <span className="text-sm text-gray-600 font-medium">Failure Reason:</span>
//             <span className="text-sm text-red-600">{payment.failureReason}</span>
//           </div>
//         )}
//         <div className="flex items-center space-x-3">
//           <span className="text-sm text-gray-600 font-medium">Last Updated:</span>
//           <span className="text-sm text-gray-800">{payment.updatedAt}</span>
//         </div>
//       </div>
//       <div className="mt-4 pt-4 border-t border-gray-200">
//         <div className="flex items-center justify-between">
//           <span className="text-2xl font-bold text-red-600">{payment.currency?.toUpperCase() === 'INR' ? '₹' : payment.currency?.toUpperCase() === 'USD' ? '$' : ''}{payment.amount.toLocaleString()} {payment.currency?.toUpperCase()}</span>
//         </div>
//       </div>
//     </div>
//   )
// }



"use client"

import { motion } from "framer-motion"
import {
  CreditCard,
  Calendar,
  User,
  Car,
  Hash,
  CheckCircle,
  Clock,
  XCircle,
  Ban,
  DollarSign,
  Building2,
  Receipt,
} from "lucide-react"
import { IndianRupee } from "lucide-react"

export default function PaymentCard({ payment }) {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return {
          color: "bg-gradient-to-r from-green-500 to-emerald-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
          icon: CheckCircle,
          borderColor: "border-green-200",
        }
      case "pending":
        return {
          color: "bg-gradient-to-r from-amber-500 to-orange-500",
          textColor: "text-amber-700",
          bgColor: "bg-amber-50",
          icon: Clock,
          borderColor: "border-amber-200",
        }
      case "failed":
        return {
          color: "bg-gradient-to-r from-red-500 to-rose-500",
          textColor: "text-red-700",
          bgColor: "bg-red-50",
          icon: XCircle,
          borderColor: "border-red-200",
        }
      case "cancelled":
        return {
          color: "bg-gradient-to-r from-gray-500 to-slate-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          icon: Ban,
          borderColor: "border-gray-200",
        }
      default:
        return {
          color: "bg-gradient-to-r from-gray-500 to-slate-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          icon: Ban,
          borderColor: "border-gray-200",
        }
    }
  }

  const statusConfig = getStatusConfig(payment.status)
  const StatusIcon = statusConfig.icon

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
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

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  }

  const InfoRow = ({ icon: Icon, label, value, highlight = false }) => (
    <motion.div variants={itemVariants} className="flex items-center space-x-3 group">
      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
        <Icon className="h-4 w-4 text-red-400 group-hover:text-red-500 transition-colors" />
      </motion.div>
      <span className="text-sm text-gray-600 font-medium min-w-[140px]">{label}:</span>
      <span className={`text-sm ${highlight ? "font-bold text-red-600" : "text-gray-800"} flex-1`}>{value || "-"}</span>
    </motion.div>
  )

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-red-100"
    >
      {/* Red gradient background accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500" />

      <div className="p-6">
        {/* Header */}
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between mb-6"
        >
          <motion.div variants={itemVariants} className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="p-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg"
            >
              <Receipt className="h-5 w-5 text-white" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Payment #{payment.id}</h3>
              <p className="text-sm text-gray-500">Transaction Details</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border-2`}
          >
            <StatusIcon className={`h-4 w-4 ${statusConfig.textColor}`} />
            <span className={`text-sm font-bold ${statusConfig.textColor}`}>
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1).toLowerCase()}
            </span>
          </motion.div>
        </motion.div>

        {/* Payment Amount - Prominent Display */}
        <motion.div
          variants={itemVariants}
          className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="p-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg"
              >
                <IndianRupee className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Amount</p>
                <motion.p
                  whileHover={{ scale: 1.05 }}
                  className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent"
                >
                  {payment.currency?.toUpperCase() === "INR"
                    ? "₹"
                    : payment.currency?.toUpperCase() === "USD"
                      ? "$"
                      : ""}
                  {payment.amount.toLocaleString()} {payment.currency?.toUpperCase()}
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Details */}
        <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-4">
          <InfoRow icon={User} label="Customer Email" value={payment.customerEmail} />
          <InfoRow icon={Car} label="Description" value={payment.description} />
          <InfoRow icon={Building2} label="Booking ID" value={payment.bookingId} />
          <InfoRow icon={Building2} label="Company ID" value={payment.companyId} />
          <InfoRow icon={Calendar} label="Created At" value={payment.createdAt} />
          <InfoRow icon={CreditCard} label="Payment Method" value={payment.paymentMethod} />
          <InfoRow icon={Hash} label="Gateway Transaction ID" value={payment.gatewayTransactionId} />

          {payment.stripeSessionId && <InfoRow icon={Hash} label="Stripe Session ID" value={payment.stripeSessionId} />}

          {payment.stripePaymentIntentId && (
            <InfoRow icon={Hash} label="Stripe Payment Intent ID" value={payment.stripePaymentIntentId} />
          )}

          {payment.failureReason && (
            <motion.div variants={itemVariants} className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-700">Failure Reason:</span>
              </div>
              <p className="text-sm text-red-600 mt-1 ml-6">{payment.failureReason}</p>
            </motion.div>
          )}

          <InfoRow icon={Calendar} label="Last Updated" value={payment.updatedAt} />
        </motion.div>

        {/* Footer with gradient border */}
        <motion.div
          variants={itemVariants}
          className="mt-6 pt-4 border-t border-gradient-to-r from-red-200 to-rose-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-full" />
              </motion.div>
              <span>Secure Transaction</span>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-medium rounded-full"
            >
              ID: {payment.id}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
