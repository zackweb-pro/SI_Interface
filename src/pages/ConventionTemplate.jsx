import React, { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
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

import decodeJWT from "@/components/DecodeJWT";
import SidebarMenu from "@/components/Menu";

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
      icon: BarChart,
      label: "Selectionner Entreprise",
      value: "select-entreprise",
      path: "/select-entreprise",
    },
    {
      icon: BadgePlus,
      label: "Ajout Etudiant(s)",
      value: "ajouter-etudiant",
      path: "/ajouter-etudiant",
    },

    {
      icon: FileCheck2,
      label: "Convention",
      value: "convention-template",
      path: "/convention-template",
    },
    {
      icon: FileCheck2,
      label: "Etudiants",
      value: "etudiants",
      path: "/etudiants",
    },
  ];
  return (
    <SidebarMenu
      user={user}
      role={"Ecole"}
      onLogout={() => {
        localStorage.removeItem("authToken");
        window.location.href = "/";
      }}
      items={items}
      children={
        <Textarea
          placeholder="Ecrire la convention en remplaceant nom d'etudiant par NOM_ETUDIANT et nom d'entreprise par NOM_ENTREPRISE..."
        />

      }
    />
  );
};

export default Dashboard;
