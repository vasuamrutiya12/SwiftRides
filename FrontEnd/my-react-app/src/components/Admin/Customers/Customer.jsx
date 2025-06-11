import { useState, useEffect } from "react"
import SearchFilter from "../../RentalCompany/SearchFilter"
import CustomerCard from "./CustomerCard"
import Navbar from "../Navbar"
import ItemsPerPageSelector from "../../RentalCompany/Booking/ItemsPerPageSelector"
import Pagination from "../../RentalCompany/Booking/Pagination"

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)

  const [customers, setCustomers] = useState([]);
  const token = localStorage.getItem("token"); // Replace with your actual token
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchCustomers = async () => {
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
  }, []);


  const handleApprove = (customerId) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.customerId === customerId ? { ...customer, verificationstatus: "approved" } : customer,
      ),
    )
    console.log(`Customer ${customerId} approved`)
  }

  const handleDelete = (customerId) => {
    setCustomers((prev) => prev.filter((customer) => customer.customerId !== customerId))
    console.log(`Customer ${customerId} deleted`)
  }
  

  const filterOptions = [
    { value: "all", label: "All Customer" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
  ]

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || customer.verificationstatus === filterStatus
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-5">
              {currentCustomers.map((customer) => (
                <CustomerCard 
                  key={customer.customerId} 
                  customer={customer} 
                  onApprove={handleApprove}
                  onDelete={handleDelete}
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