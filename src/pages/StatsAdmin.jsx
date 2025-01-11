import React from "react";
import Statistiques from "../components/ChartsAdmin";
import decodeJWT from "../components/DecodeJWT";
import SidebarMenu from "../components/Menu";
import {
  BarChart,
  Home,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
const App = () => {
  const studentData = {
    monthlyInternships: [10, 15, 20, 25, 30, 35],
  };

  const enterpriseData = {
    names: ["Google", "Microsoft", "Amazon", "Facebook", "Apple"],
    internshipCounts: [50, 30, 20, 10, 5],
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
    <div className="min-h-screen bg-gray-100">
      <SidebarMenu
        user={user}
        onLogout={handleLogout}
        items={items}
        children={
          <Statistiques
            studentData={studentData}
            enterpriseData={enterpriseData}
          />
        }
      />
    </div>
  );
};

export default App;
