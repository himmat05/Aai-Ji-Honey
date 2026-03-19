// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import HoneyBeeBackground from "./HoneyBeeBackground";

// const AddProduct = () => {
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");
//   const [products, setProducts] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const navigate = useNavigate();


//   // new changes 


//     const handleImageUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setImage(file); // keep File object for upload
//     setImagePreview(URL.createObjectURL(file)); // preview locally
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     if (!token) return alert("Unauthorized access!");

//     try {
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("price", price);

//       if (image && image instanceof File) {
//         formData.append("image", image); // ✅ send File object
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       };

//       if (editId) {
//         await axios.put(
//           `${import.meta.env.VITE_API_URL}/products/${editId}`,
//           formData,
//           config
//         );
//         setEditId(null);
//       } else {
//         await axios.post(
//           `${import.meta.env.VITE_API_URL}/products`,
//           formData,
//           config
//         );
//       }

//       // reset states
//       setName("");
//       setPrice("");
//       setImage(null);
//       setImagePreview("");
//       fetchProducts();
//     } catch (err) {
//       console.error("Error saving product:", err);
//     }
//   };


//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
//       setProducts(res.data);

//     } catch (err) {
//       console.error("Error fetching products:", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     const token = localStorage.getItem("token");
//     const Conf = confirm("⚠️ Do you really want to delete these item !")
//     if (Conf) {
//       try {
//         await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         fetchProducts();
//       } catch (err) {
//         console.error("Delete error:", err);
//       }
//     }
//   };

//     const handleEdit = (product) => {
//     setEditId(product._id);
//     setName(product.name);
//     setPrice(product.price);

