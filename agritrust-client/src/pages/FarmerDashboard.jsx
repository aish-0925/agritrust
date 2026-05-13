import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";

const STATS_CONFIG = [
  {
    key: "totalProducts",
    label: "Total Products",
    icon: "📦",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "availableProducts",
    label: "Available Products",
    icon: "✅",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    key: "lowStockProducts",
    label: "Low Stock",
    icon: "⚠️",
    color: "text-amber-600",
    bg: "bg-amber-50",
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

export default function FarmerDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/dashboard/farmer-stats")
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.message || "Failed to load stats."));
  }, []);

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {!stats
        ? STATS_CONFIG.map((s) => <StatCardSkeleton key={s.key} />)
        : STATS_CONFIG.map(({ key, label, icon, color, bg }) => (
            <div key={key} className="bg-white p-6 rounded-lg shadow">
              <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
                <span className="text-xl">{icon}</span>
              </div>
              <p className="text-gray-500 text-sm">{label}</p>
              <h2 className={`text-3xl font-bold mt-1 ${color}`}>
                {stats[key] ?? "—"}
              </h2>
            </div>
          ))}
    </motion.div>
  );
}