"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { uploadToCloudinary } from "../../utils/uploadToCloudinary"

export default function AddCarForm({ onClose }) {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    category: "",
    dailyRate: "",
    fuelType: "",
    seatingCapacity: "",
    features: "",
    imageUrls: [],
    rcBookImage: "", 
    status: "PENDING", 
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [rcBookUploading, setRcBookUploading] = useState(false)

  const handleChange = async (e) => {
    const { name, value, files } = e.target

    if (name === "imageUrls" && files?.length > 0) {
      try {
        setIsUploading(true)
        setUploadError("")
        const uploadedUrls = []

        for (const file of files) {
          if (!file.type.startsWith("image/")) {
            throw new Error("Please upload only image files")
          }

          const cloudUrl = await uploadToCloudinary(file, "image")
          if (cloudUrl) {
            uploadedUrls.push(cloudUrl)
          }
        }

        setFormData((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...uploadedUrls],
        }))
      } catch (error) {
        console.error("Error uploading images:", error)
        setUploadError(error.message || "Failed to upload images. Please try again.")
      } finally {
        setIsUploading(false)
      }
    } else if (name === "rcBookImage" && files?.length > 0) {
      // Handle RC book image upload
      try {
        setRcBookUploading(true)
        setUploadError("")
        const file = files[0]

        if (!file.type.startsWith("image/")) {
          throw new Error("Please upload only image files")
        }

        const cloudUrl = await uploadToCloudinary(file, "image")
        if (cloudUrl) {
          setFormData((prev) => ({
            ...prev,
            rcBookImage: cloudUrl,
          }))
        }
      } catch (error) {
        console.error("Error uploading RC book image:", error)
        setUploadError(error.message || "Failed to upload RC book image. Please try again.")
      } finally {
        setRcBookUploading(false)
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, index) => index !== indexToRemove),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.imageUrls.length === 0) {
      alert("Please upload at least one car image.")
      return
    }

    if (!formData.rcBookImage) {
      alert("Please upload RC book image.")
      return
    }

    const formattedData = {
      ...formData,
      year: Number.parseInt(formData.year),
      dailyRate: Number.parseFloat(formData.dailyRate),
      seatingCapacity: Number.parseInt(formData.seatingCapacity),
      features: formData.features.split(",").map((feature) => feature.trim()),
      rcbook: formData.rcBookImage,
    }
    delete formattedData.rcBookImage
    try {
      const token = localStorage.getItem("token")
      const email = localStorage.getItem("email")
      const resId = await fetch("http://localhost:8084/auth/user/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      })

      const id = await resId.json()

      const response = await fetch(`http://localhost:9090/api/rental-company/${id}/register-car`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      })

      if (!response.ok) {
        throw new Error("Failed to register car")
      }

      const result = await response.json()
      console.log("Car registered successfully:", result)
      alert("Car added successfully!")
      onClose()
    } catch (error) {
      console.error("Error registering car:", error)
      alert("Failed to add car. Please try again.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Car</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Category</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Convertible">Convertible</option>
                <option value="Truck">Truck</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per Day ($)</label>
              <input
                type="number"
                name="dailyRate"
                value={formData.dailyRate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
              <input
                type="text"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity</label>
              <input
                type="number"
                name="seatingCapacity"
                value={formData.seatingCapacity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="GPS, AC, Bluetooth, Leather Seats"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Car Images</label>
            <input
              type="file"
              name="imageUrls"
              onChange={handleChange}
              accept="image/*"
              multiple
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isUploading}
            />
            {isUploading && <p className="text-sm text-gray-600 mt-1">Uploading images...</p>}
            {uploadError && <p className="text-sm text-red-600 mt-1">{uploadError}</p>}
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Car ${index + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RC Book Image *</label>
            <input
              type="file"
              name="rcBookImage"
              onChange={handleChange}
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={rcBookUploading}
              required
            />
            {rcBookUploading && <p className="text-sm text-gray-600 mt-1">Uploading RC book image...</p>}
            {formData.rcBookImage && (
              <div className="mt-2">
                <div className="relative inline-block">
                  <img
                    src={formData.rcBookImage || "/placeholder.svg"}
                    alt="RC Book"
                    className="w-32 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, rcBookImage: "" }))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-green-600 mt-1">RC book image uploaded successfully</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              disabled
              readOnly
            />
            <p className="text-sm text-gray-500 mt-1">Status will be set to PENDING for admin approval</p>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Add Car
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
