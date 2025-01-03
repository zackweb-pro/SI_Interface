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

  const [sections, setSections] = useState([
    {
      type: "text",
      title: "Career Profile",
      content: `Greetings! I'm Zakaria Oumghar, a dedicated software engineering student at ENSIAS. I'm deeply passionate about programming, diving into new technologies, and exploring creativity and art.`,
      icon: "usertie",
    },
    {
      type: "common-list",
      title: "Education",
      items: [
        {
          title: "Software Engineering",
          authority: "ENSIAS, Rabat",
          rightSide: "2021 - Present",
        },
        {
          title: "High School Diploma",
          authority: "Berrechid High School",
          rightSide: "2020",
        },
      ],
      icon: "graduation",
    },
    {
      type: "experiences-list",
      title: "Experiences",
      items: [
        {
          title: "Software Developer Intern",
          company: "SOMAP",
          description:
            "Worked on a management system for purchases and personnel.",
          datesBetween: "2024",
          descriptionTags: ["React", "Node.js", "MySQL"],
        },
      ],
      icon: "archive",
    },
    {
      type: "tag-list",
      title: "Skills Proficiency",
      items: ["React", "Node.js", "JavaScript", "CSS", "SQL"],
      icon: "rocket",
    },
    {
      type: "common-list",
      title: "Languages",
      items: [
        { authority: "English", authorityMeta: "Professional" },
        { authority: "French", authorityMeta: "Fluent" },
        { authority: "Arabic", authorityMeta: "Native" },
      ],
      icon: "language",
    },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your CV</h1>
      <CV personalData={personalData} sections={sections} branding={false} />
      <CVEditor
        personalData={personalData}
        setPersonalData={setPersonalData}
        sections={sections}
        setSections={setSections}
      />
    </div>
  );
}
