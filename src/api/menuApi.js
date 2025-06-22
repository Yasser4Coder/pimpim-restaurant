import api from "./axios"; // import your axios instance

const menuApi = {
  // Get all menu items
  getAll: () => api.get("/menu"),

  // Get a single menu item by ID
  getById: (id) => api.get(`/menu/${id}`),

  // Add a new menu item with image (FormData)
  add: (formData) =>
    api.post("/menu", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Update a menu item by ID (with or without image)
  update: (id, formData) =>
    api.put(`/menu/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Delete a menu item by ID
  delete: (id) => api.delete(`/menu/${id}`),
};

export default menuApi;
