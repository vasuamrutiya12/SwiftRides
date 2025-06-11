import React from 'react';
import { Edit3, Trash2, Calendar, DollarSign, User, Phone, Mail, Car } from 'lucide-react';

const BookingCard = ({ booking }) => {

  const handleEdit = () => {
    console.log('Edit booking:', booking.id);
    // Add your edit logic here
  };

  const handleDelete = () => {
    console.log('Delete booking:', booking.id);
    // Add your delete logic here
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    // Custom format: 08 Jun 2025, 12:00 AM
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const rentalDays = calculateDays(booking.pickupDate, booking.returnDate);

  return (
    <div className="w-[450px] mx-auto bg-gradient-to-b from-white to-red-50 rounded-2xl shadow-xl overflow-hidden border border-red-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header with gradient */}
      <div className=" px-3 bg-gradient-to-r from-red-400 to-red-300 py-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-white text-2xl font-bold">Booking #{booking.bookingId}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Car className="w-4 h-4 text-red-100" />
                <span className="text-red-100 font-medium">{booking.carName}</span>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
              {booking.status.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-4">
        {/* Customer Info */}
        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{booking.customerName}</p>
            <p className="text-sm text-gray-600">{booking.customerEmail}</p>
            <p className="text-sm text-gray-600">{booking.customerPhone}</p>
          </div>
        </div>

        {/* Contact Info */}
        {/* <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 text-xl">
            <Phone className="w-4 h-4 text-red-500" />
            <span className="text-gray-700">{booking.customerPhone}</span>
          </div>
        </div> */}

        {/* Rental Period */}
        <div className="px-6 py-2 bg-red-50 rounded-lg  border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-gray-700">Rental Period</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <p className="text-xs text-gray-500">Start</p>
              <p className="font-semibold text-gray-900"><span>{formatDateTime(booking.pickupDate)}</span>
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="text-center">
                <p className="text-xs text-gray-500">Duration</p>
                <p className="font-semibold text-red-600">{rentalDays} days</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">End</p>
              <p className="font-semibold text-gray-900"><span>{formatDateTime(booking.returnDate)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Financial Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-50 rounded-lg p-3 border border-red-100">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-red-500" />
              <span className="text-xs font-medium text-red-700">Total Amount</span>
            </div>
            <p className="text-lg font-bold text-red-600">${(booking.totalAmount || 0).toLocaleString()}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium text-green-700">Commission</span>
            </div>
            <p className="text-lg font-bold text-green-600">${(booking.commission || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <div className="flex gap-3">
          <button
            onClick={handleEdit}
            className="flex-1 bg-red-400 hover:bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>   
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-200 hover:bg-red-400 text-red-700 hover:text-red-800 py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 border border-red-200 hover:border-red-300"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;