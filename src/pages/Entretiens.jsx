import React, { useEffect, useState } from "react";
import Demande from "../components/Demande";
import axios from "axios";
import { BarChart, Home, FileCheck2, Sidebar, BadgePlus } from "lucide-react";
import decodeJWT from "@/components/DecodeJWT";

import Menu from "@/components/Menu";

const Entretiens = () => {
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
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };
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
      value: "stagiaire",
      path: "/stagiaires",
    },
  ];
  return (
    <Menu
      user={user}
      role={"Entreprise"}
      onLogout={handleLogout}
      items={items}
      children={<div className="p-6"></div>}
    />
  );
};

export default Entretiens;
