// BookingContext.js
import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleBookNow = (car) => {
    setSelectedCar(car);
    setShowBookingForm(true);
  };

  const closeBookingForm = () => {
    setSelectedCar(null);
    setShowBookingForm(false);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedCar,
        showBookingForm,
        handleBookNow,
        closeBookingForm,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};