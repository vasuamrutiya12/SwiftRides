import { useState, useEffect } from "react"
import SearchFilter from "../../RentalCompany/SearchFilter"
import CustomerCard from "./CustomerCard"
import Navbar from "../Navbar"
import ItemsPerPageSelector from "../../RentalCompany/Booking/ItemsPerPageSelector"
import Pagination from "../../RentalCompany/Booking/Pagination"
import { useLoading } from "../../Loader/LoadingProvider"

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const { showLoader , hideLoader} = useLoading();
  const [customers, setCustomers] = useState([]);
  const token = localStorage.getItem("token"); // Replace with your actual token
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchCustomers = async () => {
      showLoader("customer is comming...")
      try {
        const response = await fetch("http://localhost:9090/api/customers", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }

        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
    hideLoader();

  }, []);


  const handleApprove = async (customerId) => {
    try {
      const response = await fetch(`http://localhost:9090/api/customers/${customerId}/status`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "verified" })
      });

      if (response.ok) {
        // Get the updated customer data from the response
        const updatedCustomer = await response.json();
        
        // Update the local state with the server response
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.customerId === customerId ? updatedCustomer : customer,
          ),
        );
        console.log(`Customer ${customerId} approved`);
      } else {
        console.error("Failed to approve customer");
        alert("Failed to approve customer. Please try again.");
      }
    } catch (error) {
      console.error("Error approving customer:", error);
      alert("Error approving customer. Please try again.");
    }
  }

  

  const filterOptions = [
    { value: "all", label: "All Customer" },
    { value: "pending", label: "Pending" },
    { value: "verified", label: "Verified" },
  ]

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || customer.drivingLicenseStatus === filterStatus
    return matchesSearch && matchesFilter
  })
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex)

  

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
        <Navbar />
      <div className="flex items-center justify-between mx-5">
        <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
        <div className="text-sm text-gray-500">Total Happy Customers: {customers.length}</div>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterValue={filterStatus}
        setFilterValue={setFilterStatus}
        filterOptions={filterOptions}
        placeholder="Search by customer name or email..."
      />

      <ItemsPerPageSelector
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />


       {currentCustomers.length === 0 ? (
          <div className="text-center py-12 mx-5">
            <div className="text-gray-500 text-lg">
              {filteredCustomers.length === 0 ? "No Customers found matching your criteria" : "Loading..."}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 min-[890px]:grid-cols-2 min-[1300px]:grid-cols-3 min-[1720px]:grid-cols-4 gap-4 sm:gap-6 mx-5">
              {currentCustomers.map((customer) => (
                <CustomerCard 
                  key={customer.customerId} 
                  customer={customer} 
                  onApprove={handleApprove}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredCustomers.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </div>
  )
}