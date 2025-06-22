import api from "./axios";

const categoryApi = {
  // Get all categories
  getAll: () => api.get("/categorys"),

  // Get single category by ID
  getById: (id) => api.get(`/categorys/${id}`),

  // Add a new category
  add: (data) => api.post("/categorys", data),

  // Update a category
  update: (id, data) => api.put(`/categorys/${id}`, data),

  // Delete a category
  delete: (id) => api.delete(`/categorys/${id}`),
};

export default categoryApi;
