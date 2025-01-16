import React, { useEffect, useState } from "react";
import axios from "axios";
import Menu from "@/components/Menu";
import decodeJWT from "@/components/DecodeJWT";
import { BadgePlus, BarChart, FileCheck2 } from "lucide-react";

const InterviewCard = ({ candidature, onSelect }) => {
  return (
    <div className="border p-4 rounded shadow-md">
      <h3 className="font-bold text-lg">
        {candidature.ETUDIANT_PRENOM} {candidature.ETUDIANT_NOM}
      </h3>
      <p className="text-sm text-gray-600">Position: {candidature.OFFRE_TITRE}</p>
      <p className="text-sm">Interview Date: {candidature.DATE_INTERVIEW}</p>
      <p className="text-sm">Interview Time: {candidature.TIME_INTERVIEW}</p>
      <p className="text-sm">Location: {candidature.PLACE}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => onSelect(candidature.ID_OFFRE, candidature.ID_ETUDIANT)}
      >
        Hire
      </button>
    </div>
  );
};

const ApprovedCandidatureList = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidatures = async () => {
    try {
      const { id } = decodeJWT(localStorage.getItem("authToken")).payload;
      const response = await axios.get(`http://localhost:3000/api/offers/interviews/${id}`);
      console.log("interviews:", response.data);
      setCandidatures(response.data);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      alert("Failed to fetch interviews.");
    } finally {
      setLoading(false);
    }
  };
  const handleSelect = async (id_offre, id_etudiant) => {
    try {
      const startDate = prompt("Enter the starting date (YYYY-MM-DD):");
      const endDate = prompt("Enter the ending date (YYYY-MM-DD):");
  
      if (!startDate || !endDate) {
        alert("Both start and end dates are required.");
        return;
      }
  
      // Pass parameters in the URL
      await axios.post(
        `http://localhost:3000/api/offers/stages/${id_offre}/${id_etudiant}/${startDate}/${endDate}`
      );
  
      alert("Student hired successfully!");
      fetchCandidatures(); // Refresh the list
    } catch (error) {
      console.error("Error hiring student:", error);
      alert("Failed to hire student.");
    }
  };
  

  useEffect(() => {
    fetchCandidatures();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (candidatures.length === 0) {
    return <div>No approved and confirmed interviews found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {candidatures.map((candidature) => (
        <InterviewCard
          key={candidature.candidature_id}
          candidature={candidature}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
};

const Entretiens = () => {
  const { nom, prenom, email } = decodeJWT(localStorage.getItem("authToken")).payload;

  const user = {
    nom,
    prenom,
    name: `${nom} ${prenom}`,
    email,
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
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Approved and Confirmed Candidatures</h2>
        <ApprovedCandidatureList />
      </div>
    </Menu>
  );
};

export default Entretiens;
