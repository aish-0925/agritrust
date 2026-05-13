import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";

const STATS_CONFIG = [
  {
    key: "activeSuppliers",
    label: "Active Suppliers",
    icon: "👨‍🌾",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "ordersThisMonth",
    label: "Orders This Month",
    icon: "📦",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    key: "totalSpend",
    label: "Total Spend",
    icon: "💰",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    key: "freshnessScore",
    label: "Freshness Score",
    icon: "⭐",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
];

function StatCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="h-8 bg-gray-200 rounded w-1/3" />
    </div>
  );
}

export default function RestaurantDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch stats
    api
      .get("/dashboard/restaurant-stats")
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.message));

    // Fetch recent orders (optional API)
    api
      .get("/orders/my")
      .then((res) => setRecentOrders(res.data.orders || []))
      .catch(() => {});
  }, []);

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* 🔹 Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {!stats
          ? STATS_CONFIG.map((s) => <StatCardSkeleton key={s.key} />)
          : STATS_CONFIG.map(({ key, label, icon, color, bg }) => (
              <div key={key} className="bg-white p-6 rounded-xl shadow">
                <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
                  <span className="text-xl">{icon}</span>
                </div>

                <p className="text-gray-500 text-sm">{label}</p>

                <h2 className={`text-3xl font-bold mt-1 ${color}`}>
                  {key === "totalSpend"
                    ? `₹${stats[key] || 0}`
                    : stats[key] ?? "—"}
                </h2>
              </div>
            ))}
      </motion.div>

      {/* 🔹 Recent Orders */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>

        {recentOrders.length === 0 ? (
          <p className="text-gray-500">No recent orders</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">
                    {order.items?.[0]?.product?.name || "Order"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">₹{order.totalPrice}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔹 Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-green-500 text-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-lg">Browse Produce</h3>
          <p className="text-sm mt-1">
            Explore fresh farm products
          </p>
        </div>

        <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-lg">My Orders</h3>
          <p className="text-sm mt-1">
            View your purchase history
          </p>
        </div>

        <div className="bg-yellow-500 text-black p-6 rounded-xl shadow">
          <h3 className="font-bold text-lg">Track Delivery</h3>
          <p className="text-sm mt-1">
            Track incoming orders
          </p>
        </div>

      </div>

    </div>
  );
}