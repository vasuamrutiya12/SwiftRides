// import React, { useState } from 'react';
// import { Star, Calendar, Car, MessageSquareWarning, MessageSquareReply, X } from "lucide-react";
// import userImg from "../../../images/userImg.png"

// export default function ReviewCard({ review }) {
  
//   const [showReplyForm, setShowReplyForm] = useState(false);
//   const [showReportForm, setShowReportForm] = useState(false);
//   const [replyMessage, setReplyMessage] = useState('');
//   const [reportReason, setReportReason] = useState('');
//   const [reportDetails, setReportDetails] = useState('');

//   const token = localStorage.getItem('token');

//   const handleReplySubmit = async () => {
//     if (!replyMessage.trim()) {
//       alert('Please enter a reply message');
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:9090/api/reviews/${reviewData.id}/addReply`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ reply: replyMessage })
//       });

//       if (!response.ok) throw new Error('Failed to submit reply');

//       const data = await response.json();
//       console.log('Reply Success:', data);
//       setReplyMessage('');
//       setShowReplyForm(false);
//     } catch (err) {
//       alert('Error submitting reply: ' + err.message);
//     }
//   };

//   const handleReportSubmit = async () => {
//     if (!reportReason) {
//       alert('Please select a reason for reporting');
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:9090/api/reviews/${reviewData.id}/addReport`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           report: {
//             reason: reportReason,
//             additionalDetails: reportDetails
//           }
//         })
//       });

//       if (!response.ok) throw new Error('Failed to submit report');

//       const data = await response.json();
//       console.log('Report Success:', data);

//       // Reset form
//       setReportReason('');
//       setReportDetails('');
//       setShowReportForm(false);

//     } catch (err) {
//       alert('Error submitting report: ' + err.message);
//     }
//   };

//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }, (_, index) => (
//       <Star
//         key={index}
//         className={`h-4 w-4 ${index < rating ? 'text-red-500 fill-current' : 'text-gray-300'}`}
//       />
//     ));
//   };



//   const reviewData = review

//   return (
//     <>
//       <div className="bg-gradient-to-br from-white to-red-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-red-500 overflow-hidden">
//         <div className="p-6">
//           <div className="flex items-start space-x-4">
//             <div className="relative">
//               <img
//                 src={userImg}
//                 alt={reviewData.customerName}
//                 className="w-14 h-14 rounded-full object-cover ring-2 ring-red-200 shadow-md"
//               />
//               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
//                 <Star className="w-3 h-3 text-white fill-current" />
//               </div>
//             </div>

//             <div className="flex-1">
//               <div className="flex items-center justify-between mb-3">
//                 <div>
//                   <h3 className="font-bold text-gray-900 text-lg">{reviewData.customerName}</h3>
//                   <div className="flex items-center space-x-3 text-sm text-gray-600">
//                     <div className="flex items-center space-x-1">
//                       <Car className="h-4 w-4 text-red-500" />
//                       <span className="font-medium">{reviewData.carName}</span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <Calendar className="h-4 w-4 text-red-500" />
//                       <span>{reviewData.date}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-red-50 px-3 py-2 rounded-lg border border-red-200">
//                   <div className="flex items-center space-x-2">
//                     <div className="flex items-center space-x-1">
//                       {renderStars(reviewData.rating)}
//                     </div>
//                     <span className="text-sm font-bold text-red-700">{reviewData.rating}/5</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
//                 <p className="text-gray-700 leading-relaxed">{reviewData.comment}</p>
//               </div>

//               <div className="mt-4 flex space-x-4">
//                 <button
//                   onClick={() => setShowReplyForm(true)}
//                   className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//                 >
//                   <MessageSquareReply className="h-4 w-4" />
//                   <span className="text-sm font-medium">Reply</span>
//                 </button>

//                 <button
//                   onClick={() => setShowReportForm(true)}
//                   className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-red-300"
//                 >
//                   <MessageSquareWarning className="h-4 w-4" />
//                   <span className="text-sm font-medium">Report</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showReplyForm && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 relative transform animate-in zoom-in-95 duration-200">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
//                 <MessageSquareReply className="h-5 w-5 text-red-500" />
//                 <span>Reply to {reviewData.customerName}</span>
//               </h2>
//               <button
//                 onClick={() => {
//                   setShowReplyForm(false);
//                   setReplyMessage('');
//                 }}
//                 className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <textarea
//               className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4 bg-red-50/30 placeholder-gray-500"
//               rows="4"
//               placeholder="Write your thoughtful reply here..."
//               value={replyMessage}
//               onChange={(e) => setReplyMessage(e.target.value)}
//             ></textarea>

//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => {
//                   setShowReplyForm(false);
//                   setReplyMessage('');
//                 }}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleReplySubmit}
//                 className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
//               >
//                 Submit Reply
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showReportForm && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 relative transform animate-in zoom-in-95 duration-200">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
//                 <MessageSquareWarning className="h-5 w-5 text-red-500" />
//                 <span>Report Review</span>
//               </h2>
//               <button
//                 onClick={() => {
//                   setShowReportForm(false);
//                   setReportReason('');
//                   setReportDetails('');
//                 }}
//                 className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <select
//               className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4 bg-red-50/30"
//               value={reportReason}
//               onChange={(e) => setReportReason(e.target.value)}
//             >
//               <option value="">Select a reason for reporting</option>
//               <option value="fake-review">Fake Review</option>
//               <option value="inappropriate-language">Inappropriate Language</option>
//               <option value="spam">Spam</option>
//               <option value="harassment">Harassment</option>
//               <option value="misleading">Misleading Information</option>
//               <option value="other">Other</option>
//             </select>

//             <textarea
//               className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4 bg-red-50/30 placeholder-gray-500"
//               rows="3"
//               placeholder="Please provide additional details about your report..."
//               value={reportDetails}
//               onChange={(e) => setReportDetails(e.target.value)}
//             ></textarea>

//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => {
//                   setShowReportForm(false);
//                   setReportReason('');
//                   setReportDetails('');
//                 }}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleReportSubmit}
//                 className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
//               >
//                 Submit Report
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }







