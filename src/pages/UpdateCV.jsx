import React, { useState } from "react";
import CV from "react-cv";
import { jsPDF } from "jspdf";

import profile from "../assets/images/profile.png";
import CVEditor from "../components/ManageCV";
import { useEffect } from "react";
import {
  Home,
  BarChart,
  FileCheck2,
  Download,
  MailWarningIcon,
} from "lucide-react";
import SidebarMenu from "@/components/Menu";
import { Button } from "@/components/ui/button";
// import react from '@/assets/react.png';
import decodeJWT from "@/components/DecodeJWT";
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
  const { nom, prenom, email, id, role } = decodeJWT(
    localStorage.getItem("authToken")
  ).payload;
  const user = {
    nom: nom,
    prenom: prenom,
    name: nom + " " + prenom,
    email: email,
    picture: nom.substr(0, 2).toUpperCase(),
  };

  const menuItems = [
    { icon: Home, label: "Offers", value: "offers", path: "/offers" },
    {
      icon: BarChart,
      label: "CV",
      value: "update-cv",
      path: "/update-cv",
    },
    {
      icon: FileCheck2,
      label: "Convocation",
      value: "convo",
      path: "/convo",
    },
  ];
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

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
  const onsave = async () => {
    const userId = localStorage.getItem("user_id"); // Assuming user_id is stored in localStorage
    const data = { personalData, sections, userId };

    try {
      const response = await fetch("http://localhost:3000/api/cv", {
        method: "POST", // Or "PUT" if updating
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("CV saved successfully!");
      } else {
        alert("Failed to save CV!");
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      alert("An error occurred!");
    }
  };
  useEffect(() => {
    // Fetch CV data on component mount
    const fetchCV = async () => {
      const userId = localStorage.getItem("user_id");
      try {
        const response = await fetch(`http://localhost:5000/api/cv/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setPersonalData(data.personalData);
          setSections(data.sections);
        }
      } catch (error) {
        console.error("Error fetching CV:", error);
      }
    };

    fetchCV();
  }, []);
  return (
    <SidebarMenu
      role={"Etudiant"}
      user={user}
      items={menuItems}
      onLogout={handleLogout}
      children={
        <div className="p-6">
          <CV
            personalData={personalData}
            sections={Object.values(sections)}
            branding={false}
          />
          <Button
            onClick={generatePDF}
            style={{ display: "flex", margin: "auto" }}
          >
            <Download></Download>
            Download PDF
          </Button>

          <CVEditor
            personalData={personalData}
            setPersonalData={setPersonalData}
            sections={sections}
            setSections={setSections}
            onsave={onsave}
          />
        </div>
      }
    />
  );
}
