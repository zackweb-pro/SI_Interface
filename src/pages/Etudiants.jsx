import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import decodeJWT from "@/components/DecodeJWT";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColumns, setSelectedColumns] = useState([
    "NOM",
    "PRENOM",
    "EMAIL",
    "TELEPHONE",
    "FILIERE",
    "ANNEE_SCOLARITE",
  ]);
  const [pageIndex, setPageIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { id: id_respo } = decodeJWT(localStorage.getItem("authToken")).payload;

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/etudiant/ecole?id_respo=${id_respo}`
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [id_respo]);

  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`http://localhost:3000/api/etudiant/${studentId}`);
      setStudents(students.filter((student) => student.ID !== studentId));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleEdit = (student) => {
    console.log("Edit student", student);
    // Implement edit functionality as per your requirements
  };

  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
    Object.values(student)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const columns = [
    { accessorKey: "NOM", header: "Nom" },
    { accessorKey: "PRENOM", header: "Prénom" },
    { accessorKey: "EMAIL", header: "Email" },
    { accessorKey: "TELEPHONE", header: "Téléphone" },
    { accessorKey: "FILIERE", header: "Filière" },
    { accessorKey: "ANNEE_SCOLARITE", header: "Année Scolarité" },
  ];

  const table = useReactTable({
    data: filteredStudents,
    columns: columns.filter((col) => selectedColumns.includes(col.accessorKey)),
    state: { pagination: { pageIndex, pageSize: itemsPerPage } },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater() : updater;
      setPageIndex(newPagination.pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(filteredStudents.length / itemsPerPage),
  });

  const toggleColumn = (key) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2"
        />
        <DropdownMenu>
          <DropdownMenu.CheckboxGroup>
            {columns.map((col) => (
              <DropdownMenuCheckboxItem
                key={col.accessorKey}
                checked={selectedColumns.includes(col.accessorKey)}
                onCheckedChange={() => toggleColumn(col.accessorKey)}
              >
                {col.header}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenu.CheckboxGroup>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {table
              .getHeaderGroups()
              .map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : header.column.columnDef.header}
                  </TableHead>
                ))
              )}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{cell.renderValue()}</TableCell>
              ))}
              <TableCell className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => handleEdit(row.original)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(row.original.ID)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <div>
          <Button
            disabled={!table.getCanPreviousPage()}
            onClick={table.previousPage}
          >
            Previous
          </Button>
          <Button disabled={!table.getCanNextPage()} onClick={table.nextPage}>
            Next
          </Button>
        </div>
        <div>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
      </div>
    </div>
  );
};

export default StudentTable;
