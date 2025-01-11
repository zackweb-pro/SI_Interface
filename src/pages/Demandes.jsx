import React, { useEffect, useState } from "react";
import Demande from "../components/Demande";
import axios from "axios";
import { BarChart, Home, FileCheck2, Menu, Sidebar } from "lucide-react";
import SidebarMenu from "../components/Menu";
import decodeJWT from "../components/DecodeJWT";

const DemandesPage = () => {
  const [demandes, setDemandes] = useState([]);

  useEffect(() => {
    // Fetch non-confirmed users from the backend
    const fetchDemandes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admins/demandes"
        );
        console.log("Demandes:", response.data);
        setDemandes(response.data);
      } catch (error) {
        console.error("Error fetching demandes:", error);
      }
    };

    fetchDemandes();
  }, []);

  const handleConfirm = async (id, type) => {
    console.log("Confirming demande:", id, type);
    try {
      await axios.post(
        `http://localhost:3000/api/admins/confirm-demande/${id}/${type}`
      );
      setDemandes((prev) => prev.filter((d) => d.id !== id || d.type !== type));
    } catch (error) {
      console.error("Error confirming demande:", error);
    }
  };
  const handleRemove = async (id, type) => {
    console.log("Removing demande:", id, type);
    try {
      await axios.delete(
        `http://localhost:3000/api/admins/remove-demande/${id}/${type}`
      );
      // Remove the demande from the state
      setDemandes((prev) => prev.filter((d) => d.id !== id || d.type !== type));
    } catch (error) {
      console.error("Error removing demande:", error);
    }
  };

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
      label: "Statistique",
      path: "/admin-dashboard/stats-admin",
      icon: BarChart,
    },
    { label: "Demandes", path: "/admin-dashboard/demandes", icon: Home },
    { label: "Comptes", path: "/admin-dashboard/comptes", icon: FileCheck2 },
  ];
  return (
    <SidebarMenu
      user={user}
      onLogout={handleLogout}
      items={items}
      children={
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {demandes.map((demande) => (
              <Demande
                key={demande.id}
                demande={demande}
                onConfirm={handleConfirm}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>
      }
    />
  );
};

export default DemandesPage;
