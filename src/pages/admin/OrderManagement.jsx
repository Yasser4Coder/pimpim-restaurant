import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import {
  Clock,
  MapPin,
  Phone,
  User,
  Loader2,
  AlertTriangle,
  StickyNote,
} from "lucide-react";
import orderApi from "../../api/orderApi";
import userApi from "../../api/userApi";
import { toast } from "react-hot-toast";
import socket from "../../services/socket";
import * as XLSX from "xlsx";

const DeleteAllOrdersDialog = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  Delete All Orders
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete{" "}
                    <span className="font-bold">ALL orders</span>? This action
                    cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="w-full sm:w-auto sm:ml-3 bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete All Orders"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryGuys, setDeliveryGuys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [orderStats, setOrderStats] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [seenOrders, setSeenOrders] = useState(new Set());
  const [exporting, setExporting] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const statusOptions = [
    "All",
    "Pending",
    "Preparing",
    "Ready",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Preparing: "bg-blue-100 text-blue-800",
    Ready: "bg-green-100 text-green-800",
    "Out for Delivery": "bg-purple-100 text-purple-800",
    Delivered: "bg-gray-100 text-gray-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  // Load seen orders from localStorage on initial render
  useEffect(() => {
    try {
      const storedSeenOrders = localStorage.getItem("seenOrders");
      if (storedSeenOrders) {
        setSeenOrders(new Set(JSON.parse(storedSeenOrders)));
      }
    } catch (e) {
      console.error("Failed to parse seenOrders from localStorage", e);
      // If parsing fails, start with an empty set
      setSeenOrders(new Set());
    }
  }, []);

  // Fetch orders and delivery guys on component mount
  useEffect(() => {
    fetchOrders();
    fetchDeliveryGuys();
    fetchOrderStats();

    // -- WebSocket Listeners --
    const handleNewOrder = (newOrder) => {
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      fetchOrderStats(); // Refresh stats when a new order arrives
      toast.success(`New Order Received: #${newOrder.orderNumber}`);
    };

    const handleOrderUpdated = (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
      fetchOrderStats(); // Refresh stats when an order is updated
      fetchDeliveryGuys(); // Real-time update for delivery guy availability
    };

    socket.on("newOrder", handleNewOrder);
    socket.on("orderUpdated", handleOrderUpdated);

    // Cleanup on component unmount
    return () => {
      socket.off("newOrder", handleNewOrder);
      socket.off("orderUpdated", handleOrderUpdated);
      // socket.disconnect(); // Do not disconnect socket on unmount
    };
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      // Save scroll position
      const scrollY = window.scrollY;
      setLoading(true);
      setError(null);
      const response = await orderApi.getAll();
      setOrders(response.data);
      // Restore scroll position after DOM updates
      setTimeout(() => {
        window.scrollTo(0, scrollY);
      }, 0);
    } catch (err) {
      setError("Failed to load orders. Please try again.");
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDeliveryGuys = async () => {
    try {
      const response = await userApi.getAll();
      // Filter only delivery guys (role 1001)
      const deliveryPersonnel = response.data.filter(
        (user) => user.role === 1001 && user.status === "active"
      );
      setDeliveryGuys(deliveryPersonnel);
    } catch (err) {
      toast.error("Failed to load delivery personnel");
    }
  };

  const fetchOrderStats = async () => {
    try {
      const response = await orderApi.getStats();
      setOrderStats(response.data);
    } catch (err) {
      toast.error("Failed to load order statistics");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // The backend will emit an "orderUpdated" event
      await orderApi.updateStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  const assignDeliveryGuy = async (orderId, deliveryGuyId) => {
    try {
      // The backend will emit an "orderUpdated" event
      await orderApi.assignDelivery(orderId, deliveryGuyId);
      toast.success("Delivery guy assigned successfully");
    } catch (err) {
      toast.error("Failed to assign delivery guy");
    }
  };

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  // Apply search filter
  const searchedOrders = filteredOrders.filter((order) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    const orderNumber = (order.orderNumber || "").toLowerCase();
    const phone = (order.customer?.phone || "").toLowerCase();
    return orderNumber.includes(query) || phone.includes(query);
  });

  const getNextStatus = (currentStatus) => {
    const statusFlow = [
      "Pending",
      "Preparing",
      "Ready",
      "Out for Delivery",
      "Delivered",
    ];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1
      ? statusFlow[currentIndex + 1]
      : null;
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString("ar-DZ")} DZD`;
  };

  const formatOrderTime = (orderTime) => {
    return new Date(orderTime).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleOrderClick = (orderId) => {
    // Only update if the order is not already marked as seen
    if (!seenOrders.has(orderId)) {
      const newSeenOrders = new Set(seenOrders).add(orderId);
      setSeenOrders(newSeenOrders);
      localStorage.setItem(
        "seenOrders",
        JSON.stringify(Array.from(newSeenOrders))
      );
    }
  };

  function isValidObjectId(id) {
    return /^[a-fA-F0-9]{24}$/.test(id);
  }

  const exportToExcel = () => {
    setExporting(true);
    try {
      // Prepare data for Excel
      const data = orders.map((order) => ({
        OrderNumber: order.orderNumber,
        Customer: order.customer?.name,
        Phone: order.customer?.phone,
        Address: order.customer?.address,
        Status: order.status,
        Total: order.total,
        Items: order.items
          .map((item) => `${item.quantity}x ${item.name}`)
          .join(", "),
        DeliveryGuy: order.deliveryGuy?.fullName || "",
        OrderTime: order.orderTime
          ? new Date(order.orderTime).toLocaleString()
          : "",
        Notes: order.notes || "",
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Orders");
      XLSX.writeFile(
        wb,
        `orders_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    } catch (err) {
      toast.error("Failed to export orders");
    } finally {
      setExporting(false);
    }
  };

  const deleteAllOrders = async () => {
    setDeletingAll(true);
    try {
      await orderApi.deleteAll();
      toast.success("All orders deleted successfully");
      fetchOrders();
      fetchOrderStats();
      setShowDeleteDialog(false);
    } catch (err) {
      toast.error("Failed to delete all orders");
    } finally {
      setDeletingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <p>{error}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 text-red-600 hover:text-red-700"
            onClick={fetchOrders}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Attention Alert for Storage Issues */}
      <div className="flex items-center p-4 mb-2 rounded-lg bg-yellow-50 border border-yellow-200">
        <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0" />
        <div className="text-yellow-900 text-sm">
          <span className="font-semibold">Attention:</span> For storage reasons,
          if your orders reach <span className="font-bold">100 - 300</span>, you
          should delete all orders to avoid issues. You can export them first to
          save a backup.
        </div>
      </div>
      <DeleteAllOrdersDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={deleteAllOrders}
        isDeleting={deletingAll}
      />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={exportToExcel}
            disabled={exporting || orders.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {exporting ? "Exporting..." : "Export Orders to Excel"}
          </Button>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            disabled={deletingAll || orders.length === 0}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete All Orders
          </Button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order number or phone..."
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            style={{ minWidth: 220 }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {statusOptions.slice(1).map((status) => {
          const count = orderStats[status] || 0;
          return (
            <Card key={status}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{status}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {searchedOrders.map((order) => {
          const isNew = order.status === "Pending" && !seenOrders.has(order.id);
          return (
            <Card
              key={order.id}
              onClick={() => handleOrderClick(order.id)}
              className={`cursor-pointer hover:shadow-lg transition-shadow duration-300 ${
                isNew ? "border-orange-500 border-2" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        {order.orderNumber}
                        {isNew && (
                          <Badge
                            variant="destructive"
                            className="ml-2 animate-pulse"
                          >
                            New
                          </Badge>
                        )}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatOrderTime(order.orderTime)}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {order.customer.name}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {order.customer.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                    <span className="text-lg font-bold">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Delivery Instructions (Notes) */}
                {order.notes && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-start">
                      <StickyNote className="h-5 w-5 mr-2 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">
                          Delivery Instructions:
                        </h4>
                        <p className="text-sm text-yellow-700">{order.notes}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-2">Order Items:</h4>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span>{formatPrice(item.quantity * item.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Delivery Address:</h4>
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>{order.customer.address}</span>
                    </div>
                    {order.deliveryGuy && (
                      <div className="mt-2">
                        <span className="text-sm font-medium">
                          Delivery Guy:{" "}
                        </span>
                        <span className="text-sm text-gray-600">
                          {order.deliveryGuy.fullName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {getNextStatus(order.status) && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click event
                        updateOrderStatus(
                          order.id,
                          getNextStatus(order.status)
                        );
                      }}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Mark as {getNextStatus(order.status)}
                    </Button>
                  )}

                  {order.status === "Ready" && !order.deliveryGuy && (
                    <div className="flex items-center space-x-2">
                      <select
                        onClick={(e) => e.stopPropagation()} // Prevent card click event
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent card click event
                          if (e.target.value) {
                            if (isValidObjectId(e.target.value)) {
                              assignDeliveryGuy(order.id, e.target.value);
                            } else {
                              alert("Invalid delivery guy ID selected!");
                            }
                          }
                        }}
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Assign Delivery Guy</option>
                        {(() => {
                          const availableGuys = deliveryGuys.filter(
                            (guy) => guy.status === "active"
                          );
                          if (availableGuys.length === 0) {
                            return (
                              <option value="" disabled>
                                No delivery guys available
                              </option>
                            );
                          }
                          return availableGuys.map((guy) => {
                            const id = guy.id || guy._id;
                            return (
                              <option key={id} value={id}>
                                {guy.fullName}
                              </option>
                            );
                          });
                        })()}
                      </select>
                    </div>
                  )}

                  {order.status !== "Cancelled" &&
                    order.status !== "Delivered" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click event
                          updateOrderStatus(order.id, "Cancelled");
                        }}
                        className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                      >
                        Cancel Order
                      </Button>
                    )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Clock className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              {filterStatus === "All"
                ? "No orders have been placed yet."
                : `No orders with status "${filterStatus}" found.`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderManagement;
