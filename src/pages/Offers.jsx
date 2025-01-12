import React from "react";
import Offer from "@/components/Offer";
import SidebarMenu from "@/components/Menu";
import { Home, BarChart, FileCheck2 } from "lucide-react";
import decodeJWT from "@/components/DecodeJWT";
const Offers = () => {
  const offers = [
    {
      id: 1,
      title: "Software Engineer ",
      organization: "Oracle",
      type: "Full-time",
      remote: true,
      description: "Develop scalable software solutions...",
      skills: ["JavaScript", "React", "Node.js"],
      postedAt: "2 days ago",
    },
    {
      id: 2,
      title: "Data Scientist",
      organization: "Orange Maroc",
      type: "Part-time",
      remote: false,
      description: "Analyze complex data sets...",
      skills: ["Python", "Machine Learning", "Statistics"],
      postedAt: "1 week ago",
    },
    {
      id: 3,
      title: "Data Scientist",
      organization: "Orange Maroc",
      type: "Part-time",
      remote: false,
      description: "Analyze complex data sets...",
      skills: ["Python", "Machine Learning", "Statistics"],
      postedAt: "1 week ago",
    },
    {
      id: 3,
      title: "Data Scientist",
      organization: "Orange Maroc",
      type: "Part-time",
      remote: false,
      description: "Analyze complex data sets...",
      skills: ["Python", "Machine Learning", "Statistics"],
      postedAt: "1 week ago",
    },
    {
      id: 3,
      title: "Data Scientist",
      organization: "Orange Maroc",
      type: "Part-time",
      remote: false,
      description: "Analyze complex data sets...",
      skills: ["Python", "Machine Learning", "Statistics"],
      postedAt: "1 week ago",
    },
    {
      id: 3,
      title: "Data Scientist",
      organization: "Orange Maroc",
      type: "Part-time",
      remote: false,
      description: "Analyze complex data sets...",
      skills: ["Python", "Machine Learning", "Statistics"],
      postedAt: "1 week ago",
    },
    // Add more offers...
  ];

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

  const menuItems = [
    { icon: Home, label: "Offers", value: "offers", path: "/offers" },
    {
      icon: BarChart,
      label: "CV",
      value: "update-cv",
      path: "/update-cv",
    },
    {
      icon: FileCheck2,
      label: "Convocation",
      value: "convo",
      path: "/convo",
    },
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
      children={
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Available Offers
          </h2>
          <div className=" flex justify-center gap-4 flex-wrap overflow-y-scroll">
            {offers.map((offer) => (
              <Offer key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      }
    />
  );
};

export default Offers;
