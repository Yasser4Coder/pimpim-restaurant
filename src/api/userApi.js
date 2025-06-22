import api from "./axios"; // the axios instance

const userApi = {
  // Get all users
  getAll: async () => await api.get("/users"),

  // Add a new delivery guy
  add: (userData) => api.post("/users", userData),

  // Delete a user by ID
  delete: (userId) => api.delete(`/users/${userId}`),

  // Update a user by ID
  update: (userId, updatedData) => api.put(`/users/${userId}`, updatedData),

  // Change user status (activate/deactivate)
  changeStatus: (userId, status) =>
    api.patch(`/users/${userId}/status`, { status }),
};

export default userApi;
