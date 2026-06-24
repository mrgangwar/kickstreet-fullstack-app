import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/admin");
      setOrders(res.data.orders);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/orders/${id}/status`, {
        orderStatus: status
      });

      alert("Order updated successfully");
      fetchOrders();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading Orders...</h2>;
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ width: "100%", padding: "20px" }}>
        <h1>Orders Management</h1>

        <table border="1" width="100%" cellPadding="10">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Change Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.user?.name || "N/A"}</td>
                <td>{order.email}</td>
                <td>₹{order.amountTotal}</td>
                <td>{order.orderStatus}</td>
                <td>{order.paymentStatus}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                <td>
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Returned">Returned</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;