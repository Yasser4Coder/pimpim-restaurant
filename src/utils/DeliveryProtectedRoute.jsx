import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

const DeliveryProtectedRoute = () => {
  const [auth, setAuth] = useState(null); // null = loading, false = not auth, true = auth

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const res = await axios.get("/users/me");
        if (res.data.role === 1001) {
          if (isMounted) setAuth(true);
        } else {
          if (isMounted) setAuth(false);
        }
      } catch {
        if (isMounted) setAuth(false);
      }
    };
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  if (auth === null) return null; // or a loading spinner
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default DeliveryProtectedRoute;
