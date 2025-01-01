import React, { useState, useRef } from "react";
import { FaEdit, FaDownload, FaPlus, FaTrash } from "react-icons/fa";
import html2pdf from "html2pdf.js";

const EditableInput = ({ value, onChange, isEditing, className }) =>
  isEditing ? (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className={`border-b focus:outline-none ${className}`}
    />
  ) : (
    <span>{value}</span>
  );

const EditableTextarea = ({ value, onChange, isEditing, className }) =>
  isEditing ? (
    <textarea
      value={value}
      onChange={onChange}
      className={`border focus:outline-none ${className}`}
    />
  ) : (
    <p>{value}</p>
  );

const CVTemplate = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Zakaria OUMGHAR",
    profileSummary:
      "Aspiring software engineer with expertise in React, Node.js, SQL, and a passion for innovation.",
    contact: {
      email: "zakaria.oumghar@example.com",
      phone: "+212 600 000 000",
      address: "Rabat, Morocco",
    },
    picture: "https://via.placeholder.com/150", // Placeholder for profile picture
    skills: ["React", "Node.js", "SQL"],
    experience: [
      {
        position: "Software Engineer Intern",
        company: "TechCorp",
        date: "2024 - Present",
        details: ["Developed web applications", "Collaborated on APIs"],
      },
    ],
    education: [
      {
        degree: "Bachelor of Software Engineering",
        university: "ENSIAS",
        year: "2020 - 2024",
      },
    ],
    languages: ["English", "French", "Arabic"],
    hobbies: ["Coding", "Reading", "Hiking"],
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

  const addNewItem = (path, item) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const updated = { ...prev };
      let current = updated;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key].push(item);
        } else {
          current = current[key];
        }
      });
      return updated;
    });
  };

  const removeItem = (path, index) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const updated = { ...prev };
      let current = updated;
      keys.forEach((key, idx) => {
        if (idx === keys.length - 1) {
          current[key].splice(index, 1);
        } else {
          current = current[key];
        }
      });
      return updated;
    });
  };

  const downloadPDF = () => {
    html2pdf().from(cvRef.current).save("Zakaria_OUMGHAR_CV.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div
        className="bg-white w-full max-w-4xl p-8 shadow-lg rounded-lg"
        ref={cvRef}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <img
            src={formData.picture}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto mb-4"
          />
          <EditableInput
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            isEditing={isEditing}
            className="text-3xl font-bold text-blue-700 w-full text-center"
          />
          <EditableTextarea
            value={formData.profileSummary}
            onChange={(e) =>
              handleInputChange("profileSummary", e.target.value)
            }
            isEditing={isEditing}
            className="mt-2 text-gray-600"
          />
        </div>

        {/* Contact */}
        <div className="text-center mb-6">
          {Object.entries(formData.contact).map(([key, value]) => (
            <EditableInput
              key={key}
              value={value}
              onChange={(e) =>
                handleInputChange(`contact.${key}`, e.target.value)
              }
              isEditing={isEditing}
              className="text-gray-600"
            />
          ))}
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Skills</h2>
          <ul className="list-disc ml-6 text-gray-700">
            {formData.skills.map((skill, index) => (
              <li key={index} className="flex items-center gap-2">
                <EditableInput
                  value={skill}
                  onChange={(e) => {
                    const updatedSkills = [...formData.skills];
                    updatedSkills[index] = e.target.value;
                    handleInputChange("skills", updatedSkills);
                  }}
                  isEditing={isEditing}
                />
                {isEditing && (
                  <button
                    onClick={() => removeItem("skills", index)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {isEditing && (
            <button
              onClick={() => addNewItem("skills", "New Skill")}
              className="flex items-center gap-2 text-blue-600 mt-2"
            >
              <FaPlus /> Add Skill
            </button>
          )}
        </div>

        {/* Experience */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">
            Experience
          </h2>
          {formData.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <EditableInput
                value={exp.position}
                onChange={(e) =>
                  handleInputChange(
                    `experience[${idx}].position`,
                    e.target.value
                  )
                }
                isEditing={isEditing}
              />
              <EditableInput
                value={exp.company}
                onChange={(e) =>
                  handleInputChange(
                    `experience[${idx}].company`,
                    e.target.value
                  )
                }
                isEditing={isEditing}
              />
              <EditableInput
                value={exp.date}
                onChange={(e) =>
                  handleInputChange(`experience[${idx}].date`, e.target.value)
                }
                isEditing={isEditing}
              />
              <ul className="list-disc ml-6 text-gray-700">
                {exp.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <EditableInput
                      value={detail}
                      onChange={(e) => {
                        const updatedDetails = [...exp.details];
                        updatedDetails[i] = e.target.value;
                        handleInputChange(
                          `experience[${idx}].details`,
                          updatedDetails
                        );
                      }}
                      isEditing={isEditing}
                    />
                    {isEditing && (
                      <button
                        onClick={() =>
                          removeItem(`experience[${idx}].details`, i)
                        }
                        className="text-red-500"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {isEditing && (
                <button
                  onClick={() =>
                    addNewItem(`experience[${idx}].details`, "New Detail")
                  }
                  className="flex items-center gap-2 text-blue-600 mt-2"
                >
                  <FaPlus /> Add Detail
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={() =>
                addNewItem("experience", {
                  position: "New Position",
                  company: "New Company",
                  date: "New Date",
                  details: ["New Detail"],
                })
              }
              className="flex items-center gap-2 text-blue-600 mt-2"
            >
              <FaPlus /> Add Experience
            </button>
          )}
        </div>

        {/* Education
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Education</h2>
          {formData */}
        {/* Languages */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">
            Languages
          </h2>
          <ul className="list-disc ml-6 text-gray-700">
            {formData.languages.map((lang, index) => (
              <li key={index} className="flex items-center gap-2">
                <EditableInput
                  value={lang}
                  onChange={(e) => {
                    const updatedLanguages = [...formData.languages];
                    updatedLanguages[index] = e.target.value;
                    handleInputChange("languages", updatedLanguages);
                  }}
                  isEditing={isEditing}
                />
                {isEditing && (
                  <button
                    onClick={() => removeItem("languages", index)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {isEditing && (
            <button
              onClick={() => addNewItem("languages", "New Language")}
              className="flex items-center gap-2 text-blue-600 mt-2"
            >
              <FaPlus /> Add Language
            </button>
          )}
        </div>

        {/* Hobbies */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Hobbies</h2>
          <ul className="list-disc ml-6 text-gray-700">
            {formData.hobbies.map((hobby, index) => (
              <li key={index} className="flex items-center gap-2">
                <EditableInput
                  value={hobby}
                  onChange={(e) => {
                    const updatedHobbies = [...formData.hobbies];
                    updatedHobbies[index] = e.target.value;
                    handleInputChange("hobbies", updatedHobbies);
                  }}
                  isEditing={isEditing}
                />
                {isEditing && (
                  <button
                    onClick={() => removeItem("hobbies", index)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {isEditing && (
            <button
              onClick={() => addNewItem("hobbies", "New Hobby")}
              className="flex items-center gap-2 text-blue-600 mt-2"
            >
              <FaPlus /> Add Hobby
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="flex items-center gap-2 text-blue-600"
          >
            <FaEdit /> {isEditing ? "Save" : "Edit"}
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 text-blue-600"
          >
            <FaDownload /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};
export default CVTemplate;
