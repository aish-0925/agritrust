import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function DashboardLayout({ children }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null); // ✅ add this

  useEffect(() => {
    api.get("/users/profile")
      .then(res => setUser(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar open={sidebarOpen} role={user?.role} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col">

        <Navbar
          user={user} // ✅ now user is real
          toggleSidebar={() => setSidebarOpen(prev => !prev)}
        />

        <div className="p-6">
          {children}
        </div>

      </div>
    </div>
  );
}