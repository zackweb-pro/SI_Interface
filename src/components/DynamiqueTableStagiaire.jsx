import React, { useState, useEffect } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";
import decodeJWT from "@/components/DecodeJWT";
const DynamicTable = ({ initialData, onDelete, onModify }) => {
  const [data, setData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [columns, setColumns] = useState([
    "student_name",
    "student_email",
    "offer_title",
    "offer_description",
    "offer_date",
    "student_starting_date",
    "student_ending_date",
    "status",
  ]);
  const {id} = decodeJWT(localStorage.getItem("authToken")).payload;
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter the data based on the search query and selected columns
    const filteredData = data.filter((item) =>
      columns.some((column) =>
        item[column]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  
    // Paginate the filtered data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
  
    setVisibleData(filteredData.slice(startIndex, endIndex));
  }, [data, searchQuery, currentPage, itemsPerPage, columns]);
  
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/offers/stages/${id}`); // Update to your API endpoint
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch stages:", error);
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (e) =>
    setItemsPerPage(Number(e.target.value));
  const handleColumnToggle = (column) =>
    setColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <label className="mr-3">Search:</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-64"
            placeholder="Search by any column..."
          />
        </div>
        <div>
          <label className="mr-3">Items per Page:</label>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border p-2 rounded"
          >
            {[5, 10, 15, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <span className="mr-3 font-bold">Toggle Columns:</span>
        {[
          "student_name",
          "student_email",
          "offer_title",
          "offer_description",
          "offer_date",
          "student_starting_date",
          "student_ending_date",
          "status",
        ].map((column) => (
          <label key={column} className="mr-4">
            <input
              type="checkbox"
              checked={columns.includes(column)}
              onChange={() => handleColumnToggle(column)}
              className="mr-1"
            />
            {column.replace(/_/g, " ").toUpperCase()}
          </label>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-blue-600 text-white">
            <tr>
              {columns.includes("student_name") && <th className="p-3 border">Student Name</th>}
              {columns.includes("student_email") && <th className="p-3 border">Student Email</th>}
              {columns.includes("offer_title") && <th className="p-3 border">Offer Title</th>}
              {columns.includes("offer_description") && (
                <th className="p-3 border">Offer Description</th>
              )}
              {columns.includes("offer_date") && <th className="p-3 border">Offer Date</th>}
              {columns.includes("student_starting_date") && (
                <th className="p-3 border">Student Starting Date</th>
              )}
              {columns.includes("student_ending_date") && (
                <th className="p-3 border">Student Ending Date</th>
              )}
              {columns.includes("status") && <th className="p-3 border">Status</th>}
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-100 ${
                  index % 2 === 0 ? "bg-gray-50" : ""
                }`}
              >
                {columns.includes("student_name") && <td className="p-3 border">{item.STUDENT_NAME}</td>}
                {columns.includes("student_email") && <td className="p-3 border">{item.STUDENT_EMAIL}</td>}
                {columns.includes("offer_title") && <td className="p-3 border">{item.OFFER_TITLE}</td>}
                {columns.includes("offer_description") && (
                  <td className="p-3 border">{item.OFFER_DESCRIPTION}</td>
                )}
                {columns.includes("offer_date") && <td className="p-3 border">{item.OFFRE_DATE} mois</td>}
                {columns.includes("student_starting_date") && (
                  <td className="p-3 border">{item.STUDENT_STARTING_DATE}</td>
                )}
                {columns.includes("student_ending_date") && (
                  <td className="p-3 border">{item.STUDENT_ENDING_DATE}</td>
                )}
                {columns.includes("status") && (
                  <td className="p-3 border">
                    {item.status === 1 ? "FINISHED" : "Pending"}
                  </td>
                )}
                <td className="p-3 border">
                  <button
                    onClick={() => onModify(item)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Modify
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
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

      <div className="mt-4 flex justify-center">
        {Array.from(
          { length: Math.ceil(data.length / itemsPerPage) },
          (_, i) => i + 1
        ).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 mx-1 rounded ${
              currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DynamicTable;
