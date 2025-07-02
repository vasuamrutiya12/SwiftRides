import { useState, useEffect } from "react"
import { Car, ArrowLeft, Star, Users, MapPin, CheckCircle, Calendar, Clock, CreditCard } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useLoading } from "../Loader/LoadingProvider";

const BookCarForm = ({ car, company, onBack }) => {

  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [currency, setCurrency] = useState("inr");
  const [exchangeRates, setExchangeRates] = useState({});
  const { showLoader, hideLoader } = useLoading();

  const [id, setId] = useState(0);
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  // Supported currencies for Stripe
  const supportedCurrencies = [
    { code: "inr", name: "Indian Rupee", symbol: "₹" },
    { code: "usd", name: "US Dollar", symbol: "$" },
    { code: "eur", name: "Euro", symbol: "€" },
    { code: "gbp", name: "British Pound", symbol: "£" },
    { code: "aud", name: "Australian Dollar", symbol: "A$" },
    { code: "cad", name: "Canadian Dollar", symbol: "C$" },
    { code: "jpy", name: "Japanese Yen", symbol: "¥" },
    { code: "sgd", name: "Singapore Dollar", symbol: "S$" },
  ];

  // Fetch exchange rates on component mount
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        // Using a free API for exchange rates (you can replace with your preferred service)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        // Fallback rates if API fails
        setExchangeRates({
          INR: 1,
          USD: 0.012,
          EUR: 0.011,
          GBP: 0.0095,
          AUD: 0.018,
          CAD: 0.016,
          JPY: 1.8,
          SGD: 0.016,
        });
      }
    };

    fetchExchangeRates();
  }, []);

  const validateDates = () => {
    const today = new Date()
    const maxDate = new Date()
    maxDate.setMonth(today.getMonth() + 5)
    const pickup = new Date(pickupDate)
    const returnD = new Date(returnDate)

    if (pickup < today) {
      setError("Pickup date must be a future date.")
      return false
    }
    if (pickup > maxDate) {
      setError("Pickup date must be within 5 months from today.")
      return false
    }
    if (returnD <= pickup) {
      setError("Return date must be after the pickup date.")
      return false
    }

    setError("")
    return true
  }

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (!exchangeRates[toCurrency.toUpperCase()]) return amount;
    
    // Convert from INR to target currency
    const convertedAmount = amount * exchangeRates[toCurrency.toUpperCase()];
    
    // Round to 2 decimal places for most currencies, except JPY which doesn't use decimals
    if (toCurrency.toLowerCase() === 'jpy') {
      return Math.round(convertedAmount);
    }
    return Math.round(convertedAmount * 100) / 100;
  };

  const calculateTotal = () => {
    if (!pickupDate || !returnDate) return 0
    const totalDays = Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24))
    const totalInINR = Math.max(1, totalDays) * car.dailyRate
    return convertCurrency(totalInINR, 'inr', currency)
  }

  const getCurrentCurrencySymbol = () => {
    const currencyObj = supportedCurrencies.find(c => c.code === currency);
    return currencyObj ? currencyObj.symbol : '₹';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateDates()) {
      setIsSubmitting(false);
      return;
    }

    const totalDays = Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24));
    const totalAmountINR = Math.max(1, totalDays) * car.dailyRate;
    // Don't convert here - send original INR amount to backend
    // const totalAmountConverted = convertCurrency(totalAmountINR, 'inr', currency);

    const booking = {
      companyID: car.companyId,
      carId: car.carId,
      pickupDate: new Date(pickupDate).toISOString(),
      returnDate: new Date(returnDate).toISOString(),
      totalDays: Math.max(1, totalDays),
      totalAmount: totalAmountINR, // Send original INR amount
      status: "pending",
      bookingReference: "BOOK" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      errorMessage: "",
    };

    try {
      const resId = await fetch("http://localhost:8084/auth/user/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      const Id = await resId.json();
      setId(Id);
      
      const response = await fetch(`http://localhost:9090/api/customers/${Id}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(booking),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.errorMessage);
      }

      const data = await response.json();
      alert(`Booking submitted successfully! Reference: ${data.bookingReference}`);
      
      const paymentPayload = {
        bookingId: Number(data.bookingId),
        companyId: Number(booking.companyID),
        amount: Number(totalAmountINR), // Send original INR amount
        paymentMethod: "card",
        currency: currency.toLowerCase(),
        customerEmail: email?.trim() || "unknown@example.com",
        description: "Payment for car rental booking",
      };


      const paymentResponse = await fetch("http://localhost:9090/api/payments/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentPayload),
      });

      if (!paymentResponse.ok) {
        throw new Error("Failed to initiate payment session");
      }

      const paymentData = await paymentResponse.json();
      const redirectUrl = paymentData.checkoutUrl;

      // Redirect to Stripe Checkout
      window.location.href = redirectUrl;

    } catch (error) {
      console.error("Error:", error);
      alert(error);
      navigate(-1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => {
    if (onBack && typeof onBack === 'function') {
      onBack()
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleBackClick()
    }
  }

  const totalDays =
    pickupDate && returnDate
      ? Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)))
      : 0

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-3xl z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to cars</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl overflow-hidden">
                <div className="relative h-72 p-1">
                  <img
                    src={car.imageUrls[0]}
                    alt={`${car.make} ${car.model}`}
                    className="rounded-2xl w-full h-full bg-white object-contain"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {car.make} {car.model}
                      </h1>
                      <div className="flex items-center gap-4 text-gray-600">
                        <span className="flex items-center gap-1">
                          <Car className="w-4 h-4" />
                          {car.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {car.seatingCapacity} seats
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {car.fuelType}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        {getCurrentCurrencySymbol()}{convertCurrency(car.dailyRate, 'inr', currency)}
                      </div>
                      <div className="text-gray-500">per day</div>
                      {currency !== 'inr' && (
                        <div className="text-sm text-gray-400">
                          (₹{car.dailyRate} INR)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {car.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Book This Car</h2>

                <div onSubmit={handleSubmit} className="space-y-6">
                  {/* Pickup Date */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Pickup Date
                      </label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Return Date */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Return Date
                      </label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Currency Selection */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CreditCard className="w-4 h-4 inline mr-1" />
                        Payment Currency
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        required
                      >
                        {supportedCurrencies.map((curr) => (
                          <option key={curr.code} value={curr.code}>
                            {curr.symbol} {curr.name} ({curr.code.toUpperCase()})
                          </option>
                        ))}
                      </select>
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

                  {/* Price Summary */}
                  {totalDays > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Daily rate</span>
                        <span className="font-medium">
                          {getCurrentCurrencySymbol()}{convertCurrency(car.dailyRate, 'inr', currency)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">
                          {totalDays} day{totalDays > 1 ? "s" : ""}
                        </span>
                      </div>
                      {currency !== 'inr' && (
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Original price (INR)</span>
                          <span>₹{Math.max(1, totalDays) * car.dailyRate}</span>
                        </div>
                      )}
                      <div className="border-t border-blue-200 pt-2">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900">Total</span>
                          <span className="font-bold text-xl text-blue-600">
                            {getCurrentCurrencySymbol()}{calculateTotal()}
                          </span>
                        </div>
                        {currency !== 'inr' && (
                          <div className="text-xs text-gray-500 text-right mt-1">
                            (₹{Math.max(1, totalDays) * car.dailyRate} INR)
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    disabled={isSubmitting || !pickupDate || !returnDate}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Book Now - {getCurrentCurrencySymbol()}{calculateTotal()}
                      </>
                    )}
                  </button>
                </div>

                {/* Security Note */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">🔒 Your booking is secure and protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookCarForm;