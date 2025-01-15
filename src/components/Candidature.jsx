import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

const Candidature = ({ candidature, refreshCandidatures }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState({
    date_interview: "",
    time_interview: "",
    place: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInterviewDetails({ ...interviewDetails, [name]: value });
  };

  const handleConfirm = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/offers/candidature/confirm/${candidature.CANDIDATURE_ID}`,
        {
          ...interviewDetails,
          is_approved: 1,
        }
      );

      setDialogOpen(false);
      refreshCandidatures(); // Refresh the list after updating
    } catch (error) {
      console.error("Error confirming candidature:", error);
    }
  };

  return (
    <div className="border p-4 rounded shadow-sm bg-white">
      <h4 className="text-lg font-bold">
        {candidature.ETUDIANT_NOM} {candidature.ETUDIANT_PRENOM}
      </h4>
      <p className="text-sm text-gray-600">{candidature.ETUDIANT_EMAIL}</p>

      {candidature.MOTIVATIONAL_LETTER && (
        <div className="mt-3 p-3 bg-gray-100 rounded">
          <h5 className="text-md font-semibold">Lettre de motivation:</h5>
          <p className="text-sm">{candidature.MOTIVATIONAL_LETTER}</p>
        </div>
      )}

      <div
        className="m-4"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {candidature.PATH_CV && (
          <div className="mt-3">
            <a
              href={`/uploads/cvis/${candidature.PATH_CV}`}
              target="_blank"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              download
            >
              Télécharger CV
            </a>
          </div>
        )}
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-green-500 hover:bg-green-600"
        >
          Select
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Candidature</DialogTitle>
          </DialogHeader>
          <form>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Date d'entretien
                </label>
                <Input
                  type="date"
                  name="date_interview"
                  value={interviewDetails.date_interview}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Heure d'entretien
                </label>
                <Input
                  type="time"
                  name="time_interview"
                  value={interviewDetails.time_interview}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Lieu</label>
                <Input
                  type="text"
                  name="place"
                  value={interviewDetails.place}
                  onChange={handleInputChange}
                  placeholder="Lieu de l'entretien"
                  required
                />
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Candidature;
