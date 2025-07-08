import React, { useState, useEffect, useRef } from "react";
import FilterSidebar from "./FilterSidebar";
import AllCars from "./AllCars";
import Navbar from "../LandingPages/Navbar";
import BookCarForm from "../BookingCar/bookCarForm"; // Add this import if it's missing
import { useNavigate, useLocation } from "react-router-dom";
import { useLoading } from "../Loader/LoadingProvider";
import { MapPin, Calendar, Search } from 'lucide-react';

const CarRentalPlatform = () => {
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [carCompanyData, setCarCompanyData] = useState([]);
  const [error, setError] = useState("");
  const { showLoader , hideLoader } = useLoading();

  const [filters, setFilters] = useState({
    seating: "",
    fuelType: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    company: "",
    search: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const searchResults = location.state?.searchResults || null;

  // Search form state
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
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState(defaultDates.pickup);
  const [returnDate, setReturnDate] = useState(defaultDates.ret);

  const [showAllCars, setShowAllCars] = useState(false);
  const [allFetchedCars, setAllFetchedCars] = useState([]); // Store all fetched cars
  const [showMobileFilters, setShowMobileFilters] = useState(false); // For mobile filter sidebar

  // Fetch rental company data
  useEffect(() => {
    const fetchData = async () => {
      showLoader("Loading cars...");
      try {
        const response = await fetch("http://localhost:9090/api/rental-company", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCarCompanyData(data);
        } else {
          const errorText = await response.text();
          setError(`Car data failed: ${errorText}`);
        }
      } catch (error) {
        console.error("Car data error:", error);
        setError("An error occurred. Please try again later.");
      } finally {
        hideLoader();
      }
    };

    fetchData();
  }, []);

  // Filter cars based on current filter state
  const applyFilters = (cars) => {
    return cars.filter((car) => {
      if (car.status && car.status.toUpperCase() === 'PENDING') return false; // Exclude PENDING cars
      const matchesSeating = !filters.seating || car.seatingCapacity === parseInt(filters.seating);
      const matchesFuel = !filters.fuelType || car.fuelType?.toLowerCase() === filters.fuelType.toLowerCase();
      const matchesCategory = !filters.category || car.category?.toLowerCase() === filters.category.toLowerCase();
      const matchesMinPrice = !filters.minPrice || car.dailyRate >= parseFloat(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || car.dailyRate <= parseFloat(filters.maxPrice);
      const matchesCompany = !filters.company || car.companyName?.toLowerCase().includes(filters.company.toLowerCase());
      const matchesSearch =
        !filters.search ||
        car.make?.toLowerCase().includes(filters.search.toLowerCase()) ||
        car.model?.toLowerCase().includes(filters.search.toLowerCase()) ||
        car.companyName?.toLowerCase().includes(filters.search.toLowerCase());

      return matchesSeating && matchesFuel && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesCompany && matchesSearch;
    });
  };

  // Group cars by company ID (ensuring companies with no filtered cars are shown)
  const groupCarsByCompany = (cars) => {
    const grouped = {};

    carCompanyData
      .filter((company) => company.status === "active")
      .forEach((company) => {
        grouped[company.companyId] = {
          companyName: company.companyName,
          companyCity: company.city,
          companyAddress: company.address,
          companyPhone: company.phoneNumber,
          cars: [],
        };
      });

    cars.forEach((car) => {
      if (grouped[car.companyId]) {
        grouped[car.companyId].cars.push(car);
      }
    });

    // Only return companies that have at least one car
    return Object.values(grouped).filter(company => company.cars.length > 0);
  };

  // Fetch cars from search API
  const fetchCars = async (city, pickup, ret) => {
    showLoader('Searching cars...');
    try {
      const token = localStorage.getItem('token');
      let url;
      if (city && city.trim() !== '') {
        url = `http://localhost:9090/api/search?city=${city}&pickupDate=${pickup}&returnDate=${ret}`;
      } else {
        url = `http://localhost:9090/api/search?pickupDate=${pickup}&returnDate=${ret}`;
      }
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      const cars = data.map(item => ({
        ...item.car,
        companyName: item.company.companyName,
        companyCity: item.company.city,
        companyAddress: item.company.address,
        companyPhone: item.company.phoneNumber,
        companyId: item.company.companyId,
      }));
      setAllFetchedCars(cars); // Store all fetched cars
      setFilteredCars(applyFilters(cars)); // Apply filters initially
    } catch (error) {
      setError('Error searching cars');
    } finally {
      hideLoader();
    }
  };

  // Initial fetch (default values)
  useEffect(() => {
    if (searchResults && Array.isArray(searchResults)) {
      // Transform searchResults to match the expected car format
      const cars = searchResults.map(item => ({
        ...item.car,
        companyName: item.company.companyName,
        companyCity: item.company.city,
        companyAddress: item.company.address,
        companyPhone: item.company.phone,
        companyId: item.company.companyId,
      }));
      setAllFetchedCars(cars);
      setFilteredCars(applyFilters(cars));
    } else {
      // Fallback: fetch from API as before
      const params = new URLSearchParams(location.search);
      const city = params.get("city");
      const pickup = params.get("pickupDate");
      const ret = params.get("returnDate");
      if (city) setPickupLocation(city);
      if (pickup) setPickupDate(pickup);
      if (ret) setReturnDate(ret);
      fetchCars(city || '', `${pickup || pickupDate}T10:00:00`, `${ret || returnDate}T18:00:00`);
    }
    // eslint-disable-next-line
  }, []);

  // Re-apply filters whenever filters or allFetchedCars change
  useEffect(() => {
    setFilteredCars(applyFilters(allFetchedCars));
  }, [filters, allFetchedCars]);

  // Search form submit
  const handleSearch = async (e) => {
    e.preventDefault();
    // Update the URL with search params
    const params = new URLSearchParams({
      city: pickupLocation,
      pickupDate,
      returnDate,
    });
    navigate(`?${params.toString()}`, { replace: true });
    fetchCars(pickupLocation, `${pickupDate}T10:00:00`, `${returnDate}T18:00:00`);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      seating: "",
      fuelType: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      company: "",
      search: "",
    });
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
  };

  const groupedCars = groupCarsByCompany(filteredCars);


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-red-50 to-pink-100">
      <Navbar />
      {/* Search Form */}
      <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-4 items-end mt-4 mb-8 border border-gray-200">
        <div className="flex-1">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Pick-up Location</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
            <input
              type="text"
              className="pl-12 w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white border border-gray-200 text-gray-800"
              placeholder="City, Airport, Address..."
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Pick-up Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
            <input
              type="date"
              className="pl-12 w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white border border-gray-200 text-gray-800"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Return Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
            <input
              type="date"
              className="pl-12 w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white border border-gray-200 text-gray-800"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl px-8 py-3 font-semibold flex items-center gap-2 shadow-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300">
          <Search className="h-5 w-5" />
          Search
        </button>
      </form>
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {selectedCar ? (    
          <BookCarForm
            car={selectedCar}
            company={carCompanyData.find((company) => company.companyId === selectedCar.companyId)}
          />
        ) : (
          <div className="flex gap-8">
            {/* Sidebar for large screens */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
            {/* Sidebar for mobile screens */}
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              isMobile={true}
              showMobileFilters={showMobileFilters}
              onCloseMobile={() => setShowMobileFilters(false)}
            />
            <div className="flex-1">
              {/* Show Filters button for mobile */}
              <div className="lg:hidden mb-4 flex justify-end">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow"
                >
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-7 7V21a1 1 0 01-1.447.894l-4-2A1 1 0 017 19v-7.293l-7-7A1 1 0 013 4z" /></svg>
                  <span className="text-sm font-medium">Filters</span>
                </button>
              </div>
              {groupedCars.every((company) => company.cars.length === 0) ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No cars found matching your criteria.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {groupedCars.map((company, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                    >
                      <div className="bg-gradient-to-r from-red-600 to-orange-400 text-white px-6 py-4">
                        <h2 className="text-2xl font-bold">{company.companyName}</h2>
                        <p className="text-blue-100 flex items-center mt-1">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {company.companyCity}
                        </p>
                        <div className="text-sm text-blue-200 mt-2">
                          {company.cars.length} car{company.cars.length !== 1 ? "s" : ""} available
                        </div>
                      </div>
                      <div className="p-6">
                        <AllCars cars={company.cars} onShowMobileFilters={() => setShowMobileFilters(true)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarRentalPlatform;
