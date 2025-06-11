import { useState, useEffect } from 'react';
import { User, Key, Mail, Briefcase, Phone, MapPin, Building, CreditCard, Calendar, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RegisterOTP from './RegisterOTP';

const Register = () => {
  const [role, setRole] = useState('customer');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Common fields
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    dateofbirth: '',

    // Customer specific fields
    drivingLicense: '',
    drivingLicenseExpiry: '',

    // Manager specific fields
    companyName: '',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [isSearchingCity, setIsSearchingCity] = useState(false);


  // Function to search for city and update map
  const searchCity = async () => {
    if (!formData.city.trim()) {
      setErrors(prev => ({ ...prev, city: "City name is required to search" }));
      return;
    }

    setIsSearchingCity(true);

    try {
      // Use OpenStreetMap Nominatim API to search for the city
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.city)}, India`);
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        // Update the form data with the found coordinates
        setFormData(prev => ({
          ...prev,
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6)
        }));

        // Update map and marker position
        if (map && marker) {
          map.setView([lat, lng], 13);
          marker.setLatLng([lat, lng]);
        }

        // Show map automatically when city is found
        setShowMap(true);

        // Initialize map if it doesn't exist yet
        if (!map) {
          initMap(lat, lng);
        }
      } else {
        setErrors(prev => ({ ...prev, city: "City not found. Please try another name." }));
      }
    } catch (error) {
      console.error("Error searching for city:", error);
      setErrors(prev => ({ ...prev, city: "Error searching for city. Please try again." }));
    } finally {
      setIsSearchingCity(false);
    }
  };

  const initMap = (lat, lng) => {
    if (map) {
      return; // Avoid re-initializing if map already exists
    }
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js";
    script.async = true;
    document.body.appendChild(script);

    const link = document.createElement('link');
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css";
    document.head.appendChild(link);

    script.onload = () => {
      const mapInstance = L.map('map').setView([lat, lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance);

      const markerInstance = L.marker([lat, lng], { draggable: true }).addTo(mapInstance);
      markerInstance.on('dragend', function () {
        const position = markerInstance.getLatLng();
        setFormData(prev => ({
          ...prev,
          latitude: position.lat.toFixed(6),
          longitude: position.lng.toFixed(6)
        }));
      });

      setMap(mapInstance);
      setMarker(markerInstance);
    };
  };


  // Initialize map when showMap becomes true
  useEffect(() => {
    if (showMap && !map && formData.latitude && formData.longitude) {
      initMap(parseFloat(formData.latitude), parseFloat(formData.longitude));
    }

    return () => {
      // Cleanup function
      if (map) {
        map.remove();
        setMap(null);
        setMarker(null);
      }
    };
  }, [showMap]);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    // Validate common fields
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      // Indian phone number validation (10 digits starting with 6-9)
      newErrors.phoneNumber = "Please enter a valid Indian phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Validate role-specific fields
    if (role === 'manager') {
      if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.latitude || !formData.longitude) newErrors.location = "Location is required";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    // Prepare payload
    const payload = {
      user: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: role === "manager" ? "RENTAL_COMPANY" : "CUSTOMER"
      }
    };

    if (role === 'customer') {
      payload.customer = {
        fullName: `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        drivingLicenseNumber: formData.drivingLicense,
        phoneNumber: formData.phoneNumber,
        drivingLicenseExpiry: formData.drivingLicenseExpiry,
        dateOfBirth: formData.dateofbirth
      };
    } else if (role === 'manager') {
      payload.rentalCompany = {
        companyName: formData.companyName,
        address: formData.address,
        city: formData.city,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        phoneNumber: formData.phoneNumber
      };
    }

    try {
      const response = await fetch('http://localhost:8084/auth/register/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(typeof data === 'string' ? data : (data.message || 'Registration failed'));
      }

      console.log('Registration successful:', data);
      setIsSuccess(true);
      navigate('/register-otp', {
        state: { email: payload.user.email },
      });

      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
          drivingLicense: '',
          drivingLicenseExpiry: '',
          companyName: '',
          address: '',
          city: '',
          latitude: '',
          longitude: '',
        });

        if (map) {
          map.remove();
          setMap(null);
          setMarker(null);
        }
        setShowMap(false);
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(error.message || 'An error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const toggleMap = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-6">
          <h2 className="text-center text-3xl font-extrabold text-white">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-indigo-100">
            Join our platform and get started today
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Registration successful!</h3>
            <p className="mt-2 text-sm text-gray-500">Your account has been created successfully.</p>
          </div>
        ) : (
          <div className="py-8 px-6 space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to register as a:
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleRoleChange('customer')}
                  className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center space-x-2 transition-colors ${role === 'customer'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  <User size={18} />
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('manager')}
                  className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center space-x-2 transition-colors ${role === 'manager'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  <Briefcase size={18} />
                  <span>Manager</span>
                </button>
              </div>
            </div>

            {/* Common Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="John"
                  />
                </div>
                {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Doe"
                  />
                </div>
                {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="drivingLicenseExpiry" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  name="dateofbirth"
                  id="dateofbirth"
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      dateofbirth: value, // ISO format (YYYY-MM-DD)
                    }));
                  }}
                  className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={16} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="9876543210"
                />
              </div>
              {errors.phoneNumber && <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="••••••"
                  />
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Role-specific fields */}
            {role === 'customer' ? (

              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.address ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="123 Main St"
                    />
                  </div>
                  {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                </div>
                <div>
                  <label htmlFor="drivingLicense" className="block text-sm font-medium text-gray-700">
                    Driving License (Optional)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="drivingLicense"
                      id="drivingLicense"
                      value={formData.drivingLicense}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="DL12345678901234"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Enter your driving license number (if available)</p>
                </div>
                <div>
                  <label htmlFor="drivingLicenseExpiry" className="block text-sm font-medium text-gray-700">
                    Driving License Expiry Date (Optional)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="drivingLicenseExpiry"
                      id="drivingLicenseExpiry"
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          drivingLicenseExpiry: value, // ISO format (YYYY-MM-DD)
                        }));
                      }}
                      className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="companyName"
                      id="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.companyName ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="Acme Inc."
                    />
                  </div>
                  {errors.companyName && <p className="mt-1 text-xs text-red-600">{errors.companyName}</p>}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.address ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="123 Main St"
                    />
                  </div>
                  {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <div className="mt-1 flex items-center space-x-2">
                    <div className="relative rounded-md shadow-sm flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.city ? 'border-red-300' : 'border-gray-300'
                          }`}
                        placeholder="Mumbai"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={searchCity}
                      disabled={isSearchingCity}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {isSearchingCity ? (
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Search size={16} />
                      )}
                    </button>
                  </div>
                  {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                </div>

                {/* Location Fields with Map Integration */}
                <div>
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <button
                      type="button"
                      onClick={toggleMap}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      {showMap ? "Hide Map" : "Show Map"}
                    </button>
                  </div>

                  {showMap && (
                    <div className="mt-2 bg-gray-100 rounded-md p-1">
                      <div id="map" className="h-64 w-full rounded-md"></div>
                      <p className="text-xs text-gray-600 mt-1 px-1">
                        Click on the map or drag the marker to set your business location
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label htmlFor="latitude" className="block text-xs text-gray-500">
                        Latitude
                      </label>
                      <input
                        type="text"
                        name="latitude"
                        id="latitude"
                        value={formData.latitude}
                        readOnly
                        className="mt-1 block w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-sm text-gray-900"
                      />
                    </div>
                    <div>
                      <label htmlFor="longitude" className="block text-xs text-gray-500">
                        Longitude
                      </label>
                      <input
                        type="text"
                        name="longitude"
                        id="longitude"
                        value={formData.longitude}
                        readOnly
                        className="mt-1 block w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-sm text-gray-900"
                      />
                    </div>
                  </div>
                  {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Register Now'
                )}
              </button>
            </div>

            <div className="text-center text-xs text-gray-500 mt-4">
              By registering, you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;