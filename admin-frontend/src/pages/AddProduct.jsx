import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function AddProduct() {
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.stock ||
      !formData.sizes ||
      !formData.images
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (Number(formData.price) < 0 || Number(formData.stock) < 0) {
      alert("Price and stock must be positive");
      return;
    }

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        sizes: formData.sizes
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        colors: formData.colors
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        images: formData.images
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      };

      await API.post("/products", productData);

      alert("Product Added Successfully");
      navigate("/products");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: "30px", width: "100%" }}>
        <h1>Add Product</h1>

        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />
        <br /><br />

        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Children">Children</option>
          <option value="Unisex">Unisex</option>
        </select>

        <br /><br />

        <input
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="sizes"
          placeholder="Sizes (comma separated)"
          value={formData.sizes}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="colors"
          placeholder="Colors (comma separated)"
          value={formData.colors}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="images"
          placeholder="Image URLs (comma separated)"
          value={formData.images}
          onChange={handleChange}
        />
        <br /><br />

        <button onClick={handleSubmit}>Add Product</button>
      </div>
    </div>
  );
}

export default AddProduct;