import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarMenu from "@/components/Menu";
import { Home, FileCheck2 } from "lucide-react";
import decodeJWT from "@/components/DecodeJWT";

// Component for displaying individual convocation details
const ConvocationCard = ({ candidature, onConfirm }) => {
  return (
    <div className="border p-4 rounded shadow-md">
      <h3 className="font-bold text-lg">
        {candidature.ETUDIANT_NOM} {candidature.ETUDIANT_PRENOM}
      </h3>
      <p className="text-sm text-gray-600">POSTE OU TITRE: {candidature.OFFRE_TITRE}</p>
      {/* <p className="text-sm">Job Title: {candidature.offre_titre}</p> */}
      <p className="text-sm">Interview Date: {candidature.DATE_INTERVIEW}</p>
      <p className="text-sm">Interview Time: {candidature.TIME_INTERVIEW}</p>
      <p className="text-sm">Location: {candidature.PLACE}</p>
      <button
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => onConfirm(candidature.CANDIDATURE_ID)}
      >
        Confirm Attendance
      </button>
    </div>
  );
};

// Component to fetch and display all approved candidatures
const CandidatureList = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidatures = async () => {
    try {
  const { nom, prenom, email, id } = decodeJWT(
    localStorage.getItem("authToken")
  ).payload;

      const response = await axios.get(
        `http://localhost:3000/api/offers/candidatures/approved/${id}`
      );
      console.log("Candidatures:", response.data);
      setCandidatures(response.data);
    } catch (error) {
      console.error("Error fetching candidatures:", error);
      alert("Failed to fetch candidatures.");
    } finally {
      setLoading(false);
    }
  };

  const confirmAttendance = async (id) => {
    try {
  
      await axios.put(
        `http://localhost:3000/api/offers/candidatures/confirm/${id}`
      );
      alert("Attendance confirmed successfully!");
      fetchCandidatures(); // Refresh the list
    } catch (error) {
      console.error("Error confirming attendance:", error);
      alert("Failed to confirm attendance.");
    }
  };

  useEffect(() => {
    fetchCandidatures();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {candidatures.map((candidature) => (
        <ConvocationCard
          key={candidature.CANDIDATURE_ID}
          candidature={candidature}
          onConfirm={confirmAttendance}
        />
      ))}
    </div>
  );
};

// Main Offers component
const Offers = () => {
  const { nom, prenom, email, id } = decodeJWT(
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
    { icon: FileCheck2, label: "Convocation", value: "convo", path: "/convo" },
    { icon: FileCheck2, label: "Changer Etat", value: "change-etat", path: "/changer-etat" },
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
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Approved Candidatures</h2>
      <CandidatureList />
    </SidebarMenu>
  );
};

export default Offers;
