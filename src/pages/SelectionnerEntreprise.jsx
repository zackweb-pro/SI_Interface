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

import SidebarMenu from "@/components/Menu";
import React, { useState, useEffect } from "react";
import axios from "axios";
import EntrepriseCard from "@/components/EntrepriseCard";
import decodeJWT from "@/components/DecodeJWT";
import Toast from "@/components/Toast";
import { Card } from "@/components/ui/card";

const SelectEntreprise = () => {
  const [toast, setToast] = useState(null);
  const [entreprises, setEntreprises] = useState([]);
  const [selectedEntreprises, setSelectedEntreprises] = useState(new Set());
  const { id: id_respo } = decodeJWT(localStorage.getItem("authToken")).payload;
  const { nom, prenom, email, role } = decodeJWT(
    localStorage.getItem("authToken")
  ).payload;
  const user = {
    nom: nom,
    prenom: prenom,
    name: nom + " " + prenom,
    email: email,
    picture: nom.substr(0, 2).toUpperCase(),
  };

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

  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/ecole/");
        console.log(response.data);
        setEntreprises(response.data);
      } catch (error) {
        console.error("Error fetching entreprises:", error);
      }
    };

    const fetchSelectedEntreprises = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/ecole/selected/${id_respo}`
        );
        console.log(response.data);

        setSelectedEntreprises(new Set(response.data.map((e) => e[0]))); // Convert to Set
      } catch (error) {
        console.error("Error fetching selected entreprises:", error);
      }
    };

    fetchEntreprises();
    fetchSelectedEntreprises();
  }, [id_respo]);

  const handleSelect = async (id_entreprise) => {
    const isCurrentlySelected = selectedEntreprises.has(id_entreprise);
    try {
      await axios.post("http://localhost:3000/api/ecole/select", {
        id_respo,
        id_entreprise,
        selected: !isCurrentlySelected,
      });
      if (isCurrentlySelected) {
        setSelectedEntreprises(
          new Set(
            Array.from(selectedEntreprises).filter((id) => id !== id_entreprise)
          )
        );
        setToast({
          message: "Entreprise unselected successfully.",
          type: "success",
        });
      } else {
        setSelectedEntreprises(new Set(selectedEntreprises.add(id_entreprise)));
        setToast({
          message: "Entreprise selected successfully.",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error selecting entreprise:", error);
      setToast({
        message: "Failed to select/unselect entreprise.",
        type: "error",
      });
    }
  };

  return (
    <SidebarMenu
      user={user}
      role={"Entreprise"}
      onLogout={() => {
        localStorage.removeItem("authToken");
        window.location.href = "/";
      }}
      items={items}
      children={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {toast && <Toast {...toast} onClose={() => setToast(null)} />}

          {entreprises.map((entreprise) => (
            <EntrepriseCard
              key={entreprise[0]}
              entreprise={entreprise}
              onSelect={handleSelect}
              isSelected={selectedEntreprises.has(entreprise[0])}
            />
          ))}
        </div>
      }
    />
  );
};

export default SelectEntreprise;