import React, { useState } from 'react';
import { Star, Calendar, Car, MessageSquareWarning, MessageSquareReply, X, CheckCircle, AlertTriangle } from "lucide-react";
import userImg from "../../../images/userImg.png"

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
      const response = await fetch(`http://localhost:9090/api/reviews/${reviewData.id}/addReply`, {
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
    console.log(reviewData);
    
    if (!reportReason) {
      alert('Please select a reason for reporting');
      return;
    }

    try {
      const response = await fetch(`http://localhost:9090/api/reviews/${reviewData.id}/addReport`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
        className={`h-4 w-4 ${index < rating ? 'text-red-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const reviewData = review;  
  const hasReply = reviewData.reply && reviewData.reply.trim() !== '';
  const hasReport = reviewData.reportReason && reviewData.reportReason.trim() !== '';
  const showButtons = !hasReply && !hasReport;

  return (
    <>
      <div className="bg-gradient-to-br from-white to-red-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-red-500 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img
                src={userImg}
                alt={reviewData.customerName || 'Customer'}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-red-200 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white fill-current" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{reviewData.customerName || 'Anonymous Customer'}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Car className="h-4 w-4 text-red-500" />
                      <span className="font-medium">Car: {reviewData.carName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-red-500" />
                      <span>{new Date(reviewData.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(reviewData.rating)}
                    </div>
                    <span className="text-sm font-bold text-red-700">{reviewData.rating}/5</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm mb-4">
                <p className="text-gray-700 leading-relaxed">{reviewData.comment}</p>
              </div>

              {/* Reply Message Display */}
              {hasReply && (
                <div className="mb-4 p-4 border-2 border-green-300 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Company Reply</h4>
                  </div>
                  <p className="text-green-700 leading-relaxed">{reviewData.reply}</p>
                </div>
              )}

              {/* Report Message Display */}
              {hasReport && (
                <div className="mb-4 p-4 border-2 border-red-400 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold text-red-800">Reported Content</h4>
                  </div>
                  <h4 className="text-red-700 leading-relaxed">Reason : {reviewData.reportReason}</h4>
                  <p className="text-red-700 leading-relaxed">Message : {reviewData.reportMessage}</p>
                </div>
              )}

              {/* Action Buttons - Only show if no reply or report exists */}
              {showButtons && (
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => setShowReplyForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <MessageSquareReply className="h-4 w-4" />
                    <span className="text-sm font-medium">Reply</span>
                  </button>

                  <button
                    onClick={() => setShowReportForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-red-300"
                  >
                    <MessageSquareWarning className="h-4 w-4" />
                    <span className="text-sm font-medium">Report</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 relative transform animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <MessageSquareReply className="h-5 w-5 text-red-500" />
                <span>Reply to Customer</span>
              </h2>
              <button
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyMessage('');
                }}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
              >
                <X size={20} />
              </button>
            </div>

            <textarea
              className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4 bg-red-50/30 placeholder-gray-500"
              rows="4"
              placeholder="Write your thoughtful reply here..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            ></textarea>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyMessage('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReplySubmit}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
              >
                Submit Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 relative transform animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <MessageSquareWarning className="h-5 w-5 text-red-500" />
                <span>Report Review</span>
              </h2>
              <button
                onClick={() => {
                  setShowReportForm(false);
                  setReportReason('');
                  setReportDetails('');
                }}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
              >
                <X size={20} />
              </button>
            </div>

            <select
              className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4 bg-red-50/30"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              <option value="">Select a reason for reporting</option>
              <option value="fake-review">Fake Review</option>
              <option value="inappropriate-language">Inappropriate Language</option>
              <option value="spam">Spam</option>
              <option value="harassment">Harassment</option>
              <option value="misleading">Misleading Information</option>
              <option value="other">Other</option>
            </select>

            <textarea
              className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4 bg-red-50/30 placeholder-gray-500"
              rows="3"
              placeholder="Please provide additional details about your report..."
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
            ></textarea>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowReportForm(false);
                  setReportReason('');
                  setReportDetails('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
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