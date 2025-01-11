import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentEspace from "@/pages/StudentEspace";
import Offers from "./components/Offers";
import UpdateCV from "./components/UpdateCV";
import Sign from "./pages/Sign";
import RECDashboard from "./pages/RECDashboard";
import RENDashboard from "./pages/RENDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StatsAdmin from "./pages/StatsAdmin";
import Demandes from "./components/Demandes";
import Comptes from "./components/Comptes";

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
    </Routes>
  );
};

export default App;
