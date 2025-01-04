import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Plus, Trash } from "lucide-react";

export default function CVEditor({
  personalData,
  setPersonalData,
  sections,
  setSections,
}) {
  const [cvData, setCvData] = useState({
    personalData: {
      name: "S. Berkay Aydin",
      title: "Senior Software Developer",
      image: "https://bulma.io/images/placeholders/128x128.png",
      contacts: [
        { type: "email", value: "john@example.com" },
        { type: "phone", value: "+00 (123) 456 78 90" },
      ],
    },
    sections: [
      {
        type: "text",
        title: "Career Profile",
        content: `When I was a child, I always wanted to be a developer.`,
        icon: "usertie",
      },
    ],
  });

  const [newSectionType, setNewSectionType] = useState(null);

  const sectionTemplates = {
    text: {
      type: "text",
      title: "New Text Section",
      content: "Write something here...",
      icon: "plus",
    },
    education: {
      type: "common-list",
      title: "Education",
      icon: "graduation",
      items: [
        {
          title: "Degree",
          authority: "Institution Name",
          rightSide: "Year",
        },
      ],
    },
    experiences: {
      type: "experiences-list",
      title: "Experiences",
      icon: "archive",
      items: [
        {
          title: "Job Title",
          company: "Company Name",
          datesBetween: "Start - End",
          description: "",
        },
      ],
    },
    projects: {
      type: "projects-list",
      title: "Projects",
      icon: "tasks",
      groups: [
        {
          sectionHeader: "Project Group",
          description: "",
          items: [{ title: "Project Name", description: "" }],
        },
      ],
    },
    skills: {
      type: "tag-list",
      title: "Skills Proficiency",
      icon: "rocket",
      items: ["Skill 1", "Skill 2"],
    },
  };

  const handleAddSection = (type) => {
    if (type && sectionTemplates[type]) {
      setCvData((prev) => ({
        ...prev,
        sections: [...prev.sections, sectionTemplates[type]],
      }));
    }
    setSections([...sections, newSection]);

    setNewSectionType(null); // Reset dropdown
  };

  const handleUpdateSection = (index, updatedSection) => {
    setSections((prev) => {
      const updatedSections = [...prev.sections];
      updatedSections[index] = updatedSection;
      return { ...prev, sections: updatedSections };
    });
  };

  const handleRemoveSection = (index) => {
    setSections((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const handleAddItemToSection = (sectionIndex, itemTemplate) => {
    setCvData((prev) => {
      const updatedSections = [...prev.sections];

      const section = updatedSections[sectionIndex];

      if (section.items) {
        section.items.push(itemTemplate);
      } else {
        section.items = [itemTemplate];
      }

      updatedSections[sectionIndex] = section;

      return { ...prev, sections: updatedSections };
    });
  };
  const handleRemoveItemFromSection = (sectionIndex, itemIndex) => {
    setCvData((prev) => {
      const updatedSections = [...prev.sections];

      const section = updatedSections[sectionIndex];

      section.items = section.items.filter((_, i) => i !== itemIndex);

      updatedSections[sectionIndex] = section;

      return { ...prev, sections: updatedSections };
    });
  };
  const handleAddContact = () => {
    const newContact = { type: "", value: "" };
    // Update the contacts array with the new contact
    setPersonalData((prevData) => ({
      ...prevData,
      contacts: [...prevData.contacts, newContact],
    }));
  };

  const handleRemoveContact = (index) => {
    setPersonalData((prevData) => ({
      ...prevData,
      contacts: prevData.contacts.filter((_, i) => i !== index), // Remove contact by index
    }));
  };

  //   const handleUpdatePersonalData = (key, value) => {

  //     setCvData((prev) => ({

  //       ...prev,

  //       personalData: { ...prev.personalData, [key]: value },

  //     }));

  const handleUpdatePersonalData = (field, value) => {
    setPersonalData({ ...personalData, [field]: value });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Your CV</h1>

      {/* Personal Info Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={personalData.name}
            onChange={(e) => handleUpdatePersonalData("name", e.target.value)}
            placeholder="Full Name"
            className="mb-4"
          />
          <Input
            value={personalData.title}
            onChange={(e) => handleUpdatePersonalData("title", e.target.value)}
            placeholder="Job Title"
            className="mb-4"
          />

          <h4 className="text-lg font-semibold mb-2">Contacts</h4>

          {personalData.contacts.map((contact, index) => (
            <div className="flex items-center gap-2 mb-2" key={index}>
              <Input
                value={contact.type}
                onChange={(e) => {
                  const updatedContacts = [...personalData.contacts];

                  updatedContacts[index].type = e.target.value;

                  handleUpdatePersonalData("contacts", updatedContacts);
                }}
                placeholder="Contact Type (e.g., Email)"
                className="flex-1"
              />

              <Input
                value={contact.value}
                onChange={(e) => {
                  const updatedContacts = [...personalData.contacts];

                  updatedContacts[index].value = e.target.value;

                  handleUpdatePersonalData("contacts", updatedContacts);
                }}
                placeholder="Contact Value"
                className="flex-1"
              />

              <Button
                variant="destructive"
                onClick={() => {
                  const updatedContacts = personalData.contacts.filter(
                    (_, i) => i !== index
                  );

                  handleUpdatePersonalData("contacts", updatedContacts);
                }}
              >
                <Trash size={16} />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            className="mt-2"
            onClick={() =>
              handleUpdatePersonalData("contacts", [
                ...personalData.contacts,

                { type: "", value: "" },
              ])
            }
          >
            <Plus size={16} className="mr-2" /> Add Contact
          </Button>
        </CardContent>
      </Card>

      {/* Sections */}
      {sections.map((section, index) => (
        <Card className="mb-4" key={index}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {section.type === "text" && (
              <Textarea
                value={section.content}
                onChange={(e) =>
                  handleUpdateSection(index, {
                    ...section,
                    content: e.target.value,
                  })
                }
                placeholder="Write content..."
                className="w-full"
              />
            )}
            {section.type === "common-list" && (
              <>
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="mb-2">
                    <Input
                      value={item.title}
                      onChange={(e) => {
                        const updatedItems = [...section.items];
                        updatedItems[itemIndex].title = e.target.value;
                        handleUpdateSection(index, {
                          ...section,
                          items: updatedItems,
                        });
                      }}
                      placeholder="Degree or Title"
                      className="mb-2"
                    />
                    <Input
                      value={item.authority || ""}
                      onChange={(e) => {
                        const updatedItems = [...section.items];
                        updatedItems[itemIndex].authority = e.target.value;
                        handleUpdateSection(index, {
                          ...section,
                          items: updatedItems,
                        });
                      }}
                      placeholder="Institution or Authority"
                      className="mb-2"
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() =>
                    handleUpdateSection(index, {
                      ...section,
                      items: [
                        ...section.items,
                        { title: "", authority: "", rightSide: "" },
                      ],
                    })
                  }
                >
                  <Plus size={16} className="mr-2" /> Add Item
                </Button>
              </>
            )}
            <Button
              variant="destructive"
              className="mt-4"
              onClick={() => handleRemoveSection(index)}
            >
              <Trash size={16} className="mr-2" /> Remove Section
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Add Section Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="primary">
            <Plus size={16} className="mr-2" /> Add New Section
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Object.keys(sectionTemplates).map((type) => (
            <DropdownMenuItem key={type} onClick={() => handleAddSection(type)}>
              {sectionTemplates[type].title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
