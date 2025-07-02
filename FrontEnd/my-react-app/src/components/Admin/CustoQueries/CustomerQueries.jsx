import { useState, useEffect } from "react"
import SearchFilter from "../../RentalCompany/SearchFilter"
import QueryCard from "./QueryCard"
import Navbar from "../Navbar"
import ItemsPerPageSelector from "../../RentalCompany/Booking/ItemsPerPageSelector"
import Pagination from "../../RentalCompany/Booking/Pagination"
import { useLoading } from "../../Loader/LoadingProvider"


export default function CustomerQueries() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const { showLoader , hideLoader} = useLoading();
  const token=localStorage.getItem("token");

  const [queries, setQueries] = useState([]);

  useEffect(() => {
    const fetchQueries = async () => {
      showLoader("Loading Queries...");
      try {
        const res = await fetch('http://localhost:9090/api/contact/all', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!res.ok) throw new Error('Failed to fetch queries');
        const data = await res.json();
        // Map backend fields to frontend expected fields
        const mapped = data.map(q => ({
          queryId: q.id,
          name: q.name,
          email: q.email,
          category: q.category || q.subject || '',
          message: q.message,
          status: q.answer ? 'answered' : 'pending',
          reply: q.answer || null,
          createdAt: q.createdAt || '',
        }));
        setQueries(mapped);
      } catch (err) {
        setQueries([]);
      } finally {
         hideLoader();
      }
    };
    fetchQueries();
    // eslint-disable-next-line
  }, []);

  const filterOptions = [
    { value: "all", label: "All Queries" },
    { value: "answered", label: "Answered" },
    { value: "pending", label: "Pending" },

  ]

  const handleDeleteQuery = async (queryId) => {
    showLoader("Deleting query...")
    const response = await fetch(`http://localhost:9090/api/contact/${queryId}`, {
          method: 'DELETE',
           headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }  
        });
        if (!response.ok) throw new Error('Failed to send answer');
        hideLoader();
  }

  const handleAnswered = (queryId, answer) => {
    setQueries(prev => prev.map(q =>
      q.queryId === queryId ? { ...q, reply: answer, status: 'answered' } : q
    ));
  };

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
            <div className="grid grid-cols-1 min-[890px]:grid-cols-2 min-[1090px]:grid-cols-3 min-[1410px]:grid-cols-4 gap-4 sm:gap-6 mx-5">
              {currentQueries.map((query) => (
                <QueryCard key={query.queryId} query={query} onDelete={handleDeleteQuery} onAnswered={handleAnswered} />
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