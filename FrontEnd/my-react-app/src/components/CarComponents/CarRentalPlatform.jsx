import React, { useState, useEffect } from "react";
import FilterSidebar from "./FilterSidebar";
import AllCars from "./AllCars";
import Navbar from "../LandingPages/Navbar";
import BookCarForm from "../BookingCar/bookCarForm"; // Add this import if it's missing
import { useNavigate, useLocation } from "react-router-dom";

const CarRentalPlatform = () => {
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [carCompanyData, setCarCompanyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  // Fetch rental company data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract all cars with metadata
  const getAllCars = () => {
    return carCompanyData
      .filter((company) => company.status === "active")
      .flatMap((company) => {
        if (Array.isArray(company.cars)) {
          return company.cars.map((car) => ({
            ...car,
            companyName: company.companyName,
            companyCity: company.city,
            companyAddress: company.address,
            companyPhone: company.phoneNumber,
            companyId: company.companyId,
          }));
        }
        return [];
      });
  };

  // Filter cars based on current filter state
  const applyFilters = (cars) => {
    return cars.filter((car) => {
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

    return Object.values(grouped);
  };

  // Recalculate filtered cars on data or filter change
  console.log(searchResults);
  
  useEffect(() => {
    const allCars = searchResults
      ? searchResults.map(item => ({
          ...item.car,
          companyName: item.company.companyName,
          companyCity: item.company.city,
          companyAddress: item.company.address,
          companyPhone: item.company.phoneNumber,
          companyId: item.company.companyId,
        }))
      : getAllCars();
    const filtered = applyFilters(allCars);
    setFilteredCars(filtered);
  }, [searchResults, filters, carCompanyData]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading data, please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      <Navbar />
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedCar ? (    
          <BookCarForm
            car={selectedCar}
            company={carCompanyData.find((company) => company.companyId === selectedCar.companyId)}
          />
        ) : (
          <div className="flex gap-8">
            <div className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
            <div className="flex-1">
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
                        <AllCars cars={company.cars} onCarSelect={handleCarSelect} />
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
