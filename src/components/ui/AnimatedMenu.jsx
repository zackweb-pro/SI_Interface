import React, { useState } from "react";
import { Home, BarChart, Users, Settings, Menu } from "lucide-react";

const DashboardMenu = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: <Home />, label: "Home" },
    { icon: <BarChart />, label: "Analytics" },
    { icon: <Users />, label: "Users" },
    { icon: <Settings />, label: "Settings" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white h-screen transition-width duration-300 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <span className={`text-lg font-bold ${isOpen ? "block" : "hidden"}`}>
            Dashboard
          </span>
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-gray-400 focus:outline-none"
          >
            <Menu />
          </button>
        </div>

        {/* Sidebar Menu */}
        <ul className="mt-4 space-y-2">
          {menuItems.map((item, index) => (
            <li key={index} className="group">
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-gray-700 focus:outline-none"
                title={isOpen ? "" : item.label}
              >
                <span className="text-gray-400 group-hover:text-white">
                  {item.icon}
                </span>
                <span
                  className={`ml-4 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        <h1 className="text-xl font-semibold">Main Content</h1>
      </div>
    </div>
  );
};

export default DashboardMenu;
