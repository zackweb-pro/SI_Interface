import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  BarChart,
  Users,
  Settings,
  Menu,
  LayoutDashboard,
  FileCheck2,
  LogOut,
} from "lucide-react";

import profile from "@/assets/images/profile.png";
import Demandes from "@/components/Demandes";
import StatsAdmin from "@/components/StatsAdmin";
import Comptes from "@/components/Comptes";
import decodeJWT from "@/components/DecodeJWT";

// import react from '@/assets/react.png';

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("stats-admin");
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const { nom, prenom, email, id, role } = decodeJWT(
    localStorage.getItem("authToken")
  ).payload;
  console.log(nom, prenom, email, id, role);
  const user = {
    name: nom + " " + prenom,
    email: email,
    picture: nom.substr(0, 2).toUpperCase(),
  };
  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleUserProfile = () => setIsUserProfileOpen(!isUserProfileOpen);

  const menuItems = [
    { icon: <BarChart />, label: "Statistique", value: "stats-admin" },
    { icon: <Home />, label: "Demandes", value: "demandes" },
    { icon: <FileCheck2 />, label: "Comptes", value: "comptes" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={` sidebar-menu bg-white text-gray-700 h-screen transition-all duration-300 ${
          isOpen ? "w-72" : "w-16"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <button
            onClick={toggleSidebar}
            className="text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <LayoutDashboard />
          </button>
        </div>

        {/* Sidebar Menu */}
        <ul className="mt-4 space-y-2">
          {menuItems.map((item) => (
            <li key={item.value} className="group">
              <button
                onClick={() => setActiveSection(item.value)}
                className={`flex items-center w-full px-4 py-2 transition-all ${
                  activeSection === item.value
                    ? "bg-violet-50 text-blue-500 border-r-2 border-blue-500"
                    : "hover:bg-blue-50 text-gray-900"
                }`}
              >
                <span
                  className={`group-hover:text-blue ${
                    activeSection === item.value
                      ? "text-blue-500"
                      : "text-gray-900"
                  }`}
                >
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

        {/* User Profile */}
        <div
          className={`absolute bottom-0 px-4 py-4 border-t border-gray-700 duration-300 transition-width ${
            isOpen ? "w-72" : "w-16"
          }`}
        >
          <button
            onClick={toggleUserProfile}
            className="flex items-center space-x-2 text-gray-400 hover:text-white"
          >
            {user.picture && (
              <div
                alt={user.name}
                className="w-8 h-8 rounded-full bg-slate-300 text-black text-center flex items-center justify-center"
              >
                {user.picture}
              </div>
            )}
            <span
              className={`transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              {user.name}
              <br />
              <span className="text-sm">{user.email}</span>
            </span>
          </button>

          {isUserProfileOpen && (
            <div className=" edit-profile-div absolute bottom-14 right-4 bg-gray-800 text-white p-4 border border-gray-700">
              <ul>
                <li
                  onClick={() => {
                    localStorage.removeItem("authToken");
                    window.location.href = "/";
                  }}
                >
                  <LogOut style={{ cursor: "pointer" }}></LogOut>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="flex-1 bg-gray-100 p-6"
      >
        {activeSection === "stats-admin" && <StatsAdmin />}

        {activeSection === "demandes" && <Demandes />}
        {activeSection === "comptes" && <Comptes />}
      </motion.div>
    </div>
  );
};

export default Dashboard;
