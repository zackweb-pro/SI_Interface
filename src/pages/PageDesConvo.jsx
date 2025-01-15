import React, { useEffect, useState } from "react";
import axios from "axios";
import ConvocationCard from "@/components/ConvocationLetter";
const ConvocationCd = ({ candidature, onConfirm }) => {
  return (
    <div className="border p-4 rounded shadow-md">
      <h3 className="font-bold text-lg">
        {candidature.etudiant_nom} {candidature.etudiant_prenom}
      </h3>
      <p className="text-sm text-gray-600">
        Email: {candidature.etudiant_email}
      </p>
      <p className="text-sm">Job Title: {candidature.offre_titre}</p>
      <p className="text-sm">Interview Date: {candidature.date_interview}</p>
      <p className="text-sm">Interview Time: {candidature.time_interview}</p>
      <p className="text-sm">Location: {candidature.place}</p>
      <button
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => onConfirm(candidature.candidature_id)}
      >
        Confirm Attendance
      </button>
    </div>
  );
};

const CandidatureList = () => {
  const [candidatures, setCandidatures] = useState([]);

  const fetchCandidatures = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/offers/candidatures/approved"
      );
      setCandidatures(response.data);
    } catch (error) {
      console.error("Error fetching candidatures:", error);
    }
  };

  const confirmAttendance = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/api/offers/candidatures/confirm/${id}`
      );
      alert("Attendance confirmed successfully!");
      fetchCandidatures(); // Refresh the list
    } catch (error) {
      console.error("Error confirming attendance:", error);
      alert("Failed to confirm attendance.");
    }
  };

  useEffect(() => {
    fetchCandidatures();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {candidatures.map((candidature) => (
        <ConvocationCard
          key={candidature.CANDIDATURE_ID}
          candidature={candidature}
          onConfirm={confirmAttendance}
        />
      ))}
    </div>
  );
};

export default CandidatureList;
