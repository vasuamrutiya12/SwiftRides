import { useState, useEffect } from "react"
import SearchFilter from "../SearchFilter"
import PaymentCard from "./PaymentCard"
import PaymentStats from "./PaymentStats"
import Navbar from "../Navbar"
import ItemsPerPageSelector from "../Booking/ItemsPerPageSelector"
import Pagination from "../Booking/Pagination"
import { useLoading } from "../../Loader/LoadingProvider"

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [payments, setPayments] = useState([])
  const [error, setError] = useState(null)
  const { showLoader, hideLoader, isLoading } = useLoading()

  useEffect(() => {
    const fetchPayments = async () => {
      showLoader("Loading Payments...")
      setError(null)
      try {
        const token = localStorage.getItem("token")
        const email = localStorage.getItem("email")
        // 1. Get companyId from email
        const resId = await fetch("http://localhost:8084/auth/user/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        })
        const companyId = await resId.json()
        // 2. Get all payments for this company
        const res = await fetch(`http://localhost:9090/api/payments/company/${companyId}`,
          { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) throw new Error("Failed to fetch payments")
        const paymentData = await res.json()
        paymentData.forEach(payment => {
          payment.amount = payment.amount*0.75
        })
        setPayments(paymentData)
      } catch (err) {
        setError(err)
      } finally {
        hideLoader()
      }
    }
    fetchPayments()
  }, [])

  const filterOptions = [
    { value: "all", label: "All Payments" },
    { value: "COMPLETED", label: "Completed" },
    { value: "PENDING", label: "Pending" },
    { value: "FAILED", label: "Failed" },
    { value: "CANCELLED", label: "Cancelled" },
  ]

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.stripeSessionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.stripePaymentIntentId?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || payment.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPayments = filteredPayments.slice(startIndex, endIndex)

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      <Navbar />
      <div className="flex items-center justify-between mx-5">
        <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
        <div className="text-sm text-gray-500">Total Transactions: {payments.length}</div>
      </div>

      <PaymentStats payments={payments} />

      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterValue={filterStatus}
        setFilterValue={setFilterStatus}
        filterOptions={filterOptions}
        placeholder="Search by customer, description, or transaction ID..."
      />
      <ItemsPerPageSelector
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
      {isLoading ? (
        <div className="text-center py-12 mx-5">
          <div className="text-gray-500 text-lg">Loading...</div>
        </div>
      ) : error ? (
        <div className="text-center py-12 mx-5">
          <div className="text-red-500 text-lg">Error loading payments: {error.message}</div>
        </div>
      ) : currentPayments.length === 0 ? (
        <div className="text-center py-12 mx-5">
          <div className="text-gray-500 text-lg">
            {filteredPayments.length === 0 ? "No payment found matching your criteria" : "Loading..."}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mx-5">
            {currentPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredPayments.length}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}
    </div>
  )
}
