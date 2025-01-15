import React, { useState } from "react";
import { motion } from "framer-motion";
import ApplyDialog from "@/components/ApplyDialog"; // Ensure the correct path to ApplyDialog
import decodeJWT from "@/components/DecodeJWT";

const Offer = ({ offer }) => {
  const { id } = decodeJWT(localStorage.getItem("authToken")).payload; // Extract student ID
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Manage dialog visibility

  const handleOpenDialog = () => setIsDialogOpen(true); // Open dialog
  const handleCloseDialog = () => setIsDialogOpen(false); // Close dialog

  return (
    <motion.div
      className="relative bg-white shadow-lg rounded-lg min-h-fit transform hover:shadow-2xl"
      style={{ width: "400px", borderRadius: "1rem" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4F46E5] to-[#6366F1] p-5 text-white">
        <h2 className="text-2xl font-bold">{offer.TITRE}</h2>
        <p className="text-sm opacity-90">{offer.ENTREPRISE_NOM}</p>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-[#ECFDF5] text-[#10B981] py-1 px-3 rounded-full">
            {offer.NATURE}
          </span>
          <span className="text-xs bg-[#EFF6FF] text-[#3B82F6] py-1 px-3 rounded-full">
            {offer.DUREE} mois
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 leading-relaxed">
          {offer.DESCRIPTION}
        </p>

        {/* Skills */}
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          Requirements
        </h3>
        <ul className="flex flex-wrap gap-2 mb-4">
          {offer.REQUIREMENTS.split(",")
            .map((item) => item.trim())
            .map((skill) => (
              <li
                key={skill}
                className="text-xs bg-[#F3F4F6] text-[#374151] py-1 px-3 rounded-full"
              >
                {skill}
              </li>
            ))}
        </ul>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <ApplyDialog
            offerId={offer.OFFRE_ID} // Pass offer ID
            studentId={id} // Pass student ID
            onClose={handleCloseDialog} // Pass onClose function
            isOpen={isDialogOpen} // Pass dialog visibility
            handleOpenDialog={handleOpenDialog} // Pass handleOpenDialog function
          />

          <p className="text-sm text-gray-500">{offer.VILLE}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Offer;
