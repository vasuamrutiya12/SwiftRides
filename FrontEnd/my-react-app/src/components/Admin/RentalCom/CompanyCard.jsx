import { useState, useEffect } from 'react';
import { MapPin, Phone, Star, Car, Users, Fuel, Calendar, Tag, Edit, Trash2, X, Save, CheckCircle, XCircle, Clock, FileText, Eye } from 'lucide-react';

const CompanyCard = ({ company, onEdit, onDelete, onCarVerification }) => {
  const [showCarsModal, setShowCarsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRCModal, setShowRCModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [editFormData, setEditFormData] = useState({
    companyName: '',
    address: '',
    city: '',
    phoneNumber: '',
    status: 'active'
  });
  const [originalData, setOriginalData] = useState({});

  // Initialize form data when modal opens
  useEffect(() => {
    if (showEditModal) {
      const initialData = {
        companyName: company.companyName,
        address: company.address,
        city: company.city,
        phoneNumber: company.phoneNumber,
        status: company.status
      };
      setEditFormData(initialData);
      setOriginalData(initialData);
    }
  }, [showEditModal, company]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getVerificationStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getVerificationIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowEditModal(true);
  };

  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    
    // Find only changed fields
    const changedData = {};
    Object.keys(editFormData).forEach(key => {
      if (editFormData[key] !== originalData[key]) {
        changedData[key] = editFormData[key];
      }
    });

    // Console log only changed data
    if (Object.keys(changedData).length > 0) {
      console.log('Changed company data:', {
        companyId: company.companyId,
        changes: changedData
      });
      
      // Send updated data to parent
      onEdit(company.companyId, { ...editFormData });
    } else {
      console.log('No changes made to company data');
    }

    setShowEditModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(company.companyId);
  };

  const handleViewRC = (car) => {
    setSelectedCar(car);
    setShowRCModal(true);
  };

  const handleVerification = async (carId, status, reason = '') => {
    const verificationData = {
      carId,
      verificationStatus: status,
      reason: reason || null,
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'current_admin@example.com' // This should come from your auth context
    };

    console.log('Sending verification data to backend:', verificationData);

    // Call the parent's verification handler
    if (onCarVerification) {
      await onCarVerification(verificationData);
    }

    // Close modal and reset
    setShowRCModal(false);
    setSelectedCar(null);
  };

  return (
    <>
      <div className="w-[450px] bg-gradient-to-b from-white to-red-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-red-100 overflow-hidden hover:transform hover:scale-105 backdrop-blur-sm">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-400  to-red-300 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg bg-opacity-10"></div>
          <div className="relative z-10 flex justify-between items-start">
            <h3 className="text-xl font-bold truncate  drop-shadow-sm">{company.companyName}</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getStatusColor(company.status)} shadow-sm`}>
                {company.status}
              </span>    
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 bg-gradient-to-b from-white to-red-50">
          {/* Address */}
          <div className="flex items-start space-x-3 group">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors">
              <MapPin className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">
              <p className="font-medium text-gray-800">{company.address}</p>
              <p className="text-red-600 font-medium">{company.city}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <Phone className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-sm text-gray-700 font-medium">{company.phoneNumber}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <Star className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-sm text-gray-700 font-medium">
              {company.rating ? `${company.rating}/5 Stars` : 'No rating yet'}
            </span>
          </div>

          {/* Cars Count */}
          <div className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <Car className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-sm text-gray-700 font-medium">
              {company.cars?.length || 0} cars available
            </span>
          </div>

          {/* Created Date */}
          <div className="text-xs text-gray-500 bg-red-50 px-3 py-2 rounded-lg font-medium border border-red-100">
            Member since: {formatDate(company.createdAt)}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={() => setShowCarsModal(true)}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <Car className="w-4 h-4" />
            <span>View Cars ({company.cars?.length || 0})</span>
          </button>
          
          {/* Quick Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleEdit}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cars Modal */}
      {showCarsModal && (
        <div className="fixed inset-0  bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[100vh] overflow-hidden shadow-2xl border border-red-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-red-400 via-red-400 to-red-700 px-4 py-3 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-red bg-opacity-10"></div>
              <div className="relative z-10 flex justify-between items-center">
                <h2 className="text-2xl font-bold drop-shadow-sm">Cars from {company.companyName}</h2>
                <button
                  onClick={() => setShowCarsModal(false)}
                  className="text-white hover:text-red-200 text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh] bg-gradient-to-b from-white to-red-50">
              {company.cars && company.cars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {company.cars.map((car) => (
                    <div key={car.carId} className="bg-white border border-red-100 rounded-xl p-5 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 relative overflow-hidden">
                      <div className="absolute -right-5 -top-5 w-10 h-10 bg-red-100 rounded-full opacity-50"></div>
                      
                      {/* Verification Status Badge */}
                      <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 border ${getVerificationStatusColor(car.verificationStatus)}`}>
                        {getVerificationIcon(car.verificationStatus)}
                        <span className="capitalize">{car.verificationStatus}</span>
                      </div>

                      {/* Car Image */}
                      {car.imageUrls && car.imageUrls.length > 0 && (
                        <div className="mb-4 mt-8">
                          <img
                            src={car.imageUrls[0]}
                            alt={`${car.make} ${car.model}`}
                            className="w-full h-40 object-cover rounded-xl bg-red-50 shadow-md"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-40 bg-gradient-to-br from-red-100 to-red-200 rounded-xl items-center justify-center hidden shadow-md">
                            <Car className="w-12 h-12 text-red-400" />
                          </div>
                        </div>
                      )}

                      {/* Car Details */}
                      <div className="space-y-3">
                        <h3 className="font-bold text-xl text-gray-800 leading-tight">
                          {car.make} {car.model}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                              <Calendar className="w-3 h-3 text-red-600" />
                            </div>
                            <span className="text-gray-700 font-medium">{car.year}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                              <Tag className="w-3 h-3 text-red-600" />
                            </div>
                            <span className="text-gray-700 font-medium">{car.category}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                              <Users className="w-3 h-3 text-red-600" />
                            </div>
                            <span className="text-gray-700 font-medium">{car.seatingCapacity} seats</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                              <Fuel className="w-3 h-3 text-red-600" />
                            </div>
                            <span className="text-gray-700 font-medium capitalize">{car.fuelType}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-red-100">
                          <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                            ₹{car.dailyRate}/day
                          </div>
                          {car.rating && (
                            <div className="flex items-center space-x-1 bg-red-50 px-2 py-1 rounded-full">
                              <Star className="w-4 h-4 text-red-500 fill-current" />
                              <span className="text-sm text-red-700 font-semibold">{car.rating}</span>
                            </div>
                          )}
                        </div>

                        {/* Features */}
                        {car.features && car.features.length > 0 && (
                          <div className="pt-3">
                            <div className="flex flex-wrap gap-2">
                              {car.features.map((feature, index) => (
                                <span
                                  key={index}
                                  className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* RC Book Actions */}
                        <div className="pt-4 border-t border-red-100">
                          <button
                            onClick={() => handleViewRC(car)}
                            className="w-full bg-red-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                          >
                            <FileText className="w-4 h-4" />
                            <span>View RC Book</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="w-10 h-10 text-red-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-600">No cars available for this company</p>
                  <p className="text-sm text-gray-500 mt-1">Please check back later</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RC Book Verification Modal */}
      {showRCModal && selectedCar && (
        <div className="fixed inset-0  bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-red-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-red-400 via-red-400 to-orange-700 px-6 py-4 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-red bg-opacity-10"></div>
              <div className="relative z-10 flex justify-between items-center">
                <h2 className="text-xl font-bold drop-shadow-sm flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>RC Book Verification - {selectedCar.make} {selectedCar.model}</span>
                </h2>
                <button
                  onClick={() => {
                    setShowRCModal(false);
                    setSelectedCar(null);
                  }}
                  className="text-white hover:text-blue-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh] bg-gradient-to-b from-white to-blue-50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* RC Book Image */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span>RC Book Document</span>
                  </h3>
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-lg">
                    <img
                      src={selectedCar.rcBookImageUrl}
                      alt="RC Book"
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='16' fill='%236b7280' text-anchor='middle'%3ERC Book Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  
                  {/* Document Info */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Submitted:</span>
                      <span className="text-sm text-gray-800">{formatDate(selectedCar.submittedAt)}</span>
                    </div>
                    {selectedCar.verifiedAt && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Verified:</span>
                        <span className="text-sm text-gray-800">{formatDate(selectedCar.verifiedAt)}</span>
                      </div>
                    )}
                    {selectedCar.verifiedBy && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Verified By:</span>
                        <span className="text-sm text-gray-800">{selectedCar.verifiedBy}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Car Details & Verification Actions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <Car className="w-5 h-5 text-blue-600" />
                    <span>Car Details</span>
                  </h3>
                  
                  {/* Car Info */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Car ID:</span>
                        <p className="text-gray-800">{selectedCar.carId}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Make & Model:</span>
                        <p className="text-gray-800">{selectedCar.make} {selectedCar.model}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Year:</span>
                        <p className="text-gray-800">{selectedCar.year}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Category:</span>
                        <p className="text-gray-800">{selectedCar.category}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Fuel Type:</span>
                        <p className="text-gray-800 capitalize">{selectedCar.fuelType}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Seats:</span>
                        <p className="text-gray-800">{selectedCar.seatingCapacity}</p>
                      </div>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-600">Current Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 border ${getVerificationStatusColor(selectedCar.verificationStatus)}`}>
                        {getVerificationIcon(selectedCar.verificationStatus)}
                        <span className="capitalize">{selectedCar.verificationStatus}</span>
                      </span>
                    </div>
                  </div>

                  {/* Verification Actions */}
                  {selectedCar.verificationStatus === 'pending' && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4 shadow-sm">
                      <h4 className="font-semibold text-gray-800">Admin Actions</h4>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleVerification(selectedCar.carId, 'approved')}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span>Approve</span>
                        </button>
                        
                        <button
                          onClick={() => handleVerification(selectedCar.carId, 'rejected', 'Document unclear or invalid')}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
                        >
                          <XCircle className="w-5 h-5" />
                          <span>Reject</span>
                        </button>
                      </div>
                      
                      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                        <p className="font-medium mb-1">Verification Guidelines:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Verify car details match RC book information</li>
                          <li>Check document clarity and authenticity</li>
                          <li>Ensure registration number is visible</li>
                          <li>Confirm owner details are legitimate</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Already Verified Info */}
                  {selectedCar.verificationStatus !== 'pending' && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-2">Verification Complete</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Status: <span className="font-medium capitalize">{selectedCar.verificationStatus}</span></p>
                        {selectedCar.verifiedAt && (
                          <p>Date: <span className="font-medium">{formatDate(selectedCar.verifiedAt)}</span></p>
                        )}
                        {selectedCar.verifiedBy && (
                          <p>By: <span className="font-medium">{selectedCar.verifiedBy}</span></p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-red-100 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-red-400 via-red-400 to-red-700 px-6 py-4 text-white relative overflow-hidden">
              <div className="absolute inset-0  bg-opacity-10"></div>
              <div className="relative z-10 flex justify-between items-center">
                <h2 className="text-xl font-bold drop-shadow-sm flex items-center space-x-2">
                  <Edit className="w-5 h-5" />
                  <span>Edit Company</span>
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-white hover:text-red-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleEditFormSubmit} className="p-6 space-y-6 bg-gradient-to-b from-white to-red-50">
              {/* Company Name */}
              <div className="space-y-2">
                <label className=" text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                    <Car className="w-3 h-3 text-red-600" />
                  </div>
                  <span>Company Name</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={editFormData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  placeholder="Enter company name"
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className=" text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-red-600" />
                  </div>
                  <span>Address</span>
                </label>
                <textarea
                  name="address"
                  value={editFormData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                  placeholder="Enter full address"
                  required
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className=" text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-red-600" />
                  </div>
                  <span>City</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={editFormData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  placeholder="Enter city name"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className=" text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                    <Phone className="w-3 h-3 text-red-600" />
                  </div>
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editFormData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className=" text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-red-600" />
                  </div>
                  <span>Status</span>
                </label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyCard;