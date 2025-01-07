import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

const Statistiques = ({ studentData, enterpriseData }) => {
  // Horizontal Bar Chart Data
  const horizontalBarData = {
    labels: ["Company A", "Company B", "Company C", "Company D"],
    datasets: [
      {
        label: "Internships Offered",
        data: [12, 19, 7, 14],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const horizontalBarOptions = {
    indexAxis: "y", // This makes the bars horizontal
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  // Pie Chart Data
  const pieChartData = {
    labels: ["Internships Secured", "Internships Not Secured"],
    datasets: [
      {
        data: [70, 30],
        backgroundColor: ["#4F46E5", "#6366F1"],
        hoverBackgroundColor: ["#4338CA", "#4F46E5"],
      },
    ],
  };

  return (
    <div
      className="p-6"
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        // textAlign: "center",
        // display: "flex",
        // flexDirection: "column",
        // gap: "2rem",
        // // flexWrap: "wrap",
        // justifyContent: "center",
        // alignItems: "center",
        // minHeight: "90vh",
      }}
    >
      <h1 className="text-2xl font-bold mb-6">Statistiques</h1>

      {/* Horizontal Bar Chart */}
      <div className="mb-8" style={{ maxWidth: "500px" }}>
        <h2 className="text-lg font-semibold mb-4">Internships by Company</h2>
        <Bar data={horizontalBarData} options={horizontalBarOptions} />
      </div>

      {/* Pie Chart */}
      <div className="mb-8" style={{ maxWidth: "400px" }}>
        <h2 className="text-lg font-semibold mb-4">Internship Success Rate</h2>
        <Pie data={pieChartData} />
      </div>
    </div>
  );
};

export default Statistiques;
