import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Home, FileCheck2, Sidebar, BadgePlus } from "lucide-react";
import SidebarMenu from "@/components/Menu";
import decodeJWT from "@/components/DecodeJWT";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

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

const CreateOffre = () => {
  const { id, nom, prenom, email } = decodeJWT(
    localStorage.getItem("authToken")
  ).payload;
  const [offreData, setOffreData] = useState({
    respo_id: id,
    titre: "",
    nature: "",
    description: "",
    requirements: "",
    status_offre: "",
    duree: "",
    ville: "",
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // console.log(id);

  const user = {
    nom: nom,
    prenom: prenom,
    name: `${nom} ${prenom}`,
    email: email,
    picture: nom.substr(0, 2).toUpperCase(),
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };
  const items = [
    {
      icon: BadgePlus,
      label: "Ajout Offre",
      value: "ajouter-offre",
      path: "/ajouter-offre",
    },
    {
      icon: BarChart,
      label: "Gestion Candidatures",
      value: "candidatures",
      path: "/candidatures",
    },
    {
      icon: FileCheck2,
      label: "Entretiens",
      value: "entretiens",
      path: "/entretiens",
    },
    {
      icon: FileCheck2,
      label: "Stagiaires",
      value: "stagiaire",
      path: "/stagiaires",
    },
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOffreData({ ...offreData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setOffreData({ ...offreData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/entreprise/create-offre",
        {
          ...offreData,
          respo_id: id,
        }
      );

      setToast({
        show: true,
        message: "Offre créée avec succès.",
        type: "success",
      });
      setOffreData({
        respo_id: id,
        titre: "",
        nature: "",
        description: "",
        requirements: "",
        status_offre: "",
        duree: "",
        ville: "",
      });
    } catch (error) {
      console.error(error);
      setToast({
        show: true,
        message: "Une erreur est survenue lors de la création de l'offre.",
        type: "error",
      });
    }
  };

  const closeToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  return (
    <SidebarMenu
      user={user}
      role={"Entreprise"}
      onLogout={handleLogout}
      items={items}
      children={
        <>
          {toast.show && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={closeToast}
            />
          )}
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>Créer une Nouvelle Offre</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <Input
                  name="titre"
                  placeholder="Titre du poste"
                  value={offreData.titre}
                  onChange={handleChange}
                  required
                />
                <Select
                  value={offreData.nature}
                  onValueChange={(value) => handleSelectChange("nature", value)}
                  required
                >
                  <SelectTrigger>
                    {/* Dynamically show the selected value or placeholder */}
                    <span>
                      {offreData.nature || "Nature (Remote ou Présentiel)"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Présentiel">Présentiel</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea
                  name="description"
                  placeholder="Description de l'offre"
                  value={offreData.description}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="requirements"
                  placeholder="Exigences (séparées par des virgules)"
                  value={offreData.requirements}
                  onChange={handleChange}
                  required
                />
                <Select
                  value={offreData.status_offre}
                  onValueChange={(value) =>
                    handleSelectChange("status_offre", value)
                  }
                  required
                >
                  <SelectTrigger>
                    {/* Dynamically show the selected value or placeholder */}
                    <span>{offreData.status_offre || "Status de l'offre"}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ouvert">Ouvert</SelectItem>
                    <SelectItem value="Fermé">Fermé</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  name="duree"
                  placeholder="Durée (en mois)"
                  type="number"
                  value={offreData.duree}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="ville"
                  placeholder="Ville"
                  value={offreData.ville}
                  onChange={handleChange}
                  required
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit">Créer l'offre</Button>
              </CardFooter>
            </form>
          </Card>
        </>
      }
    />
  );
};

export default CreateOffre;
