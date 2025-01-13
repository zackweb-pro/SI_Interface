import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const EntrepriseCard = ({ entreprise, onSelect, isSelected }) => {
  return (
    <Card className="relative overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-transform transform hover:scale-105 rounded-lg">
      {/* Gradient Banner */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h3 className="text-2xl font-bold">{entreprise[1]}</h3>
          <p className="text-sm">{entreprise[4]}</p>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="pt-24 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
        <p className="text-gray-700">
          <span className="font-medium text-gray-800">Téléphone:</span>{" "}
          {entreprise[3]}
        </p>

        <p className="text-gray-700">
          <span className="font-medium text-gray-800">Sécteur:</span>{" "}
          {entreprise[2]}
        </p>

        <p className="text-gray-700">
          <span className="font-medium text-gray-800">Adresse:</span>{" "}
          {entreprise[5]}
        </p>
      </CardContent>

      {/* Card Footer */}
      <CardFooter>
        <Button
          onClick={() => onSelect(entreprise[0])}
          className={`w-full ${
            isSelected
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isSelected ? "Unselect" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EntrepriseCard;
