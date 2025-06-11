import { useState } from "react"
import SearchFilter from "../../RentalCompany/SearchFilter"
import QueryCard from "./QueryCard"
import Navbar from "../Navbar"
import ItemsPerPageSelector from "../../RentalCompany/Booking/ItemsPerPageSelector"
import Pagination from "../../RentalCompany/Booking/Pagination"
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export default function CustomerQueries() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)

  const [queries, setQueries] = useState([
    {
        queryId:12,
        name:"john vik",
        email:"johnvik@rek.comm",
        category:"Booking issue",
        
        message:"ererewrvfc dffsd dssf",
        status:"pending",
        reply:null,
        createdAt:"06/08/202514:51:35GMT+05:30"
    },
    {
        queryId:13,
        name:"vihan vik",
        email:"johnvik@rek.comm",
        category:"Booking issue",
        message:"ererewrvfc dffsd dssf",
        status:"answered",
        reply:"we will fix it soon",
        createdAt:"06/08/202514:51:35GMT+05:30"
    },
    {
        queryId:14,
        name:"rwewr vik",
        email:"johnvik@rek.comm",
        category:"Booking issue",
        message:"ererewrvfc dffsd dssf",
        status:"pending",
        reply:null,
        createdAt:"06/08/202514:51:35GMT+05:30"
    },
  ])
   

  const filterOptions = [
    { value: "all", label: "All Queries" },
    { value: "answered", label: "Answered" },
    { value: "pending", label: "Pending" },

  ]

  const handleDeleteQuery = (queryId) => {
    setQueries(prev => prev.filter(q => q.queryId !== queryId));
  }

  const filteredQueries = queries.filter((query) => {
    const matchesSearch =
      query.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || query.status === filterStatus
    return matchesSearch && matchesFilter
  })
  const totalPages = Math.ceil(filteredQueries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentQueries= filteredQueries.slice(startIndex, endIndex)

  

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
        <Navbar />
      <div className="flex items-center justify-between mx-5">
        <h1 className="text-3xl font-bold text-gray-900">Customer Queries Management</h1>
        <div className="text-sm text-gray-500">Total Queries: {queries.length}</div>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterValue={filterStatus}
        setFilterValue={setFilterStatus}
        filterOptions={filterOptions}
        placeholder="Search by catagory or message..."
      />

      <ItemsPerPageSelector
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />

       {currentQueries.length === 0 ? (
          <div className="text-center py-12 mx-5">
            <div className="text-gray-500 text-lg">
              {filteredQueries.length === 0 ? "No Queries found matching your criteria" : "Loading..."}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6 mx-5">
              {currentQueries.map((query) => (
                <QueryCard key={query.queryId} query={query} onDelete={handleDeleteQuery} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredQueries.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </div>
  )
}