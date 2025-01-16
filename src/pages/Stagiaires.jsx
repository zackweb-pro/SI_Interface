import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import {
  BarChart,
  FileCheck2,
  BadgePlus,
} from "lucide-react";

import decodeJWT from "@/components/DecodeJWT";
import SidebarMenu from "@/components/Menu";
import DynamicTable from "@/components/DynamiqueTableStagiaire"; // Assuming DynamicTable is in components

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("stagiaires");
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchStages = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/stages/${id}`); // Update with your API endpoint
      const data = await response.json();
      setStages(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stages:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (stageId) => {
    try {
      await fetch(`http://localhost:3000/api/offers/stages/${stageId}`, {
        method: "DELETE",
      });
      setStages(stages.filter((stage) => stage.id !== stageId));
    } catch (error) {
      console.error("Error deleting stage:", error);
    }
  };

  const handleModify = async (modifiedStage) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/offers/stages/${modifiedStage.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(modifiedStage),
        }
      );
      if (response.ok) {
        setStages((prevStages) =>
          prevStages.map((stage) =>
            stage.id === modifiedStage.id ? modifiedStage : stage
          )
        );
      }
    } catch (error) {
      console.error("Error modifying stage:", error);
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

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
        children={
<div className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Stages</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DynamicTable
            initialData={stages}
            onDelete={handleDelete}
            onModify={handleModify}
          />
        )}
      </div>
        }
      
      />

  );
};

export default Dashboard;
