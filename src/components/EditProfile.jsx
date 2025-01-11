import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";

const EditProfileDialog = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    nom: user.nom || "",
    prenom: user.prenom || "",
    email: user.email || "",
    number: user.number || "",
    previousPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [editPassword, setEditPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    // Validate form data (optional) and send to the backend
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="nom">Nom</Label>
            <Input
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="prenom">Prenom</Label>
            <Input
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="number">Phone Number</Label>
            <Input
              id="number"
              name="number"
              type="tel"
              value={formData.number}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label>Edit Password</Label>
            <Toggle pressed={editPassword} onPressedChange={setEditPassword}>
              {editPassword ? "Enabled" : "Disabled"}
            </Toggle>
          </div>
          {editPassword && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="previousPassword">Previous Password</Label>
                <Input
                  id="previousPassword"
                  name="previousPassword"
                  type="password"
                  value={formData.previousPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
