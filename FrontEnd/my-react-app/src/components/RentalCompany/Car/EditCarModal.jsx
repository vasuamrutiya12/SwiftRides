"use client"

import { useState, useRef } from "react"
import { X, Upload } from "lucide-react"
import { uploadToCloudinary } from "../../utils/uploadToCloudinary"

export default function EditCarModal({ car, onClose, onUpdate }) {
  const [formData, setFormData] = useState(car)
  const [submitting, setSubmitting] = useState(false)
  const [newImages, setNewImages] = useState([])
  const [imagesToRemove, setImagesToRemove] = useState([])
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve({
            file,
            preview: e.target.result,
            id: Date.now() + Math.random(),
          })
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(imagePromises).then((images) => {
      setNewImages((prev) => [...prev, ...images])
    })
  }

  const removeExistingImage = (imageUrl, index) => {
    setImagesToRemove((prev) => [...prev, { url: imageUrl, index }])
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }))
  }

  const removeNewImage = (imageId) => {
    setNewImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // 1. Upload new images and get URLs
    let uploadedUrls = []
    if (newImages.length > 0) {
      uploadedUrls = await Promise.all(
        newImages.map(async (img) => {
          const url = await uploadToCloudinary(img.file, "image")
          return url
        })
      )
    }

    // 2. Remove images marked for removal from the current imageUrls
    let updatedImageUrls = formData.imageUrls || []
    imagesToRemove.forEach(({ url }) => {
      updatedImageUrls = updatedImageUrls.filter((imgUrl) => imgUrl !== url)
    })

    // 3. Merge new uploaded URLs
    updatedImageUrls = [...updatedImageUrls, ...uploadedUrls.filter(Boolean)]

    // 4. Prepare the updated data
    const updatedData = {
      ...formData,
      carId: car.carId || car.id,
      imageUrls: updatedImageUrls,
    }

    await onUpdate(updatedData)
    setSubmitting(false)
    onClose()
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-red-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={submitting}
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Edit <span className="text-red-600">Car</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Make</label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                placeholder="Car Make"
                className="w-full p-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Model"
                className="w-full p-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full p-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Daily Rate ($)</label>
              <input
                type="number"
                name="dailyRate"
                value={formData.dailyRate}
                onChange={handleChange}
                placeholder="Daily Rate"
                className="w-full p-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Fuel Type</label>
              <input
                type="text"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                placeholder="Fuel Type"
                className="w-full p-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Seating</label>
              <input
                type="number"
                name="seatingCapacity"
                value={formData.seatingCapacity}
                onChange={handleChange}
                placeholder="Seats"
                className="w-full p-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="Year"
                className="w-full p-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Features (comma separated)</label>
            <input
              type="text"
              name="features"
              value={Array.isArray(formData.features) ? formData.features.join(", ") : formData.features}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, features: e.target.value.split(",").map((f) => f.trim()) }))
              }
              placeholder="GPS, AC, Bluetooth, Leather Seats"
              className="w-full p-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Image Management Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-gray-700">Car Images</label>
              <button
                type="button"
                onClick={triggerFileInput}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <Upload className="w-4 h-4" />
                Add Images
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Existing Images */}
            {formData.imageUrls && formData.imageUrls.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Current Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Car ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-red-200 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(url, index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Preview */}
            {newImages.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-3">New Images to Upload</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {newImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.preview || "/placeholder.svg"}
                        alt="New upload"
                        className="w-full h-24 object-cover rounded-lg border-2 border-green-200 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(image.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">New</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Area */}
            {(!formData.imageUrls || formData.imageUrls.length === 0) && newImages.length === 0 && (
              <div
                onClick={triggerFileInput}
                className="border-2 border-dashed border-red-300 rounded-xl p-8 text-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors"
              >
                <Upload className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Click to upload car images</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors font-semibold"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
