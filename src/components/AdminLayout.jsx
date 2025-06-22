import { useState } from "react";
import Sidebar from "./Sidebar";

import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
