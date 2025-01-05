import React from "react";
import ConvocationCard from "./ConvocationLetter";

const App = () => {
  const interviewDetails = {
    candidateName: "Doha",
    interviewDate: "January 10, 2025",
    interviewTime: "10:00 AM",
    interviewLocation: "Oracle Rabat 123 rue ba2 chi haja",
    jobTitle: "Software Developer Intern",

    postedAt: "December 30, 2024",
  };

  return (
    <div
      className=" flex items-center justify-center"
      style={{ flexWrap: "wrap", gap: "1rem" }}
    >
      <ConvocationCard details={interviewDetails} />
      <ConvocationCard details={interviewDetails} />
      <ConvocationCard details={interviewDetails} />
      <ConvocationCard details={interviewDetails} />
    </div>
  );
};

export default App;
