import React from "react";
import Offer from "./Offer";
const Offers = () => {
  const offers = [
    {
      id: 1,
      title: "Software Engineer ",
      organization: "Oracle",
      type: "Full-time",
      remote: true,
      description: "Develop scalable software solutions...",
      skills: ["JavaScript", "React", "Node.js"],
      postedAt: "2 days ago",
    },
    {
      id: 2,
      title: "Data Scientist",
      organization: "Orange Maroc",
      type: "Part-time",
      remote: false,
      description: "Analyze complex data sets...",
      skills: ["Python", "Machine Learning", "Statistics"],
      postedAt: "1 week ago",
    },
    {
      id: 3,
      title: "Data Scientist",
      organization: "Orange Maroc",
      type: "Part-time",
      remote: false,
      description: "Analyze complex data sets...",
      skills: ["Python", "Machine Learning", "Statistics"],
      postedAt: "1 week ago",
    },
    {
      id: 3,
      title: "Data Scientist",
      organization: "Orange Maroc",
      type: "Part-time",
      remote: false,
      description: "Analyze complex data sets...",
      skills: ["Python", "Machine Learning", "Statistics"],
      postedAt: "1 week ago",
    },
    {
      id: 3,
      title: "Data Scientist",
      organization: "Orange Maroc",
      type: "Part-time",
      remote: false,
      description: "Analyze complex data sets...",
      skills: ["Python", "Machine Learning", "Statistics"],
      postedAt: "1 week ago",
    },
    {
      id: 3,
      title: "Data Scientist",
      organization: "Orange Maroc",
      type: "Part-time",
      remote: false,
      description: "Analyze complex data sets...",
      skills: ["Python", "Machine Learning", "Statistics"],
      postedAt: "1 week ago",
    },
    // Add more offers...
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Available Offers
      </h2>
      <div className=" flex justify-center gap-4 flex-wrap overflow-y-scroll">
        {offers.map((offer) => (
          <Offer key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
};

export default Offers;
