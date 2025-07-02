/* eslint-disable no-unused-vars */

// import { useState } from "react";
// import { Edit, Trash2, Eye } from "lucide-react";

// export default function CarCard({ car, onUpdate, onDelete }) {
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "available":
//         return "bg-green-100 text-green-800";
//       case "rented":
//         return "bg-blue-100 text-blue-800";
//       case "maintenance":
//         return "bg-yellow-100 text-yellow-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//       <img src={car.imageUrls && car.imageUrls.length > 0 ? car.imageUrls[0] : "/placeholder.svg"} alt={`${car.make} ${car.model}`} className="w-full h-48 object-cover" />

//       <div className="p-4">
//         <div className="flex items-center justify-between mb-2">
//           <h3 className="text-lg font-semibold text-gray-900">{car.make} {car.model}</h3>
//           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(car.status)}`}>
//             {car.status}
//           </span>
//         </div>

//         <div className="space-y-2 mb-4">
//           <p className="text-sm text-gray-600">Make: {car.make}</p>
//           <p className="text-sm text-gray-600">Model: {car.model}</p>
//           <p className="text-sm text-gray-600">Type: {car.category}</p>
//           <p className="text-lg font-bold text-red-600">${car.dailyRate}/day</p>
//         </div>

//         <div className="mb-4">
//           <p className="text-sm text-gray-600 mb-1">Features:</p>
//           <div className="flex flex-wrap gap-1">
//             {car.features.map((feature, index) => (
//               <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
//                 {feature}
//               </span>
//             ))}
//           </div>
//         </div>

//         <div className="flex space-x-2">
//           <button
//             className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-3 rounded-md flex items-center justify-center space-x-1 transition-colors"
//             onClick={() => setViewModalOpen(true)}
//           >
//             <Eye className="h-4 w-4" />
//             <span>View</span>
//           </button>
//           <button
//             className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 py-2 px-3 rounded-md flex items-center justify-center space-x-1 transition-colors"
//             onClick={() => setEditModalOpen(true)}
//           >
//             <Edit className="h-4 w-4" />
//             <span>Edit</span>
//           </button>
//           <button
//             className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-md flex items-center justify-center space-x-1 transition-colors"
//             onClick={() => onDelete(car.id)}
//           >
//             <Trash2 className="h-4 w-4" />
//             <span>Delete</span>
//           </button>
//         </div>
//       </div>

//       {viewModalOpen && <ViewCarModal car={car} onClose={() => setViewModalOpen(false)} />}
//       {editModalOpen && <EditCarModal car={car} onClose={() => setEditModalOpen(false)} onUpdate={onUpdate} />}
//     </div>
//   );
// }

