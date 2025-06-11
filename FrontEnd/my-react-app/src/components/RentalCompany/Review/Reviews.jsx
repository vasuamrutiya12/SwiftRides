import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import SearchFilter from "../SearchFilter"
import ReviewCard from "./ReviewCard"
import Navbar from "../Navbar"
import ItemsPerPageSelector from "../Booking/ItemsPerPageSelector"
import Pagination from "../Booking/Pagination"

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRating, setFilterRating] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        const email = localStorage.getItem("email")

        const resId = await fetch("http://localhost:8084/auth/user/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        })

        const id = await resId.json()

        const res = await fetch(`http://localhost:9090/api/reviews/companyId/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const reviewsData = await res.json()

        const enrichedReviews = await Promise.all(
          reviewsData.map(async (review) => {
            const [carRes, customerRes] = await Promise.all([
              fetch(`http://localhost:9090/api/cars/${review.carId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }).then((res) => res.json()),
              fetch(`http://localhost:9090/api/customers/${review.customerId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }).then((res) => res.json()),
            ])

            return {
              id: review.reviewId,
              customerName: customerRes.fullName,
              carName: `${carRes.make} ${carRes.model}`,
              rating: review.rating,
              comment: review.comment,
              date: new Date(review.createdAt).toISOString().split("T")[0],
              customerAvatar: "/placeholder.svg?height=40&width=40",
            }
          })
        )

        setReviews(enrichedReviews)
      } catch (error) {
        console.error("Failed to fetch reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const filterOptions = [
    { value: "all", label: "All Ratings" },
    { value: "5", label: "5 Stars" },
    { value: "4", label: "4 Stars" },
    { value: "3", label: "3 Stars" },
    { value: "2", label: "2 Stars" },
    { value: "1", label: "1 Star" },
  ]

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterRating === "all" || review.rating.toString() === filterRating

    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentReviews = filteredReviews.slice(startIndex, endIndex)

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

       

  return (
    <div className="space-y-6">
      <Navbar />
      <div className="flex items-center justify-between mx-5">
        <h1 className="text-3xl font-bold text-gray-900">Customer Reviews</h1>
        <div className="text-right">
          <div className="text-2xl font-bold text-red-600">{averageRating.toFixed(1)}/5</div>
          <div className="text-sm text-gray-500">Average Rating</div>
        </div>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterValue={filterRating}
        setFilterValue={setFilterRating}
        filterOptions={filterOptions}
        placeholder="Search reviews by customer, car, or comment..."
      />

      <ItemsPerPageSelector
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {loading ? (
        <div className="text-center py-12 mx-5 text-gray-500">Loading...</div>
      ) : currentReviews.length === 0 ? (
        <div className="text-center py-12 mx-5 text-gray-500">
          No reviews found matching your criteria
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mx-5">
            {currentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />

            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredReviews.length}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}
    </div>
  )
}
