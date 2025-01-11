import React, { useState, useEffect } from "react";
import axios from "axios";
import Candidature from "./Candidature";

const GestionOffer = ({ offer }) => {
  const [candidatures, setCandidatures] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    titre: offer.titre,
    description: offer.description,
  });

  // Fetch candidatures for the offer
  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/candidatures?offer_id=${offer.id}`
        );
        setCandidatures(response.data.candidatures);
      } catch (error) {
        console.error("Failed to fetch candidatures:", error);
      }
    };

    fetchCandidatures();
  }, [offer.id]);

  // Handle delete offer
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/offers/${offer.id}`);
      alert("Offer deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete offer:", error);
    }
  };

  // Handle save modifications
  const handleSave = async () => {
    try {
      await axios.put(`/api/offers/${offer.id}`, formData);
      alert("Offer updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update offer:", error);
    }
  };

  return (
    <div className="border p-4 rounded shadow-sm">
      {!isEditing ? (
        <>
          <h2 className="text-lg font-bold">{offer.titre}</h2>
          <p className="text-sm text-gray-600">{offer.description}</p>
          <div className="flex space-x-2 mt-2">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setIsEditing(true)}
            >
              Modify
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.titre}
            onChange={(e) =>
              setFormData({ ...formData, titre: e.target.value })
            }
          />
          <textarea
            className="w-full p-2 border rounded"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <h3 className="text-md font-semibold mt-4">Candidatures</h3>
      <div className="space-y-2">
        {candidatures.map((candidature) => (
          <Candidature key={candidature.id} candidature={candidature} />
        ))}
      </div>
    </div>
  );
};

export default GestionOffer;
