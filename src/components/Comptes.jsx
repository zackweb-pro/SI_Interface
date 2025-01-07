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
    filter === "" ? users : users.filter((user) => user.type === filter);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Comptes Confirmés</h1>

      {/* Filter */}
      <div className="flex justify-end mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="">Tous</option>
          <option value="ecole">Responsable Ecole</option>
          <option value="entreprise">Responsable Entreprise</option>
        </select>
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
  );
};

export default Comptes;
