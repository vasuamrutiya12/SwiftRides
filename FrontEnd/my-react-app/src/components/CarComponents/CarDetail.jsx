import { useLocation } from 'react-router-dom';
import { ArrowLeft , Calendar , Users , Fuel} from "lucide-react"
import ReviewCard from '../RentalCompany/Review/ReviewCard';
import ImageCarousel from "./ImageCarousel"
import StarRating from "./StarRating"
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../BookingCar/BookingContext';

const CarDetails = () => {

    const location = useLocation();
    const { car } = location.state || {};
    const navigate = useNavigate();
    const { handleBookNow } = useBooking();

    const handleBackClick = () => {
      navigate(-1);
  }
  const handleBookClick = () => {
      if (car) {
        handleBookNow(car);
        navigate('/all-car');
      }
    }
  
  if (!car) {
    return <p>No car data available.</p>;
  }
  const reviews = [
  {
    id: 1,
    userName: "John Smith",
    rating: 5,
    date: "2025-05-20",
    comment: "Excellent car! Very comfortable and fuel-efficient. The GPS system was very helpful during my trip. Highly recommended for family trips.",
    avatar: "JS"
  },
  {
    id: 2,
    userName: "Sarah Johnson",
    rating: 4,
    date: "2025-05-18",
    comment: "Great experience overall. The car was clean and well-maintained. Air conditioning worked perfectly. Only minor issue was the pickup location was a bit hard to find.",
    avatar: "SJ"
  },
  {
    id: 3,
    userName: "Mike Wilson",
    rating: 5,
    date: "2025-05-15",
    comment: "Outstanding service! The Toyota Camry exceeded my expectations. Smooth drive, excellent fuel economy, and all features worked flawlessly. Will definitely rent again.",
    avatar: "MW"
  },
  {
    id: 4,
    userName: "Emily Davis",
    rating: 4,
    date: "2025-05-12",
    comment: "Very reliable car for city driving. Bluetooth connectivity was seamless. The seating is comfortable for long drives. Good value for money.",
    avatar: "ED"
  },
  {
    id: 5,
    userName: "David Brown",
    rating: 3,
    date: "2025-05-10",
    comment: "Decent car but had some minor issues with the GPS. Overall experience was okay. Customer service was responsive when I reported the issue.",
    avatar: "DB"
  }
];
   const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;


  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBackClick}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {car.make} {car.model} {car.year}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2">
          {/* Image Carousel */}
          <ImageCarousel images={car.imageUrls} carName={`${car.make} ${car.model}`} />
          
          {/* Car Details */}
          <div className="bg-white rounded-lg p-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Car Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className="font-medium">Year:</span>
                    <span className="ml-2 text-gray-700">{car.year}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className="font-medium">Seating:</span>
                    <span className="ml-2 text-gray-700">{car.seatingCapacity} people</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Fuel className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className="font-medium">Fuel Type:</span>
                    <span className="ml-2 text-gray-700">{car.fuelType}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Category:</span>
                  <span className="ml-2 text-gray-700 capitalize">{car.category}</span>
                </div>
                
                <div>
                  <span className="font-medium">Status:</span>
                  <span className="ml-2 text-green-600 capitalize font-medium">{car.status}</span>
                </div>
                
                <div>
                  <span className="font-medium">Daily Rate:</span>
                  <span className="ml-2 text-2xl font-bold text-green-600">₹{car.dailyRate.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {/* Features */}
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Reviews */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 sticky top-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
            
            {/* Average Rating */}
            <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={Math.round(averageRating)} size="w-6 h-6" />
              <p className="text-gray-600 mt-2">Based on {reviews.length} reviews</p>
            </div>
            
            {/* Book Now Button */}
            <button 
            onClick={handleBookClick}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-6">
              Book Now - ₹{car.dailyRate.toLocaleString()}/day
            </button>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarDetails