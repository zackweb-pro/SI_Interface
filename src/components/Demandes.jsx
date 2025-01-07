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
        setDemandes(response.data);
      } catch (error) {
        console.error("Error fetching demandes:", error);
      }
    };

    fetchDemandes();
  }, []);

  const handleConfirm = async (demandeId) => {
    try {
      await axios.post(`/api/demandes/confirm/${demandeId}`);
      // Refresh demandes after confirmation
      setDemandes((prev) => prev.filter((d) => d.id !== demandeId));
    } catch (error) {
      console.error("Error confirming demande:", error);
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
          />
        ))}
      </div>
    </div>
  );
};

export default DemandesPage;
