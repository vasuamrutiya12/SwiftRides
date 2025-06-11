// import { Edit, Trash2, Eye } from "lucide-react"

// export default function CarCard({ car }) {
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "available":
//         return "bg-green-100 text-green-800"
//       case "rented":
//         return "bg-blue-100 text-blue-800"
//       case "maintenance":
//         return "bg-yellow-100 text-yellow-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//       <img src={car.image || "/placeholder.svg"} alt={car.name} className="w-full h-48 object-cover" />

//       <div className="p-4">
//         <div className="flex items-center justify-between mb-2">
//           <h3 className="text-lg font-semibold text-gray-900">{car.name}</h3>
//           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(car.status)}`}>
//             {car.status}
//           </span>
//         </div>

//         <div className="space-y-2 mb-4">
//           <p className="text-sm text-gray-600">Model: {car.model}</p>
//           <p className="text-sm text-gray-600">Type: {car.type}</p>
//           <p className="text-lg font-bold text-red-600">${car.price}/day</p>
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
//           <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-3 rounded-md flex items-center justify-center space-x-1 transition-colors">
//             <Eye className="h-4 w-4" />
//             <span>View</span>
//           </button>
//           <button className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 py-2 px-3 rounded-md flex items-center justify-center space-x-1 transition-colors">
//             <Edit className="h-4 w-4" />
//             <span>Edit</span>
//           </button>
//           <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-md flex items-center justify-center space-x-1 transition-colors">
//             <Trash2 className="h-4 w-4" />
//             <span>Delete</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

import { useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";

export default function CarCard({ car, onUpdate, onDelete }) {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "rented":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img src={car.image || "/placeholder.svg"} alt={car.name} className="w-full h-48 object-cover" />

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{car.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(car.status)}`}>
            {car.status}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600">Make: {car.make}</p>
          <p className="text-sm text-gray-600">Model: {car.model}</p>
          <p className="text-sm text-gray-600">Type: {car.category}</p>
          <p className="text-lg font-bold text-red-600">${car.dailyRate}/day</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Features:</p>
          <div className="flex flex-wrap gap-1">
            {car.features.map((feature, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-3 rounded-md flex items-center justify-center space-x-1 transition-colors"
            onClick={() => setViewModalOpen(true)}
          >
            <Eye className="h-4 w-4" />
            <span>View</span>
          </button>
          <button
            className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 py-2 px-3 rounded-md flex items-center justify-center space-x-1 transition-colors"
            onClick={() => setEditModalOpen(true)}
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-md flex items-center justify-center space-x-1 transition-colors"
            onClick={() => onDelete(car.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {viewModalOpen && <ViewCarModal car={car} onClose={() => setViewModalOpen(false)} />}
      {editModalOpen && <EditCarModal car={car} onClose={() => setEditModalOpen(false)} onUpdate={onUpdate} />}
    </div>
  );
}

function ViewCarModal({ car, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{car.name}</h2>
        <p><strong>Model:</strong> {car.model}</p>
        <p><strong>Type:</strong> {car.type}</p>
        <p><strong>Status:</strong> {car.status}</p>
        <p><strong>Price:</strong> ${car.dailyRate}/day</p>
        <p><strong>Features:</strong> {car.features.join(", ")}</p>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Close</button>
        </div>
      </div>
    </div>
  );
}

function EditCarModal({ car, onClose, onUpdate }) {
  const [formData, setFormData] = useState(car);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Car</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Car Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Model"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Type"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Save Changes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 ml-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
