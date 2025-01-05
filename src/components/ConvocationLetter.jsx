import React from "react";

const ConvocationLetter = ({
  studentName,
  interviewDate,
  interviewTime,
  interviewLocation,
  jobTitle,
  additionalNotes,
}) => {
  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-xl mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Convocation Letter</h1>
        <p className="text-gray-600 mt-2">From the HR Department</p>
      </div>
      <div className="mt-6">
        <p className="text-gray-800">
          Dear <span className="font-semibold">{studentName}</span>,
        </p>
        <p className="mt-4 text-gray-600 leading-6">
          We are pleased to invite you to attend an interview for the position
          of <span className="font-semibold">{jobTitle}</span>. This is a great
          opportunity to showcase your skills and learn more about the role.
        </p>
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Interview Details:
          </h2>
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
        {additionalNotes && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Additional Notes:
            </h2>
            <p className="text-gray-600">{additionalNotes}</p>
          </div>
        )}
        <p className="mt-6 text-gray-600">
          Please arrive at least 15 minutes early and bring a copy of your
          updated resume along with any relevant documents.
        </p>
        <p className="mt-6 text-gray-800">
          We look forward to meeting you and wish you the best of luck!
        </p>
        <p className="mt-6 text-gray-800">
          Best regards,
          <br />
          <span className="font-semibold">The HR Team</span>
        </p>
      </div>
    </div>
  );
};

export default ConvocationLetter;
