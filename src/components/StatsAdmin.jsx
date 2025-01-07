import React from "react";
import Statistiques from "./ChartsAdmin";

const App = () => {
  const studentData = {
    monthlyInternships: [10, 15, 20, 25, 30, 35],
  };

  const enterpriseData = {
    names: ["Google", "Microsoft", "Amazon", "Facebook", "Apple"],
    internshipCounts: [50, 30, 20, 10, 5],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Statistiques studentData={studentData} enterpriseData={enterpriseData} />
    </div>
  );
};

export default App;

// import React, { useState, useEffect } from "react";
// import Statistiques from "./Statistiques";

// const App = () => {
//   const [studentData, setStudentData] = useState(null);
//   const [enterpriseData, setEnterpriseData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const studentResponse = await fetch("/api/student-stats");
//         const enterpriseResponse = await fetch("/api/enterprise-stats");

//         const studentData = await studentResponse.json();
//         const enterpriseData = await enterpriseResponse.json();

//         setStudentData(studentData);
//         setEnterpriseData(enterpriseData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   if (!studentData || !enterpriseData) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Statistiques studentData={studentData} enterpriseData={enterpriseData} />
//     </div>
//   );
// };

// export default App;
