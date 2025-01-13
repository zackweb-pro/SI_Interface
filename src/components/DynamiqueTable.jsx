import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";

const DynamicTable = ({ initialData, onDelete, onModify }) => {
  const [data, setData] = useState(initialData); // Use initialData prop
  const [visibleData, setVisibleData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [columns, setColumns] = useState([
    "nom",
    "prenom",
    "email",
    "telephone",
    "filiere",
    "annee_scolarite",
    "motdepasse",
    "statut_etudiant",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false);
  const [modifyUser, setModifyUser] = useState(null);

  useEffect(() => {
    let filteredData = [...data]; // Important: Create a copy of the data
    console.log("Data:", data);
    if (statusFilter !== "") {
      filteredData = filteredData.filter(
        (item) => item.statut_etudiant === (statusFilter === "Stage" ? 1 : 0)
      );
    }

    if (searchQuery) {
      filteredData = filteredData.filter((item) =>
        columns.some((column) =>
          item[column]
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }

    setVisibleData(
      filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    );
  }, [data, itemsPerPage, currentPage, statusFilter, searchQuery, columns]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (e) =>
    setItemsPerPage(Number(e.target.value));
  const handleColumnToggle = (column) =>
    setColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );

  const openDeleteDialog = (userId) => {
    setDeleteUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteUserId(null);
  };

  const openModifyDialog = (user) => {
    setModifyUser({ ...user }); // Create a copy here too
    setIsModifyDialogOpen(true);
  };

  const closeModifyDialog = () => {
    setIsModifyDialogOpen(false);
    setModifyUser(null);
  };

  const handleDelete = () => {
    if (deleteUserId !== null) {
      onDelete(deleteUserId);
      setData(data.filter((item) => item.id !== deleteUserId)); // Update data state
    }
    closeDeleteDialog();
  };

  const handleModify = () => {
    if (modifyUser) {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === modifyUser.id ? { ...modifyUser } : item
        )
      );
      onModify(modifyUser);
    }
    closeModifyDialog();
  };

  return (
    <div className="p-4">
      {/* Filters and Actions */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div>
          <label className="mr-2">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All</option>
            <option value="Stage">Stage</option>
            <option value="Pas Encore">Pas Encore</option>
          </select>
        </div>

        <div>
          <label className="mr-2">Search:</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded"
            placeholder="Search..."
          />
        </div>

        <div>
          <label className="mr-2">Items per Page:</label>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border p-2 rounded"
          >
            {[5, 10, 15].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Column Visibility */}
      <div className="mb-4">
        <label className="mr-2">Toggle Columns:</label>
        {[
          "nom",
          "prenom",
          "email",
          "telephone",
          "filiere",
          "annee_scolarite",
          "motdepasse",
          "statut_etudiant",
        ].map((column) => (
          <label key={column} className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              checked={columns.includes(column)}
              onChange={() => handleColumnToggle(column)}
              className="mr-1"
            />
            {column}
          </label>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <tr>
              {columns.includes("nom") && <th className="p-3 border">Nom</th>}
              {columns.includes("prenom") && (
                <th className="p-3 border">Prenom</th>
              )}
              {columns.includes("email") && (
                <th className="p-3 border">Email</th>
              )}
              {columns.includes("telephone") && (
                <th className="p-3 border">Telephone</th>
              )}
              {columns.includes("filiere") && (
                <th className="p-3 border">Filiere</th>
              )}
              {columns.includes("annee_scolarite") && (
                <th className="p-3 border">Annee Scolarite</th>
              )}
              {columns.includes("motdepasse") && (
                <th className="p-3 border">Mot de Passe</th>
              )}
              {columns.includes("statut_etudiant") && (
                <th className="p-3 border">Status</th>
              )}

              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleData.map((item, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-100 ${
                  index % 2 === 0 ? "bg-gray-50" : ""
                }`}
              >
                {columns.includes("nom") && (
                  <td className="p-3 border">{item.nom}</td>
                )}
                {columns.includes("prenom") && (
                  <td className="p-3 border">{item.prenom}</td>
                )}

                {columns.includes("email") && (
                  <td className="p-3 border">{item.email}</td>
                )}
                {columns.includes("telephone") && (
                  <td className="p-3 border">{item.telephone}</td>
                )}
                {columns.includes("filiere") && (
                  <td className="p-3 border">{item.filiere}</td>
                )}
                {columns.includes("annee_scolarite") && (
                  <td className="p-3 border">{item.annee_scolarite}</td>
                )}
                {columns.includes("motdepasse") && (
                  <td className="p-3 border">{item.motdepasse}</td>
                )}

                {columns.includes("statut_etudiant") && (
                  <td className="p-3 border">
                    {item.statut_etudiant === 1 ? "Stage" : "Pas Encore"}
                  </td>
                )}
                <td className="p-3 border">
                  <button
                    onClick={() => openModifyDialog(item)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Modify
                  </button>
                  <button
                    onClick={() => openDeleteDialog(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        {Array.from(
          { length: Math.ceil(data.length / itemsPerPage) },
          (_, i) => i + 1
        ).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 mx-1 rounded ${
              currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Delete Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-xl mb-4">
              Are you sure you want to delete this user?
            </h3>
            <div>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Confirm
              </button>
              <button
                onClick={closeDeleteDialog}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modify Dialog */}
      {isModifyDialogOpen && modifyUser && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 min-w-96 rounded shadow-lg">
            <h3 className="text-xl mb-4">Modify User</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleModify(modifyUser);
              }}
            >
              <div className="mb-4">
                <label className="block">Nom</label>
                <input
                  type="text"
                  value={modifyUser.nom}
                  onChange={(e) =>
                    setModifyUser({ ...modifyUser, nom: e.target.value })
                  }
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block">Prénom</label>
                <input
                  type="text"
                  value={modifyUser.prenom}
                  onChange={(e) =>
                    setModifyUser({ ...modifyUser, prenom: e.target.value })
                  }
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block">Telephone</label>
                <input
                  type="text"
                  value={modifyUser.telephone}
                  onChange={(e) =>
                    setModifyUser({ ...modifyUser, telephone: e.target.value })
                  }
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block">Filiere</label>
                <input
                  type="text"
                  value={modifyUser.filiere}
                  onChange={(e) =>
                    setModifyUser({ ...modifyUser, filiere: e.target.value })
                  }
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block">Annee Scolarite</label>
                <input
                  type="text"
                  value={modifyUser.annee_scolarite}
                  onChange={(e) =>
                    setModifyUser({
                      ...modifyUser,
                      annee_scolarite: e.target.value,
                    })
                  }
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block">Mot de Passe</label>
                <input
                  type="text"
                  value={modifyUser.motdepasse}
                  onChange={(e) =>
                    setModifyUser({ ...modifyUser, motdepasse: e.target.value })
                  }
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block">Email</label>
                <input
                  type="email"
                  value={modifyUser.email}
                  onChange={(e) =>
                    setModifyUser({ ...modifyUser, email: e.target.value })
                  }
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block">Status</label>
                <select
                  value={modifyUser.statut_etudiant}
                  onChange={(e) =>
                    setModifyUser({
                      ...modifyUser,
                      statut_etudiant: e.target.value,
                    })
                  }
                  className="border p-2 w-full"
                >
                  <option value={1}>Stage</option>
                  <option value={0}>Pas Encore</option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Confirm
                </button>
                <button
                  onClick={closeModifyDialog}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;
