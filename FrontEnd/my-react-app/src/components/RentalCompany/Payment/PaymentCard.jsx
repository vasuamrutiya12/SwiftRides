import { CreditCard, Calendar, User, Car, Hash } from "lucide-react"

export default function PaymentCard({ payment }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✓"
      case "pending":
        return "⏳"
      case "failed":
        return "✗"
      case "cancelled":
        return "⊘"
      default:
        return "?"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Payment #{payment.id}</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
          <span className="mr-1">{getStatusIcon(payment.status)}</span>
          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{payment.customerName}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Car className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{payment.carName}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{payment.date}</span>
        </div>

        <div className="flex items-center space-x-3">
          <CreditCard className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{payment.paymentMethod}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Hash className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{payment.transactionId}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-red-600">${payment.amount.toLocaleString()}</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-sm transition-colors">
              View Details
            </button>
            {payment.status === "pending" && (
              <button className="px-3 py-1 bg-green-50 hover:bg-green-100 text-green-600 rounded text-sm transition-colors">
                Process
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
