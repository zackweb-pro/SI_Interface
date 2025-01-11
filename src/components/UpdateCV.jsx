import React, { useState } from "react";
import CV from "react-cv";
import { jsPDF } from "jspdf";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import profile from "../assets/images/profile.png";
import { Toggle } from "./ui/toggle";
import CVEditor from "./ManageCV";

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

  const [sections, setSections] = useState({
    career: {
      type: "text",
      title: "About Me",
      content:
        "Greetings! I'm Zakaria Oumghar, a dedicated software engineering student at ENSIAS. I'm deeply passionate about programming, diving into new technologies, and exploring creativity and art.",
      icon: "usertie",
    },
    education: {
      type: "common-list",
      title: "Education",
      icon: "graduation",
      items: [
        {
          title:
            "2 years of preparatory classes for engineering schools (CPGE)",
          authority: "CPGE",
          authorityWebSite: "https://www.cpge.ac.ma/",
          rightSide: "2021 - 2023",
        },
        {
          title: "SOFTWARE ENGINEER (SE)",
          authority: "ENSIAS",
          authorityWebSite: "https://www.ensias.um5.ac.ma/",
          rightSide: "2023 - Present",
        },
      ],
    },
    experience: {
      type: "experiences-list",
      title: "Experiences",
      items: [
        {
          title: "Software Developer Intern",
          company: "SOMAP",
          companyWebSite: "https://www.somap.ma/",
          description:
            "Worked on a management system for purchases and personnel.",
          companyMeta: "",
          datesBetween: "2024",
          descriptionTags: ["React", "Node.js", "MySQL"],
        },
      ],
      icon: "archive",
    },
    projects: {
      type: "projects-list",
      title: "Projects",
      description: "Voici quelques projets sur lesquels j'ai travaillé",
      icon: "tasks",
      groups: [
        {
          sectionHeader:
            "application web de gestion des achats et du personnel",
          description: " ",
          items: [
            {
              title: "Lien du projet",
              projectUrl: "https://github.com/zackweb-pro",
              description:
                "j'ai travaillé sur un système de gestion des achats et du personnel",
            },
          ],
        },
      ],
    },
    skills: {
      type: "tag-list",
      title: "Skills Proficiency",
      items: ["React", "Node.js", "JavaScript", "CSS", "SQL"],
      icon: "rocket",
    },
    languages: {
      type: "common-list",
      title: "Languages",
      items: [
        { authority: "English", authorityMeta: "Professional" },
        { authority: "French", authorityMeta: "Fluent" },
        { authority: "Arabic", authorityMeta: "Native" },
      ],
      icon: "language",
    },
  });
  // console.log(sections);
  // console.log(Object.values(sections));
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("CV", 10, 10);
    doc.save("CV.pdf");
  };
  const onsave = () => {};
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your CV</h1>
      <CV
        personalData={personalData}
        sections={Object.values(sections)}
        branding={false}
      />
      <button onClick={generatePDF}>Download PDF</button>

      <CVEditor
        personalData={personalData}
        setPersonalData={setPersonalData}
        sections={sections}
        setSections={setSections}
        onsave={onsave}
      />
    </div>
  );
}
