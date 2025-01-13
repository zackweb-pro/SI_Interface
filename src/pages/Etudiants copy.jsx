// frontend/components/StudentTable.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
const EditStudentDialog = ({ student, onEdit, onClose }) => {
  const [updatedStudent, setUpdatedStudent] = useState(
    student
      ? { ...student }
      : {
          NOM: "",
          PRENOM: "",
          EMAIL: "",
          TELEPHONE: "",
          FILIERE: "",
          ANNEE_SCOLARITE: "",
        }
  );

  useEffect(() => {
    if (student) {
      setUpdatedStudent({ ...student });
    }
  }, [student]);

  const handleChange = (e) => {
    setUpdatedStudent({ ...updatedStudent, [e.target.name]: e.target.value });
  };

  if (!student) return null;

  return (
    <div>
      <Input
        type="text"
        placeholder="Nom"
        name="NOM"
        value={updatedStudent.NOM}
        onChange={handleChange}
        className="mb-2"
      />
      <Input
        type="text"
        placeholder="Prenom"
        name="PRENOM"
        value={updatedStudent.PRENOM}
        onChange={handleChange}
        className="mb-2"
      />
      <Input
        type="email"
        placeholder="Email"
        name="EMAIL"
        value={updatedStudent.EMAIL}
        onChange={handleChange}
        className="mb-2"
      />
      <Input
        type="tel"
        placeholder="Téléphone"
        name="TELEPHONE"
        value={updatedStudent.TELEPHONE}
        onChange={handleChange}
        className="mb-2"
      />
      <Input
        type="text"
        placeholder="Filière"
        name="FILIERE"
        value={updatedStudent.FILIERE}
        onChange={handleChange}
        className="mb-2"
      />
      <Input
        type="text"
        placeholder="Année Scolarité"
        name="ANNEE_SCOLARITE"
        value={updatedStudent.ANNEE_SCOLARITE}
        onChange={handleChange}
        className="mb-2"
      />
      <Button onClick={() => onEdit(updatedStudent)}>Confirm</Button>
      <Button onClick={onClose} variant="outline">
        Cancel
      </Button>
    </div>
  );
};
const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);

  const filteredStudents = students.filter((student) => {
    const searchRegex = new RegExp(searchQuery, "i");
    return (
      searchRegex.test(student.NOM) ||
      searchRegex.test(student.PRENOM) ||
      searchRegex.test(student.EMAIL)
      // Add other fields to search as needed
    );
  });
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
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/etudiant/ecole?id_respo=${id_respo}`
        );
        console.log(response.data);
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
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
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/etudiant/${studentToDelete}`
      );
      setStudents(students.filter((student) => student.ID !== studentToDelete));
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error("Error deleting student:", error);
      // Handle error, show message to user
    }
  };

  const handleEdit = async (updatedStudent) => {
    try {
      await axios.put(
        `http://localhost:3000/api/etudiant/${studentToEdit.ID}`,
        updatedStudent
      );
      setStudents(
        students.map((student) =>
          student.ID === studentToEdit.ID ? updatedStudent : student
        )
      );
      setIsEditDialogOpen(false);
      setStudentToEdit(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SidebarMenu
      user={user}
      role={"Entreprise"}
      onLogout={() => {
        localStorage.removeItem("authToken");
        window.location.href = "/";
      }}
      items={items}
      children={
        <div>
          <Input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 w-full"
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Email</TableHead>
                {/* Add other table headers */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStudents.map((student) => (
                <TableRow key={student[0]}>
                  <TableCell>{student[1]}</TableCell>
                  <TableCell>{student[2]}</TableCell>
                  <TableCell>{student[3]}</TableCell>
                  {/* Add other table cells */}
                  <TableCell className="text-right flex gap-2 justify-end">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setStudentToEdit({
                              ID: student[0],
                              NOM: student[1],
                              PRENOM: student[2],
                              EMAIL: student[3],
                              TELEPHONE: student[5],
                              FILIERE: student[6],
                              ANNEE_SCOLARITE: student[7],
                            })
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Edit Student</AlertDialogTitle>
                        </AlertDialogHeader>
                        <EditStudentDialog
                          student={studentToEdit}
                          onEdit={handleEdit}
                          onClose={() => setStudentToEdit(null)}
                        />
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          onClick={() => setStudentToDelete(student)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this student.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setStudentToDelete(null)}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-4">
            {Array.from({
              length: Math.ceil(filteredStudents.length / itemsPerPage),
            }).map((_, index) => (
              <Button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`mx-1 ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                variant={currentPage === index + 1 ? "default" : "outline"}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      }
    />
  );
};

export default StudentTable;
