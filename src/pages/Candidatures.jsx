import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, FileCheck2, BadgePlus } from "lucide-react";
import decodeJWT from "@/components/DecodeJWT";
import Menu from "@/components/Menu";
import GestionOffer from "@/components/GestionOffer";

const Candidatures = () => {
  const {
    nom,
    prenom,
    email,
    id: respo_id,
  } = decodeJWT(localStorage.getItem("authToken")).payload;

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

  const [offers, setOffers] = useState([]);

  // Fetch offers created by the current respo
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`/api/offers?respo_id=${respo_id}`);
        setOffers(response.data.offers);
      } catch (error) {
        console.error("Failed to fetch offers:", error);
      }
    };

    fetchOffers();
  }, [respo_id]);

  return (
    <Menu user={user} onLogout={handleLogout} role={"Entreprise"} items={items}>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Gestion des Candidatures</h1>
        <div className="space-y-4">
          {offers.map((offer) => (
            <GestionOffer key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </Menu>
  );
};

export default Candidatures;