// function ViewCarModal({ car, onClose }) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4">{car.make} {car.model}</h2>
//         <p><strong>Model:</strong> {car.model}</p>
//         <p><strong>Type:</strong> {car.category}</p>
//         <p><strong>Status:</strong> {car.status}</p>
//         <p><strong>Price:</strong> ${car.dailyRate}/day</p>
//         <p><strong>Fuel Type:</strong> {car.fuelType}</p>
//         <p><strong>Seating Capacity:</strong> {car.seatingCapacity}</p>
//         <p><strong>Year:</strong> {car.year}</p>
//         {car.imageUrls && car.imageUrls.length > 0 && (
//           <div className="mt-4">
//             <strong>Images:</strong>
//             <div className="flex flex-wrap gap-2 mt-2">
//               {car.imageUrls.map((url, index) => (
//                 <img key={index} src={url} alt={`Car ${index + 1}`} className="w-24 h-24 object-cover rounded" />
//               ))}
//             </div>
//           </div>
//         )}
//         <p><strong>Features:</strong> {car.features.join(", ")}</p>
//         <div className="mt-4 flex justify-end">
//           <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Close</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function EditCarModal({ car, onClose, onUpdate }) {
//   const [formData, setFormData] = useState(car);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onUpdate(formData);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4">Edit Car</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <label className="block text-sm font-medium text-gray-700">Make</label>
//           <input
//             type="text"
//             name="make"
//             value={formData.make}
//             onChange={handleChange}
//             placeholder="Car Make"
//             className="w-full p-2 border rounded"
//           />
//           <label className="block text-sm font-medium text-gray-700">Model</label>
//           <input
//             type="text"
//             name="model"
//             value={formData.model}
//             onChange={handleChange}
//             placeholder="Model"
//             className="w-full p-2 border rounded"
//           />
//           <label className="block text-sm font-medium text-gray-700">Category</label>
//           <input
//             type="text"
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             placeholder="Category"
//             className="w-full p-2 border rounded"
//           />
//           <label className="block text-sm font-medium text-gray-700">Daily Rate ($)</label>
//           <input
//             type="number"
//             name="dailyRate"
//             value={formData.dailyRate}
//             onChange={handleChange}
//             placeholder="Daily Rate"
//             className="w-full p-2 border rounded"
//           />
//           <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
//           <input
//             type="text"
//             name="fuelType"
//             value={formData.fuelType}
//             onChange={handleChange}
//             placeholder="Fuel Type"
//             className="w-full p-2 border rounded"
//           />
//           <label className="block text-sm font-medium text-gray-700">Seating Capacity</label>
//           <input
//             type="number"
//             name="seatingCapacity"
//             value={formData.seatingCapacity}
//             onChange={handleChange}
//             placeholder="Seating Capacity"
//             className="w-full p-2 border rounded"
//           />
//           <label className="block text-sm font-medium text-gray-700">Year</label>
//           <input
//             type="number"
//             name="year"
//             value={formData.year}
//             onChange={handleChange}
//             placeholder="Year"
//             className="w-full p-2 border rounded"
//           />
//           <label className="block text-sm font-medium text-gray-700">Features (comma separated)</label>
//           <input
//             type="text"
//             name="features"
//             value={Array.isArray(formData.features) ? formData.features.join(', ') : formData.features}
//             onChange={(e) => setFormData((prev) => ({ ...prev, features: e.target.value.split(',').map(f => f.trim()) }))}
//             placeholder="GPS, AC, Bluetooth"
//             className="w-full p-2 border rounded"
//           />
//           {/* Image URLs are read-only in edit modal, managed via AddCarForm */}
//           {formData.imageUrls && formData.imageUrls.length > 0 && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Current Images</label>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {formData.imageUrls.map((url, index) => (
//                   <img key={index} src={url} alt={`Car ${index + 1}`} className="w-20 h-20 object-cover rounded border" />
//                 ))}
//               </div>
//             </div>
//           )}
//           <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//             Save Changes
//           </button>
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 ml-2"
//           >
//             Cancel
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { Edit, Trash2, Eye, Star, Calendar, Users, Fuel } from "lucide-react";

export default function CarCard({ car, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg";
      case "rented":
        return "bg-gradient-to-r from-red-800 to-red-900 text-white shadow-lg";
      case "maintenance":
        return "bg-gradient-to-r from-red-300 to-red-400 text-red-900 shadow-lg";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg";
    }
  };

  return (
    <div className="group bg-gradient-to-br from-white via-red-50 to-red-100 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-red-200">
      <div className="relative overflow-hidden">
        <img
          src={car.imageUrls && car.imageUrls.length > 0 ? car.imageUrls[0] : "/placeholder.svg"}
          alt={`${car.make} ${car.model}`}
          className="w-full h-56 object-contain bg-white p-2 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4">
          <span className={`px-4 py-2 rounded-full text-sm font-bold tracking-wide ${getStatusColor(car.status)} transform rotate-3 shadow-lg`}>
            {car.status.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-red-700 transition-colors">
            {car.make} <span className="text-red-600">{car.model}</span>
          </h3>
          <p className="text-sm text-gray-600 uppercase tracking-wide font-medium">{car.category}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <Calendar className="h-5 w-5 text-red-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Year</p>
            <p className="font-bold text-red-700">{car.year}</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <Users className="h-5 w-5 text-red-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Seats</p>
            <p className="font-bold text-red-700">{car.seatingCapacity}</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <Fuel className="h-5 w-5 text-red-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Fuel</p>
            <p className="font-bold text-red-700 text-xs">{car.fuelType}</p>
          </div>
        </div>
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">Premium Features:</p>
          <div className="flex flex-wrap gap-2">
            {car.features.slice(0, 4).map((feature, index) => (
              <span key={index} className="px-3 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-800 text-xs rounded-full font-medium border border-red-300 shadow-sm">
                {feature}
              </span>
            ))}
            {car.features.length > 4 && (
              <span className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs rounded-full font-medium shadow-sm">
                +{car.features.length - 4} more
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="text-right">
            <p className="text-sm text-gray-600">Starting from</p>
            <p className="text-3xl font-bold text-red-600">
              ${car.dailyRate}
              <span className="text-lg text-gray-500 font-normal">/day</span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white py-3 px-3 rounded-xl flex items-center justify-center space-x-1 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            onClick={() => onEdit(car)}
          >
            <Edit className="h-4 w-4" />
            <span className="text-sm font-semibold">Edit</span>
          </button>
          <button
            className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white py-3 px-3 rounded-xl flex items-center justify-center space-x-1 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            onClick={() => onDelete(car)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-sm font-semibold">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

