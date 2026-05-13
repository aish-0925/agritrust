import { Link } from "react-router-dom";
import { menuConfig } from "../config/menuConfig";

export default function Sidebar({ open, role }) {

  const menu = menuConfig[role] || [];

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="p-5 border-b font-bold text-lg">
        🌱 AgriTrust
      </div>

      <nav className="flex flex-col p-4 gap-4">

        {menu.map((item, i) => (
          <Link key={i} to={item.path}>
            {item.name}
          </Link>
        ))}

      </nav>
    </aside>
  );
}