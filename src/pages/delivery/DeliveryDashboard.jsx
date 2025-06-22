import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import socket from "../../services/socket";
import { useNavigate } from "react-router-dom";
import logo from "../../images/306930671_3283853568599185_1930342004374579919_n-removebg-preview.png";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState("");
  const [deliveryGuyId, setDeliveryGuyId] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const navigate = useNavigate();

  // Fetch delivery guy info on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/users/me");
        setFullName(res.data.fullName);
        setDeliveryGuyId(res.data.id);
      } catch (err) {
        setFullName("");
        setDeliveryGuyId("");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!deliveryGuyId) return;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Fetch only orders assigned to this delivery guy
        const res = await axios.get("/orders/my-orders");
        setOrders(res.data);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    // Real-time updates
    const handleOrderUpdate = (order) => {
      // Only update if the order is assigned to this delivery guy
      if (order.deliveryGuy && order.deliveryGuy.id === deliveryGuyId) {
        setOrders((prev) => {
          const exists = prev.some((o) => o.id === order.id);
          if (exists) {
            return prev.map((o) => (o.id === order.id ? order : o));
          } else {
            return [order, ...prev];
          }
        });
      }
    };
    socket.on("orderUpdated", handleOrderUpdate);
    socket.on("newOrder", handleOrderUpdate);

    return () => {
      socket.off("orderUpdated", handleOrderUpdate);
      socket.off("newOrder", handleOrderUpdate);
    };
  }, [deliveryGuyId]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await axios.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Calculate delivered orders and total
  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  );
  const deliveredCount = deliveredOrders.length;
  const deliveredTotal = deliveredOrders.reduce(
    (sum, order) => sum + (order.total || 0),
    0
  );
  // Update profit to 200 DA per delivery
  const deliveredProfit = deliveredCount * 200;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="loader"></div>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-red-500">
        {error}
      </div>
    );

  return (
    <div
      className="min-h-screen flex flex-col items-center px-2 py-4 sm:py-8"
      style={{
        background: "linear-gradient(135deg, #ffb347 0%, #ffcc33 100%)",
        backgroundRepeat: "repeat",
        position: "relative",
        minHeight: "100vh",
      }}
    >
      {/* Optional: subtle pattern overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: 0.08,
          backgroundImage:
            "repeating-linear-gradient(135deg, #fff2 0 2px, transparent 2px 40px)",
        }}
      />
      {/* Sticky header */}
      <div
        className="w-full max-w-lg flex flex-col items-center gap-2 mb-4"
        style={{ zIndex: 2 }}
      >
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 rounded-full shadow"
          />
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              Delivery Dashboard
            </h1>
            {fullName && (
              <div className="text-xs text-gray-600">{fullName}</div>
            )}
          </div>
        </div>
        {/* Delivered orders summary */}
        <div className="flex flex-wrap gap-4 justify-center mt-2">
          <div className="bg-white/80 rounded-lg px-4 py-2 shadow text-center">
            <div className="text-xs text-gray-500">Delivered Orders</div>
            <div className="text-lg font-bold text-green-600">
              {deliveredCount}
            </div>
          </div>
          <div className="bg-white/80 rounded-lg px-4 py-2 shadow text-center">
            <div className="text-xs text-gray-500">Total Delivered</div>
            <div className="text-lg font-bold text-orange-600">
              {deliveredTotal.toLocaleString()} DA
            </div>
          </div>
          <div className="bg-white/80 rounded-lg px-4 py-2 shadow text-center">
            <div className="text-xs text-gray-500">Your Profit</div>
            <div className="text-lg font-bold text-blue-600">
              {deliveredProfit.toLocaleString()} DA
            </div>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleLogout}
          className="!px-3 !py-1 self-end"
        >
          Logout
        </Button>
      </div>
      <div className="w-full max-w-lg flex-1" style={{ zIndex: 1 }}>
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            No assigned orders.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/90 rounded-xl shadow-lg p-4 flex flex-col gap-2 animate-fade-in border border-gray-100"
                style={{ backdropFilter: "blur(2px)" }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-base text-orange-700">
                    Order #{order.orderNumber}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold">
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <div>
                    <b>Customer:</b> {order.customer.name}
                  </div>
                  <div>
                    <b>Phone:</b> {order.customer.phone}
                  </div>
                  <div>
                    <b>Address:</b> {order.customer.address}
                  </div>
                  <div>
                    <b>Total:</b>{" "}
                    <span className="text-orange-700 font-bold">
                      {order.total} DA
                    </span>
                  </div>
                  <div>
                    <b>Items:</b>
                    <ul className="list-disc ml-5">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="text-gray-800">
                          {item.name}{" "}
                          <span className="font-semibold">
                            x{item.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {order.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-1">
                      <b>Notes:</b> {order.notes}
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  {order.status === "Out for Delivery" && (
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold"
                      onClick={() => handleStatusUpdate(order.id, "Delivered")}
                      disabled={updatingOrderId === order.id}
                    >
                      {updatingOrderId === order.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="loader border-white border-t-2 border-b-2 w-4 h-4 rounded-full animate-spin"></span>
                          Delivering...
                        </span>
                      ) : (
                        "Mark as Delivered"
                      )}
                    </Button>
                  )}
                  {order.status === "Ready" && (
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold"
                      onClick={() =>
                        handleStatusUpdate(order.id, "Out for Delivery")
                      }
                    >
                      Pick Up Order
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
