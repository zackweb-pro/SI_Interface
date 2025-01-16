import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Home,
  BarChart,
  Users,
  Settings,
  Menu,
  LayoutDashboard,
  FileCheck2,
  BadgePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import decodeJWT from "@/components/DecodeJWT";
import SidebarMenu from "@/components/Menu";
import { Edit, Trash2 } from "lucide-react";
import DynamicTable from "@/components/DynamiqueTable";

const StudentTable = () => {
  let data;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    nom,
    prenom,
    email,
    role,
    id: id_respo,
  } = decodeJWT(localStorage.getItem("authToken")).payload;
  const user = {
    nom: nom,
    prenom: prenom,
    name: nom + " " + prenom,
    email: email,
    picture: nom.substr(0, 2).toUpperCase(),
  };
  const fetchStudents = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(
        `http://localhost:3000/api/etudiant/ecole?id_respo=${id_respo}`
      );
      const data = response.data.map((item) => ({
        id: item[0],
        nom: item[1],
        prenom: item[2],
        email: item[3],
        telephone: item[5],
        motdepasse: item[4],
        filiere: item[6],
        annee_scolarite: item[7],
        statut_etudiant: item[10],
      }));
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      // Consider setting an error state here as well
    } finally {
      setLoading(false); // Set loading to false after fetching (success or error)
    }
  };
  useEffect(() => {
    fetchStudents();
  }, [id_respo]);

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

  const handleDelete = async (studentId) => {
    try {
      console.log(studentId);
      // Make DELETE request to the API using the student's ID
      await axios.delete(
        `http://localhost:3000/api/etudiant/${studentId}`,
        studentId
      );
      fetchStudents();

      // Update the state to remove the deleted student
    } catch (error) {
      console.error("Error deleting student:", error);
      // Handle error, show message to the user
    }
  };

  const handleEdit = async (updatedStudent) => {
    try {
      console.log(updatedStudent);
      // Make PUT request to the API using the student's ID and updated data
      await axios.put(
        `http://localhost:3000/api/etudiant/${updatedStudent.ID}`,
        updatedStudent
      );
      fetchStudents();

      // Update the state with the modified student data
    } catch (error) {
      console.error("Error editing student:", error);
      // Handle error, show message to the user
    }
  };

  return (
    <SidebarMenu
      user={user}
      role={"Ecole"}
      onLogout={() => {
        localStorage.removeItem("authToken");
        window.location.href = "/";
      }}
      items={items}
      children={
        loading ? ( // Conditional rendering
          <p>Loading students...</p> // Or a loading spinner
        ) : students.length > 0 ? (
          <DynamicTable
            initialData={students}
            onDelete={handleDelete}
            onModify={handleEdit}
          />
        ) : (
          <p>No students found.</p>
        )
      }
    />
  );
};

export default StudentTable;
