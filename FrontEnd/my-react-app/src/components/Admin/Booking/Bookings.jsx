import { useState, useEffect } from "react";
import SearchFilter from "../../RentalCompany/SearchFilter";
import BookingCard from "./BookingCard";
import Navbar from "../Navbar";
import ItemsPerPageSelector from "../../RentalCompany/Booking/ItemsPerPageSelector";
import Pagination from "../../RentalCompany/Booking/Pagination";
import { useLoading } from "../../Loader/LoadingProvider";

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    const fetchBookings = async () => {
      showLoader("Loading admin bookings data...");
      try {
        const response = await fetch("http://localhost:9090/api/bookings", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        const enrichedBookings = await Promise.all(
          data.map(async (booking) => {
            const [carRes, customerRes] = await Promise.all([
              fetch(`http://localhost:9090/api/cars/${booking.carId}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
              fetch(`http://localhost:9090/api/customers/${booking.customerId}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ]);

            const car = await carRes.json();
            const customer = await customerRes.json();

            return {
              ...booking,
              commission:booking.totalAmount*0.25 ,
              customerName: customer.fullName,
              customerPhone: customer.phoneNumber,
              customerEmail: customer.email || `user${customer.customerId}@example.com`,
              carName: `${car.make} ${car.model}`,
            };
          })
        );
        setBookings(enrichedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
        hideLoader();
      }
    };

    fetchBookings();
  }, [token]);

  const filterOptions = [
    { value: "all", label: "All Bookings" },
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      (booking.customerName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (booking.carName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (booking.customerEmail?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all" || booking.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

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
          <div className="grid grid-cols-1 min-[890px]:grid-cols-2 min-[1090px]:grid-cols-3 min-[1410px]:grid-cols-4 gap-4 sm:gap-6 mx-5">
            {currentBookings.map((booking) => (
              <BookingCard key={`${booking.id}-${booking.customerEmail}`} booking={booking} />  
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
  );
}
