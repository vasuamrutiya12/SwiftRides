import User from "lucide-react"

const CarReviewCard = ({ review }) => {
  console.log(review)
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
            <User />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{review.userName}</h4>
            <p className="text-sm text-gray-500">{review.date}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size="w-4 h-4" />
      </div>
      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
  );
};

export default CarReviewCard;