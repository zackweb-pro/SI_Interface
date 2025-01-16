import React, { useEffect, useState } from "react";
import Offer from "@/components/Offer";
import SidebarMenu from "@/components/Menu";
import { Home, FileCheck2 } from "lucide-react";
import decodeJWT from "@/components/DecodeJWT";
import { Button } from "@/components/ui/button";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statutEtudiant, setStatutEtudiant] = useState(null); // Store the current state

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

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/offers/${id}`);
        const data = await response.json();
        console.log(data);
        setOffers(data);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch the initial status of `statut_etudiant`
    const fetchStatutEtudiant = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/etudiant/${id}`);
        const data = await response.json();
        setStatutEtudiant(data.statut_etudiant); // Assuming `statut_etudiant` is returned in the response
      } catch (error) {
        console.error("Error fetching student status:", error);
      }
    };

    fetchOffers();
    fetchStatutEtudiant();
  }, [id]);

  const handleChangeState = async () => {
    try {
      const newStatus = statutEtudiant === 0 ? 1 : 0;

      const response = await fetch(`http://localhost:3000/api/etudiant/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statut_etudiant: newStatus,
        }),
      });

      if (response.ok) {
        setStatutEtudiant(newStatus);
        alert("Statut updated successfully!");
      } else {
        console.error("Failed to update statut.");
        alert("Failed to update statut.");
      }
    } catch (error) {
      console.error("Error updating statut:", error);
    }
  };

  return (
    <SidebarMenu
      role={"Etudiant"}
      user={user}
      items={menuItems}
      onLogout={handleLogout}
      children={
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Offers Management
          </h2>
          <Button className="" onClick={handleChangeState}>
            Changer Etat (Current: {statutEtudiant})
          </Button>
        </div>
      }
    />
  );
};

export default Offers;
