import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import "../css/dashboard.css";
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
  const [newSectionType, setNewSectionType] = useState(null);

  const sectionTemplates = {
    text: {
      type: "text",
      title: "About Me",
      content: "",
      icon: "plus",
    },
    education: {
      type: "common-list",
      title: "Education",
      icon: "graduation",
      items: [
        {
          title: "",
          authority: "",
          authorityWebSite: "",
          rightSide: "t",
        },
      ],
    },
    experiences: {
      type: "experiences-list",
      title: "Experiences",
      icon: "archive",
      items: [
        {
          title: "",
          company: "",
          datesBetween: "",
          description: "",
          descriptionTags: "",
        },
      ],
    },
    projects: {
      type: "projects-list",
      title: "Projects",
      description: "Voici quelques projets sur lesquels j'ai travaillé",
      icon: "tasks",
      groups: [
        {
          sectionHeader: "",
          description: "",
          items: [
            {
              title: "",
              projectUrl: "",
              description: "",
            },
          ],
        },
      ],
    },
    skills: {
      type: "tag-list",
      title: "Skills Proficiency",
      icon: "rocket",
      items: [],
    },
    languanges: {
      type: "common-list",
      title: "Languages",
      items: [{ authority: "", authorityMeta: "" }],
      icon: "language",
    },
  };
  const handleAddSection = (type) => {
    if (type && sectionTemplates[type]) {
      const newKey = `section_${Date.now()}`; // Generate a unique key
      const newSection = sectionTemplates[type]; // Get the new section template

      setSections((prev) => ({
        ...prev,
        [newKey]: newSection, // Add the new section with a unique key
      }));

      setNewSectionType(null); // Reset dropdown
    }
  };

  const handleUpdateSection = (key, updatedSection) => {
    setSections((prev) => ({ ...prev, [key]: updatedSection }));
  };

  const handleRemoveSection = (keyToRemove) => {
    setSections((prev) => {
      const updatedSections = { ...prev };
      delete updatedSections[keyToRemove];
      return updatedSections;
    });
  };

  const handleAddItemToSection = (sectionIndex, itemTemplate) => {
    setSections((prev) => {
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
    setSections((prev) => {
      const updatedSections = [...prev.sections];

      const section = updatedSections[sectionIndex];

      section.items = section.items.filter((_, i) => i !== itemIndex);

      updatedSections[sectionIndex] = section;

      return { ...prev, sections: updatedSections };
    });
  };
  const handleAddContact = () => {
    const newContact = { type: "", value: "" };
    // Update the contacts array with the new contactmkdir controllers models routes config middlewares utils

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
      {Object.entries(sections).map(([key, section], index) => (
        <Card className="mb-4" key={index}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {section.type === "text" && (
              <Textarea
                value={section.content}
                onChange={(e) => {
                  console.log(typeof section);
                  var val = e.target.value;
                  // var content_list = [];
                  console.log("val", val);
                  handleUpdateSection(key, {
                    ...section,
                    content: val,
                  });
                }}
                placeholder="Write content..."
                className="w-full"
              />
            )}
            {section.type === "common-list" &&
              section.title === "Education" && (
                <>
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="mb-2">
                      <Input
                        value={item.title}
                        onChange={(e) => {
                          const updatedItems = [...section.items];
                          updatedItems[itemIndex].title = e.target.value;
                          handleUpdateSection(key, {
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
                          handleUpdateSection(key, {
                            ...section,
                            items: updatedItems,
                          });
                        }}
                        placeholder="Institution or Authority"
                        className="mb-2"
                      />
                      <Input
                        value={item.authorityWebSite || ""}
                        onChange={(e) => {
                          const updatedItems = [...section.items];
                          updatedItems[itemIndex].authorityWebSite =
                            e.target.value;
                          handleUpdateSection(key, {
                            ...section,
                            items: updatedItems,
                          });
                        }}
                        placeholder="Institution or Authority's Website"
                        className="mb-2"
                      />
                      <Input
                        value={item.rightSide || ""}
                        onChange={(e) => {
                          const updatedItems = [...section.items];
                          updatedItems[itemIndex].rightSide = e.target.value;
                          handleUpdateSection(key, {
                            ...section,
                            items: updatedItems,
                          });
                        }}
                        placeholder="YYYYY-YYYY or YYYYY-Present"
                        className="mb-2"
                      />
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setSections((prevData) => ({
                            ...prevData,
                            education: {
                              ...prevData.education,
                              items: prevData.education.items.filter(
                                (_, i) => i !== itemIndex
                              ),
                            }, // Remove contact by index
                          }));
                        }}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  ))}
                  <div className="add-rm-wrapper">
                    <Button
                      variant="outline"
                      // className="mt-2"
                      onClick={() =>
                        setSections((prevData) => ({
                          ...prevData,
                          education: {
                            ...prevData.education,
                            items: [
                              ...prevData.education.items,
                              {
                                title: "",
                                authority: "",
                                authorityWebSite: "",
                                rightSide: "",
                              },
                            ],
                          }, // Remove contact by index
                        }))
                      }
                    >
                      <Plus size={16} className="mr-2" /> Add Item
                    </Button>
                    <Button
                      variant="destructive"
                      // className="mt-4"
                      onClick={() => handleRemoveSection(key)}
                    >
                      <Trash size={16} className="mr-2" /> Remove Section
                    </Button>
                  </div>
                </>
              )}

            {section.type === "experiences-list" && (
              <>
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="mb-2">
                    <Input
                      value={item.title}
                      onChange={(e) => {
                        const updatedItems = [...section.items];
                        updatedItems[itemIndex].title = e.target.value;
                        handleUpdateSection(key, {
                          ...section,
                          items: updatedItems,
                        });
                      }}
                      placeholder="Your job in the Company"
                      className="mb-2"
                    />
                    <Input
                      value={item.company || ""}
                      onChange={(e) => {
                        const updatedItems = [...section.items];
                        updatedItems[itemIndex].company = e.target.value;
                        handleUpdateSection(key, {
                          ...section,
                          items: updatedItems,
                        });
                      }}
                      placeholder="Company Name"
                      className="mb-2"
                    />
                    <Input
                      value={item.companyWebSite || ""}
                      onChange={(e) => {
                        const updatedItems = [...section.items];
                        updatedItems[itemIndex].companyWebSite = e.target.value;
                        handleUpdateSection(key, {
                          ...section,
                          items: updatedItems,
                        });
                      }}
                      placeholder="Company's Website"
                      className="mb-2"
                    />

                    <Textarea
                      value={item.description || ""}
                      onChange={(e) => {
                        const updatedItems = [...section.items];
                        updatedItems[itemIndex].description = e.target.value;
                        handleUpdateSection(key, {
                          ...section,
                          items: updatedItems,
                        });
                      }}
                      placeholder="Describe your experience.."
                      className="mb-2"
                    />

                    <Input
                      value={item.descriptionTags || ""}
                      onChange={(e) => {
                        const updatedItems = [...section.items];
                        updatedItems[itemIndex].descriptionTags =
                          e.target.value.split(",");
                        console.log(e.target.value);
                        handleUpdateSection(key, {
                          ...section,
                          items: updatedItems,
                        });
                      }}
                      placeholder="Skills you acquire comma separated"
                      className="mb-2"
                    />

                    <Input
                      value={item.datesBetween || ""}
                      onChange={(e) => {
                        const updatedItems = [...section.items];
                        updatedItems[itemIndex].datesBetween = e.target.value;
                        handleUpdateSection(key, {
                          ...section,
                          items: updatedItems,
                        });
                      }}
                      placeholder="YYYYY-YYYY or YYYYY-Present"
                      className="mb-2"
                    />
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSections((prevData) => ({
                          ...prevData,
                          experience: {
                            ...prevData.experience,
                            items: prevData.experience.items.filter(
                              (_, i) => i !== itemIndex
                            ),
                          }, // Remove contact by index
                        }));
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                ))}
                <div className="add-rm-wrapper">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setSections((prevData) => ({
                        ...prevData,
                        experience: {
                          ...prevData.experience,
                          items: [
                            ...prevData.experience.items,
                            {
                              title: "",
                              company: "",
                              companyWebSite: "",
                              description: "",
                              companyMeta: "",
                              datesBetween: "",
                              descriptionTags: [],
                            },
                          ],
                        }, // Remove contact by index
                      }))
                    }
                  >
                    <Plus size={16} className="mr-2" /> Add Item
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveSection(key)}
                  >
                    <Trash size={16} className="mr-2" /> Remove Section
                  </Button>
                </div>
              </>
            )}

            {section.type === "projects-list" && (
              <>
                {section.groups.map((item, itemIndex) => (
                  <div key={itemIndex} className="mb-2">
                    <Input
                      value={item.sectionHeader}
                      onChange={(e) => {
                        const updatedItems = [...section.groups];
                        updatedItems[itemIndex].sectionHeader = e.target.value;
                        handleUpdateSection(key, {
                          ...section,
                          groups: updatedItems,
                        });
                      }}
                      placeholder="Your project's FullName "
                      className="mb-2"
                    />
                    <Input
                      value={item.items[0].title || ""}
                      onChange={(e) => {
                        const updatedItems = [...section.groups];
                        updatedItems[itemIndex].items[0].title = e.target.value;
                        handleUpdateSection(key, {
                          ...section,
                          groups: updatedItems,
                        });
                      }}
                      placeholder="Your project Name (1 word or 2)"
                      className="mb-2"
                    />
                    <Input
                      value={item.items[0].projectUrl || ""}
                      onChange={(e) => {
                        const updatedItems = [...section.groups];
                        updatedItems[itemIndex].items[0].projectUrl =
                          e.target.value;
                        handleUpdateSection(key, {
                          ...section,
                          groups: updatedItems,
                        });
                      }}
                      placeholder="Project's Link"
                      className="mb-2"
                    />

                    <Textarea
                      value={item.items[0].description || ""}
                      onChange={(e) => {
                        const updatedItems = [...section.groups];
                        updatedItems[itemIndex].items[0].description =
                          e.target.value;
                        handleUpdateSection(key, {
                          ...section,
                          groups: updatedItems,
                        });
                      }}
                      placeholder="Describe your experience.."
                      className="mb-2"
                    />

                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSections((prevData) => ({
                          ...prevData,
                          projects: {
                            ...prevData.projects,
                            groups: prevData.projects.groups.filter(
                              (_, i) => i !== itemIndex
                            ),
                          }, // Remove contact by index
                        }));
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                ))}
                <div className="add-rm-wrapper">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setSections((prevData) => ({
                        ...prevData,
                        projects: {
                          ...prevData.projects,
                          groups: [
                            ...prevData.projects.groups,
                            {
                              sectionHeader: "",
                              description: " ",
                              items: [
                                {
                                  title: "",
                                  projectUrl: "",
                                  description: "",
                                },
                              ],
                            },
                          ],
                        }, // Remove contact by index
                      }))
                    }
                  >
                    <Plus size={16} className="mr-2" /> Add Item
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveSection(key)}
                  >
                    <Trash size={16} className="mr-2" /> Remove Section
                  </Button>
                </div>
              </>
            )}

            {section.type === "tag-list" && (
              <>
                <Input
                  value={section.items || ""}
                  onChange={(e) => {
                    const items_h = e.target.value.split(",");
                    console.log(e.target.value);
                    handleUpdateSection(key, {
                      ...section,
                      items: items_h,
                    });
                  }}
                  placeholder="the skills you have"
                  className="mb-2"
                />

                <div className="add-rm-wrapper">
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveSection(key)}
                  >
                    <Trash size={16} className="mr-2" /> Remove Section
                  </Button>
                </div>
              </>
            )}

            {section.type === "common-list" &&
              section.title === "Languages" && (
                <>
                  {section.items.map((language, indexitem) => (
                    <div
                      className="flex items-center gap-2 mb-2"
                      key={indexitem}
                    >
                      <Input
                        value={language.authority}
                        onChange={(e) => {
                          const updatedContacts = [...section.items];

                          updatedContacts[indexitem].authority = e.target.value;

                          handleUpdateSection(key, {
                            ...section,
                            items: updatedContacts,
                          });
                        }}
                        placeholder="Language"
                        className="flex-1"
                      />

                      <Input
                        value={language.authorityMeta}
                        onChange={(e) => {
                          const updatedContacts = [...section.items];

                          updatedContacts[indexitem].authorityMeta =
                            e.target.value;

                          handleUpdateSection(key, {
                            ...section,
                            items: updatedContacts,
                          });
                        }}
                        placeholder="Your professioncy in this language"
                        className="flex-1"
                      />

                      <Button
                        variant="destructive"
                        onClick={() => {
                          setSections((prevData) => ({
                            ...prevData,
                            languages: {
                              ...prevData.languages,
                              items: prevData.languages.items.filter(
                                (_, i) => i !== indexitem
                              ),
                            }, // Remove contact by index
                          }));
                        }}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  ))}

                  <div className="add-rm-wrapper">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setSections((prevData) => ({
                          ...prevData,
                          languages: {
                            ...prevData.languages,
                            items: [
                              ...prevData.languages.items,
                              { authority: "", authorityMeta: "" },
                            ],
                          }, // Remove contact by index
                        }))
                      }
                    >
                      <Plus size={16} className="mr-2" /> Add Item
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleRemoveSection(key)}
                    >
                      <Trash size={16} className="mr-2" /> Remove Section
                    </Button>
                  </div>
                </>
              )}
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
