import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const navigate = useNavigate();

  /* FETCH PRODUCTS */
  useEffect(() => {
  api.get("/products")
    .then(res => setProducts(res.data.products)) // 👈 IMPORTANT
    .catch(err => console.log(err));
}, []);

  /* DELETE */
  // const remove = async (id) => {
  //   await api.delete(`/products/${id}`);
  //   setProducts(products.filter(p => p._id !== id));
  // };

  /* FILTER */
  const filtered = products.filter(p =>
    (filter === "All" || p.category === filter) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  /* STATUS */
  const getStatus = (qty) => {
    if (qty < 20) return { text: "Critical", color: "bg-red-100 text-red-700" };
    if (qty < 50) return { text: "Low stock", color: "bg-yellow-100 text-yellow-700" };
    return { text: "Available", color: "bg-green-100 text-green-700" };
  };

  /* STATS */
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const avgPrice = products.length
    ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
    : 0;
  const critical = products.filter(p => p.quantity < 20).length;

  return (
    <div className="p-6">

      {/* HEADER */}
      <h2 className="text-xl font-semibold mb-4">Your marketplace</h2>

      {/* SEARCH + BUTTON */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Search products..."
          className="flex-1 border rounded-lg px-3 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => navigate("/products/add")}
          className="bg-green-800 text-white px-4 rounded-lg"
        >
          + Add product
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["All", "vegetable", "fruit", "grain", "spice"].map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1 rounded-full text-sm border ${
              filter === c ? "bg-green-100 text-green-700 border-green-400" : ""
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat title="Total listings" value={products.length} />
        <Stat title="Avg price / kg" value={`₹${avgPrice}`} />
        <Stat title="Total stock" value={`${totalStock} kg`} />
        <Stat title="Need attention" value={critical} />
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-4">

        {filtered.map(p => {
          const status = getStatus(p.quantity);

          return (
            <div key={p._id} className="bg-white rounded-xl shadow overflow-hidden">

              {/* IMAGE */}
              <div className="h-24 bg-gray-200 flex items-center justify-center">
                {p.images?.length ? (
                  <img
  src={`http://localhost:5000${p.images[0]}`}
  className="w-full h-full object-cover"
/>
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>

              {/* BODY */}
              <div className="p-4 space-y-3">

                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium">{p.name}</h3>
                    <p className="text-xs text-gray-500">{p.category}</p>
                  </div>

                  <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                    {status.text}
                  </span>
                </div>

                {/* META */}
                <div className="flex gap-2">
                  <div className="bg-gray-100 p-2 rounded flex-1">
                    <p className="text-sm font-medium">₹{p.price}/{p.unit}</p>
                    <p className="text-xs text-gray-500">Price</p>
                  </div>

                  <div className="bg-gray-100 p-2 rounded flex-1">
                    <p className="text-sm font-medium">{p.quantity} {p.unit}</p>
                    <p className="text-xs text-gray-500">Stock</p>
                  </div>
                </div>

               {/* ACTIONS */}
<div className="flex gap-2">

  {/* EDIT */}
  <button
    onClick={() => navigate(`/products/edit/${p._id}`)}
    className="flex-1 border rounded px-2 py-1 text-sm hover:bg-gray-50"
  >
    Edit listing
  </button>

  {/* VIEW ORDERS */}
  <button
    onClick={() => navigate(`/orders/${p._id}`)}
    className="flex-1 bg-green-900 text-white rounded px-2 py-1 text-sm hover:bg-green-800"
  >
    View orders
  </button>

</div>

              </div>
            </div>
          );
        })}

        {/* ADD CARD */}
        <div
          onClick={() => navigate("/products/add")}
          className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center h-52 cursor-pointer"
        >
          <span className="text-3xl text-gray-400">+</span>
          <p className="text-sm text-gray-500">Add new product</p>
        </div>

      </div>
    </div>
  );
}

/* STAT COMPONENT */
function Stat({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-xs text-gray-500">{title}</p>
    </div>
  );
}