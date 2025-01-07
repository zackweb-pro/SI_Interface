import React from "react";
import { motion } from "framer-motion";

const Demande = ({ demande, onConfirm, onRemove }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-white shadow-lg rounded-lg overflow-hidden transform hover:shadow-2xl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F97316] to-[#FB923C] p-5 text-white">
        <h2 className="text-xl font-bold">
          {demande.nom} {demande.prenom}
        </h2>
        <p className="text-sm opacity-90">{demande.email}</p>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Institution Details */}
        <div className="mb-3">
          <h3 className="text-md font-semibold text-gray-800">Institution</h3>
          <p className="text-gray-600">
            <span className="font-bold">{demande.institution.nom}</span> -{" "}
            {demande.type === "ecole" ? "Ecole" : "Entreprise"}
          </p>
          <p className="text-gray-600 text-sm">
            <strong> Contact:</strong> {demande.institution.contact_email} |{" "}
            {demande.institution.contact_telephone}
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 leading-relaxed">
          Requested to be responsible for the {demande.type}.
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <button
            className="relative group bg-[#16A34A] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#15803D] duration-300"
            onClick={() => onConfirm(demande.id, demande.type)}
          >
            Confirm
            <span className="absolute inset-0 bg-[#22C55E] rounded-lg opacity-0 group-hover:opacity-20 duration-300"></span>
          </button>
          <button
            className="relative group bg-[#f52d2d] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#af3131] duration-300"
            onClick={() => onRemove(demande.id, demande.type)}
          >
            supprimer
            <span className="absolute inset-0 bg-[#22C55E] rounded-lg opacity-0 group-hover:opacity-20 duration-300"></span>
          </button>
          {/* <p className="text-sm text-gray-500">
            Created at: {demande.createdAt}
          </p> */}
        </div>
      </div>
    </motion.div>
  );
};

export default Demande;
