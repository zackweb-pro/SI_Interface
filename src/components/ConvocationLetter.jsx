import React from "react";
import { motion } from "framer-motion";

const ConvocationCard = ({ details }) => {
  const {
    candidateName,
    interviewDate,
    interviewTime,
    interviewLocation,
    jobTitle,
    additionalNotes,
    postedAt,
  } = details;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-white shadow-lg rounded-lg overflow-hidden transform hover:shadow-2xl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#E1372F] to-[#FF6B6B] p-5 text-white">
        <h2 className="text-2xl font-bold">Interview Invitation</h2>
        <p className="text-sm opacity-90">HR Department</p>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Candidate Details */}
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Candidate: {candidateName}
        </h3>

        {/* Interview Details */}
        <div className="bg-[#F9FAFB] p-4 rounded-lg shadow-md mb-4">
          <p className="text-gray-800">
            <strong>Job Title:</strong> {jobTitle}
          </p>
          <p className="text-gray-800">
            <strong>Date:</strong> {interviewDate}
          </p>
          <p className="text-gray-800">
            <strong>Time:</strong> {interviewTime}
          </p>
          <p className="text-gray-800">
            <strong>Location:</strong> {interviewLocation}
          </p>
        </div>

        {/* Additional Notes */}
        {additionalNotes && (
          <div className="bg-[#FFF8E5] p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-md font-semibold text-[#FF6B6B] mb-2">
              Additional Notes
            </h3>
            <p className="text-gray-600">{additionalNotes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center">
          <button className="relative group bg-[#E1372F] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#B53029] duration-300">
            Confirm Attendance
            <span className="absolute inset-0 bg-[#FF6B6B] rounded-lg opacity-0 group-hover:opacity-20 duration-300"></span>
          </button>
          <p className="text-xs text-gray-500">Posted: {postedAt}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ConvocationCard;
