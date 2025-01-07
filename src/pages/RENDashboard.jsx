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
} from "lucide-react";

import Offers from "@/components/Offers";
import UpdateCV from "@/components/UpdateCV";
import profile from "@/assets/images/profile.png";
import PageDesConvo from "@/components/PageDesConvo";
import decodeJWT from "@/components/DecodeJWT";

// import react from '@/assets/react.png';

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("ajouter-offre");
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const { nom, prenom, email, id, role } = decodeJWT(
    localStorage.getItem("authToken")
  ).payload;
  const user = {
    name: nom + " " + prenom,
    email: email,
    picture: nom.substr(0, 2).toUpperCase(),
  };
  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleUserProfile = () => setIsUserProfileOpen(!isUserProfileOpen);

  const menuItems = [
    { icon: <Home />, label: "Ajout Offre", value: "ajouter-offre" },
    { icon: <BarChart />, label: "Gestion Candidature", value: "candidature" },
    { icon: <FileCheck2 />, label: "Entretien", value: "entretien" },
    { icon: <FileCheck2 />, label: "Stagaires", value: "stagaire" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={` sidebar-menu bg-gray-900 text-white h-screen transition-all duration-300 ${
          isOpen ? "w-72" : "w-16"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-gray-400 focus:outline-none"
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
                className={`flex items-center w-full px-4 py-2 rounded-lg transition-all ${
                  activeSection === item.value
                    ? "bg-gray-800 text-white"
                    : "hover:bg-gray-700 text-gray-400"
                }`}
              >
                <span
                  className={`group-hover:text-white ${
                    activeSection === item.value
                      ? "text-white"
                      : "text-gray-400"
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
        {activeSection === "offers" && <Offers />}
        {activeSection === "update-cv" && <UpdateCV />}
        {activeSection === "convo" && <PageDesConvo />}
      </motion.div>
    </div>
  );
};

export default Dashboard;
