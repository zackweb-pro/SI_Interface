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
    name: "",
    title: "",
    image: null,
    contacts: [{ type: "", value: "" }],
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
      content: "",
      icon: "plus",
    },
    education: {
      type: "common-list",
      title: "Education",
      icon: "graduation",
      items: [
        {
          title: "",
          authority: "",
          authorityWebSite: "",
          rightSide: "",
        },
      ],
    },
    experiences: {
      type: "experiences-list",
      title: "Experiences",
      icon: "archive",
      items: [
        {
          title: "",
          company: "",
          datesBetween: "",
          description: "",
          descriptionTags: "",
        },
      ],
    },
    projects: {
      type: "projects-list",
      title: "Projects",
      description: "Voici quelques projets sur lesquels j'ai travaillé",
      icon: "tasks",
      groups: [
        {
          sectionHeader: "",
          description: "",
          items: [
            {
              title: "",
              projectUrl: "",
              description: "",
            },
          ],
        },
      ],
    },
    skills: {
      type: "tag-list",
      title: "Skills Proficiency",
      icon: "rocket",
      items: [],
    },
    languanges: {
      type: "common-list",
      title: "Languages",
      items: [{ authority: "", authorityMeta: "" }],
      icon: "language",
    },
    loisirs: {
      type: "tag-list",
      title: "Hobbies",
      items: [],
      icon: "heart",
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
    const userId = id; // Assuming user_id is stored in localStorage
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
      const userId = id;
      try {
        const response = await fetch(`http://localhost:3000/api/cv/${userId}`);
        if (response.ok) {
          const data = await response.json();
          console.log("response", data);

          // Ensure aboutMe is a string, especially if it's coming as a CLOB from the backend
          const aboutMeContent = data.personalData.aboutMe || ""; // Default to empty string if undefined

          setPersonalData({ ...data.personalData, aboutMe: aboutMeContent });
          setSections(data.sections);

          setSections({
            ...sections,
            career: {
              ...sections.career,
              content: String(personalData.aboutMe), // Ensure content is a string
            },
            projects: {
              ...sections.projects,
              groups: sections.projects.groups.map((group) => ({
                ...group,
                items: group.items.map((item) => ({
                  ...item,
                  description: String(item.description), // Ensure description is a string
                })),
              })),
            },
          });
        }
      } catch (error) {
        console.error("Error fetching CV:", error);
      }
    };

    fetchCV();
  }, [id]);

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
