import api from "./axios";

const galleryApi = {
  // Get all gallery images
  getAll: () => api.get("/gallery"),

  // Upload a new image
  upload: (formData) =>
    api.post("/gallery", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Delete an image
  delete: (id) => api.delete(`/gallery/${id}`),
};

export default galleryApi;
