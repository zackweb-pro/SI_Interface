import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Offers from "./components/Offers";
import UpdateCV from "./components/UpdateCV";
import Sign from "./pages/Sign";

const App = () => {
  return (
    <Routes>
      {/* Dashboard route */}
      <Route path="/" element={<Sign />} />

      <Route path="/dashboard" element={<Dashboard />} />

      {/* Routes inside the Dashboard */}
      <Route path="/offers" element={<Offers />} />
      <Route path="/update-cv" element={<UpdateCV />} />
    </Routes>
  );
};

export default App;
