import { Calendar, User, Car, Phone, Mail, DollarSign } from "lucide-react"

export default function BookingCard({ booking }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Booking #{booking.id}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{booking.customerName}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Car className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{booking.carName}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {booking.startDate} to {booking.endDate}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{booking.customerEmail}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{booking.customerPhone}</span>
        </div>

        <div className="flex items-center space-x-3">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-semibold text-red-600">${booking.totalAmount}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-3 rounded-md text-sm transition-colors">
            View payment details
          </button>
          
        </div>
      </div>
    </div>
  )
}
