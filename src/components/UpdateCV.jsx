import React, { useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";

const EditableField = ({
  type = "text",
  value,
  onChange,
  isEditing,
  className,
}) =>
  isEditing ? (
    type === "textarea" ? (
      <textarea
        value={value}
        onChange={onChange}
        className={`border focus:outline-none ${className}`}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`border-b focus:outline-none ${className}`}
      />
    )
  ) : (
    <span>{value}</span>
  );

const CVTemplate = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    jobTitle: "Software Engineer",
    aboutMe: "Passionate about developing innovative software solutions.",
    skills: ["JavaScript", "React", "Node.js"],
    languages: ["English", "Spanish"],
    experience: [
      {
        company: "Tech Corp",
        position: "Frontend Developer",
        period: "2020 - Present",
        description: "Developed and maintained user-facing applications.",
      },
    ],
    education: [
      {
        institution: "University of Technology",
        degree: "BSc in Computer Science",
        period: "2016 - 2020",
        description: "Specialized in software development and algorithms.",
      },
    ],
  });

  const handleInputChange = (path, value) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const updated = { ...prev };
      let current = updated;
      keys.forEach((key, idx) => {
        if (idx === keys.length - 1) {
          current[key] = value;
        } else {
          current = current[key];
        }
      });
      return updated;
    });
  };

  const updateArray = (path, item, action) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const updated = { ...prev };
      let current = updated;
      keys.forEach((key, idx) => {
        if (idx === keys.length - 1) {
          if (action === "add") current[key].push(item);
          if (action === "remove") current[key].splice(item, 1);
        } else current = current[key];
      });
      return updated;
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isEditing ? "Save" : "Edit"}
      </button>

      <div className="text-center mb-6">
        <EditableField
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          isEditing={isEditing}
          className="text-3xl font-bold"
        />
        <EditableField
          value={formData.jobTitle}
          onChange={(e) => handleInputChange("jobTitle", e.target.value)}
          isEditing={isEditing}
          className="text-xl text-gray-600"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-blue-700">About Me</h2>
        <EditableField
          type="textarea"
          value={formData.aboutMe}
          onChange={(e) => handleInputChange("aboutMe", e.target.value)}
          isEditing={isEditing}
          className="w-full mt-2"
        />
      </div>

      {["skills", "languages"].map((section) => (
        <div key={section} className="mb-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </h2>
          <ul className="list-disc ml-6 text-gray-700">
            {formData[section].map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <EditableField
                  value={item}
                  onChange={(e) =>
                    handleInputChange(`${section}[${index}]`, e.target.value)
                  }
                  isEditing={isEditing}
                />
                {isEditing && (
                  <button
                    onClick={() => updateArray(section, index, "remove")}
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
              onClick={() => updateArray(section, "New Item", "add")}
              className="flex items-center gap-2 text-blue-600 mt-2"
            >
              <FaPlus /> Add{" "}
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          )}
        </div>
      ))}

      {["experience", "education"].map((section) => (
        <div key={section} className="mb-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </h2>
          {formData[section].map((item, index) => (
            <div key={index} className="border-b pb-4 mb-4">
              <EditableField
                value={item.company || item.institution}
                onChange={(e) =>
                  handleInputChange(
                    `${section}[${index}].${
                      item.company ? "company" : "institution"
                    }`,
                    e.target.value
                  )
                }
                isEditing={isEditing}
                className="font-semibold"
              />
              <EditableField
                value={item.position || item.degree}
                onChange={(e) =>
                  handleInputChange(
                    `${section}[${index}].${
                      item.position ? "position" : "degree"
                    }`,
                    e.target.value
                  )
                }
                isEditing={isEditing}
              />
              <EditableField
                value={item.period}
                onChange={(e) =>
                  handleInputChange(
                    `${section}[${index}].period`,
                    e.target.value
                  )
                }
                isEditing={isEditing}
              />
              <EditableField
                type="textarea"
                value={item.description}
                onChange={(e) =>
                  handleInputChange(
                    `${section}[${index}].description`,
                    e.target.value
                  )
                }
                isEditing={isEditing}
              />
              {isEditing && (
                <button
                  onClick={() => updateArray(section, index, "remove")}
                  className="text-red-500 mt-2"
                >
                  <FaTrash /> Remove{" "}
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={() =>
                updateArray(
                  section,
                  {
                    company: "",
                    position: "",
                    period: "",
                    description: "",
                  },
                  "add"
                )
              }
              className="flex items-center gap-2 text-blue-600"
            >
              <FaPlus /> Add{" "}
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CVTemplate;
