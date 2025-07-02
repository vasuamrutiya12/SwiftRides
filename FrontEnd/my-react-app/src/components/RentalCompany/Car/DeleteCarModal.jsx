import { useState } from "react";

export default function DeleteCarModal({ car, onClose, onDelete }) {
  const [submitting, setSubmitting] = useState(false);
  const handleDelete = async () => {
    setSubmitting(true);
    await onDelete(car.carId || car.id);
    setSubmitting(false);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-red-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          Confirm <span className="text-red-600">Delete</span>
        </h2>
        <p className="mb-8 text-center text-gray-700">
          Are you sure you want to delete <span className="font-bold">{car.make} {car.model}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors font-semibold"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            disabled={submitting}
          >
            {submitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
} 