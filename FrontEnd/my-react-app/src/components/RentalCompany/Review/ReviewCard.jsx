import React, { useState } from 'react';
import { Star, Calendar, Car, MessageSquareWarning, MessageSquareReply, X } from "lucide-react";

export default function ReviewCard({ review }) {
  
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');


  const token = localStorage.getItem('token');

  const handleReplySubmit = async () => {
    if (!replyMessage.trim()) {
      alert('Please enter a reply message');
      return;
    }

    try {
      const response = await fetch(`http://localhost:9090/api/reviews/${review.id}/addReply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reply: replyMessage })
      });

      if (!response.ok) throw new Error('Failed to submit reply');

      const data = await response.json();
      console.log('Reply Success:', data);
      setReplyMessage('');
      setShowReplyForm(false);
    } catch (err) {
      alert('Error submitting reply: ' + err.message);
    }
  };

  const handleReportSubmit = async () => {
    if (!reportReason) {
      alert('Please select a reason for reporting');
      return;
    }

    try {
      const response = await fetch(`http://localhost:9090/api/reviews/${review.id}/addReport`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Ensure `token` is defined in your component
        },
        body: JSON.stringify({
          report: {
            reason: reportReason,
            additionalDetails: reportDetails
          }
        })
      });

      if (!response.ok) throw new Error('Failed to submit report');

      const data = await response.json();
      console.log('Report Success:', data);

      // Reset form
      setReportReason('');
      setReportDetails('');
      setShowReportForm(false);

    } catch (err) {
      alert('Error submitting report: ' + err.message);
    }
  };


  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start space-x-4">
          <img
            src={review.customerAvatar || '/placeholder.svg'}
            alt={review.customerName}
            className="w-12 h-12 rounded-full object-cover"
          />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{review.customerName}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Car className="h-3 w-3" />
                  <span>{review.carName}</span>
                  <Calendar className="h-3 w-3 ml-2" />
                  <span>{review.date}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {renderStars(review.rating)}
                <span className="ml-1 text-sm font-medium text-gray-600">{review.rating}/5</span>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">{review.comment}</p>

            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => setShowReplyForm(true)}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
              >
                <MessageSquareReply className="h-4 w-4" />
                <span className="text-sm">Reply</span>
              </button>

              <button
                onClick={() => setShowReportForm(true)}
                className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors cursor-pointer"
              >
                <MessageSquareWarning className="h-4 w-4" />
                <span className="text-sm">Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Reply to {review.customerName}'s Review</h2>
              <button
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyMessage('');
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              rows="4"
              placeholder="Write your reply here..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            ></textarea>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyMessage('');
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReplySubmit}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Report {review.customerName}'s Review</h2>
              <button
                onClick={() => {
                  setShowReportForm(false);
                  setReportReason('');
                  setReportDetails('');
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              <option value="">Select a reason</option>
              <option value="fake-review">Fake Review</option>
              <option value="inappropriate-language">Inappropriate Language</option>
              <option value="spam">Spam</option>
              <option value="harassment">Harassment</option>
              <option value="misleading">Misleading Information</option>
              <option value="other">Other</option>
            </select>

            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
              rows="3"
              placeholder="Provide additional details about your report..."
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
            ></textarea>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowReportForm(false);
                  setReportReason('');
                  setReportDetails('');
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
