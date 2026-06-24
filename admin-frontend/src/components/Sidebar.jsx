import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2>Kick Street Admin</h2>

      <Link
        className={location.pathname === "/dashboard" ? "active" : ""}
        to="/dashboard"
      >
        Dashboard
      </Link>

      <Link
        className={location.pathname.includes("/products") ? "active" : ""}
        to="/products"
      >
        Products
      </Link>

      <Link
        className={location.pathname === "/orders" ? "active" : ""}
        to="/orders"
      >
        Orders
      </Link>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;