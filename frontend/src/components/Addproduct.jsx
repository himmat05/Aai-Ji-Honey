import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HoneyBeeBackground from "./HoneyBeeBackground";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // ← store actual file, not base64
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) return alert("Unauthorized access!");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("image", image); // actual File object

      if (editId) {
        // For PUT, you may need to use multipart override
        // await axios.put(`http://localhost:5000/products/${editId}`, formData, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     'Content-Type': 'multipart/form-data'
        //   },
        // });
        await axios.put(`${import.meta.env.VITE_API_URL}/products/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
        setEditId(null);
      } else {
        // Add new
        // await axios.post("http://localhost:5000/products", formData, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     'Content-Type': 'multipart/form-data'
        //   },
        // });
        await axios.post(`${import.meta.env.VITE_API_URL}/products`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
      }

      setName("");
      setPrice("");
      setImage("");
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };



  const fetchProducts = async () => {
    try {
      // const res = await axios.get("http://localhost:5000/products");
      // setProducts(res.data);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      setProducts(res.data);

    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const Conf = confirm("⚠️ Do you really want to delete these item !")
    if (Conf) {
      try {
        // await axios.delete(`http://localhost:5000/products/${id}`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setName(product.name);
    setPrice(product.price);
    setImage(product.image);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-gradient-to-br from-yellow-50/80 via-white/80 to-amber-100/80 ">
      <HoneyBeeBackground />
      <div className="p-4 mt-[-10px] rounded-t-lg max-w-4xl mx-auto bg-gradient-to-b from-white/80 to-yellow-200 transition-all duration-300 ease-in-out hover:drop-shadow-2xl rounded-b-3xl hover:z-0">
        <h1 className="text-2xl font-bold mb-4 mt-7">{editId ? "Edit Product" : "Add Product"}</h1>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="block w-full border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Price (₹)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="block w-full border p-2 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full border p-2 rounded"
          />
          {image && (
            <img src={image} alt="Preview" className="w-32 h-32 object-contain rounded border" />
          )}
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
          >
            {editId ? "Update" : "Add"} Product
          </button>
        </form>

        {/* orders list route */}
        <div className="mb-4 flex gap-4">
          <button
            onClick={() => navigate('/OrderDashboard')}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 cursor-pointer"
          >
            🧾 Order List
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-2">Manage Products</h2>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded shadow flex flex-col items-center bg-white hover:shadow-lg transition-shadow duration-300"
            >
              {/* <img
                img src={`${import.meta.env.VITE_API_URL}${product.image}`} 
                alt={product.name}
                className="w-full h-80 object-contain rounded "
              /> */}
              <img
                src={product.image.startsWith("data:")
                  ? product.image
                  : `data:image/jpeg;base64,${product.image}`}
                alt={product.name}
                className="w-full h-80 object-contain rounded"
              />

              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm">₹{product.price}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 hover:cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 hover:cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
