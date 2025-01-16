import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentEspace from "@/pages/StudentEspace";
import Offers from "./pages/Offers";
import UpdateCV from "./pages/UpdateCV";
import Sign from "./pages/Sign";
import RECDashboard from "./pages/RECDashboard";
import RENDashboard from "./pages/RENDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StatsAdmin from "./pages/StatsAdmin";
import Demandes from "./pages/Demandes";
import Comptes from "./pages/Comptes";
import AjoutOffre from "./pages/AjoutOffre";
import Candidatures from "./pages/Candidatures";
import Entretiens from "./pages/Entretiens";
import Convocation from "./pages/PageDesConvo";
import AjoutEtudiant from "./pages/AjoutEtudiant";
import ConventionTemplate from "./pages/ConventionTemplate";
import ChangerEtat from "./pages/ChangerEtat";
import Etudiants from "./pages/Etudiants";
import SelectionnerEntreprise from "./pages/SelectionnerEntreprise";
import Stagiaire from "./pages/Stagiaires";

const App = () => {
  return (
    <Routes>
      {/* Dashboard route */}
      <Route path="/" element={<Sign />} />

      <Route path="/student-espace" element={<StudentEspace />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/respo-ecole-dashboard" element={<RECDashboard />} />
      <Route path="/respo-entreprise-dashboard" element={<RENDashboard />} />
      <Route path="/admin-dashboard/stats-admin" element={<StatsAdmin />} />
      <Route path="/admin-dashboard/demandes" element={<Demandes />} />
      <Route path="/admin-dashboard/comptes" element={<Comptes />} />

      <Route path="/ajouter-offre" element={<AjoutOffre />} />
      <Route path="/candidatures" element={<Candidatures />} />
      <Route path="/entretiens" element={<Entretiens />} />

      <Route path="/offers" element={<Offers />} />
      <Route path="/update-cv" element={<UpdateCV />} />
      <Route path="/convo" element={<Convocation />} />
      <Route path="/stagiaires" element={<Stagiaire />} />
      {/* Add more routes here... */}
      <Route path="/ajouter-etudiant" element={<AjoutEtudiant />} />
      <Route path="/convention-template" element={<ConventionTemplate />} />
      <Route path="/etudiants" element={<Etudiants />} />
      <Route path="/select-entreprise" element={<SelectionnerEntreprise />} />
    {/* { icon: FileCheck2, label: "changer etat", value: "change-etat", path: "/changer-etat" }, */}
    <Route path="/changer-etat" element={<ChangerEtat/>} />
      <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
  );
};

export default App;
