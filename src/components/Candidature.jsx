import React from "react";

const Candidature = ({ candidature }) => {
  return (
    <div className="border p-2 rounded shadow-sm">
      <h4 className="text-sm font-bold">{candidature.studentName}</h4>
      <p className="text-xs text-gray-600">{candidature.email}</p>
      <div className="flex space-x-2 mt-2">
        {candidature.cv && (
          <a
            href={candidature.cv}
            target="_blank"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            View CV
          </a>
        )}
        {candidature.motivationLetter && (
          <a
            href={candidature.motivationLetter}
            target="_blank"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            View Letter
          </a>
        )}
      </div>
    </div>
  );
};

export default Candidature;
