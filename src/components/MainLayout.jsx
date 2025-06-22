import React from "react";
import { Outlet } from "react-router-dom";
import StatusAd from "./StatusAd";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <>
      <StatusAd />
      <Header />
      <main className="min-h-[calc(100vh + 100px)]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
