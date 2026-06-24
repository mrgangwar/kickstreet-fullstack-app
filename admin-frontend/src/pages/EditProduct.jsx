import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Men",
    brand: "",
    sizes: "",
    colors: "",
    stock: "",
    images: ""
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      const product = res.data.product;

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "Men",
        brand: product.brand || "",
        stock: product.stock || "",
        sizes: product.sizes ? product.sizes.join(", ") : "",
        colors: product.colors ? product.colors.join(", ") : "",
        images: product.images ? product.images.join(", ") : ""
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Failed to load product");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.description || !formData.price) {
      alert("Please fill required fields");
      return;
    }

    try {
      const updatedData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        sizes: formData.sizes
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
        colors: formData.colors
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
        images: formData.images
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean)
      };

      await API.put(`/products/${id}`, updatedData);

      alert("Product Updated Successfully");
      navigate("/products");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <h2 style={{ padding: "20px" }}>Loading...</h2>;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: "30px", width: "100%" }}>
        <h1>Edit Product</h1>

        <input name="name" value={formData.name} onChange={handleChange} />
        <br /><br />

        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <br /><br />

        <input name="price" value={formData.price} onChange={handleChange} />
        <br /><br />

        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Children">Children</option>
          <option value="Unisex">Unisex</option>
        </select>

        <br /><br />

        <input name="brand" value={formData.brand} onChange={handleChange} />
        <br /><br />

        <input name="stock" value={formData.stock} onChange={handleChange} />
        <br /><br />

        <input
          name="sizes"
          value={formData.sizes}
          onChange={handleChange}
          placeholder="Sizes (comma separated)"
        />
        <br /><br />

        <input
          name="colors"
          value={formData.colors}
          onChange={handleChange}
          placeholder="Colors (comma separated)"
        />
        <br /><br />

        <input
          name="images"
          value={formData.images}
          onChange={handleChange}
          placeholder="Image URLs (comma separated)"
        />
        <br /><br />

        <button onClick={handleUpdate}>Update Product</button>
      </div>
    </div>
  );
}

export default EditProduct;