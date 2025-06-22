import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Images,
  ShoppingBag,
  ChefHat,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      link: "/admin",
      icon: LayoutDashboard,
    },
    {
      id: "users",
      label: "User Management",
      link: "/admin/users-management",
      icon: Users,
    },
    {
      id: "menu",
      label: "Menu Management",
      link: "/admin/menu",
      icon: UtensilsCrossed,
    },
    { id: "gallery", label: "Gallery", link: "/admin/gallery", icon: Images },
    {
      id: "orders",
      label: "Orders",
      link: "/admin/order-managment",
      icon: ShoppingBag,
    },
    {
      id: "settings",
      label: "Settings",
      link: "/admin/settings",
      icon: Settings,
    },
  ];
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <ChefHat className="h-8 w-8 text-orange-500" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Restaurant Admin
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Open</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              to={item.link || "#"}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                activeTab === item.id
                  ? "bg-orange-50 text-orange-600 border-r-2 border-orange-500"
                  : "text-gray-600"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
