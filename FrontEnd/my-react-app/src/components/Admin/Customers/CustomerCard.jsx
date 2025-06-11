import { useState } from "react"
import { X, Eye, Check, Trash2, User, Phone, MapPin, CreditCard } from "lucide-react"

const VerificationModal = ({
  customer,
  isOpen,
  onClose,
  onApprove,
  onDelete,
}) => {
  const [isApproving, setIsApproving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const token = localStorage.getItem("token")

  const handleApprove = async () => {
    setIsApproving(true)
      // API call to approve customer
    //   const response = await fetch("/api/customers/approve", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       customerId: customer.customerId,
    //       status: "approved",
    //     }),
    //   })
        onApprove(customer.customerId)
        onClose()
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:9090/api/customers/${customer.customerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        onDelete(customer.customerId);
        onClose();
      } else {
        // Optionally handle error
        alert("Failed to delete customer.");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Error deleting customer.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-white to-red-50 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-800">Customer Verification</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Details */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-800 mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Name:</span>
                <p className="text-gray-800">{customer.fullName}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Phone:</span>
                <p className="text-gray-800">{customer.phoneNumber}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Email:</span>
                <p className="text-gray-800">{customer.email || "Not provided"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">License Number:</span>
                <p className="text-gray-800">{customer.drivingLicenseNumber}</p>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-600">Address:</span>
                <p className="text-gray-800">{customer.address}</p>
              </div>
            </div>
          </div>

          {/* Driving License Image */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Driving License</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <img
                src={customer.drivinglicenseimage}
                alt="Driving License"
                className="w-full max-w-md mx-auto rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            {customer.verificationstatus !== "approved" ? (
              <>
                <button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {isApproving ? "Approving..." : "Approve Customer"}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  {isDeleting ? "Deleting..." : "Delete Customer"}
                </button>
              </>
            ) : (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                {isDeleting ? "Removing..." : "Remove Customer"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const CustomerCard = ({ customer, onApprove = () => {}, onDelete = () => {} }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <>
      <div
        className="w-[450px] bg-gradient-to-b from-white to-red-50 border-2 border-red-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-red-300 hover:-translate-y-1 text-xl"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-400 to-red-500 text-white p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className=" font-bold">{customer.fullName}</h3>
                <p className="text-red-100 text-sm">ID: {customer.customerId}</p>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(customer.verificationstatus)}`}
            >
              {customer.verificationstatus?.charAt(0).toUpperCase() + customer.verificationstatus?.slice(1)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <Phone className="w-4 h-4 text-red-500" />
            <span>{customer.phoneNumber}</span>
          </div>

          {customer.email && (
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">@</span>
              </div>
              <span>{customer.email}</span>
            </div>
          )}

          <div className="flex items-start gap-3 text-gray-700">
            <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
            <span >{customer.address}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <CreditCard className="w-4 h-4 text-red-500" />
            <span>{customer.drivingLicenseNumber}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm text-red-700 font-medium">Click to verify</span>
            <Eye className="w-4 h-4 text-red-500" />
          </div>
        </div>
      </div>

      <VerificationModal
        customer={customer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={onApprove}
        onDelete={onDelete}
      />
    </>
  )
}

export default CustomerCard;