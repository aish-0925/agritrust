import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";

export default function Browse() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get("/products/browse", {
        params: { category, search, sort }
      });
      setProducts(res.data.products);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, [category, search, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleAddToCart = async (productId) => {
  try {
    await api.post("/cart", {
      productId,
      quantity: 1
    });

    alert("Added to cart ✅");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to add to cart");
  }
};

  return (
    <div className="min-h-screen w-full bg-white text-green-700 p-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-green-500 tracking-wide">— MARKETPLACE</p>
          <h1 className="text-3xl font-semibold">
            Browse <span className="text-green-600">fresh</span> produce
          </h1>
        </div>

        <button onClick={() => navigate("/restaurant/cart")} className="bg-green-600 px-4 py-2 rounded-lg font-medium text-white hover:bg-green-500 transition">
          🛒 Cart
        </button>
      </div>

      {/* SEARCH + SORT */}
      <div className="flex gap-4 mb-6">
        <input
          placeholder="Search produce..."
          className="flex-1 px-4 py-2 rounded-lg border border-green-300 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 rounded-lg border border-green-300"
        >
          <option value="">Sort: Relevance</option>
          <option value="price_low">Price: Low</option>
          <option value="price_high">Price: High</option>
        </select>
      </div>

      {/* CATEGORY */}
      <div className="flex gap-3 flex-wrap mb-8">
        {["All", "vegetable", "fruit", "grain", "spice"].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1 rounded-full text-sm transition ${
              category === c
                ? "bg-green-600 text-white"
                : "border border-green-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.04 }}
            className="bg-white rounded-xl overflow-hidden border border-green-200 shadow-sm"
          >
            <div className="h-32 bg-green-50 flex items-center justify-center relative">
              {p.image ? (
                <img
                  src={`http://localhost:5000${p.image}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-green-400 text-sm">No Image</span>
              )}

              {p.organic && (
                <span className="absolute top-2 left-2 text-xs bg-green-600 text-white px-2 py-1 rounded">
                  Organic
                </span>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-sm capitalize text-green-500">{p.category}</p>

              <p className="text-xs text-green-400 mt-1">
                {p.farmer} • {p.city}
              </p>

              <div className="flex justify-between items-center mt-3">
                <span className="text-xl font-semibold text-green-700">
                  ₹{p.price}
                  <span className="text-sm text-green-400">/{p.unit}</span>
                </span>
              </div>

              <p className="text-xs text-green-400 mt-1">
                {p.stock} {p.unit} left
              </p>

              <button
  onClick={() => handleAddToCart(p.id)}
  className="mt-4 w-full bg-green-600 hover:bg-green-500 transition py-2 rounded-lg font-medium text-white"
>
  Add to cart
</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* EMPTY */}
      {products.length === 0 && (
        <div className="text-center text-green-400 mt-10">
          No products found 😔
        </div>
      )}
    </div>
  );
}