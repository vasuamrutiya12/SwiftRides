import { useState } from "react"
import SearchFilter from "../SearchFilter"
import PaymentCard from "./PaymentCard"
import PaymentStats from "./PaymentStats"
import Navbar from "../Navbar"
import ItemsPerPageSelector from "../Booking/ItemsPerPageSelector"
import Pagination from "../Booking/Pagination"

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const payments = [
    {
      id: 1,
      customerName: "John Doe",
      carName: "BMW X5",
      amount: 2250,
      status: "completed",
      date: "2024-01-15",
      paymentMethod: "Credit Card",
      transactionId: "TXN001",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      carName: "Mercedes C-Class",
      amount: 760,
      status: "pending",
      date: "2024-01-12",
      paymentMethod: "PayPal",
      transactionId: "TXN002",
    },
    {
      id: 3,
      customerName: "Mike Johnson",
      carName: "Audi Q7",
      amount: 2600,
      status: "failed",
      date: "2024-01-10",
      paymentMethod: "Bank Transfer",
      transactionId: "TXN003",
    },
    {
      id: 4,
      customerName: "Sarah Wilson",
      carName: "Tesla Model 3",
      amount: 1800,
      status: "cancelled",
      date: "2024-01-08",
      paymentMethod: "Credit Card",
      transactionId: "TXN004",
    },
    {
      id: 5,
      customerName: "John Doe",
      carName: "BMW X5",
      amount: 2250,
      status: "completed",
      date: "2024-01-15",
      paymentMethod: "Credit Card",
      transactionId: "TXN001",
    },
    {
      id: 25,
      customerName: "Jane Smith",
      carName: "Mercedes C-Class",
      amount: 760,
      status: "pending",
      date: "2024-01-12",
      paymentMethod: "PayPal",
      transactionId: "TXN002",
    },
    {
      id: 35,
      customerName: "Mike Johnson",
      carName: "Audi Q7",
      amount: 2600,
      status: "failed",
      date: "2024-01-10",
      paymentMethod: "Bank Transfer",
      transactionId: "TXN003",
    },
    {
      id: 44,
      customerName: "Sarah Wilson",
      carName: "Tesla Model 3",
      amount: 1800,
      status: "cancelled",
      date: "2024-01-08",
      paymentMethod: "Credit Card",
      transactionId: "TXN004",
    },
    {
      id: 14,
      customerName: "John Doe",
      carName: "BMW X5",
      amount: 2250,
      status: "completed",
      date: "2024-01-15",
      paymentMethod: "Credit Card",
      transactionId: "TXN001",
    },
    {
      id: 72,
      customerName: "Jane Smith",
      carName: "Mercedes C-Class",
      amount: 760,
      status: "pending",
      date: "2024-01-12",
      paymentMethod: "PayPal",
      transactionId: "TXN002",
    },
    
    {
      id: 74,
      customerName: "Sarah Wilson",
      carName: "Tesla Model 3",
      amount: 1800,
      status: "cancelled",
      date: "2024-01-08",
      paymentMethod: "Credit Card",
      transactionId: "TXN004",
    },
    {
      id: 71,
      customerName: "John Doe",
      carName: "BMW X5",
      amount: 2250,
      status: "completed",
      date: "2024-01-15",
      paymentMethod: "Credit Card",
      transactionId: "TXN001",
    },
    {
      id: 275,
      customerName: "Jane Smith",
      carName: "Mercedes C-Class",
      amount: 760,
      status: "pending",
      date: "2024-01-12",
      paymentMethod: "PayPal",
      transactionId: "TXN002",
    },
    {
      id: 543,
      customerName: "Mike Johnson",
      carName: "Audi Q7",
      amount: 2600,
      status: "failed",
      date: "2024-01-10",
      paymentMethod: "Bank Transfer",
      transactionId: "TXN003",
    },
    {
      id: 124,
      customerName: "Sarah Wilson",
      carName: "Tesla Model 3",
      amount: 1800,
      status: "cancelled",
      date: "2024-01-08",
      paymentMethod: "Credit Card",
      transactionId: "TXN004",
    },
    {
      id: 154,
      customerName: "John Doe",
      carName: "BMW X5",
      amount: 2250,
      status: "completed",
      date: "2024-01-15",
      paymentMethod: "Credit Card",
      transactionId: "TXN001",
    },
    {
      id: 257,
      customerName: "Jane Smith",
      carName: "Mercedes C-Class",
      amount: 760,
      status: "pending",
      date: "2024-01-12",
      paymentMethod: "PayPal",
      transactionId: "TXN002",
    },
    {
      id: 357,
      customerName: "Mike Johnson",
      carName: "Audi Q7",
      amount: 2600,
      status: "failed",
      date: "2024-01-10",
      paymentMethod: "Bank Transfer",
      transactionId: "TXN003",
    },
    {
      id: 422,
      customerName: "Sarah Wilson",
      carName: "Tesla Model 3",
      amount: 1800,
      status: "cancelled",
      date: "2024-01-08",
      paymentMethod: "Credit Card",
      transactionId: "TXN004",
    },
  ]

  const filterOptions = [
    { value: "all", label: "All Payments" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "cancelled", label: "Cancelled" },
  ]

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
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
        placeholder="Search by customer, car, or transaction ID..."
      />
      <ItemsPerPageSelector
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
         {currentPayments.length === 0 ? (
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
