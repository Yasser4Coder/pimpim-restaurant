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

const Admin = () => {
  const navigate = useNavigate();
  const stats = [
    {
      title: "Total Orders",
      value: "1,234",
      icon: ShoppingBag,
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Revenue",
      value: "$12,345",
      icon: DollarSign,
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "Menu Items",
      value: "89",
      icon: UtensilsCrossed,
      change: "+3",
      changeType: "positive",
    },
    {
      title: "Delivery Staff",
      value: "24",
      icon: Users,
      change: "+2",
      changeType: "positive",
    },
  ];
  const recentOrders = [
    {
      id: "#1234",
      customer: "John Doe",
      items: "2x Burger, 1x Fries",
      status: "Preparing",
      total: "$24.99",
    },
    {
      id: "#1235",
      customer: "Jane Smith",
      items: "1x Pizza, 2x Coke",
      status: "Out for Delivery",
      total: "$32.50",
    },
    {
      id: "#1236",
      customer: "Mike Johnson",
      items: "3x Tacos, 1x Salad",
      status: "Delivered",
      total: "$18.75",
    },
    {
      id: "#1237",
      customer: "Sarah Wilson",
      items: "1x Pasta, 1x Wine",
      status: "Preparing",
      total: "$28.00",
    },
  ];
  const handleLogout = async () => {
    await axios.post("/auth/logout");
    navigate("/login");
  };
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm">{order.items}</p>
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
                  <span className="font-medium">{order.total}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
