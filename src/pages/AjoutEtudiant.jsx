import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Users,
  Settings,
  Menu,
  LayoutDashboard,
  FileCheck2,
  BadgePlus,
  Upload,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import decodeJWT from "@/components/DecodeJWT";
import SidebarMenu from "@/components/Menu";
import axios from "axios";

const Toast = ({ message, type, onClose }) => {
  const backgroundColor = type === "success" ? "bg-green-500" : "bg-red-500";
  return (
    <div
      className={`${backgroundColor} text-white px-4 py-2 rounded fixed bottom-4 right-4 shadow-lg flex items-center justify-between`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-sm font-bold bg-transparent border-none cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
};

const Dashboard = () => {
  const [toast, setToast] = useState(null);
  const [isSingleStudent, setIsSingleStudent] = useState(true);
  const [studentData, setStudentData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    filiere: "",
    annee_scolarite: "",
  });
  const { nom, prenom, email, id, role } = decodeJWT(
    localStorage.getItem("authToken")
  ).payload;
  const user = {
    nom,
    prenom,
    name: nom + " " + prenom,
    email,
    picture: nom.substr(0, 2).toUpperCase(),
  };

  const handleInputChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // Hide after 3 seconds
  };

  const addSingleStudent = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/ecole", {
        ...studentData,
        id_respo: id,
      });
      showToast("Student added successfully.", "success");
      setStudentData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        filiere: "",
        annee_scolarite: "",
      });
    } catch (error) {
      showToast(
        error.response?.data?.error || "Failed to add student.",
        "error"
      );
      console.error("Error adding student:", error);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("file", file);
      try {
        for (let pair of formData.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }

        const response = await axios.post(
          `http://localhost:3000/api/ecole/bulk?id_respo=${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        showToast("Students added successfully.", "success");
      } catch (error) {
        showToast(
          error.response?.data?.error || "Failed to add students.",
          "error"
        );
        console.error("Error uploading CSV:", error);
      }
    },
    [id]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const items = [
    {
      icon: BarChart,
      label: "Selectionner Entreprise",
      value: "select-entreprise",
      path: "/select-entreprise",
    },
    {
      icon: BadgePlus,
      label: "Ajout Etudiant(s)",
      value: "ajouter-etudiant",
      path: "/ajouter-etudiant",
    },

    {
      icon: FileCheck2,
      label: "Convention",
      value: "convention-template",
      path: "/convention-template",
    },
    {
      icon: FileCheck2,
      label: "Etudiants",
      value: "etudiants",
      path: "/etudiants",
    },
  ];
  return (
    <SidebarMenu
      user={user}
      role={"Entreprise"}
      onLogout={() => {
        localStorage.removeItem("authToken");
        window.location.href = "/";
      }}
      items={items}
    >
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}{" "}
      {/* Render the toast */}
      <Card className="w-[80%] mx-auto mt-10">
        <CardHeader className="flex justify-between">
          <h2 className="text-lg font-medium">Ajouter Etudiant(s)</h2>
          <Button onClick={() => setIsSingleStudent(!isSingleStudent)}>
            {isSingleStudent ? "Ajouter en bulk" : "Ajouter un seul étudiant"}
          </Button>
        </CardHeader>
        <CardContent>
          {isSingleStudent ? (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={studentData.nom}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    name="prenom"
                    value={studentData.prenom}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={studentData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    value={studentData.telephone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="filiere">Filière</Label>
                  <Input
                    id="filiere"
                    name="filiere"
                    value={studentData.filiere}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="annee_scolarite">Année Scolaire</Label>
                  <Input
                    id="annee_scolarite"
                    name="annee_scolarite"
                    value={studentData.annee_scolarite}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className="border-dashed border-2 border-gray-300 p-10 rounded-md cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-blue-500 font-medium">
                  Déposez le fichier ici...
                </p>
              ) : (
                <p className="text-gray-500 text-center">
                  Glissez-déposez votre fichier CSV ici, ou cliquez pour le
                  sélectionner.
                  <br />
                  Les étudiants seront ajoutés automatiquement.
                </p>
              )}
              <Upload className="mx-auto mt-4 text-gray-500" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={isSingleStudent ? addSingleStudent : null}
            disabled={!isSingleStudent}
          >
            {isSingleStudent ? "Ajouter Etudiant" : "Importer"}
          </Button>
        </CardFooter>
      </Card>
    </SidebarMenu>
  );
};

export default Dashboard;
