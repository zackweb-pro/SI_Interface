import React, { useEffect, useState } from "react";
import Demande from "./Demande";
import axios from "axios";
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Demandes</h1>
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
  );
};

export default DemandesPage;
