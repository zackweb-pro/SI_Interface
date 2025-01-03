import React, { useState } from "react";
import CV from "react-cv";
import { jsPDF } from "jspdf";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import profile from "../assets/images/profile.png";

export default function UpdateCV() {
  const [personalData, setPersonalData] = useState({
    name: "Zakaria OUMGAHR",
    title: "Senior Software Developer",
    image: profile,
    contacts: [
      { type: "email", value: "zakaria.oumghar1@gmail.com" },
      { type: "phone", value: "+1-0000000000" },
      { type: "location", value: "Berrechid" },
      { type: "website", value: "example.com" },
      { type: "linkedin", value: "linkedin.com/in/zakaria-oumghar-b30b9b1bb/" },
      { type: "github", value: "github.com/zackweb-pro" },
    ],
  });

  const [sections, setSections] = useState([
    {
      type: "text",
      title: "Career Profile",
      content: `Greetings! I'm Zakaria Oumghar, a dedicated software engineering student at ENSIAS. I'm deeply passionate about programming, diving into new technologies, and exploring creativity and art.`,
      icon: "usertie",
    },
  ]);

  const handleAddSection = (type) => {
    const newSection =
      type === "skills"
        ? {
            type: "skills",
            title: "Skills",
            items: [{ name: "Skill Name", level: "Beginner" }],
          }
        : type === "education"
        ? {
            type: "education",
            title: "Education",
            items: [
              {
                institution: "Institution Name",
                description: "Degree/Program Description",
                startDate: "YYYY",
                endDate: "YYYY or Present",
              },
            ],
          }
        : type === "experience"
        ? {
            type: "experience",
            title: "Experience",
            items: [
              {
                role: "Job Title",
                company: "Company Name",
                description: "Responsibilities and Achievements",
                startDate: "YYYY",
                endDate: "YYYY or Present",
              },
            ],
          }
        : {
            type: "hobbies",
            title: "Hobbies",
            items: ["Hobby 1", "Hobby 2"],
          };
    setSections((prev) => [...prev, newSection]);
  };

  const handleUpdateSection = (index, updatedSection) => {
    setSections((prev) =>
      prev.map((sec, i) => (i === index ? updatedSection : sec))
    );
  };

  const handleRemoveSection = (index) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDownloadCV = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(personalData.name, 10, 10);
    doc.setFontSize(14);
    doc.text(personalData.title, 10, 20);
    doc.text("Contacts:", 10, 30);
    personalData.contacts.forEach((contact, idx) =>
      doc.text(`${contact.type}: ${contact.value}`, 10, 40 + idx * 10)
    );
    sections.forEach((section, idx) => {
      doc.addPage();
      doc.text(section.title, 10, 10);
      if (section.type === "text") {
        doc.text(section.content, 10, 20);
      } else {
        section.items.forEach((item, itemIdx) => {
          if (section.type === "skills") {
            doc.text(`${item.name} - ${item.level}`, 10, 20 + itemIdx * 10);
          } else if (
            section.type === "education" ||
            section.type === "experience"
          ) {
            doc.text(
              `${item.institution || item.role} (${item.startDate} - ${
                item.endDate
              })`,
              10,
              20 + itemIdx * 20
            );
            doc.text(item.description, 10, 30 + itemIdx * 20);
          } else if (section.type === "hobbies") {
            doc.text(item, 10, 20 + itemIdx * 10);
          }
        });
      }
    });
    doc.save("CV.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Update Your CV</h1>

      <CV personalData={personalData} sections={sections} branding={false} />

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Manage CV</h2>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <input
                type="text"
                value={personalData.name}
                onChange={(e) =>
                  setPersonalData({ ...personalData, name: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
                placeholder="Name"
              />
              <input
                type="text"
                value={personalData.title}
                onChange={(e) =>
                  setPersonalData({ ...personalData, title: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
                placeholder="Title"
              />
              {personalData.contacts.map((contact, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={contact.type}
                    onChange={(e) => {
                      const updatedContacts = [...personalData.contacts];
                      updatedContacts[index].type = e.target.value;
                      setPersonalData({
                        ...personalData,
                        contacts: updatedContacts,
                      });
                    }}
                    placeholder="Contact Type"
                    className="border p-2 rounded flex-1 mr-2"
                  />
                  <input
                    type="text"
                    value={contact.value}
                    onChange={(e) => {
                      const updatedContacts = [...personalData.contacts];
                      updatedContacts[index].value = e.target.value;
                      setPersonalData({
                        ...personalData,
                        contacts: updatedContacts,
                      });
                    }}
                    placeholder="Contact Value"
                    className="border p-2 rounded flex-1"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {sections.map((section, index) => (
          <Card key={index} className="mt-4">
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {section.type === "text" && (
                <textarea
                  value={section.content}
                  onChange={(e) =>
                    handleUpdateSection(index, {
                      ...section,
                      content: e.target.value,
                    })
                  }
                  className="block w-full border p-2 rounded mb-2"
                ></textarea>
              )}

              {section.type === "skills" &&
                section.items.map((skill, skillIndex) => (
                  <div key={skillIndex} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        const updatedItems = [...section.items];
                        updatedItems[skillIndex].name = e.target.value;
                        handleUpdateSection(index, {
                          ...section,
                          items: updatedItems,
                        });
                      }}
                      placeholder="Skill Name"
                      className="border p-2 rounded mr-2 flex-1"
                    />
                    <input
                      type="text"
                      value={skill.level}
                      onChange={(e) => {
                        const updatedItems = [...section.items];
                        updatedItems[skillIndex].level = e.target.value;
                        handleUpdateSection(index, {
                          ...section,
                          items: updatedItems,
                        });
                      }}
                      placeholder="Skill Level"
                      className="border p-2 rounded flex-1"
                    />
                  </div>
                ))}

              <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                onClick={() => handleRemoveSection(index)}
              >
                Remove Section
              </button>
            </CardContent>
          </Card>
        ))}

        <button
          className="bg-orange-500 text-white px-4 py-2 rounded mt-4"
          onClick={handleDownloadCV}
        >
          Download CV
        </button>
      </div>
    </div>
  );
}
