import { useState, useEffect } from "react"
import { Calendar, Car, CheckCircle, Clock, CreditCard, MapPin, Star, Users, X, User, Mail, Phone } from "lucide-react"
import { addMonths, isBefore } from "date-fns"

const BookingModal = ({ isOpen, onClose, car, company }) => {
  const [formData, setFormData] = useState({
    pickupDate: "",
    returnDate: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        pickupDate: "",
        pickupTime: "10:00",
        returnDate: "",
        returnTime: "10:00",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
      })
      setError("")
    }
  }, [isOpen])

  const validateDates = () => {
    const today = new Date()
    const maxDate = addMonths(today, 5)
    const pickup = new Date(`${formData.pickupDate}`)
    const returnD = new Date(`${formData.returnDate}`)

    if (isBefore(pickup, today)) {
      setError("Pickup date must be a future date.")
      return false
    }
    if (isBefore(maxDate, pickup)) {
      setError("Pickup date must be within 5 months from today.")
      return false
    }
    if (isBefore(returnD, pickup)) {
      setError("Return date and time must be after the pickup date and time.")
      return false
    }

    setError("")
    return true
  }

  const calculateTotalDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 0
    const pickup = new Date(`${formData.pickupDate}`)
    const returnD = new Date(`${formData.returnDate}`)
    const diffTime = returnD - pickup
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(1, diffDays)
  }

  const calculateTotalAmount = () => {
    const totalDays = calculateTotalDays()
    return totalDays * car.dailyRate
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const generateBookingReference = () => {
    return `BR${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!validateDates()) {
      setIsSubmitting(false)
      return
    }

    const totalDays = calculateTotalDays()
    const totalAmount = calculateTotalAmount()
    const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`)
    const returnDateTime = new Date(`${formData.returnDate}T${formData.returnTime}`)

    const booking = {
      companyID: company.companyId,
      customerId: 123, // This should come from authenticated user
      carId: car.carId,
      pickupDate: pickupDateTime.toISOString(),
      returnDate: returnDateTime.toISOString(),
      totalDays,
      totalAmount,
      status: "pending",
      bookingReference: generateBookingReference(),
      createdAt: new Date().toISOString(),
      customerDetails: {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
      },
    }

    // Simulate API call
    setTimeout(() => {
      console.log("Booking data:", booking)
      alert(`Booking confirmed! Reference: ${booking.bookingReference}`)
      setIsSubmitting(false)
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  const totalDays = calculateTotalDays()
  const totalAmount = calculateTotalAmount()

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="grid md:grid-cols-2 max-h-[90vh] overflow-y-auto">
            {/* Left Side - Car Details */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Book Your Car</h2>
                <p className="text-blue-100">Complete your reservation in just a few steps</p>
              </div>

              {/* Car Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-blue-100 text-sm">{car.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{car.seatingCapacity} seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{car.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{car.rating || "4.8"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>${car.dailyRate}/day</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Included Features</h4>
                <div className="grid grid-cols-1 gap-2">
                  {car.features?.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              {totalDays > 0 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <h4 className="font-semibold mb-3">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Daily rate</span>
                      <span>${car.dailyRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration</span>
                      <span>
                        {totalDays} day{totalDays > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="border-t border-white/20 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Booking Form */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Rental Dates */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Rental Period</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Pickup Date
                      </label>
                      <input
                        type="date"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>


                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Return Date
                      </label>
                      <input
                        type="date"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-600 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !formData.pickupDate ||
                    !formData.returnDate ||
                    !formData.customerName ||
                    !formData.customerEmail ||
                    !formData.customerPhone
                  }
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Booking...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Confirm Booking
                    </>
                  )}
                </button>

                {/* Security Note */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">🔒 Your information is secure and protected</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingModal
