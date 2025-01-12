import React from "react";
import ConvocationCard from "@/components/ConvocationLetter";
import decodeJWT from "@/components/DecodeJWT";
import { Home, BarChart, FileCheck2 } from "lucide-react";
import SidebarMenu from "@/components/Menu";

const App = () => {
  const interviewDetails = {
    candidateName: "Doha",
    interviewDate: "January 10, 2025",
    interviewTime: "10:00 AM",
    interviewLocation: "Oracle Rabat 123 rue ba2 chi haja",
    jobTitle: "Software Developer Intern",

    postedAt: "December 30, 2024",
  };
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
        <div
          className=" flex items-center justify-center"
          style={{ flexWrap: "wrap", gap: "1rem" }}
        >
          <ConvocationCard details={interviewDetails} />
          <ConvocationCard details={interviewDetails} />
          <ConvocationCard details={interviewDetails} />
          <ConvocationCard details={interviewDetails} />
        </div>
      }
    />
  );
};

export default App;
