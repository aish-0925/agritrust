import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "vegetable",
    price: "",
    quantity: "",
    unit: "kg",
    description: "",
    organic: false
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  /* INPUT */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  /* IMAGE */
  const handleImage = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    const urls = files.map(file => URL.createObjectURL(file));
    setPreview(urls);
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const formData = new FormData();

    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });

    images.forEach(img => {
      formData.append("images", img);
    });

    const token = localStorage.getItem("token");

    await api.post("/products", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    alert("Product added successfully");
    navigate("/marketplace");

  } catch (err) {
    console.error(err); 
    alert(err.response?.data?.message || "Error");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6">

      {/* HEADER */}
      <h2 className="text-xl font-semibold mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">

        {/* LEFT FORM */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6 space-y-4">

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-600">Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="text-sm text-gray-600">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option value="vegetable">Vegetable</option>
              <option value="fruit">Fruit</option>
              <option value="grain">Grain</option>
              <option value="spice">Spice</option>
            </select>
          </div>

          {/* PRICE + QUANTITY */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Price</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Quantity</label>
              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
                required
              />
            </div>
          </div>

          {/* UNIT */}
          <div>
            <label className="text-sm text-gray-600">Unit</label>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option value="kg">Kg</option>
              <option value="ton">Ton</option>
              <option value="bunch">Bunch</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-gray-600">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* ORGANIC */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="organic"
              checked={form.organic}
              onChange={handleChange}
            />
            Organic Product
          </label>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="bg-green-800 text-white px-6 py-2 rounded-lg hover:bg-green-900"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>

        </div>

        {/* RIGHT IMAGE */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-center">

          <label className="border-2 border-dashed rounded-xl h-48 flex items-center justify-center cursor-pointer hover:bg-gray-50">

            {preview.length ? (
              <div className="grid grid-cols-2 gap-2 p-2">
                {preview.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="h-20 w-full object-cover rounded"
                  />
                ))}
              </div>
            ) : (
              <span className="text-gray-400">Upload Images</span>
            )}

            <input
              type="file"
              multiple
              hidden
              onChange={handleImage}
            />
          </label>

          <p className="text-xs text-gray-500 mt-3 text-center">
            JPG, PNG (Max 5MB)
          </p>

        </div>

      </form>
    </div>
  );
}