import { Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import ProfileAvatar from "./ProfileAvatar";

export default function Navbar({ user, toggleSidebar }) {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"
      
    );
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-50 flex justify-between items-center bg-white/80 backdrop-blur border-b border-gray-100 px-6 py-4">

      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Menu size={22} />
        </button>

        <h2 className="font-semibold text-gray-800 text-lg">
  {user?.role === "restaurant"
    ? "🍽 Restaurant Dashboard"
    : "🌾 Farmer Dashboard"}
</h2>
      </div>

      <div className="flex items-center gap-5 relative">

        <NotificationBell />

        <div onClick={() => setOpen(!open)} className="cursor-pointer">
          <ProfileAvatar user={user} />
        </div>

        {open && (
          <div className="absolute right-0 top-14 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2">

            <div className="px-4 py-2 border-b text-sm">
              <p className="font-medium">{user?.name}</p>
              <p className="text-gray-500 text-xs">{user?.email}</p>
            </div>

            <button
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              Profile
            </button>

            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm"
            >
              Logout
            </button>

          </div>
        )}
      </div>
    </div>
  );
}