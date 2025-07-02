
import { createContext, useContext, useState } from "react"
import { Car, Fuel, MapPin } from "lucide-react"

const LoadingContext = createContext()

// Car Loader Component (integrated)
function CarLoader({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
        <div className="text-center">
          {/* Car Animation */}
          <div className="relative mb-6">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="animate-bounce delay-0">
                <Car className="w-12 h-12 text-red-600" />
              </div>
              <div className="animate-bounce delay-100">
                <Fuel className="w-8 h-8 text-red-500" />
              </div>
              <div className="animate-bounce delay-200">
                <MapPin className="w-8 h-8 text-red-400" />
              </div>
            </div>

            {/* Road Animation */}
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 h-full w-8 bg-red-700 rounded-full animate-slide"></div>
            </div>
          </div>

          {/* Loading Text */}
          <h3 className="text-xl font-bold text-gray-800 mb-2">Car Rental Service</h3>
          <p className="text-red-600 font-medium mb-4">{message}</p>

          {/* Spinning Dots */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Global Loader Component (integrated)
function GlobalLoader({ isLoading, loadingMessage }) {
  if (!isLoading) return null
  return <CarLoader message={loadingMessage} />
}

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Loading...")

  const showLoader = (message = "Loading...") => {
    setLoadingMessage(message)
    setIsLoading(true)
  }

  const hideLoader = () => {
    setIsLoading(false)
    setLoadingMessage("Loading...")
  }

  const value = {
    isLoading,
    loadingMessage,
    showLoader,
    hideLoader,
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <GlobalLoader isLoading={isLoading} loadingMessage={loadingMessage} />
    </LoadingContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}
