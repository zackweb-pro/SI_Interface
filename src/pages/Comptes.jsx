import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Home, FileCheck2 } from "lucide-react";
import decodeJWT from "../components/DecodeJWT";
import Menu from "../components/Menu";

import ConfirmDialog from "@/components/ui/ConfirmDialog"; // Import the ConfirmDialog component

const Comptes = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState(""); // Filter for "ecole" or "entreprise"
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    userId: null,
    userType: "",
  });
  const { toasts, showToast } = useToast();
  const API_BASE_URL = "http://localhost:3000/api/admins";

  const fetchConfirmedUsers = async () => {
    const response = await axios.get(`${API_BASE_URL}/confirmed-users`);
    return response.data;
  };

  const deleteUser = async (id, type) => {
    await axios.delete(`${API_BASE_URL}/delete-user/${id}/${type}`);
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchConfirmedUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        showToast("Failed to load users.", "error");
      }
    };

    loadUsers();
  }, []);
  const { nom, prenom, email } = decodeJWT(
    localStorage.getItem("authToken")
  ).payload;

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
      label: "Statistique",
      path: "/admin-dashboard/stats-admin",
      icon: BarChart,
    },
    { label: "Demandes", path: "/admin-dashboard/demandes", icon: Home },
    { label: "Comptes", path: "/admin-dashboard/comptes", icon: FileCheck2 },
  ];

  const handleDelete = async () => {
    try {
      await deleteUser(confirmDialog.userId, confirmDialog.userType);
      setUsers((prev) =>
        prev.filter(
          (user) =>
            user.id !== confirmDialog.userId ||
            user.type !== confirmDialog.userType
        )
      );
      showToast("User deleted successfully.", "success");
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast("Failed to delete user.", "error");
    } finally {
      setConfirmDialog({ isOpen: false, userId: null, userType: "" });
    }
  };

  const filteredUsers =
    filter === null ? users : users.filter((user) => user.type === filter);

  return (
    <Menu
      user={user}
      onLogout={handleLogout}
      items={items}
      children={
        <div className="p-6">
          {/* Filter */}
          <div className="flex justify-end mb-4">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder="Type de comptes" // value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    console.log("select value: ", e.target.value);
                  }}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>Tous</SelectItem>
                <SelectItem value="ecole">Responsable Ecole</SelectItem>
                <SelectItem value="entreprise">
                  Responsable Entreprise
                </SelectItem>
              </SelectContent>
            </Select>

            {/* <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="">Tous</option>
            <option value="ecole">Responsable Ecole</option>
            <option value="entreprise">Responsable Entreprise</option>
          </select>*/}
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.nom} {user.prenom}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.telephone}</TableCell>
                  <TableCell>{user.institution}</TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell>
                    <button
                      onClick={() =>
                        setConfirmDialog({
                          isOpen: true,
                          userId: user.id,
                          userType: user.type,
                        })
                      }
                      className="text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Confirmation Dialog */}
          <ConfirmDialog
            isOpen={confirmDialog.isOpen}
            message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
            onConfirm={handleDelete}
            onCancel={() =>
              setConfirmDialog({ isOpen: false, userId: null, userType: "" })
            }
          />

          {/* Toast Notifications */}
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => showToast("", "")}
            />
          ))}
        </div>
      }
    />
  );
};

export default Comptes;
