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
  BadgePlus,
} from "lucide-react";

import Offers from "@/components/Offers";
import UpdateCV from "@/components/UpdateCV";
import profile from "@/assets/images/profile.png";
import PageDesConvo from "@/components/PageDesConvo";
import decodeJWT from "@/components/DecodeJWT";
import SidebarMenu from "@/components/Menu";
import AjoutOffre from "./AjoutOffre";

// import react from '@/assets/react.png';

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("ajouter-offre");
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
  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleUserProfile = () => setIsUserProfileOpen(!isUserProfileOpen);
  const items = [
    {
      icon: BadgePlus,
      label: "Ajout Offre",
      value: "ajouter-offre",
      path: "/ajouter-offre",
    },
    {
      icon: BarChart,
      label: "Gestion Candidatures",
      value: "candidatures",
      path: "/candidatures",
    },
    {
      icon: FileCheck2,
      label: "Entretiens",
      value: "entretiens",
      path: "/entretiens",
    },
    {
      icon: FileCheck2,
      label: "Stagiaires",
      value: "stagiaires",
      path: "/stagiaires",
    },
  ];
  return (
    <SidebarMenu
      user={user}
      role={"Entreprise"}
      onLogout={() => {
        localStorage.removeItem("authToken");
        window.location.href = "/";
      }}
      items={items}
    />
  );
};

export default Dashboard;
