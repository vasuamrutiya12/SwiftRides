const CLOUD_NAME = "dt14sja2f";
const UPLOAD_PRESET = "Luffy12";

/**
 * Uploads a file to Cloudinary (image or video).
 * @param {File} file - The file to upload.
 * @param {string} fileType - Either "image" or "video".
 * @returns {Promise<string|null>} The secure URL of the uploaded file or null on failure.
 */
export const uploadToCloudinary = async (file, fileType) => {
  if (!file || (fileType !== "image" && fileType !== "video")) {
    console.error("Invalid file or fileType");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${fileType}/upload`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.secure_url) {
      console.error("Cloudinary upload failed:", result.error || result);
      return null;
    }

    return result.secure_url;
  } catch (error) {
    console.error("Upload to Cloudinary failed:", error);
    return null;
  }
};
