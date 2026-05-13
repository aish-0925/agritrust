import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EditProduct() {
  const { id } = useParams();
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

  /* FETCH PRODUCT */
  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        const p = res.data.product;

        setForm({
          name: p.name,
          category: p.category,
          price: p.price,
          quantity: p.quantity,
          unit: p.unit,
          description: p.description || "",
          organic: p.organic
        });

        // show existing images
        if (p.images) {
          setPreview(p.images.map(img => `http://localhost:5000/${img}`));
        }
      })
      .catch(err => console.log(err));
  }, [id]);

  /* INPUT CHANGE */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  /* IMAGE CHANGE */
  const handleImage = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    const urls = files.map(file => URL.createObjectURL(file));
    setPreview(urls);
  };

  /* UPDATE */
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

      await api.put(`/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Product updated successfully");
      navigate("/marketplace");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* DELETE */
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Product deleted");
      navigate("/marketplace");

    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <h2 className="text-xl font-semibold mb-6">Edit Product</h2>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">

        {/* FORM */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6 space-y-4">

          {/* NAME */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full border rounded-lg p-2"
          />

          {/* CATEGORY */}
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="vegetable">Vegetable</option>
            <option value="fruit">Fruit</option>
            <option value="grain">Grain</option>
            <option value="spice">Spice</option>
          </select>

          {/* PRICE + QUANTITY */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="border rounded-lg p-2"
            />

            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              className="border rounded-lg p-2"
            />
          </div>

          {/* UNIT */}
          <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="kg">Kg</option>
            <option value="ton">Ton</option>
            <option value="bunch">Bunch</option>
          </select>

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border rounded-lg p-2"
          />

          {/* ORGANIC */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="organic"
              checked={form.organic}
              onChange={handleChange}
            />
            Organic Product
          </label>

          {/* BUTTONS */}
          <div className="flex gap-3 mt-4">

            <button
              type="submit"
              disabled={loading}
              className="bg-green-800 text-white px-6 py-2 rounded-lg"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              Delete
            </button>

          </div>

        </div>

        {/* IMAGE */}
        <div className="bg-white rounded-xl shadow p-6">

          <label className="border-2 border-dashed rounded-xl h-48 flex items-center justify-center cursor-pointer">

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

        </div>

      </form>
    </div>
  );
}