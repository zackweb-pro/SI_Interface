import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Home, BarChart, FileCheck2 } from "lucide-react";
import SidebarMenu from "@/components/Menu";

import decodeJWT from "@/components/DecodeJWT";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  const { pathname } = useLocation(); // Get the current path
  const { nom, prenom, email } = decodeJWT(
    localStorage.getItem("authToken")
  ).payload;

  const user = {
    nom: nom,
    prenom: prenom,
    name: `${nom} ${prenom}`,
    email: email,
    picture: nom.substr(0, 2).toUpperCase(),
  };
  const items = [
    {
      label: "Statistique",
      path: "/admin-dashboard/stats-admin",
      icon: BarChart,
    },
    { label: "Demandes", path: "/admin-dashboard/demandes", icon: Home },
    { label: "Comptes", path: "/admin-dashboard/comptes", icon: FileCheck2 },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleUserProfile = () => setIsUserProfileOpen(!isUserProfileOpen);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SidebarMenu user={user} onLogout={handleLogout} items={items} />

      {/* Main Content */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="flex-1 bg-gray-100 p-6"
      >
        {/* Use React Router's Outlet to render the content */}
        {/* Example: <Outlet /> */}
      </motion.div>
    </div>
  );
};

export default Dashboard;
