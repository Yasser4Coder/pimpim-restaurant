import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/home/Home";
import Menu from "./pages/menu/Menu";
import Food from "./pages/Food/Food";
import Cart from "./pages/cart/Cart";
import Gallery from "./pages/gallery/Gallery";
import AboutUs from "./pages/aboutus/AboutUs";
import OrderTracking from "./pages/tracking/OrderTracking";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import DeliveryProtectedRoute from "./utils/DeliveryProtectedRoute";
import Login from "./pages/login/Login";

// Admin Pages
import Admin from "./pages/admin/Admin";
import GalleryManagement from "./pages/admin/GalleryManagement";
import MenuManagement from "./pages/admin/MenuManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import Settings from "./pages/admin/Settings";
import UsersManagement from "./pages/admin/UsersManagement";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/search/:searchTerm" element={<Menu />} />
        <Route path="/menu/tags/:tag" element={<Menu />} />
        <Route path="/food/:id" element={<Food />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/track" element={<OrderTracking />} />
        <Route path="/track/:orderNumber" element={<OrderTracking />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Delivery Guy Route */}
      <Route element={<DeliveryProtectedRoute />}>
        <Route path="/delivery" element={<DeliveryDashboard />} />
      </Route>

      {/* Protected Admin Routes with Admin Layout */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
          <Route path="gallery" element={<GalleryManagement />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="order-managment" element={<OrderManagement />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users-management" element={<UsersManagement />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
