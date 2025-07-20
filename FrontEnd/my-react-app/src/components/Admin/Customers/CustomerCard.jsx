import { useState } from "react"
import { X, Eye, Check, Trash2, User, Phone, MapPin, CreditCard } from "lucide-react"
import userImg from "../../../images/userImg.png"
import { useLoading } from "../../Loader/LoadingProvider"

const VerificationModal = ({
  customer,
  isOpen,
  onClose,
  onApprove,
  onDelete,
}) => {
  const [isApproving, setIsApproving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const token = localStorage.getItem("token")
  const { showLoader, hideLoader } = useLoading()

  const handleApprove = async () => {
    setIsApproving(true)
    showLoader("Approving Customer...")
    onApprove(customer.customerId)
    onClose()
    hideLoader()
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }
    setIsDeleting(true);
    showLoader("Rejecting Customer...");
    try {
      const response = await fetch(`http://localhost:9090/api/customers/block/${customer.customerId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          drivingLicenseStatus: "rejected",
        })
      });
      if (response.ok) {
        // Notify customer via NotificationService
        const notifyRes = await fetch("http://localhost:9090/api/notification/block-reason", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            customerId: customer.customerId,
            customerEmail: customer.email,
            customerName: customer.fullName,
            reason: rejectReason
          })
        });
        if (notifyRes.ok) {
          onClose();
          alert("Customer rejected and notified by email.");
        } else {
          alert("Customer rejected, but failed to send notification email.");
        }
      } else {
        alert("Failed to reject customer.");
      }
    } catch (error) {
      console.error("Error rejecting customer:", error);
      alert("Error rejecting customer.");
    } finally {
      setIsDeleting(false);
      hideLoader();
      window.location.reload();
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    showLoader("Blocking Customer...")
    try {
      const response = await fetch(`http://localhost:9090/api/customers/block/${customer.customerId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body:{
          drivingLicenseStatus:"rejected"
        }
      });
      if (response.ok) {
        onClose();
      } else {
        // Optionally handle error
        alert("Failed to block customer.");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Error blocking customer.");
    } finally {
      setIsDeleting(false);
      hideLoader()
      window.location.reload()
    }
  };
  const handleUnblock = async () => {
    setIsDeleting(true);
    showLoader("Blocking Customer...")
    try {
      const response = await fetch(`http://localhost:9090/api/customers/block/${customer.customerId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body:{
          drivingLicenseStatus:"verified"
        }
      });
      if (response.ok) {
        onDelete(customer.customerId);
        onClose();
      } else {
        // Optionally handle error
        alert("Failed to block customer.");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Error blocking customer.");
    } finally {
      setIsDeleting(false);
      hideLoader()
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
              {customer.drivingLicenseImg ? (
                <img
                  src={customer.drivingLicenseImg}
                  alt="Driving License"
                  className="w-full max-w-md mx-auto rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No license image uploaded</p>
                </div>
              )}
              {customer.drivingLicenseImg && (
                <div className="text-center py-8 hidden">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">Failed to load license image</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            {customer.drivingLicenseStatus !== "verified" ? (
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
                  onClick={() => setShowRejectForm(true)}
                  disabled={isDeleting}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  {isDeleting ? "Rejecting..." : "Reject Customer"}
                </button>
              </>
            ) : (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                {isDeleting ? "Blocking..." : "Block Customer"}
              </button>
            )}
          </div>

          {/* Reject Reason Form Modal */}
          {showRejectForm && (
            <div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-60">
              <div className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl p-8 max-w-md w-full">
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                  disabled={isDeleting}
                >
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-gray-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /></svg>
                </button>
                <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">Reject Customer</h3>
                <label className="block mb-2 text-gray-700 font-semibold">Reason for rejection</label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl p-3 mb-4 min-h-[90px] focus:outline-none focus:ring-2 focus:ring-red-200 transition"
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Enter reason..."
                  disabled={isDeleting}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium border border-gray-300"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Rejecting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const CustomerCard = ({ customer, onApprove = () => {}}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "verified":
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
        className="w-[420px] bg-gradient-to-b from-white to-red-50 border-2 border-red-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-red-300 hover:-translate-y-1 text-xl"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-400 to-red-500 text-white p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <img
                src={userImg}
                alt={customer.fullname || 'Customer'}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-red-200 shadow-md"
                />
              </div>
              <div>
                <h3 className=" font-bold">{customer.fullName}</h3>
                <p className="text-red-100 text-sm">ID: {customer.customerId}</p>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(customer.drivingLicenseStatus)}`}
            >
              {customer.drivingLicenseStatus?.charAt(0).toUpperCase() + customer.drivingLicenseStatus?.slice(1) || "Pending"}
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
            {customer.drivingLicenseImg && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                License Image
              </span>
            )}
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
      />
    </>
  )
}

export default CustomerCard;