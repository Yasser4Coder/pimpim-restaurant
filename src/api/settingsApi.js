import api from "./axios"; // the axios instance

const settingsApi = {
  // Get restaurant settings
  get: async () => await api.get("/settings"),

  // Update all restaurant settings
  update: (settingsData) => api.put("/settings", settingsData),

  // Upload restaurant logo
  uploadLogo: (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    return api.post("/settings/logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Upload cover image
  uploadCoverImage: (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    return api.post("/settings/cover-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Upload owner photo
  uploadOwnerPhoto: (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    return api.post("/settings/owner-photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Upload hero section image
  uploadHeroImage: (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    return api.post("/settings/hero-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Remove hero section image
  removeHeroImage: (index) => api.delete(`/settings/hero-image/${index}`),

  // Update hero section content
  updateHeroContent: (content) => api.patch("/settings/hero-content", content),

  // Update Instagram gallery selection
  updateInstagramGallery: (galleryData) =>
    api.patch("/settings/instagram-gallery", galleryData),

  // Get gallery images for selection
  getGalleryImages: async () => await api.get("/settings/gallery-images"),

  // Update restaurant status (open/closed)
  updateStatus: (isOpen) => api.patch("/settings/status", { isOpen }),

  // Update operating hours
  updateHours: (hours) => api.patch("/settings/hours", { hours }),

  // Update contact information
  updateContact: (contact) => api.patch("/settings/contact", { contact }),

  // Update owner information
  updateOwner: (owner) => api.patch("/settings/owner", { owner }),

  // Reset settings to default
  reset: async () => await api.delete("/settings"),

  // Update hero section images from gallery
  updateHeroImages: (galleryData) =>
    api.patch("/settings/hero-images", galleryData),
};

export default settingsApi;
