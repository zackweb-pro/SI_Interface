import React, { useState, useRef } from "react";
import { FaEdit, FaDownload } from "react-icons/fa";
import html2pdf from "html2pdf.js";

const CVTemplate = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Miller",
    profileSummary:
      "Experienced Data Analyst with over 5+ years of expertise in SQL, Python, Excel, Power BI, Power BI Service, and more.",
    contact: {
      email: "john.miller@example.com",
      phone: "+91 00 00 00 00 00",
      address: "Hyderabad, India",
    },
    skills: [
      "SQL, SSMS, Power BI, Power BI Service",
      "Python, PySpark, Pandas, Numpy",
      "Microsoft Excel, Word, PowerPoint",
    ],
    experience: [
      {
        position: "Data Analyst",
        company: "XYZ Corporation",
        date: "2018.08 - 2024.05",
        details: [
          "Collected, cleaned, and processed large datasets.",
          "Conducted exploratory data analysis to identify trends.",
          "Created interactive dashboards with Power BI and DAX.",
        ],
      },
    ],
    education: [
      {
        degree: "Master of Computer Application",
        university: "JNTU Kakinada University",
        year: "2012 - 2015",
      },
    ],
  });

  const cvRef = useRef();

  const handleInputChange = (path, value) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const updated = { ...prev };
      let current = updated;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = value;
        } else {
          current = current[key];
        }
      });
      return updated;
    });
  };

  const downloadPDF = () => {
    html2pdf().from(cvRef.current).save("CV.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white w-full max-w-4xl p-8 shadow-lg rounded-lg" ref={cvRef}>
        {/* Header */}
        <div className="text-center mb-6">
          {isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="text-3xl font-bold text-blue-700 w-full text-center border-b focus:outline-none"
            />
          ) : (
            <h1 className="text-3xl font-bold text-blue-700">{formData.name}</h1>
          )}
          <p className="mt-2 text-gray-600">
            {isEditing ? (
              <textarea
                value={formData.profileSummary}
                onChange={(e) => handleInputChange("profileSummary", e.target.value)}
                className="w-full text-center border focus:outline-none"
              />
            ) : (
              formData.profileSummary
            )}
          </p>
        </div>

        {/* Contact */}
        <div className="text-center mb-6">
          {Object.entries(formData.contact).map(([key, value]) => (
            <p key={key} className="text-gray-600">
              {isEditing ? (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleInputChange(`contact.${key}`, e.target.value)}
                  className="border-b focus:outline-none"
                />
              ) : (
                value
              )}
            </p>
          ))}
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Skills</h2>
          <ul className="list-disc ml-6 text-gray-700">
            {formData.skills.map((skill, index) =>
              isEditing ? (
                <li key={index}>
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => {
                      const updatedSkills = [...formData.skills];
                      updatedSkills[index] = e.target.value;
                      handleInputChange("skills", updatedSkills);
                    }}
                    className="border-b focus:outline-none"
                  />
                </li>
              ) : (
                <li key={index}>{skill}</li>
              )
            )}
          </ul>
        </div>

        {/* Experience */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Experience</h2>
          {formData.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <h3 className="font-semibold">{exp.position} - {exp.company}</h3>
              <p className="text-sm text-gray-500">{exp.date}</p>
              <ul className="list-disc ml-6 text-gray-700">
                {exp.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Education</h2>
          {formData.education.map((edu, idx) => (
            <div key={idx}>
              <h3 className="font-semibold">{edu.degree}</h3>
              <p className="text-gray-600">{edu.university}</p>
              <p className="text-sm text-gray-500">{edu.year}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaEdit /> {isEditing ? "Save" : "Edit"}
        </button>
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <FaDownload /> Download
        </button>
      </div>
    </div>
  );
};

export default CVTemplate;
