import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import "../styles/dashboard.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchAnalytics();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      setStats(res.data.stats);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/admin/analytics");
      setAnalytics(res.data.analytics);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content">
        <h1>Dashboard</h1>

        {stats && (
          <div className="cards">
            <div className="card">
              <h3>Total Products</h3>
              <p>{stats.totalProducts}</p>
            </div>

            <div className="card">
              <h3>Total Orders</h3>
              <p>{stats.totalOrders}</p>
            </div>

            <div className="card">
              <h3>Total Revenue</h3>
              <p>₹{stats.totalRevenue}</p>
            </div>

            <div className="card">
              <h3>Pending Orders</h3>
              <p>{stats.pendingOrders}</p>
            </div>

            <div className="card">
              <h3>Delivered Orders</h3>
              <p>{stats.deliveredOrders}</p>
            </div>
          </div>
        )}

        <div style={{ marginTop: "40px" }}>
          <h2>Revenue Analytics</h2>

          <BarChart width={800} height={350} data={analytics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;