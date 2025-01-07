import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentEspace from "@/pages/StudentEspace";
import Offers from "./components/Offers";
import UpdateCV from "./components/UpdateCV";
import Sign from "./pages/Sign";
import RECDashboard from "./pages/RECDashboard";
import RENDashboard from "./pages/RENDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  return (
    <Routes>
      {/* Dashboard route */}
      <Route path="/" element={<Sign />} />

      <Route path="/student-espace" element={<StudentEspace />} />

      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/respo-ecole-dashboard" element={<RECDashboard />} />
      <Route path="/respo-entreprise-dashboard" element={<RENDashboard />} />
    </Routes>
  );
};

export default App;
