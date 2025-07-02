import React, { useState } from 'react';
import { MapPin, Calendar, Search, Car, Star, Award, Shield } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import {useLoading} from "../Loader/LoadingProvider"

const CarRentalHero = () => {
  const navigate = useNavigate();

  // Set default dates: pickupDate is tomorrow, returnDate is the day after tomorrow
  const getDefaultDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);
    const toISODate = (date) => date.toISOString().split('T')[0];
    return {
      pickup: toISODate(tomorrow),
      ret: toISODate(dayAfterTomorrow),
    };
  };
  const defaultDates = getDefaultDates();
  const [pickupLocation, setPickupLocation] = useState('Jam Jodhpur');
  const [pickupDate, setPickupDate] = useState(defaultDates.pickup);
  const [returnDate, setReturnDate] = useState(defaultDates.ret);
  const { showLoader, hideLoader ,isLoading} = useLoading()


const handleSearch = async () => {
  showLoader("Getting Car Ready...")
    const token = localStorage.getItem('token');
    const city = pickupLocation.trim() === '' ? 'Jam Jodhpur' : encodeURIComponent(pickupLocation);
    const pickup = pickupDate ? `${pickupDate}T10:00:00` : '';
    const ret = returnDate ? `${returnDate}T18:00:00` : '';
    const url = `http://localhost:9090/api/search?city=${city}&pickupDate=${pickup}&returnDate=${ret}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      // Navigate to CarRentalPlatform and pass results
      navigate("/all-car", { state: { searchResults: data } });
      
    } catch (error) {
      console.error('Error searching cars:', error);
    }
    hideLoader();
  };
  return (
    <section className="relative bottom-20 min-h-screen bg-gradient-to-br from-red-500 via-red-700 to-orange-600 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-pink-400/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-red-300/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 to-transparent"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-white/20"></div>
          ))}
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-12 lg:py-20 top-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4 items-center text-sm">
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                <Award className="h-4 w-4 text-pink-300" />
                <span>Award Winning</span>
              </div>
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Fully Insured</span>
              </div>
            </div>

            {/* Main heading */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Find Your Perfect
                <span className="block bg-gradient-to-r from-pink-300 to-red-300 bg-clip-text text-transparent">
                  Dream Ride
                </span>
                for Any Journey
              </h1>
              <p className="text-xl lg:text-2xl text-red-100 leading-relaxed max-w-lg">
                Choose from our premium selection of vehicles at competitive rates. 
                <span className="text-pink-300 font-semibold"> No hidden fees.</span> 
                <span className="text-red-200"> Just pure driving pleasure.</span>
              </p>
            </div>

            {/* Key features */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>24/7 Customer Support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-300 rounded-full"></div>
                <span>Free Cancellation(depending on term & cons)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-300 rounded-full"></div>
                <span>Best Price Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Content - Search Form */}
          <div className="space-y-6">
            {/* Search Form */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 lg:p-8 shadow-2xl border border-white/20">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Book Your Ride</h3>
                <p className="text-gray-600">Get instant quotes from top rental companies</p>
              </div>

              <div className="space-y-4">
                {/* Pick-up Location */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Pick-up Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                    <input
                      type="text"
                      className="pl-12 w-full p-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all duration-200 text-gray-800 border border-gray-200"
                      placeholder="City, Airport, Address..."
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                    />
                  </div>
                </div>

                {/* Date inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Pick-up Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                      <input
                        type="date"
                        className="pl-12 w-full p-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all duration-200 text-gray-800 border border-gray-200"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Return Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                      <input
                        type="date"
                        className="pl-12 w-full p-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all duration-200 text-gray-800 border border-gray-200"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <button onClick={handleSearch} className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <Search className="h-5 w-5 mr-2" />
                  Search Available Cars
                </button>

                {/* Additional info */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    🚗 Over <span className="font-semibold text-red-600">10,000+</span> vehicles available
                  </p>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-pink-300">500K+</div>
                <div className="text-sm text-red-100">Happy Customers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-pink-300">50+</div>
                <div className="text-sm text-red-100">Locations</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-pink-300">24/7</div>
                <div className="text-sm text-red-100">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative car silhouette */}
      <div className="absolute bottom-0 right-0 w-1/2 lg:w-1/3 h-64 lg:h-96 opacity-10 pointer-events-none">
        <Car className="w-full h-full text-white" />
      </div>

    </section>
  );
};

export default CarRentalHero;