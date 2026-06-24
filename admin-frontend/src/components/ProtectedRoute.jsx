import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  let admin = null;
  try {
    admin = JSON.parse(localStorage.getItem("admin"));
  } catch (error) {
    admin = null;
  }

  if (!token || admin?.role !== "admin") {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;