//     // ⚠️ important: don't set product.image (URL string) as File
//     setImage(null);
//     setImagePreview(product.image); // show current Cloudinary image in preview
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   return (
//     <div className="bg-gradient-to-br from-yellow-50/80 via-white/80 to-amber-100/80 ">
//       <HoneyBeeBackground />
//       <div className="p-4 mt-[-10px] rounded-t-lg max-w-4xl mx-auto bg-gradient-to-b from-white/80 to-yellow-200 transition-all duration-300 ease-in-out hover:drop-shadow-2xl rounded-b-3xl hover:z-0">
//         <h1 className="text-2xl font-bold mb-4 mt-7">{editId ? "Edit Product" : "Add Product"}</h1>

//         <form onSubmit={handleSubmit} className="space-y-4 mb-8">
//           <input
//             type="text"
//             placeholder="Product Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//             className="block w-full border p-2 rounded"
//           />
//           <input
//             type="number"
//             placeholder="Price (₹)"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             required
//             className="block w-full border p-2 rounded"
//           />
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="block w-full border p-2 rounded"
//           />
//           {imagePreview && (
//             <img src={imagePreview} alt="Preview" className="w-32 h-32 object-contain rounded border" />
//           )}


//           <button
//             type="submit"
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
//           >
//             {editId ? "Update" : "Add"} Product
//           </button>
//         </form>

//         {/* orders list route */}
//         <div className="mb-4 flex gap-4">
//           <button
//             onClick={() => navigate('/OrderDashboard')}
//             className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 cursor-pointer"
//           >
//             🧾 Order List
//           </button>
//         </div>

//         <h2 className="text-xl font-semibold mb-2">Manage Products</h2>
//         <div className="grid grid-cols-2 gap-4">
//           {products.map((product) => (
//             <div
//               key={product._id}
//               className="border p-4 rounded shadow flex flex-col items-center bg-white hover:shadow-lg transition-shadow duration-300"
//             >
//               <img
//                 src={product.image}
//                 alt={product.name}
//                 className="w-full h-80 object-contain rounded"
//               />

//               <h3 className="font-semibold">{product.name}</h3>
//               <p className="text-sm">₹{product.price}</p>
//               <div className="mt-2 flex gap-2">
//                 <button
//                   onClick={() => handleEdit(product)}
//                   className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 hover:cursor-pointer"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(product._id)}
//                   className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 hover:cursor-pointer"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProduct;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HoneyBeeBackground from "./HoneyBeeBackground";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [globalOffer, setGlobalOffer] = useState("");
  const navigate = useNavigate();

  const handleGlobalOfferSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized access!");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/products/offer/all`,
        { offerPercentage: Number(globalOffer) },
        config
      );
      toast.success(`✅ Global offer of ${globalOffer}% applied to all products!`);
      setGlobalOffer("");
      fetchProducts(); // Refresh list to get new prices
    } catch (err) {
      console.error("Error setting global offer:", err);
      toast.error("❌ Error applying global offer");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized access!");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);

      if (image && image instanceof File) {
        formData.append("image", image);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/products/${editId}`,
          formData,
          config
        );
        setEditId(null);
        toast.success("✅ Product updated successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/products`,
          formData,
          config
        );
        toast.success("✅ Product added successfully!");
      }

      setName("");
      setPrice("");
      setImage(null);
      setImagePreview("");
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      toast.error("❌ Error saving product");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const Conf = confirm("⚠️ Are you sure you want to delete this item?")
    if (Conf) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ Product deleted successfully!");
        fetchProducts();
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("❌ Error deleting product");
      }
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setName(product.name);
    setPrice(product.price);
    setImage(null);
    setImagePreview(product.image);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 py-8 px-4">
      <HoneyBeeBackground />
      
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            {editId ? "✏️ Edit Product" : "➕ Add New Product"}
          </h1>
          <p className="text-amber-700">Manage your honey collection</p>
        </div>

        {/* Global Settings Section */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl shadow-lg p-8 mb-12 border-2 border-amber-300">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">🌍 Global Settings</h2>
          <form onSubmit={handleGlobalOfferSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-amber-900 mb-2">Apply Sitewide Discount (%)</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="e.g., 15"
                  min="0"
                  max="100"
                  value={globalOffer}
                  onChange={(e) => setGlobalOffer(e.target.value)}
                  required
                  className="w-full border-2 border-amber-300 p-3 pr-10 rounded-lg focus:outline-none focus:border-orange-500 transition-colors bg-white/80 backdrop-blur-sm"
                />
                <span className="absolute right-4 top-3.5 text-amber-700 font-bold">%</span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 whitespace-nowrap cursor-pointer"
            >
              🎉 Apply to All
            </button>
          </form>
          <p className="text-sm text-amber-700 mt-3 font-medium">
            Note: This will instantly override the offer percentage on every product in the store. Set to 0 to remove all discounts.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border-2 border-amber-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">Product Name</label>
              <input
                type="text"
                placeholder="e.g., Raw Acacia Honey"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border-2 border-amber-200 p-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">Price (₹)</label>
              <input
                type="number"
                placeholder="Enter price in rupees"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full border-2 border-amber-200 p-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border-2 border-dashed border-amber-300 p-4 rounded-lg cursor-pointer hover:border-amber-500 transition-colors bg-amber-50"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-40 h-40 object-contain rounded-lg border-2 border-amber-200 shadow-lg" 
                  />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t-2 border-amber-200">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {editId ? "✏️ Update Product" : "➕ Add Product"}
              </button>
              <button
                type="button"
                onClick={() => navigate('/OrderDashboard')}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                📋 View Orders
              </button>
            </div>
          </form>
        </div>

        {/* Products Management Section */}
        <div>
          <h2 className="text-3xl font-bold text-amber-900 mb-8">📦 Manage Products</h2>
          
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border-2 border-amber-200">
              <p className="text-2xl text-amber-700 font-semibold">No products yet. Add one to get started! 🍯</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-amber-100"
                >
                  {/* Product Image */}
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 h-64 flex items-center justify-center p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-amber-900 mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-orange-600 mb-4">₹{product.price}</p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;