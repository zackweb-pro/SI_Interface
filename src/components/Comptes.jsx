import React from "react";
import { motion } from "framer-motion";

const Offer = ({ offer }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-white shadow-lg rounded-lg overflow-hidden transform  hover:shadow-2xl "
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4F46E5] to-[#6366F1] p-5 text-white">
        <h2 className="text-2xl font-bold">{offer.title}</h2>
        <p className="text-sm opacity-90">{offer.organization}</p>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-[#ECFDF5] text-[#10B981] py-1 px-3 rounded-full">
            {offer.type}
          </span>
          {offer.remote && (
            <span className="text-xs bg-[#EFF6FF] text-[#3B82F6] py-1 px-3 rounded-full">
              Remote
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 leading-relaxed">
          {offer.description}
        </p>

        {/* Skills */}
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          Requirements
        </h3>
        <ul className="flex flex-wrap gap-2 mb-4">
          {offer.skills.map((skill) => (
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
          <button className="relative group bg-[#4F46E5] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#4338CA] duration-300">
            Apply Now
            <span className="absolute inset-0 bg-[#8B5CF6] rounded-lg opacity-0 group-hover:opacity-20  duration-300"></span>
          </button>
          <p className="text-sm text-gray-500">{offer.postedAt}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Offer;
