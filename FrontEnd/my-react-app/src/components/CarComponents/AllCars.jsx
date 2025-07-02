import { Search, Filter } from 'lucide-react';
import CarCard from './CarCard';
import BookCarForm from '../BookingCar/bookCarForm';
import { useState } from 'react';
import { useBooking } from '../BookingCar/BookingContext';

const AllCars = ({ cars, favorites, onToggleFavorite, onShowMobileFilters }) => {
  const { selectedCar, showBookingForm, handleBookNow, closeBookingForm } = useBooking();
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  // Custom handler to check license status before booking
  const handleBookNowWithCheck = (car) => {
    const licenseStatus = localStorage.getItem('drivingLicenseStatus');
    if (licenseStatus === 'PENDING') {
      setShowLicenseModal(true);
      return;
    }
    handleBookNow(car);
  };

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
                onBookNow={() => handleBookNowWithCheck(car)} 
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

      {/* License Restriction Modal */}
      {showLicenseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Booking Restricted</h2>
            <p className="text-gray-700 mb-6">
              You are not allowed to book a car until your driving license is verified.
            </p>
            <button
              onClick={() => setShowLicenseModal(false)}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:from-red-700 hover:to-orange-700 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCars;