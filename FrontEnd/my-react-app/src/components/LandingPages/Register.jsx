import { useState, useEffect } from "react";
import { useLoading } from "../Loader/LoadingProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Key,
  Mail,
  Briefcase,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Calendar,
  Search,
  Car,
  Shield,
  ChevronRight,
  CheckCircle,
  X,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import { Link } from "react-router-dom";

const Register = () => {
  const [role, setRole] = useState("customer");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Common fields
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    dateofbirth: "",

    // Customer specific fields
    
    drivingLicenseStatus: "PENDING",

    // Manager specific fields
    companyName: "",
    address: "",
    city: "",
    latitude: "",
    longitude: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formCompletion, setFormCompletion] = useState(0);
  const { showLoader, hideLoader, isLoading } = useLoading();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const slideVariants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => {
      return {
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };

  // Calculate form completion percentage
  useEffect(() => {
    const calculateCompletion = () => {
      const fields =
        role === "customer"
          ? [
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "password",
              "confirmPassword",
            ]
          : [
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "password",
              "confirmPassword",
              "companyName",
              "address",
              "city",
            ];

      const filledFields = fields.filter(
        (field) => formData[field].trim() !== ""
      ).length;
      return Math.round((filledFields / fields.length) * 100);
    };

    setFormCompletion(calculateCompletion());
  }, [formData, role]);

  // Function to search for city and update map
  const searchCity = async () => {
    if (!formData.city.trim()) {
      setErrors((prev) => ({
        ...prev,
        city: "City name is required to search",
      }));
      return;
    }

    setIsSearchingCity(true);

    try {
      // Use OpenStreetMap Nominatim API to search for the city
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          formData.city
        )}, India`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = Number.parseFloat(result.lat);
        const lng = Number.parseFloat(result.lon);

        // Update the form data with the found coordinates
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
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
        setErrors((prev) => ({
          ...prev,
          city: "City not found. Please try another name.",
        }));
      }
    } catch (error) {
      console.error("Error searching for city:", error);
      setErrors((prev) => ({
        ...prev,
        city: "Error searching for city. Please try again.",
      }));
    } finally {
      setIsSearchingCity(false);
    }
  };

  const initMap = (lat, lng) => {
    if (map) {
      return; // Avoid re-initializing if map already exists
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js";
    script.async = true;
    document.body.appendChild(script);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css";
    document.head.appendChild(link);

    script.onload = () => {
      const mapInstance = L.map("map").setView([lat, lng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      const markerInstance = L.marker([lat, lng], { draggable: true }).addTo(
        mapInstance
      );
      markerInstance.on("dragend", () => {
        const position = markerInstance.getLatLng();
        setFormData((prev) => ({
          ...prev,
          latitude: position.lat.toFixed(6),
          longitude: position.lng.toFixed(6),
        }));
      });

      setMap(mapInstance);
      setMarker(markerInstance);
    };
  };

  // Initialize map when showMap becomes true
  useEffect(() => {
    if (showMap && !map && formData.latitude && formData.longitude) {
      initMap(
        Number.parseFloat(formData.latitude),
        Number.parseFloat(formData.longitude)
      );
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
      [name]: value,
    });

    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Validate common fields for step 1
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Please enter a valid Indian phone number";
      }
      if (!formData.dateofbirth) {
        newErrors.dateofbirth = "Please enter a valid Birth Date";
      }else if(formData.dateofbirth){
        const dob = new Date(formData.dateofbirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        if (age < 18) {
          newErrors.dateofbirth = "Must be 18 years or older";
        }
      }
    } else if (step === 2) {
      // Validate password fields for step 2
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else if (step === 3 && role === "manager") {
      // Validate manager-specific fields for step 3
      if (!formData.companyName.trim())
        newErrors.companyName = "Company name is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.latitude || !formData.longitude)
        newErrors.location = "Location is required";
    }

    return newErrors;
  };

  const handleNextStep = () => {
    const validationErrors = validate(currentStep);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (currentStep < (role === "customer" ? 2 : 3)) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    showLoader("We will Registering...");
    setApiError(null);

    // Prepare payload
    const payload = {
      user: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: role === "manager" ? "RENTAL_COMPANY" : "CUSTOMER",
      },
    };

    if (role === "customer") {
      payload.customer = {
        fullName: `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        drivingLicenseStatus:formData.drivingLicenseStatus,
        dateOfBirth: formData.dateofbirth,
      };
    } else if (role === "manager") {
      payload.rentalCompany = {
        companyName: formData.companyName,
        address: formData.address,
        city: formData.city,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        phoneNumber: formData.phoneNumber,
      };
    }

    try {
      const response = await fetch(
        "http://localhost:8084/auth/register/initiate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data.message || "Registration failed"
        );
      }

      console.log("Registration successful:", data);
      setIsSuccess(true);
      navigate("/register-otp", {
        state: { email: payload.user.email },
      });

      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          drivingLicense: "",
          drivingLicenseExpiry: "",
          companyName: "",
          address: "",
          city: "",
          latitude: "",
          longitude: "",
        });

        if (map) {
          map.remove();
          setMap(null);
          setMarker(null);
        }
        setShowMap(false);
      }, 3000);
    } catch (error) {
      console.error("Registration error:", error);
      setApiError(
        error.message ||
          "An error occurred during registration. Please try again."
      );
    } finally {
      hideLoader();
    }
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  // Car animation for loading
  const carVariants = {
    initial: { x: -100 },
    animate: {
      x: 100,
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 2,
        ease: "easeInOut",
      },
    },
  };

  // Render step content
  const renderStepContent = (step) => {
    const direction = step < currentStep ? -1 : 1;

    return (
      <motion.div
        key={step}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full"
      >
        {step === 1 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            {/* Role Selection */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to register as a:
              </label>
              <div className="flex space-x-4">
                <motion.button
                  type="button"
                  onClick={() => handleRoleChange("customer")}
                  className={`flex-1 py-4 px-4 rounded-lg border flex items-center justify-center space-x-2 transition-all duration-300 ${
                    role === "customer"
                      ? "bg-red-50 border-red-500 text-red-700 shadow-md"
                      : "border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: role === "customer" ? 1 : 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User size={18} />
                  <span>Customer</span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => handleRoleChange("manager")}
                  className={`flex-1 py-4 px-4 rounded-lg border flex items-center justify-center space-x-2 transition-all duration-300 ${
                    role === "manager"
                      ? "bg-red-50 border-red-500 text-red-700 shadow-md"
                      : "border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: role === "manager" ? 1 : 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Briefcase size={18} />
                  <span>Manager</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Common Fields */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <motion.input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 sm:text-sm border-2 rounded-md focus:ring-red-500 focus:border-red-500 transition-all duration-300 ${
                      errors.firstName ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="John"
                    whileFocus={{ scale: 1.01, borderColor: "#ef4444" }}
                  />
                </div>
                {errors.firstName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-xs text-red-600 flex items-center"
                  >
                    <AlertCircle size={12} className="mr-1" />{" "}
                    {errors.firstName}
                  </motion.p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <motion.input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 sm:text-sm border-2 rounded-md focus:ring-red-500 focus:border-red-500 transition-all duration-300 ${
                      errors.lastName ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Doe"
                    whileFocus={{ scale: 1.01, borderColor: "#ef4444" }}
                  />
                </div>
                {errors.lastName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-xs text-red-600 flex items-center"
                  >
                    <AlertCircle size={12} className="mr-1" /> {errors.lastName}
                  </motion.p>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <motion.input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 sm:text-sm border-2 rounded-md focus:ring-red-500 focus:border-red-500 transition-all duration-300 ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="your@email.com"
                  whileFocus={{ scale: 1.01, borderColor: "#ef4444" }}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-600 flex items-center"
                >
                  <AlertCircle size={12} className="mr-1" /> {errors.email}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={16} className="text-gray-400" />
                </div>
                <motion.input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 sm:text-sm border-2 rounded-md focus:ring-red-500 focus:border-red-500 transition-all duration-300 ${
                    errors.phoneNumber ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="989898xxxx"
                  whileFocus={{ scale: 1.01, borderColor: "#ef4444" }}
                />
              </div>
              {errors.phoneNumber && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-600 flex items-center"
                >
                  <AlertCircle size={12} className="mr-1" />{" "}
                  {errors.phoneNumber}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="dateofbirth"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <motion.input
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
                  className="block w-full pl-10 pr-3 py-3 sm:text-sm border-2 border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  whileFocus={{ scale: 1.01, borderColor: "#ef4444" }}
                />
              </div>
              {errors.dateofbirth && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-600 flex items-center"
                >
                  <AlertCircle size={12} className="mr-1" />{" "}
                  {errors.dateofbirth}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={16} className="text-gray-400" />
                </div>
                <motion.input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 sm:text-sm border-2 rounded-md focus:ring-red-500 focus:border-red-500 transition-all duration-300 ${
                    errors.address ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="123 Main St"
                  whileFocus={{ scale: 1.01, borderColor: "#ef4444" }}
                />
              </div>
              {errors.address && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-600 flex items-center"
                >
                  <AlertCircle size={12} className="mr-1" /> {errors.address}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key size={16} className="text-gray-400" />
                  </div>
                  <motion.input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 sm:text-sm border-2 rounded-md focus:ring-red-500 focus:border-red-500 transition-all duration-300 ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="••••••"
                    whileFocus={{ scale: 1.01, borderColor: "#ef4444" }}
                  />
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-xs text-red-600 flex items-center"
                  >
                    <AlertCircle size={12} className="mr-1" /> {errors.password}
                  </motion.p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key size={16} className="text-gray-400" />
                  </div>
                  <motion.input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 sm:text-sm border-2 rounded-md focus:ring-red-500 focus:border-red-500 transition-all duration-300 ${
                      errors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="••••••"
                    whileFocus={{ scale: 1.01, borderColor: "#ef4444" }}
                  />
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-xs text-red-600 flex items-center"
                  >
                    <AlertCircle size={12} className="mr-1" />{" "}
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {step === 3 && role === "manager" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building size={16} className="text-gray-400" />
                </div>
                <motion.input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 sm:text-sm border-2 rounded-md focus:ring-red-500 focus:border-red-500 transition-all duration-300 ${
                    errors.companyName ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Acme Inc."
                  whileFocus={{ scale: 1.01, borderColor: "#ef4444" }}
                />
              </div>
              {errors.companyName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-600 flex items-center"
                >
                  <AlertCircle size={12} className="mr-1" />{" "}
                  {errors.companyName}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={16} className="text-gray-400" />
                </div>
                <motion.input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 sm:text-sm border-2 rounded-md focus:ring-red-500 focus:border-red-500 transition-all duration-300 ${
                    errors.address ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="123 Main St"
                  whileFocus={{ scale: 1.01, borderColor: "#ef4444" }}
                />
              </div>
              {errors.address && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-600 flex items-center"
                >
                  <AlertCircle size={12} className="mr-1" /> {errors.address}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <div className="relative rounded-md shadow-sm flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building size={16} className="text-gray-400" />
                  </div>
                  <motion.input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 sm:text-sm border-2 rounded-md focus:ring-red-500 focus:border-red-500 transition-all duration-300 ${
                      errors.city ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Mumbai"
                    whileFocus={{ scale: 1.01, borderColor: "#ef4444" }}
                  />
                </div>
                <motion.button
                  type="button"
                  onClick={searchCity}
                  disabled={isSearchingCity}
                  className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSearchingCity ? (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <Search size={16} />
                  )}
                </motion.button>
              </div>
              {errors.city && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-600 flex items-center"
                >
                  <AlertCircle size={12} className="mr-1" /> {errors.city}
                </motion.p>
              )}
            </motion.div>

            {/* Location Fields with Map Integration */}
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <motion.button
                  type="button"
                  onClick={toggleMap}
                  className="text-sm text-red-600 hover:text-red-500 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showMap ? (
                    <>
                      <X size={14} className="mr-1" /> Hide Map
                    </>
                  ) : (
                    <>
                      <MapPin size={14} className="mr-1" /> Show Map
                    </>
                  )}
                </motion.button>
              </div>

              <AnimatePresence>
                {showMap && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 bg-gray-100 rounded-md p-1 overflow-hidden"
                  >
                    <div id="map" className="h-64 w-full rounded-md"></div>
                    <p className="text-xs text-gray-600 mt-1 px-1">
                      Click on the map or drag the marker to set your business
                      location
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label
                    htmlFor="latitude"
                    className="block text-xs text-gray-500"
                  >
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
                  <label
                    htmlFor="longitude"
                    className="block text-xs text-gray-500"
                  >
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
              {errors.location && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-600 flex items-center"
                >
                  <AlertCircle size={12} className="mr-1" /> {errors.location}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-red-200 rounded-full opacity-20"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 5,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-10 right-10 w-40 h-40 bg-orange-200 rounded-full opacity-20"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 7,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/4 w-24 h-24 bg-red-300 rounded-full opacity-10"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 9,
          ease: "easeInOut",
        }}
      />

      {/* Car silhouettes in background */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-20 opacity-5"
        initial={{ x: -200 }}
        animate={{ x: window.innerWidth + 200 }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 15,
          ease: "linear",
        }}
      >
        <Car size={60} className="text-red-900" />
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-0 w-full h-20 opacity-5"
        initial={{ x: -100 }}
        animate={{ x: window.innerWidth + 100 }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 20,
          ease: "linear",
          delay: 5,
        }}
      >
        <Car size={40} className="text-red-900" />
      </motion.div>

      <div className="max-w-md w-full">
        <motion.div
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <motion.div
            className="bg-gradient-to-r from-red-600 to-red-700 py-8 px-6 relative overflow-hidden"
            whileHover={{ backgroundPosition: ["0% 0%", "100% 0%"] }}
            transition={{ duration: 3 }}
          >
            {/* Animated car icon */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full opacity-10 flex items-center justify-center overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 40,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <Car size={180} className="text-white" />
              </motion.div>
            </motion.div>

            <motion.div
              className="mx-auto h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm p-3 text-white flex items-center justify-center mb-4 relative z-10"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Car size={32} className="text-white" />
            </motion.div>

            <motion.h2
              className="text-center text-3xl font-extrabold text-white relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Create Your Account
            </motion.h2>

            <motion.p
              className="mt-2 text-center text-sm text-red-100 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Join our premium car rental service today
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="mt-6 h-1 bg-red-800/50 rounded-full overflow-hidden relative z-10"
              initial={{ width: "100%" }}
              animate={{ width: "100%" }}
            >
              <motion.div
                className="h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: `${formCompletion}%` }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>

            {/* Step indicators */}
            <div className="flex justify-between mt-2 relative z-10">
              <motion.div
                className="flex flex-col items-center"
                animate={{
                  scale: currentStep === 1 ? 1.1 : 1,
                  opacity: currentStep >= 1 ? 1 : 0.7,
                }}
              >
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                    currentStep >= 1
                      ? "bg-white text-red-600"
                      : "bg-red-800/50 text-white"
                  }`}
                >
                  1
                </div>
                <span className="text-xs text-white mt-1">Details</span>
              </motion.div>

              <motion.div
                className="flex flex-col items-center"
                animate={{
                  scale: currentStep === 2 ? 1.1 : 1,
                  opacity: currentStep >= 2 ? 1 : 0.7,
                }}
              >
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                    currentStep >= 2
                      ? "bg-white text-red-600"
                      : "bg-red-800/50 text-white"
                  }`}
                >
                  2
                </div>
                <span className="text-xs text-white mt-1">Security</span>
              </motion.div>

              {role === "manager" && (
                <motion.div
                  className="flex flex-col items-center"
                  animate={{
                    scale: currentStep === 3 ? 1.1 : 1,
                    opacity: currentStep >= 3 ? 1 : 0.7,
                  }}
                >
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                      currentStep >= 3
                        ? "bg-white text-red-600"
                        : "bg-red-800/50 text-white"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-xs text-white mt-1">Business</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {isSuccess ? (
            <motion.div
              className="p-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, 0] }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <CheckCircle className="h-8 w-8 text-green-600" />
              </motion.div>
              <motion.h3
                className="mt-3 text-xl font-medium text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Registration successful!
              </motion.h3>
              <motion.p
                className="mt-2 text-sm text-gray-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Your account has been created successfully.
              </motion.p>
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  className="relative h-2 bg-gray-100 rounded-full overflow-hidden"
                  initial={{ width: "100%" }}
                  animate={{ width: "100%" }}
                >
                  <motion.div
                    className="h-full bg-green-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3 }}
                  />
                </motion.div>
                <p className="text-xs text-gray-500 mt-2">
                  Redirecting to verification...
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <div className="py-8 px-6 space-y-6">
              <AnimatePresence mode="wait" custom={currentStep}>
                {renderStepContent(currentStep)}
              </AnimatePresence>

              {/* API Error */}
              <AnimatePresence>
                {apiError && (
                  <motion.div
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                  >
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{apiError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                {currentStep > 1 ? (
                  <motion.button
                    type="button"
                    onClick={handlePrevStep}
                    className="py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Back
                  </motion.button>
                ) : (
                  <div></div> // Empty div to maintain flex spacing
                )}

                <motion.button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className="flex items-center justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isLoading ? (
                    <motion.div
                      className="flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        variants={carVariants}
                        initial="initial"
                        animate="animate"
                        className="mr-2"
                      >
                        <Car size={18} />
                      </motion.div>
                      Processing...
                    </motion.div>
                  ) : currentStep < (role === "customer" ? 2 : 3) ? (
                    <motion.div className="flex items-center">
                      Continue <ChevronRight size={16} className="ml-1" />
                    </motion.div>
                  ) : (
                    "Register Now"
                  )}
                </motion.button>
              </div>

              <motion.div
                className="text-center text-sm"
                variants={itemVariants}
              >
                <Link
                  to="/"
                  className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                >
                  <motion.span whileHover={{ x: 2 }} className="inline-block">
                    ← Go Back
                  </motion.span>
                </Link>
              </motion.div>
              <motion.div
                className="text-center text-xs text-gray-500 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                By registering, you agree to our Terms of Service and Privacy
                Policy
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Car Features */}
        <motion.div
          className="mt-8 grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm flex flex-col items-center"
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <motion.div
              className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-2"
              whileHover={{ rotate: 10 }}
            >
              <Shield size={20} className="text-red-600" />
            </motion.div>
            <p className="text-xs text-gray-600 text-center">Secure Booking</p>
          </motion.div>

          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm flex flex-col items-center"
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <motion.div
              className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-2"
              whileHover={{ rotate: 10 }}
            >
              <Car size={20} className="text-red-600" />
            </motion.div>
            <p className="text-xs text-gray-600 text-center">Premium Fleet</p>
          </motion.div>

          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm flex flex-col items-center"
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <motion.div
              className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-2"
              whileHover={{ rotate: 10 }}
            >
              <MapPin size={20} className="text-red-600" />
            </motion.div>
            <p className="text-xs text-gray-600 text-center">
              Nationwide Service
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
