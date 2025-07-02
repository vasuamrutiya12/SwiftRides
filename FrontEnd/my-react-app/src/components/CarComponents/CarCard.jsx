import {
  Search,
  Car,
  Filter,
  MapPin,
  Users,
  Fuel,
  Star,
  Heart,
  Menu,
  X,
  DollarSign,
  Dock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

// Car Card Component
const CarCard = ({ car, onToggleFavorite, onBookNow }) => {
  const formatPrice = (price) => {
    return `₹${price.toLocaleString()}`;
  };
  const navigate = useNavigate();

  // Carousel state
  const [imgIndex, setImgIndex] = useState(0);
  const intervalRef = useRef(null);

  const handleViewCar = (car) => {
    navigate("/car/cardetails", { state: { car } });
  };

  // Carousel handlers
  const handleMouseEnter = () => {
    if (car.imageUrls.length > 1) {
      intervalRef.current = setInterval(() => {
        setImgIndex((prev) => (prev + 1) % car.imageUrls.length);
      }, 1000);
    }
  };
  const handleMouseLeave = () => {
    clearInterval(intervalRef.current);
    setImgIndex(0);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        <img
          src={car.imageUrls[imgIndex]}
          alt={`${car.make} ${car.model}`}
          className="p-2 w-full h-50 object-contain bg-white group-hover:scale-105 transition-transform duration-300"
        />
        {/* Left Arrow */}
        {car.imageUrls.length > 1 && (
          <button
            onClick={e => { e.stopPropagation(); setImgIndex((prev) => (prev - 1 + car.imageUrls.length) % car.imageUrls.length); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            tabIndex={-1}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {/* Right Arrow */}
        {car.imageUrls.length > 1 && (
          <button
            onClick={e => { e.stopPropagation(); setImgIndex((prev) => (prev + 1) % car.imageUrls.length); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            tabIndex={-1}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => onToggleFavorite(car.carId)}
          className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
        >
        
        </button>
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
              car.category === "luxury"
                ? "bg-gradient-to-r from-amber-400 to-orange-600"
                : car.category === "suv"
                ? "bg-gradient-to-r from-green-400 to-green-600"
                : "bg-gradient-to-r from-red-400 to-red-600"
            }`}
          >
            {car.category.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {car.make} {car.model}
            </h3>
            <p className="text-sm text-gray-600">{car.year}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-red-600">
              {formatPrice(car.dailyRate)}
            </p>
            <p className="text-sm text-gray-500">per day</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{car.seatingCapacity} seats</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel size={16} />
            <span>{car.fuelType}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <MapPin size={16} />
          <span className="font-medium text-gray-700">{car.companyName}</span>
          <span>• {car.companyCity}</span>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Features:</p>
          <div className="flex flex-wrap gap-1">
            {car.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600"
              >
                {feature}
              </span>
            ))}
            {car.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">
                +{car.features.length - 3} more
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={()=> handleViewCar(car)}
            className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Dock className="w-4 h-4" />
            View Details
          </button>

          <button
            onClick={() => onBookNow(car)}
            className="w-full bg-gradient-to-r from-red-400 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-700 hover:to-orage-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Car className="w-4 h-4" />
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
export default CarCard;
