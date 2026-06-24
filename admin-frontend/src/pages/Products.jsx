import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.products);
      setLoading(false);
    } catch (error) {
      console.log("Fetch products error:", error);
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${id}`);
      alert("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.log("Delete error:", error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading Products...</h2>;
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: "20px", width: "100%" }}>
        <h1>Products Management</h1>

        <button
          onClick={() => navigate("/products/add")}
          style={{
            padding: "10px 20px",
            marginBottom: "20px",
            cursor: "pointer"
          }}
        >
          Add Product
        </button>

        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      width="60"
                      height="60"
                      style={{ objectFit: "cover" }}
                    />
                  </td>

                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>

                  <td>
                    <button
                      onClick={() =>
                        navigate(`/products/edit/${product._id}`)
                      }
                      style={{ marginRight: "10px", cursor: "pointer" }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(product._id)}
                      style={{ cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" align="center">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;