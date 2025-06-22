import { Outlet, Navigate } from "react-router-dom";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

const ProtectedRoutes = () => {
  const token = localStorage.getItem("token");
  const user = token ? parseJwt(token) : null;
  if (user && user.role === 1012) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoutes;
