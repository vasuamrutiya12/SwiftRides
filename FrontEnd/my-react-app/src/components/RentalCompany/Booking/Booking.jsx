import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import SearchFilter from "../SearchFilter"
import BookingCard from "./BookingCard"
import Navbar from "../Navbar"
import ItemsPerPageSelector from "./ItemsPerPageSelector"
import Pagination from "./Pagination"
import { useLoading } from "../../Loader/LoadingProvider"

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const { showLoader, hideLoader } = useLoading()

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  
  useEffect(() => {
    const fetchBookings = async () => {
      showLoader("Loading bookings data...");
      try {
        const resId = await fetch("http://localhost:8084/auth/user/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        });

        const id = await resId.json();
        const res = await fetch(`http://localhost:9090/api/bookings/companyId/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const bookingData = await res.json()
        
        // Enrich each booking with car and customer data
        const enrichedBookings = await Promise.all(
          bookingData.map(async (booking) => {
            const [carRes, customerRes] = await Promise.all([
              fetch(`http://localhost:9090/api/cars/${booking.carId}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
              fetch(`http://localhost:9090/api/customers/${booking.customerId}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ])

            const car = await carRes.json()
            const customer = await customerRes.json()
            return {
              ...booking,
              totalAmount: booking.totalAmount*0.75,
              customerName: customer.fullName,
              customerPhone: customer.phoneNumber,
              customerEmail: customer.email, 
              carName: `${car.make} ${car.model}`,
            }
          })
        )

        setBookings(enrichedBookings)
      } catch (error) {
        console.error("Failed to fetch bookings", error)
      } finally {
        setLoading(false)
        hideLoader()
      }
    }

    fetchBookings()
  }, [])

  const filterOptions = [
    { value: "all", label: "All Bookings" },
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ]

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.carName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || booking.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBookings = filteredBookings.slice(startIndex, endIndex)

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      <Navbar />
      <div className="flex items-center justify-between mx-5">
        <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
        <div className="text-sm text-gray-500">Total Bookings: {bookings.length}</div>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterValue={filterStatus}
        setFilterValue={setFilterStatus}
        filterOptions={filterOptions}
        placeholder="Search by customer name, car, or email..."
      />

      <ItemsPerPageSelector
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {loading ? (
        <div className="text-center py-12 mx-5">
          <div className="text-gray-500 text-lg">Loading...</div>
        </div>
      ) : currentBookings.length === 0 ? (
        <div className="text-center py-12 mx-5">
          <div className="text-gray-500 text-lg">No bookings found matching your criteria</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mx-5">
            {currentBookings.map((booking) => (
              <BookingCard key={booking.bookingId} booking={booking} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredBookings.length}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}
    </div>
  )
}
