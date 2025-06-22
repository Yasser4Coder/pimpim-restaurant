import api from "./axios";

const orderApi = {
  // Get all orders
  getAll: () => api.get("/orders"),

  // Get order by ID
  getById: (id) => api.get(`/orders/${id}`),

  // Get order by order number for tracking
  getByOrderNumber: (orderNumber) => api.get(`/orders/track/${orderNumber}`),

  // Create a new order
  create: (orderData) => api.post("/orders", orderData),

  // Update order status
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),

  // Assign delivery guy to order
  assignDelivery: (id, deliveryGuyId) =>
    api.put(`/orders/${id}/assign-delivery`, { deliveryGuyId }),

  // Get orders by status
  getByStatus: (status) => api.get(`/orders/status/${status}`),

  // Get order statistics
  getStats: () => api.get("/orders/stats/overview"),
};

export default orderApi;
