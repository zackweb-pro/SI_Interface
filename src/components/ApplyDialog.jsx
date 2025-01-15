import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogOverlay,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const ApplyDialog = ({
  offerId,
  studentId,
  isOpen,
  onClose,
  handleOpenDialog,
}) => {
  const [motivationLetter, setMotivationLetter] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleApply = async () => {
    if (!motivationLetter || !cvFile) {
      setErrorMessage("Please fill out all fields before submitting.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("id_offre", offerId);
      formData.append("id_etudiant", studentId);
      formData.append("motivation_letter_content", motivationLetter);
      formData.append("cvFile", cvFile);

      const response = await fetch("http://localhost:3000/api/offers/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        setMotivationLetter("");
        setCvFile(null);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to apply for the offer.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleClose = () => {
    setMotivationLetter("");
    setCvFile(null);
    setErrorMessage(null);
    onClose(); // Call the provided onClose function to close the dialog
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTrigger asChild>
        <Button
          className="bg-[#4F46E5] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#4338CA]"
          onClick={handleOpenDialog}
        >
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for Offer</DialogTitle>
        </DialogHeader>
        <div>
          <Textarea
            placeholder="Write your motivation letter..."
            value={motivationLetter}
            onChange={(e) => setMotivationLetter(e.target.value)}
            className="mb-4"
          />
          <Input
            type="file"
            onChange={(e) => setCvFile(e.target.files[0])}
            className="mb-4"
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
      {/* Wrap the content with DialogOverlay for better accessibility */}
      <DialogOverlay onClick={handleClose} />
    </Dialog>
  );
};

export default ApplyDialog;
