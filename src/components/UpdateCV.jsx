import React, { useState } from "react";
import { Input } from "@/components/ui/input"; // ShadCN input
import { Button } from "@/components/ui/button"; // ShadCN button

const UpdateCV = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("CV Updated:", formData);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update CV</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full"
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full"
        />
        <textarea
          name="skills"
          placeholder="Skills (comma-separated)"
          value={formData.skills}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        ></textarea>
        <Button type="submit" className="w-full">
          Update CV
        </Button>
      </form>
    </div>
  );
};

export default UpdateCV;
