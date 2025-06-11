import { Search, Filter } from 'lucide-react';
import CarCard from './CarCard';
import BookCarForm from '../BookingCar/bookCarForm';
import { useState } from 'react';
import { useBooking } from '../BookingCar/BookingContext';

const AllCars = ({ cars, favorites, onToggleFavorite, onShowMobileFilters }) => {
  const { selectedCar, showBookingForm, handleBookNow, closeBookingForm } = useBooking();
  // const [selectedCar, setSelectedCar] = useState(null);
  // const [showBookingForm, setShowBookingForm] = useState(false);

  // const handleBookNow = (car) => {
  //   setSelectedCar(car);
  //   setShowBookingForm(true);
  // };
  

  // const closeBookingForm = () => {
  //   setSelectedCar(null);
  //   setShowBookingForm(false);
  // };

  return (
    <div className="flex-1">
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
       
        <div className="lg:hidden">
          <button
            onClick={onShowMobileFilters}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={18} />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>
      </div>

      {/* Cars Grid */}
      {cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={`${car.carId}-${car.companyId}`} className="relative">
              <CarCard
                car={car}
                favorites={favorites}
                onToggleFavorite={onToggleFavorite}
                onBookNow={() => handleBookNow(car)} 
                
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No cars found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters to see more results
          </p>
        </div>
      )}

      {/* Booking Form Modal - Remove the extra modal wrapper */}
      {showBookingForm && selectedCar && (
        <BookCarForm 
          car={selectedCar} 
          company={{ companyId: 'comp123' }} 
          onBack={closeBookingForm}
        />
      )}
    </div>
  );
};

export default AllCars;