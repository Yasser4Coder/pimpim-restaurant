import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Users, UtensilsCrossed, ShoppingBag, DollarSign } from "lucide-react";
import { Button } from "../../components/ui/Button";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import orderApi from "../../api/orderApi";

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [menuCount, setMenuCount] = useState(null);
  const [deliveryCount, setDeliveryCount] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [progressView, setProgressView] = useState("monthly"); // 'monthly' or 'yearly'

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          statsRes,
          revenueRes,
          menuRes,
          deliveryRes,
          recentOrdersRes,
          progressRes,
        ] = await Promise.all([
          axios.get("/orders/stats/overview"),
          axios.get("/orders/revenue"),
          axios.get("/menu/count"),
          axios.get("/users/delivery-count"),
          axios.get("/orders/recent"),
          orderApi.getProgress(),
        ]);
        setStats(statsRes.data);
        setRevenue(revenueRes.data.totalRevenue);
        setMenuCount(menuRes.data.count);
        setDeliveryCount(deliveryRes.data.count);
        setRecentOrders(recentOrdersRes.data);
        setProgress(progressRes.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await axios.post("/auth/logout");
    navigate("/login");
  };

  // Prepare stats for display
  const statsArray = [
    {
      title: "Total Orders",
      value: stats ? Object.values(stats).reduce((a, b) => a + b, 0) : "-",
      icon: ShoppingBag,
      change: "-",
      changeType: "positive",
    },
    {
      title: "Revenue",
      value: revenue !== null ? `${revenue.toLocaleString()} DZD` : "-",
      icon: DollarSign,
      change: "-",
      changeType: "positive",
    },
    {
      title: "Menu Items",
      value: menuCount !== null ? menuCount : "-",
      icon: UtensilsCrossed,
      change: "-",
      changeType: "positive",
    },
    {
      title: "Delivery Staff",
      value: deliveryCount !== null ? deliveryCount : "-",
      icon: Users,
      change: "-",
      changeType: "positive",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening at your restaurant.
          </p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="!px-4 !py-2"
        >
          Logout
        </Button>
      </div>

      {error && <div className="text-red-600">{error}</div>}
      {loading ? (
        <div className="text-center py-12 text-gray-500">
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsArray.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p
                      className={`text-xs ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Business Progress Section */}
          {progress && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Business Progress
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cumulative Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-700">
                      {progress.cumulativeRevenue.toLocaleString()} DZD
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Cumulative Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-700">
                      {progress.cumulativeOrders.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="mb-6">
                <div className="flex items-center mb-2 gap-2">
                  <h3 className="text-lg font-semibold">Progress</h3>
                  <select
                    value={progressView}
                    onChange={(e) => setProgressView(e.target.value)}
                    className="ml-2 px-2 py-1 border rounded text-sm"
                  >
                    <option value="monthly">Monthly Progress</option>
                    <option value="yearly">Yearly Progress</option>
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-[300px] w-full text-sm border rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Year</th>
                        {progressView === "monthly" && (
                          <th className="px-4 py-2 text-left">Month</th>
                        )}
                        <th className="px-4 py-2 text-left">Revenue (DZD)</th>
                        <th className="px-4 py-2 text-left">Orders</th>
                      </tr>
                    </thead>
                    <tbody>
                      {progressView === "monthly" ? (
                        progress.monthlyStats &&
                        progress.monthlyStats.length > 0 ? (
                          progress.monthlyStats
                            .sort(
                              (a, b) => b.year - a.year || b.month - a.month
                            )
                            .map((stat, idx) => (
                              <tr
                                key={idx}
                                className="border-b last:border-b-0"
                              >
                                <td className="px-4 py-2">{stat.year}</td>
                                <td className="px-4 py-2">{stat.month}</td>
                                <td className="px-4 py-2">
                                  {stat.revenue.toLocaleString()}
                                </td>
                                <td className="px-4 py-2">{stat.orders}</td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-4 py-2 text-center text-gray-400"
                            >
                              No monthly data
                            </td>
                          </tr>
                        )
                      ) : progress.yearlyStats &&
                        progress.yearlyStats.length > 0 ? (
                        progress.yearlyStats
                          .sort((a, b) => b.year - a.year)
                          .map((stat, idx) => (
                            <tr key={idx} className="border-b last:border-b-0">
                              <td className="px-4 py-2">{stat.year}</td>
                              <td className="px-4 py-2">
                                {stat.revenue.toLocaleString()}
                              </td>
                              <td className="px-4 py-2">{stat.orders}</td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-4 py-2 text-center text-gray-400"
                          >
                            No yearly data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">
                    No recent orders found.
                  </div>
                ) : (
                  recentOrders.map((order) => (
                    <div
                      key={order.id || order._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">
                              #
                              {order.orderNumber ||
                                order.displayOrderNumber ||
                                order._id}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.customer?.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm">
                              {order.items
                                ?.map(
                                  (item) => `${item.quantity}x ${item.name}`
                                )
                                .join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Out for Delivery"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="font-medium">
                          ${order.total?.toFixed(2)} DZD
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Admin;
