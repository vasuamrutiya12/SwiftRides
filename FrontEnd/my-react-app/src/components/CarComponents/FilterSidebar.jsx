import { Search, Filter, MapPin, Users, Fuel, Star, Heart, Menu, X, DollarSign } from 'lucide-react';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, isMobile = false, showMobileFilters, onCloseMobile }) => {
  if (isMobile && !showMobileFilters) return null;

  return (
    <div className={`${isMobile ? 'fixed inset-0 z-50 bg-white' : 'sticky top-4'}`}>
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-red-600 to-rose-600">
          <h2 className="text-lg font-semibold text-white">Filters</h2>
          <button onClick={onCloseMobile} className="text-white">
            <X size={24} />
          </button>
        </div>
      )}
      
      <div className={`${isMobile ? 'p-4 h-full overflow-y-auto' : 'bg-white rounded-2xl p-6 shadow-xl border border-gray-100'}`}>
        {!isMobile && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Filters</h2>
            <button 
              onClick={onClearFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Cars</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by make, model, or company..."
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Seating Capacity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Seating Capacity</label>
            <select
              value={filters.seating}
              onChange={(e) => onFilterChange('seating', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="5">5 Seats</option>
              <option value="7">7 Seats</option>
              <option value="8">8+ Seats</option>
            </select>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fuel Type</label>
            <select
              value={filters.fuelType}
              onChange={(e) => onFilterChange('fuelType', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="economy">Economy</option>
              <option value="suv">SUV</option>
              <option value="luxury">Luxury</option>
              <option value="compact">Compact</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Rate Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => onFilterChange('minPrice', e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Rental Company</label>
            <input
              type="text"
              placeholder="Search companies..."
              value={filters.company}
              onChange={(e) => onFilterChange('company', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {isMobile && (
          <div className="mt-6 pt-4 border-t">
            <button 
              onClick={onClearFilters}
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg mb-2 hover:bg-gray-200 transition-colors"
            >
              Clear All Filters
            </button>
            <button 
              onClick={onCloseMobile}
              className="w-full py-2 px-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-all"
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export default FilterSidebar;