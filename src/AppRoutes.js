import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Menu from "./pages/menu/Menu";
import Food from "./pages/Food/Food";
import Cart from "./pages/cart/Cart";
import Admin from "./pages/admin/Admin";
import Products from "./pages/admin/Products";
import Gallery from "./pages/gallery/Gallery";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Status from "./pages/admin/Status";
import GallerySet from "./pages/admin/GallerySet";
import AboutUs from "./pages/aboutus/AboutUs";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/menu/search/:searchTerm" element={<Menu />} />
      <Route path="/menu/tags/:tag" element={<Menu />} />
      <Route path="/food/:id" element={<Food />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/status" element={<Status />} />
        <Route path="/admin/gallery-settings" element={<GallerySet />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
