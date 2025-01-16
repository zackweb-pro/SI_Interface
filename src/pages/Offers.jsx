import React, { useEffect, useState } from "react";
import Offer from "@/components/Offer";
import SidebarMenu from "@/components/Menu";
import { Home, BarChart, FileCheck2 } from "lucide-react";
import decodeJWT from "@/components/DecodeJWT";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

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
    // { icon: BarChart, label: "CV", value: "update-cv", path: "/update-cv" },
    { icon: FileCheck2, label: "Convocation", value: "convo", path: "/convo" },
    { icon: FileCheck2, label: "changer etat", value: "change-etat", path: "/changer-etat" },
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

    fetchOffers();
  }, [id]);

  return (
    <SidebarMenu
      role={"Etudiant"}
      user={user}
      items={menuItems}
      onLogout={handleLogout}
      children={
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Available Offers
          </h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="flex justify-center gap-4 flex-wrap overflow-y-scroll">
              {offers.map((offer) => (
                <Offer key={offer.OFFRE_ID} offer={offer} />
              ))}
            </div>
          )}
        </div>
      }
    />
  );
};

export default Offers;
