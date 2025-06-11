import Navbar from "../LandingPages/Navbar";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  Star,
  MessageSquare,
  Clock,
  MapPin,
  Settings,
  Edit3,
  Save,
  X,
  Plus,
  Send,
  StarIcon,
  LogOut,
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const navigate = useNavigate();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfile, setEditProfile] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    drivingLicenseNumber: ""
  });

  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [comments, setComments] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: "", comment: "" });

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
        setProfile(profileData);
        setEditProfile(profileData); // Sync edit fields

        const resBookings = await fetch(`${BASE_URL2}/api/customers/${id}/booking`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const bookingData = await resBookings.json();
        setBookings(bookingData);

        const resComments = await fetch(`${BASE_URL2}/api/customers/${id}/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resComments.ok) {
          const commentData = await resComments.json();
          setComments(commentData);
        }
      } catch (err) {
        console.error("Error loading customer data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (email && token) fetchCustomerData();
    else setLoading(false);
  }, [email, token]);

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

      if (!response.ok) throw new Error("Failed to update profile");

      const updated = await response.json();
      setProfile(updated);
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Failed to update profile.");
    }
  };

  const handleProfileCancel = () => {
    setEditProfile(profile); // Reset edits
    setIsEditingProfile(false);
  };

  const handleAddReview = (booking) => {
    setSelectedBooking(booking);
    setReviewForm({ rating: 0, title: "", comment: "" });
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (reviewForm.rating === 0 || !reviewForm.comment.trim()) {
      alert("Please provide a rating and comment");
      return;
    }

    const payload = {
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    };

    const customerId = selectedBooking.customerId || selectedBooking.customer?.customerId;
    const carId = selectedBooking.carId;

    console.log(payload);
    console.log(customerId+" "+carId);
    
    
    
    try {
      const response = await fetch(`${BASE_URL2}/api/customers/${customerId}/car/${carId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit review");

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
        comment: payload.comment,
        createdAt: new Date().toISOString(),
        helpful: 0,
        notHelpful: 0,
        companyResponse: null,
      };

      setComments([newReview, ...comments]);

      setBookings(bookings.map(booking =>
        booking.bookingReference === selectedBooking.bookingReference
          ? { ...booking, hasReview: true }
          : booking
      ));

      setShowReviewModal(false);
      setSelectedBooking(null);
      setReviewForm({ rating: 0, title: "", comment: "" });
    } catch (error) {
      console.error("Review submission failed:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ));

  const renderRatingStars = (rating, onRatingChange = null) =>
    Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onRatingChange && onRatingChange(i + 1)}
        className={`w-6 h-6 ${onRatingChange ? "cursor-pointer hover:scale-110" : ""} transition-transform`}
        disabled={!onRatingChange}
      >
        <Star className={`w-6 h-6 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
      </button>
    ));

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "success": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      {/* Navbar placeholder */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "bookings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <Calendar className="inline-block w-5 h-5 mr-2" />
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "profile"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <Settings className="inline-block w-5 h-5 mr-2" />
                Profile Update
              </button>
              <button
                onClick={() => setActiveTab("comment")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "comment"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <MessageSquare className="inline-block w-5 h-5 mr-2" />
                My Comments
              </button>
              <button
                onClick={handleLogout}
                className="ml-auto py-4 px-1 border-b-2 font-medium text-sm text-red-600 hover:text-red-800 transition-colors border-transparent"
              >
                <LogOut className="inline-block w-5 h-5 mr-2" />
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
              <div className="text-sm text-gray-600">
                {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {bookings.map((booking, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Car Image */}
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={booking.car.imageUrls[0]}
                      alt="Rental Car"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop";
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Booking #{booking.bookingReference}
                        </h3>
                        <p className="text-lg text-gray-600">
                          Car: {booking.car.make} {booking.car.model} • Company: {booking.companyID}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ₹{booking.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {booking.totalDays} day{booking.totalDays !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>

                    {/* Pickup & Return Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Pickup</div>
                          <div className="text-sm text-gray-600">
                            {formatDate(booking.pickupDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-red-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Return</div>
                          <div className="text-sm text-gray-600">
                            {formatDate(booking.returnDate)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t pt-4 flex justify-between items-center">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Booked on {formatDate(booking.createdAt)}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                        {booking.status.toLowerCase() === "success" && !booking.hasReview && (
                          <button
                            onClick={() => handleAddReview(booking)}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Review</span>
                          </button>
                        )}
                        {booking.hasReview && (
                          <span className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>Reviewed</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "comment" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Comments & Reviews</h2>
              <div className="text-sm text-gray-600">
                {comments.length} review{comments.length !== 1 ? "s" : ""} written
              </div>
            </div>

            <div className="space-y-6 grid gap-6 md:grid-cols-1 lg:grid-cols-2">


              {comments.map((comment) => (
                comment.carDto ? (
                  <div key={comment.reviewId} className="bg-white ...">
                    {/* Use comment.carDto.make, comment.carDto.model, etc */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={comment.carDto.imageUrls[0]}  // use first image URL
                            alt={`${comment.carDto.make} ${comment.carDto.model}`}
                            className="w-20 h-16 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {comment.carDto.make} {comment.carDto.model} ({comment.carDto.year})
                              </h3>
                              {/* You can add bookingReference if available */}
                            </div>
                            <div className="flex items-center space-x-1">
                              {renderStars(comment.rating)}
                              <span className="ml-2 text-sm font-medium text-gray-700">
                                {comment.rating}/5
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {/* You can have a title if you store it */}
                          Review
                        </h4>
                        <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
                      </div>
                      {/* Add metadata, companyResponse, etc if you have */}
                    </div>
                  </div>
                ) : null
              ))}


            </div>
          </div>
        )}

        {activeTab === "profile" && profile && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
                {!isEditingProfile && (
                  <button
                    onClick={() => {
                      setEditProfile({
                        fullName: profile.fullName,
                        phoneNumber: profile.phoneNumber,
                        address: profile.address,
                        drivingLicenseNumber: profile.drivingLicenseNumber
                      });
                      setIsEditingProfile(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={editProfile.fullName}
                        onChange={(e) => setEditProfile({ ...editProfile, fullName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                        {profile.fullName}
                      </div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    {isEditingProfile ? (
                      <input
                        type="tel"
                        value={editProfile.phoneNumber}
                        onChange={(e) => setEditProfile({ ...editProfile, phoneNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                        {profile.phoneNumber}
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    {isEditingProfile ? (
                      <textarea
                        value={editProfile.address}
                        onChange={(e) => setEditProfile({ ...editProfile, address: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                        {profile.address}
                      </div>
                    )}
                  </div>

                  {/* Driving License */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Driving License</label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {profile.drivingLicenseNumber}
                    </div>
                  </div>

                  {/* Buttons */}
                  {isEditingProfile && (
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleProfileSave}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={handleProfileCancel}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Add Review</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-6">
              {/* Car Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedBooking.car.imageUrls[0]}
                    alt="Car"
                    className="w-16 h-12 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop";
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {selectedBooking.car.make} {selectedBooking.car.model} ({selectedBooking.car.year})
                    </h4>
                    <p className="text-sm text-gray-600">
                      Booking: #{selectedBooking.bookingReference}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Overall Rating *
                </label>
                <div className="flex items-center space-x-1">
                  {renderRatingStars(reviewForm.rating, (rating) =>
                    setReviewForm({ ...reviewForm, rating })
                  )}
                  <span className="ml-3 text-sm text-gray-600">
                    {reviewForm.rating > 0 ? `${reviewForm.rating}/5` : "Select rating"}
                  </span>
                </div>
              </div>

              {/* Review Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title *
                </label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  placeholder="e.g., Great car and excellent service"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Review Comment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your experience with this rental car and service..."
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 10 characters ({reviewForm.comment.length}/10)
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewForm.rating === 0 || reviewForm.comment.length < 10}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;