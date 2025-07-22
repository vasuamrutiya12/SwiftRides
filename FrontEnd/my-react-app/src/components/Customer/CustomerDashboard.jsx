"use client";

/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../LandingPages/Navbar";
import {
  User,
  Calendar,
  Star,
  MessageSquare,
  MessageSquareReply,
  AlertTriangle ,
  Clock,
  MapPin,
  Settings,
  Edit3,
  Save,
  X,
  Plus,
  LogOut,
  Car,
  Award,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Camera,
  UploadCloud,
} from "lucide-react";
import { useLoading } from "../Loader/LoadingProvider";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const navigate = useNavigate();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfile, setEditProfile] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    drivingLicenseNumber: "",
    dateOfBirth: "",
  });

  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [comments, setComments] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showLoader, hideLoader } = useLoading();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [name, setName] = useState("");
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: "",
    comment: "",
  });
  const [isUpdatingReview, setIsUpdatingReview] = useState(false);
  const [existingReview, setExistingReview] = useState(null);

  const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false);
  const [selectedBookingForDetails, setSelectedBookingForDetails] =
    useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [licenseForm, setLicenseForm] = useState({
    drivingLicenseNumber: "",
    licenseImage: null,
    licenseImagePreview: null,
  });
  const [isEditingLicense, setIsEditingLicense] = useState(false);

  const [selfieForm, setSelfieForm] = useState({
    selfieImage: null,
    selfieImagePreview: null,
    selfieImageUrl: null,
  });

  const [showSelfieStep, setShowSelfieStep] = useState(false);
  const [licenseSaved, setLicenseSaved] = useState(false);

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const BASE_URL1 = "http://localhost:8084"; // Auth Service
  const BASE_URL2 = "http://localhost:9090"; // Customer/Booking Service

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      showLoader("loading...");
      try {
        const resId = await fetch(`${BASE_URL1}/auth/user/email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        });

        const id = await resId.json();
        setCustomerId(id);

        const resProfile = await fetch(`${BASE_URL2}/api/customers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await resProfile.json();
        console.log(profileData);
        localStorage.setItem("drivingLicenseStatus",profileData.drivingLicenseStatus)
        setName(profileData.fullName);
        setProfile(profileData);

        setEditProfile(profileData); // Sync edit fields

        const resBookings = await fetch(
          `${BASE_URL2}/api/customers/${id}/booking`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        let bookingData = await resBookings.json();
        for (const b of bookingData) {
          if (b.status && b.status.toLowerCase() === "pending" && !isLessThanOneHourOld(b.createdAt)) {
            await handleDeleteBooking(b.bookingId);
          }
        }
        // Filter out deleted bookings
        bookingData = bookingData.filter(b => !(b.status && b.status.toLowerCase() === "pending" && !isLessThanOneHourOld(b.createdAt)));
        setBookings(bookingData);

        const resComments = await fetch(
          `${BASE_URL2}/api/reviews/customer/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (resComments.ok) {
          const fetchedComments = await resComments.json();
          const reviewData = fetchedComments;
          const hasReply = reviewData.reply && reviewData.reply.trim() !== "";
          const hasReport =
            reviewData.report && reviewData.report.trim() !== "";
          const showButtons = !hasReply && !hasReport;
          const commentsWithCarInfo = fetchedComments.map((comment) => {
            const booking = bookingData.find((b) => b.carId === comment.carId);
            return {
              ...comment,
              carDto: booking ? booking.car : null, // Attach car details as carDto
            };
          });
          setComments(commentsWithCarInfo);
          console.log(commentsWithCarInfo);
        }
      } catch (err) {
        console.error("Error loading customer data:", err);
      } finally {
        hideLoader();
        setLoading(false);
      }
    };

    if (email && token) fetchCustomerData();
    else setLoading(false);
  }, [email, token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200";
      case "cancelled":
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const renderRatingStars = (rating, onRatingChange = null) => {
    return Array.from({ length: 5 }, (_, index) => (
      <motion.button
        key={index}
        type="button"
        onClick={() => onRatingChange && onRatingChange(index + 1)}
        className={`w-6 h-6 ${
          onRatingChange ? "cursor-pointer" : ""
        } transition-transform`}
        disabled={!onRatingChange}
        whileHover={onRatingChange ? { scale: 1.1 } : {}}
        whileTap={onRatingChange ? { scale: 0.95 } : {}}
      >
        <Star
          className={`w-6 h-6 ${
            index < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
          }`}
        />
      </motion.button>
    ));
  };
  const handleProfileCancel = () => {
    setEditProfile(profile); // Reset edits
    setIsEditingProfile(false);
  };
  const handleAddReview = (booking) => {

    // Check if customer has already reviewed this car
    const existingReview = comments.find(
      (comment) => comment.carId === booking.carId
    );

    if (existingReview) {
      // Update existing review
      setIsUpdatingReview(true);
      setExistingReview(existingReview);
      setReviewForm({
        rating: existingReview.rating,
        title: existingReview.title || "",
        comment: existingReview.comment,
      });
    } else {
      // Add new review
      setIsUpdatingReview(false);
      setExistingReview(null);
      setReviewForm({
        rating: 0,
        title: "",
        comment: "",
      });
    }

    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const handleViewBookingDetails = (booking) => {
    setSelectedBookingForDetails(booking);
    setCurrentImageIndex(0); // Reset to first image when opening modal
    setShowBookingDetailsModal(true);
  };

  const nextImage = () => {
    if (selectedBookingForDetails?.car?.imageUrls) {
      setCurrentImageIndex((prev) =>
        prev === selectedBookingForDetails.car.imageUrls.length - 1
          ? 0
          : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedBookingForDetails?.car?.imageUrls) {
      setCurrentImageIndex((prev) =>
        prev === 0
          ? selectedBookingForDetails.car.imageUrls.length - 1
          : prev - 1
      );
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (
      reviewForm.rating === 0 ||
      !reviewForm.title.trim() ||
      !reviewForm.comment.trim()
    ) {
      alert("Please fill in all fields and provide a rating");
      return;
    }

    const payload = {
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    };

    const customerId =
      selectedBooking.customerId || selectedBooking.customer?.customerId;
    const carId = selectedBooking.carId;

    console.log(payload);
    console.log(customerId + " " + carId);

    try {
      const method = isUpdatingReview ? "PUT" : "POST";
      const url = isUpdatingReview
        ? `${BASE_URL2}/api/reviews/car/${carId}/customer/${customerId}`
        : `${BASE_URL2}/api/reviews/car/${carId}/customer/${customerId}`;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      if (isUpdatingReview) {
        // Update existing review in the list
        setComments(
          comments.map((comment) =>
            comment.carId === carId
              ? {
                  ...comment,
                  rating: payload.rating,
                  comment: payload.comment,
                  title: reviewForm.title,
                }
              : comment
          )
        );
      } else {
        // Add new review
        const newReview = {
          id: comments.length + 1,
          carId,
          bookingReference: selectedBooking.bookingReference,
          car: {
            make: selectedBooking.car.make,
            model: selectedBooking.car.model,
            year: selectedBooking.car.year,
            imageUrl: selectedBooking.car.imageUrls?.[0],
          },
          rating: payload.rating,
          title: reviewForm.title,
          comment: payload.comment,
          createdAt: new Date().toISOString(),
          helpful: 0,
          notHelpful: 0,
          companyResponse: null,
        };

        setComments([newReview, ...comments]);
      }

      setBookings(
        bookings.map((booking) =>
          booking.bookingReference === selectedBooking.bookingReference
            ? { ...booking, hasReview: true }
            : booking
        )
      );

      setShowReviewModal(false);
      setSelectedBooking(null);
      setReviewForm({ rating: 0, title: "", comment: "" });
      setIsUpdatingReview(false);
      setExistingReview(null);
      window.location.reload();
    } catch (error) {
      console.error("Review submission failed:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleProfileSave = async () => {
    try {
      const response = await fetch(`${BASE_URL2}/api/customers/${customerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editProfile),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      alert("Profile updated successfully!");
      setIsEditingProfile(false);
      window.location.reload();
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleLicenseImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLicenseForm({
        ...licenseForm,
        licenseImage: file,
        licenseImagePreview: URL.createObjectURL(file),
      });
    } else {
      setLicenseForm({
        ...licenseForm,
        licenseImage: null,
        licenseImagePreview: null,
      });
    }
  };

  const handleLicenseSave = async () => {
    if (!licenseForm.drivingLicenseNumber.trim()) {
      alert("Please enter your driving license number.");
      return;
    }

    showLoader("Updating license...");
    try {
      let imageUrl = profile?.drivingLicenseImg || null;
      if (licenseForm.licenseImage) {
        const cloudinaryResponse = await uploadToCloudinary(
          licenseForm.licenseImage,
          "image"
        );
        if (!cloudinaryResponse) {
          hideLoader();
          alert("Failed to upload image. Please try again.");
          return;
        }
        imageUrl = cloudinaryResponse;
      }

      const updatedCustomerResponse = await fetch(
        `${BASE_URL2}/api/customers/${customerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...profile,
            drivingLicenseNumber: licenseForm.drivingLicenseNumber,
            drivingLicenseImg: imageUrl,
          }),
        }
      );

      if (!updatedCustomerResponse.ok) {
        throw new Error("Failed to update driving license information.");
      }

      const newProfile = await updatedCustomerResponse.json();
      setProfile(newProfile);
      setIsEditingLicense(false);
      setLicenseForm({
        drivingLicenseNumber: "",
        licenseImage: null,
        licenseImagePreview: null,
      });
      setLicenseSaved(true);
      setShowSelfieStep(true); // Show selfie step after saving
      alert("Driving license information updated successfully! Now upload a selfie for verification.");
    } catch (error) {
      alert("Failed to update driving license. Please try again.");
    } finally {
      hideLoader();
    }
  };

  const handlePayAndBook = async (booking) => {
    try {
      showLoader("Redirecting to payment...");
      const paymentPayload = {
        bookingId: Number(booking.bookingId),
        companyId: Number(booking.companyID),
        amount: Number(booking.totalAmount),
        paymentMethod: "card",
        currency: "inr",
        customerEmail: email?.trim() || "unknown@example.com",
        description: "Payment for car rental booking",
      };
  
      const paymentResponse = await fetch("http://localhost:9090/api/payments/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentPayload),
      });
  
      if (!paymentResponse.ok) {
        throw new Error("Failed to initiate payment session");
      }
  
      const paymentData = await paymentResponse.json();
      const redirectUrl = paymentData.checkoutUrl;
      window.location.href = redirectUrl;
    } catch (error) {
      hideLoader();
      alert("Payment initiation failed. Please try again.");
      console.error(error);
    }
  };
  
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      showLoader("Deleting booking...");
      const response = await fetch(`http://localhost:9090/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete booking");
      setBookings(bookings.filter((b) => b.bookingId !== bookingId));
      alert("Booking deleted.");
    } catch (error) {
      alert("Failed to delete booking.");
      console.error(error);
    } finally {
      setSelectedBookingForDetails(null);
      hideLoader();
      window.location.reload();
    }
  };

  const handleSelfieImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelfieForm({
        ...selfieForm,
        selfieImage: file,
        selfieImagePreview: URL.createObjectURL(file),
      });
      const uploadedUrl = await uploadToCloudinary(file, "image");
      setSelfieForm((prev) => ({
        ...prev,
        selfieImageUrl: uploadedUrl,
      }));
      // Automatically verify after selfie is uploaded
      if (uploadedUrl && profile?.drivingLicenseImg && profile?.drivingLicenseNumber) {
        await verifyDL(uploadedUrl);
      }
    } else {
      setSelfieForm({
        selfieImage: null,
        selfieImagePreview: null,
        selfieImageUrl: null,
      });
    }
  };

  const verifyDL = async (selfieUrlParam) => {
    const selfieUrlToUse = selfieUrlParam || selfieForm.selfieImageUrl;
    if (!profile?.drivingLicenseImg || !profile?.drivingLicenseNumber || !selfieUrlToUse) {
      alert("Please provide all required images and license number.");
      return;
    }
    try {
      console.log("11");
      
      const res = await fetch("http://localhost:9090/api/customers/dl/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dl_image_url: profile.drivingLicenseImg,
          entered_dl_number: profile.drivingLicenseNumber,
          selfie_image_url: selfieUrlToUse,
          customerName: profile.fullName,
          dateOfBirth: profile.dateOfBirth,
        }),
      });
      console.log("22");
      const result = await res.json();
      console.log(result);
      console.log(profile.fullName,profile.dateOfBirth);
      console.log("33")
      
      // Handle new response fields for match status
      if (result.status === "verified") {
        await fetch(`${BASE_URL2}/api/customers/${customerId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "verified" }),
        });
        localStorage.setItem("drivingLicenseStatus", "verified");
        setProfile((prev) => ({ ...prev, drivingLicenseStatus: "verified" }));
        alert("DL verified and status updated!");
      } else {
        alert(result.reason || result.message || "DL verification failed. See details in console.");
        console.log("DL Verification details:", result);
      }
    } catch (error) {
      alert("Verification failed.");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  // Stats calculation
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(
    (b) => b.status.toLowerCase() === "success"
  ).length;
  const totalSpent = bookings.reduce(
    (sum, booking) => sum + booking.totalAmount,
    0
  );
  const averageRating =
    comments.length > 0
      ? (
          comments.reduce((sum, comment) => sum + comment.rating, 0) /
          comments.length
        ).toFixed(1)
      : 0;

  const isLessThanOneHourOld = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now - created;
    return diffMs < 60 * 60 * 1000; // 1 hour in ms
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-red-100/50 p-6">
            {/* Mobile: Horizontal Layout, Desktop: Vertical Layout */}
            <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
              {/* User Information Section */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                      Welcome back, {name}!
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Manage your bookings and profile
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:flex lg:space-x-8 lg:gap-0">
                <div className="text-center p-3 sm:p-0">
                  <div className="text-xl sm:text-2xl font-bold text-red-600">
                    {totalBookings}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Total Bookings
                  </div>
                </div>
                <div className="text-center p-3 sm:p-0">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {completedBookings}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Completed
                  </div>
                </div>
                <div className="text-center p-3 sm:p-0">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    ₹{totalSpent.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Total Spent
                  </div>
                </div>
                <div className="text-center p-3 sm:p-0">
                  <div className="text-xl sm:text-2xl font-bold text-amber-600">
                    {averageRating}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Avg Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-red-100/50 mb-8"
        >
          <div className="p-2">
            <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {[
                { id: "bookings", label: "My Bookings", icon: Calendar },
                { id: "profile", label: "Profile", icon: Settings },
                { id: "license", label: "Driving License", icon: User }, // Add this new tab
                { id: "comment", label: "My Reviews", icon: MessageSquare },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center sm:justify-start space-x-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25"
                      : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
              <motion.button
                onClick={handleLogout}
                className="flex items-center justify-center sm:justify-start space-x-2 px-6 py-3 rounded-xl font-medium text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 sm:ml-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </motion.button>
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "bookings" && (
            <motion.div
              key="bookings"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <h2 className="text-2xl font-bold text-gray-900">
                  My Bookings
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2 w-fit">
                  <Car className="w-4 h-4" />
                  <span>
                    {bookings.length} booking{bookings.length !== 1 ? "s" : ""}{" "}
                    found
                  </span>
                </div>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
              >
                {bookings.map((booking, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-red-100/50 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                    whileHover={{ y: -5 }}
                  >
                    {/* Car Image */}
                    <div className="relative h-48 bg-gradient-to-br from-white-100 to-white-200 overflow-hidden">
                      <img
                        src={
                          booking.car.imageUrls?.[0] ||
                          booking.car.imageUrl ||
                          "/placeholder.svg"
                        }
                        alt={`${booking.car.make} ${booking.car.model}`}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop";
                        }}
                      />
                      <div className="absolute top-4 right-4">
                        <span
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          <span>{booking.status.toUpperCase()}</span>
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium">
                          {booking.car.category}
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {booking.car.make} {booking.car.model} (
                            {booking.car.year})
                          </h3>
                          <p className="text-sm text-gray-600">
                            Booking #{booking.bookingReference.slice(-8)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                            ₹{booking.totalAmount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {booking.totalDays} day
                            {booking.totalDays !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>

                      {/* Pickup & Return Info */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                          <div className="p-1 bg-green-500 rounded-full">
                            <MapPin className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-green-900">
                              Pickup
                            </div>
                            <div className="text-sm text-green-700">
                              {formatDate(booking.pickupDate)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                          <div className="p-1 bg-red-500 rounded-full">
                            <MapPin className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-red-900">
                              Return
                            </div>
                            <div className="text-sm text-red-700">
                              {formatDate(booking.returnDate)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>Booked {formatDate(booking.createdAt)}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewBookingDetails(booking)}
                            className="flex items-center justify-center space-x-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Details</span>
                          </motion.button>
                          {booking.status.toLowerCase() === "success" &&
                            !booking.hasReview && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleAddReview(booking)}
                                className="flex items-center justify-center space-x-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg shadow-green-500/25"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Review</span>
                              </motion.button>
                            )}
                          {booking.hasReview && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAddReview(booking)}
                              className="flex items-center justify-center space-x-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25"
                            >
                              <Edit3 className="w-4 h-4" />
                              <span>Update Review</span>
                            </motion.button>
                          )}
                          
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              key="profile"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-4xl mx-auto"
            >
              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-red-100/50 overflow-hidden"
              >
                {/* Profile Header */}
                <div className="relative px-6 py-8 bg-gradient-to-r from-red-500 via-rose-500 to-red-500 text-white overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
                  <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 mx-auto sm:mx-0"
                      >
                        <User className="w-10 h-10 text-white" />
                      </motion.div>
                      <div className="p-2 text-center sm:text-left">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                          Profile Settings
                        </h2>
                        <p className="text-white/80">
                          Manage your personal information and preferences
                        </p>
                      </div>
                    </div>
                    {!isEditingProfile && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditingProfile(true)}
                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30 w-fit mx-auto sm:mx-0"
                      >
                        <Edit3 className="h-5 w-5" />
                        <span className="font-medium">Edit Profile</span>
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Profile Content */}
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Full Name */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                          <User className="w-4 h-4 text-red-500" />
                          <span>Full Name</span>
                        </label>
                        {isEditingProfile ? (
                          <motion.input
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            type="text"
                            value={editProfile.fullName}
                            onChange={(e) =>
                              setEditProfile({
                                ...editProfile,
                                fullName: e.target.value,
                              })
                            }
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white shadow-sm"
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-gray-900 border-2 border-gray-200 font-medium">
                            {profile.fullName}
                          </div>
                        )}
                      </motion.div>

                      {/* Email Address */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-red-500" />
                          <span>Email Address</span>
                        </label>
                        {isEditingProfile ? (
                          <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-gray-900 border-2 border-gray-200 font-medium">
                            {email}
                          </div>
                        ) : (
                          <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-gray-900 border-2 border-gray-200 font-medium">
                            {email}
                          </div>
                        )}
                      </motion.div>

                      {/* Date of Birth */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-red-500" />
                          <span>Date of Birth</span>
                        </label>
                        {isEditingProfile ? (
                          <motion.input
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            type="date"
                            value={editProfile.dateOfBirth}
                            onChange={(e) =>
                              setEditProfile({
                                ...editProfile,
                                dateOfBirth: e.target.value,
                              })
                            }
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white shadow-sm"
                            placeholder="Enter your date of birth"
                          />
                        ) : (
                          <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-gray-900 border-2 border-gray-200 font-medium">
                            {profile.dateOfBirth
                              ? new Date(profile.dateOfBirth).toLocaleDateString()
                              : "Not provided"}
                          </div>
                        )}
                      </motion.div>
                    </div>
                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Phone Number */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-red-500" />
                          <span>Phone Number</span>
                        </label>
                        {isEditingProfile ? (
                          <motion.input
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={editProfile.phoneNumber}
                            onChange={(e) => {
                              const numericValue = e.target.value.replace(
                                /\D/g,
                                ""
                              ); // Remove non-digits
                              setEditProfile({
                                ...editProfile,
                                phoneNumber: numericValue,
                              });
                            }}
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white shadow-sm"
                            placeholder="Enter your phone number"
                          />
                        ) : (
                          <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-gray-900 border-2 border-gray-200 font-medium">
                            {profile.phoneNumber}
                          </div>
                        )}
                      </motion.div>

                      {/* Address */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span>Address</span>
                        </label>
                        {isEditingProfile ? (
                          <motion.textarea
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            value={editProfile.address}
                            onChange={(e) =>
                              setEditProfile({
                                ...editProfile,
                                address: e.target.value,
                              })
                            }
                            rows={4}
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white shadow-sm resize-none"
                            placeholder="Enter your address"
                          />
                        ) : (
                          <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-gray-900 border-2 border-gray-200 font-medium min-h-[120px] flex items-start">
                            {profile.address}
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditingProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-8 pt-6 border-t border-gray-200"
                    >
                      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleProfileSave}
                          className="flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg shadow-green-500/25 font-medium"
                        >
                          <Save className="h-5 w-5" />
                          <span>Save Changes</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleProfileCancel}
                          className="flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-gray-500 to-slate-500 text-white rounded-xl hover:from-gray-600 hover:to-slate-600 transition-all duration-200 shadow-lg shadow-gray-500/25 font-medium"
                        >
                          <X className="h-5 w-5" />
                          <span>Cancel</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Profile Stats */}
                  {!isEditingProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-8 pt-6 border-t border-gray-200"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Account Statistics
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-xl font-bold text-blue-600">
                                {totalBookings}
                              </div>
                              <div className="text-sm text-blue-700">
                                Total Bookings
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-xl font-bold text-green-600">
                                {completedBookings}
                              </div>
                              <div className="text-sm text-green-700">
                                Completed
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                              <Star className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-xl font-bold text-purple-600">
                                {comments.length}
                              </div>
                              <div className="text-sm text-purple-700">
                                Reviews
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                              <Award className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-xl font-bold text-amber-600">
                                {averageRating}
                              </div>
                              <div className="text-sm text-amber-700">
                                Avg Rating
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "license" && (
            <motion.div
              key="license"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-4xl mx-auto"
            >
              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-red-100/50 overflow-hidden"
              >
                {/* License Header */}
                <div className="relative px-6 py-8 bg-gradient-to-r from-red-400 via-red-500 to-orange-500 text-white overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
                  <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 mx-auto sm:mx-0"
                      >
                        <User className="w-10 h-10 text-white" />
                      </motion.div>
                      <div className="text-center sm:text-left p-2">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                          Driving License
                        </h2>
                        <p className="text-white/80">
                          Upload and manage your driving license information
                        </p>
                      </div>
                    </div>
                    {!isEditingLicense && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (profile?.drivingLicenseStatus === "verified") {
                            return; // Don't allow editing if verified
                          }
                          setLicenseForm({
                            drivingLicenseNumber:
                              profile?.drivingLicenseNumber || "",
                            licenseImage: null,
                            licenseImagePreview: null,
                          });
                          setIsEditingLicense(true);
                        }}
                        disabled={profile?.drivingLicenseStatus === "verified"}
                        className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 border w-fit mx-auto sm:mx-0 ${
                          profile?.drivingLicenseStatus === "verified"
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-white/30"
                        }`}
                      >
                        <Edit3 className="h-5 w-5" />
                        <span className="font-medium">
                          {profile?.drivingLicenseStatus === "verified"
                            ? "License Verified"
                            : "Update License"}
                        </span>
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* License Content */}
                <div className="p-8">
                  {/* Verification Notice */}
                  {profile?.drivingLicenseStatus === "verified" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-green-900">
                            License Verified
                          </h3>
                          <p className="text-sm text-green-700">
                            Your driving license has been verified by our admin
                            team. No further changes are allowed.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - License Number */}
                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                          <User className="w-4 h-4 text-red-500" />
                          <span>Driving License Number</span>
                        </label>
                        {isEditingLicense ? (
                          <motion.input
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            type="text"
                            value={licenseForm.drivingLicenseNumber}
                            onChange={(e) =>
                              setLicenseForm({
                                ...licenseForm,
                                drivingLicenseNumber: e.target.value,
                              })
                            }
                            disabled={
                              profile?.drivingLicenseStatus === "verified"
                            }
                            className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:border-red-500 transition-all duration-200 shadow-sm ${
                              profile?.drivingLicenseStatus === "verified"
                                ? "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "border-gray-200 bg-white focus:ring-red-500"
                            }`}
                            placeholder={
                              profile?.drivingLicenseStatus === "verified"
                                ? "Cannot be changed"
                                : "Enter your driving license number"
                            }
                          />
                        ) : (
                          <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-gray-900 border-2 border-gray-200 font-medium">
                            {profile?.drivingLicenseNumber || "Not provided"}
                          </div>
                        )}
                      </motion.div>

                      {/* License Status */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`rounded-xl p-4 ${
                          profile?.drivingLicenseStatus === "verified"
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                            : profile?.drivingLicenseStatus === "Rejected"
                            ? "bg-gradient-to-r from-red-50 to-rose-50 border border-red-200"
                            : "bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              profile?.drivingLicenseStatus === "verified"
                                ? "bg-green-500"
                                : profile?.drivingLicenseStatus === "Rejected"
                                ? "bg-red-500"
                                : "bg-amber-500"
                            }`}
                          >
                            {profile?.drivingLicenseStatus === "verified" ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : profile?.drivingLicenseStatus === "Rejected" ? (
                              <XCircle className="w-5 h-5 text-white" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              License Status
                            </h3>
                            <p
                              className={`text-sm ${
                                profile?.drivingLicenseStatus === "verified"
                                  ? "text-green-700"
                                  : profile?.drivingLicenseStatus === "Rejected"
                                  ? "text-red-700"
                                  : "text-amber-700"
                              }`}
                            >
                              {profile?.drivingLicenseStatus === "verified"
                                ? "Verified"
                                : profile?.drivingLicenseStatus === "Rejected"
                                ? "Rejected"
                                : "Pending Verification"}
                            </p>
                            {profile?.drivingLicenseStatus === "Rejected" && (
                              <p className="text-xs text-red-600 mt-1">
                                Your license was rejected. Please contact support or re-upload your license.
                              </p>
                            )}
                            {profile?.drivingLicenseStatus !== "verified" && profile?.drivingLicenseStatus !== "rejected" && (
                              <p className="text-xs text-amber-600 mt-1">
                                Your license will be verified by our admin team after submission.
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Right Column - License Image */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col items-center justify-center space-y-4"
                    >
                      {/* Show existing license image if available */}
                      {profile?.drivingLicenseImg && !isEditingLicense && (
                        <div className="w-full max-w-md">
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                              <span className="font-semibold text-green-900">
                                Current License Image
                              </span>
                            </div>
                            <img
                              src={profile.drivingLicenseImg}
                              alt="Current Driving License"
                              className="w-full h-auto rounded-xl shadow-lg border border-gray-200"
                            />
                          </div>
                        </div>
                      )}

                      {/* Upload area - show only when editing or no existing image */}
                      {(!profile?.drivingLicenseImg || isEditingLicense) && (
                        <label
                          htmlFor="license-upload"
                          className={`w-full max-w-md border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-200 ${
                            profile?.drivingLicenseStatus === "verified"
                              ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                              : "bg-gray-50 border-gray-200 cursor-pointer hover:border-red-400 hover:bg-red-50"
                          }`}
                        >
                          <UploadCloud
                            className={`w-12 h-12 mb-3 ${
                              profile?.drivingLicenseStatus === "verified"
                                ? "text-gray-400"
                                : "text-gray-400"
                            }`}
                          />
                          <span
                            className={`font-semibold text-center ${
                              profile?.drivingLicenseStatus === "verified"
                                ? "text-gray-500"
                                : "text-gray-700"
                            }`}
                          >
                            {profile?.drivingLicenseStatus === "verified"
                              ? "License Image Verified"
                              : profile?.drivingLicenseImg
                              ? "Update Driving License Image"
                              : "Upload Driving License Image"}
                          </span>
                          <p
                            className={`text-sm text-center mt-1 ${
                              profile?.drivingLicenseStatus === "verified"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            {profile?.drivingLicenseStatus === "verified"
                              ? "Cannot be changed"
                              : "Drag & drop or click to upload"}
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLicenseImageChange}
                            disabled={
                              profile?.drivingLicenseStatus === "verified"
                            }
                            className="hidden"
                            id="license-upload"
                          />
                        </label>
                      )}

                      {/* Show preview when editing and new image is selected */}
                      {isEditingLicense && licenseForm.licenseImagePreview && (
                        <div className="mt-4 w-full max-w-md">
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                <Camera className="w-4 h-4 text-white" />
                              </div>
                              <span className="font-semibold text-blue-900">
                                New Image Preview
                              </span>
                            </div>
                            <img
                              src={licenseForm.licenseImagePreview}
                              alt="New Driving License Preview"
                              className="w-full h-auto rounded-xl shadow-lg border border-gray-200"
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>


                  {/* Action Buttons for License */}
                  {isEditingLicense && !showSelfieStep && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-8 pt-6 border-t border-gray-200"
                    >
                      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleLicenseSave}
                          className="flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-blue-500/25 font-medium"
                        >
                          <Save className="h-5 w-5" />
                          <span>Save License Info</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsEditingLicense(false)}
                          className="flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-gray-500 to-slate-500 text-white rounded-xl hover:from-gray-600 hover:to-slate-600 transition-all duration-200 shadow-lg shadow-gray-500/25 font-medium"
                        >
                          <X className="h-5 w-5" />
                          <span>Cancel</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Selfie Upload Step */}
                  {showSelfieStep && (
                    <div className="flex flex-col items-center mt-8">
                      <label
                        htmlFor="selfie-upload"
                        className="w-full max-w-md border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-200 bg-gray-50 border-gray-200 cursor-pointer hover:border-red-400 hover:bg-red-50 mt-4"
                      >
                        <Camera className="w-12 h-12 mb-3 text-gray-400" />
                        <span className="font-semibold text-gray-700">Upload Selfie with License</span>
                        <p className="text-sm text-gray-500 mt-1">Drag & drop or click to upload</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSelfieImageChange}
                          className="hidden"
                          id="selfie-upload"
                        />
                      </label>
                      {selfieForm.selfieImagePreview && (
                        <div className="mt-4 w-full max-w-md">
                          <img
                            src={selfieForm.selfieImagePreview}
                            alt="Selfie Preview"
                            className="w-full h-auto rounded-xl shadow-lg border border-gray-200"
                          />
                        </div>
                      )}
                      <p className="mt-2 text-blue-600 font-semibold">After uploading your selfie, verification will start automatically.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "comment" && (
            <motion.div
              key="comment"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <h2 className="text-2xl font-bold text-gray-900">My Reviews</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2 w-fit">
                  <Award className="w-4 h-4" />
                  <span>
                    {comments.length} review{comments.length !== 1 ? "s" : ""}{" "}
                    written
                  </span>
                </div>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6 md:grid-cols-1 lg:grid-cols-2"
              >
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    variants={itemVariants}
                    className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-red-100/50 overflow-hidden hover:shadow-xl transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    {/* Comment Header with Car Info */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 border border-gray-200 rounded-xl">
                          <img
                            src={ 
                              comment.carDto?.imageUrls?.[0] ||
                              comment.carDto?.imageUrl ||
                              "/placeholder.svg"
                            }
                            alt={`${comment.carDto?.make || ""} ${
                              comment.carDto?.model || ""
                            }`}
                            className="w-20 h-16 object-contain rounded-xl"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {comment.carDto?.make || "Unknown"}{" "}
                                {comment.carDto?.model || "Car"} (
                                {comment.carDto?.year || "N/A"})
                              </h3>
                            </div>
                            <div className="flex items-center space-x-1 bg-amber-50 px-3 py-1 rounded-lg w-fit">
                              {renderStars(comment.rating)}
                              <span className="ml-2 text-sm font-medium text-amber-700">
                                {comment.rating}/5
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comment Content */}
                    <div className="p-6">
                      <div className="mb-4">
                        <p className="text-gray-700 leading-relaxed">
                          {comment.comment}
                        </p>
                      </div>

                      {/* Comment Meta */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 mb-4 space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{comment.helpful}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ThumbsDown className="w-4 h-4" />
                            <span>{comment.notHelpful}</span>
                          </div>
                        </div>
                      </div>

                      {/* Company Response */}
                      {comment && (
                        <div className="mb-4">
                          {comment.reply && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-4 rounded-r-xl mb-3">
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                    <MessageSquareReply className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span className="font-semibold text-blue-900">
                                      Company Response
                                    </span>
                                  </div>
                                  <p className="text-blue-800 text-sm leading-relaxed">
                                    {comment.reply}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          {comment.report && (
                            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-4 rounded-r-xl">
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span className="font-semibold text-red-900">
                                      ⚠️ Content Reported
                                    </span>
                                  </div>
                                  <p className="text-red-800 text-lg leading-relaxed">
                                    Reason : {comment.report.reason}
                                  </p>
                                  <p className="text-red-800 text-sm leading-relaxed">
                                    Message : {comment.report.additionalDetails}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {showReviewModal && selectedBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {isUpdatingReview
                      ? "Update Your Review"
                      : "Add Your Review"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowReviewModal(false);
                      setIsUpdatingReview(false);
                      setExistingReview(null);
                      setReviewForm({ rating: 0, title: "", comment: "" });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">
                    {isUpdatingReview
                      ? "Updating review for:"
                      : "Reviewing booking for:"}
                  </p>
                  <p className="font-semibold text-lg text-gray-800">
                    {selectedBooking.car.make} {selectedBooking.car.model} (
                    {selectedBooking.car.year})
                  </p>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <div className="flex items-center space-x-1">
                      {renderRatingStars(reviewForm.rating, (newRating) =>
                        setReviewForm({ ...reviewForm, rating: newRating })
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review Title
                    </label>
                    <input
                      type="text"
                      value={reviewForm.title}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      placeholder="e.g., Great Car, Smooth Ride!"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Review
                    </label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          comment: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 resize-none"
                      placeholder="Share your experience..."
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewModal(false);
                        setIsUpdatingReview(false);
                        setExistingReview(null);
                        setReviewForm({ rating: 0, title: "", comment: "" });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      {isUpdatingReview ? "Update Review" : "Submit Review"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

          {/* Booking Details Modal */}
          {showBookingDetailsModal && selectedBookingForDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Booking Details
                      </h2>
                      <p className="text-gray-600">
                        Booking #{selectedBookingForDetails.bookingReference}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowBookingDetailsModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-6 w-6 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Car Details Section */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          Car Information
                        </h3>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                          <div className="flex items-start space-x-4">
                            <img
                              src={
                                selectedBookingForDetails.car.imageUrls?.[0] ||
                                selectedBookingForDetails.car.imageUrl ||
                                "/placeholder.svg"
                              }
                              alt={`${selectedBookingForDetails.car.make} ${selectedBookingForDetails.car.model}`}
                              className="w-24 h-20 object-contain rounded-lg shadow-md bg-white"
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop";
                              }}
                            />
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {selectedBookingForDetails.car.make}{" "}
                                {selectedBookingForDetails.car.model}
                              </h4>
                              <p className="text-gray-600 mb-2">
                                Year: {selectedBookingForDetails.car.year}
                              </p>
                              <div className="flex items-center space-x-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                  {selectedBookingForDetails.car.category}
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                  {selectedBookingForDetails.car.fuelType ||
                                    "Petrol"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Car Images Gallery */}
                      {selectedBookingForDetails.car.imageUrls &&
                        selectedBookingForDetails.car.imageUrls.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">
                              Car Images
                            </h4>
                            <div className="relative">
                              {/* Main Image Display */}
                              <div className="relative h-64 bg-white-100 rounded-xl overflow-hidden">
                                <img
                                  src={
                                    selectedBookingForDetails.car.imageUrls[
                                      currentImageIndex
                                    ]
                                  }
                                  alt={`${selectedBookingForDetails.car.make} ${
                                    selectedBookingForDetails.car.model
                                  } - Image ${currentImageIndex + 1}`}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop";
                                  }}
                                />

                                {/* Navigation Arrows */}
                                {selectedBookingForDetails.car.imageUrls
                                  .length > 1 && (
                                  <>
                                    <button
                                      onClick={prevImage}
                                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                                    >
                                      <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M15 19l-7-7 7-7"
                                        />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={nextImage}
                                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                                    >
                                      <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M9 5l7 7-7 7"
                                        />
                                      </svg>
                                    </button>
                                  </>
                                )}

                                {/* Image Counter */}
                                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                  {currentImageIndex + 1} /{" "}
                                  {
                                    selectedBookingForDetails.car.imageUrls
                                      .length
                                  }
                                </div>
                              </div>

                              {/* Thumbnail Navigation */}
                              {selectedBookingForDetails.car.imageUrls.length >
                                1 && (
                                <div className="mt-4 flex space-x-2 overflow-x-auto">
                                  {selectedBookingForDetails.car.imageUrls.map(
                                    (imageUrl, index) => (
                                      <button
                                        key={index}
                                        onClick={() =>
                                          setCurrentImageIndex(index)
                                        }
                                        className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                          index === currentImageIndex
                                            ? "border-blue-500 shadow-lg"
                                            : "border-gray-200 hover:border-gray-300"
                                        }`}
                                      >
                                        <img
                                          src={imageUrl}
                                          alt={`Thumbnail ${index + 1}`}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.target.src =
                                              "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop";
                                          }}
                                        />
                                      </button>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Booking Details Section */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          Booking Information
                        </h3>
                        <div className="space-y-4">
                          {/* Status */}
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                            <span className="font-medium text-gray-700">
                              Status
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                selectedBookingForDetails.status
                              )}`}
                            >
                              {getStatusIcon(selectedBookingForDetails.status)}
                              <span className="ml-1">
                                {selectedBookingForDetails.status.toUpperCase()}
                              </span>
                            </span>
                          </div>

                          {/* Dates */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-green-50 rounded-xl">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-500 rounded-full">
                                  <MapPin className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-green-900">
                                    Pickup Date
                                  </p>
                                  <p className="text-lg font-semibold text-green-700">
                                    {formatDate(
                                      selectedBookingForDetails.pickupDate
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 bg-red-50 rounded-xl">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-red-500 rounded-full">
                                  <MapPin className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-red-900">
                                    Return Date
                                  </p>
                                  <p className="text-lg font-semibold text-red-700">
                                    {formatDate(
                                      selectedBookingForDetails.returnDate
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Duration and Amount */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 rounded-xl">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-500 rounded-full">
                                  <Calendar className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-blue-900">
                                    Duration
                                  </p>
                                  <p className="text-lg font-semibold text-blue-700">
                                    {selectedBookingForDetails.totalDays} day
                                    {selectedBookingForDetails.totalDays !== 1
                                      ? "s"
                                      : ""}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-xl">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-500 rounded-full">
                                  <span className="text-white font-bold">
                                    ₹
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-purple-900">
                                    Total Amount
                                  </p>
                                  <p className="text-lg font-semibold text-purple-700">
                                    ₹
                                    {selectedBookingForDetails.totalAmount.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Booking Date */}
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-gray-500 rounded-full">
                                <Clock className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Booked On
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                  {formatDate(
                                    selectedBookingForDetails.createdAt
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          {selectedBookingForDetails.status && selectedBookingForDetails.status.toLowerCase() === "pending" && isLessThanOneHourOld(selectedBookingForDetails.createdAt) && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handlePayAndBook(selectedBookingForDetails)}
                                className="flex items-center justify-center space-x-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg shadow-green-500/25"
                              >
                                <span>Pay & Book</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDeleteBooking(selectedBookingForDetails.bookingId)}
                                className="flex items-center justify-center space-x-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg shadow-red-500/25"
                              >
                                <span>Delete</span>
                              </motion.button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
