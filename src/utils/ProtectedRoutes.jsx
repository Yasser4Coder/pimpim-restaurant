import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const ProtectedRoutes = () => {
  const user = useAuth();
  return user.orgRole === "org:admin" ? <Outlet /> : <Navigate to={"/"} />;
};

export default ProtectedRoutes;
