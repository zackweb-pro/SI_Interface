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
import SidebarMenu from "@/components/Menu";

// import react from '@/assets/react.png';
import decodeJWT from "@/components/DecodeJWT";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("offers");
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const { nom, prenom, email, id, role } = decodeJWT(
    localStorage.getItem("authToken")
  ).payload;
  const user = {
    nom: nom,
    prenom: prenom,
    name: nom + " " + prenom,
    email: email,
    picture: nom.substr(0, 2).toUpperCase(),
  };

  const menuItems = [
    { icon: Home, label: "Offers", value: "offers", path: "/offers" },
    {
      icon: BarChart,
      label: "CV",
      value: "update-cv",
      path: "/update-cv",
    },
    {
      icon: FileCheck2,
      label: "Convocation",
      value: "convo",
      path: "/convo",
    },
  ];
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };
  return (
    <SidebarMenu
      role={"Etudiant"}
      user={user}
      items={menuItems}
      onLogout={handleLogout}
      children={<div className="flex flex-col flex-1"> </div>}
    />
  );
};

export default Dashboard;
