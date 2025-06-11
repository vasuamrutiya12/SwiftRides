import React, { useState } from 'react';
import { Edit3, Trash2, User, Phone, TriangleAlert, MessageSquareText, Send, X, AlertTriangle } from 'lucide-react';
const QueryCard = ({ query, onDelete }) => {
  const [answeropen, setAnswerOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleAnswer = () => {
    setAnswerOpen(true);
  };

  const handleDelete = () => {
    setDeleteConfirmOpen(true);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      console.log('Query ID:', query.queryId);
      setMessage('');
      setAnswerOpen(false);
    }
  };

  const handleCancelAnswer = () => {
    setMessage('');
    setAnswerOpen(false);
  };

  const confirmDelete = async () => {
    // If you have an API, call it here, e.g.:
    // await fetch(`/api/queries/${query.queryId}`, { method: 'DELETE' });

    // Call the parent handler to remove from UI
    if (onDelete) onDelete(query.queryId);
    setDeleteConfirmOpen(false);
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'answered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-black-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      {/* Responsive Card - adjusts width based on screen size */}

      <div className="w-full max-w-lg inset-0 mx-auto bg-opacity-60 backdrop-blur-sm bg-gradient-to-b from-white to-red-50 rounded-2xl shadow-xl overflow-hidden border border-red-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Header with gradient */}
        <div className="px-3 sm:px-4 bg-gradient-to-r from-red-400 to-red-500 py-3 sm:py-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white text-base sm:text-lg font-bold">Query #{query.queryId}</h3>
              </div>
              <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(query.status)}`}>
                {query.status.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {/* Customer Info */}
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{query.name}</p>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{query.email}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3">
              <TriangleAlert className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0" />
              <span className="text-gray-700 text-sm sm:text-base truncate">{query.category}</span>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquareText className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 text-sm sm:text-base break-words">{query.message}</span>
            </div> 
            {query.reply != null && ( 
              <>
                <h4 className='my-2 sm:my-3 text-lg sm:text-2xl font-bold text-amber-800'>Your Answer</h4>
                <div className="flex items-start gap-3">
                  <Send className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm sm:text-base break-words">{query.reply}</span>
                </div>  
              </>
            )}       
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="flex gap-2 sm:gap-3">
            {query.reply == null && (
              <button
                onClick={handleAnswer}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Answer</span>
                <span className="sm:hidden">Reply</span>
              </button>
            )}
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 border border-red-200 hover:border-red-300 text-sm sm:text-base"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Remove</span>
              <span className="sm:hidden">Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Answer Modal - Responsive */}
      {answeropen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className=" bg-gradient-to-b from-white to-red-50 rounded-2xl shadow-2xl w-full max-w-md mx-4 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCancelAnswer}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Answer Query</h3>
            </div>

            {/* Selected Query Display */}
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-100">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Query #{query.queryId}</p>
                <p className="text-sm font-medium text-gray-900 break-words">{query.name} - {query.email}</p>
                <p className="text-sm text-gray-700"><span className="font-medium">Category:</span> {query.category}</p>
                <p className="text-sm text-gray-700 break-words"><span className="font-medium">Message:</span> {query.message}</p>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 sm:p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Response
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your response here..."
                className="w-full h-24 sm:h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            {/* Action Buttons */}
            <div className="p-4 sm:p-6 pt-0 flex gap-3">
              <button
                onClick={handleCancelAnswer}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Responsive */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4">
            {/* Header */}
            <div className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Delete Query</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Are you sure you want to remove this query? This action cannot be undone.
              </p>
            </div>

            {/* Query Info */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600">Query #{query.queryId}</p>
                <p className="text-sm font-medium text-gray-900 break-words">{query.name}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QueryCard;