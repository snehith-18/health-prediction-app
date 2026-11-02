import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Activity,
  HeartPulse,
} from "lucide-react";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Patients",
      path: "/patients",
      icon: Users,
    },
    {
      name: "Add Patient",
      path: "/add-patient",
      icon: UserPlus,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white p-6">

      <div className="flex items-center gap-3 mb-12">
        <div className="bg-blue-600 p-2 rounded-xl">
          <HeartPulse size={25} />
        </div>

        <h1 className="text-xl font-bold">
          Health<span className="text-blue-400">Care</span>
        </h1>
      </div>

      <p className="text-xs text-slate-400 uppercase mb-4">
        Main Menu
      </p>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

    </aside>
  );
}

export default Sidebar;