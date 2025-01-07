import "../css/Sign.css";
import { useState } from "react";
import ParticleBackground from "../components/ui/ParticleBackground";
import ShineBorder from "../components/ui/shine-border";
import { motion } from "framer-motion";
import { useEffect } from "react";
export default function Sign() {
  const [toggle_attr, toggle_fun] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    type: "entreprise", // Default to 'entreprise'
    companyOrSchoolName: "",
    roleOrField: "",
    contactPhone: "",
    contactEmail: "",
  });
  const [institutions, setInstitutions] = useState([]);

  const [selectedInstitution, setSelectedInstitution] = useState(null);

  const [showAddInstitutionForm, setShowAddInstitutionForm] = useState(false);

  useEffect(() => {
    fetchInstitutions();
  }, [formData.type]);

  const fetchInstitutions = async () => {
    try {
      const part = formData.type === "entreprise" ? "entreprises" : "ecoles";
      const res = await fetch(`http://localhost:3000/api/respo/${part}`);
      const data = await res.json();
      // console.log(res);
      console.log(data);
      setInstitutions(data);
    } catch (err) {
      console.error("Error fetching institutions:", err);
    }
  };

  const handleInstitutionSelect = (e) => {
    const institutionId = e.target.value;
    console.log(institutionId);
    if (institutionId) {
      const selected = institutions.find((inst) => inst[0] == institutionId);
      console.log(selected);
      setSelectedInstitution(selected);

      setFormData({
        ...formData,

        companyOrSchoolName: selected[1],

        roleOrField: selected[2],

        contactPhone: selected[3],

        contactEmail: selected[4],
      });
    } else {
      setSelectedInstitution(null);

      setFormData({
        ...formData,

        companyOrSchoolName: "",

        roleOrField: "",

        contactPhone: "",

        contactEmail: "",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep((prev) => prev + 1);
  };

  const handlePrev = (e) => {
    e.preventDefault();
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determine the API endpoint based on the selected type
    const endpoint =
      formData.type === "ecole" ? "/respo-ecole" : "/respo-entreprise";

    try {
      const response = await fetch(
        `http://localhost:3000/api/respo${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            companyOrSchoolName: formData.companyOrSchoolName,
            roleOrField: formData.roleOrField,
            contactPhone: formData.contactPhone,
            contactEmail: formData.contactEmail,
          }),
        }
      );

      if (response.ok) {
        alert("Your account request has been submitted successfully!");
        // Optionally reset the form or redirect
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          type: "entreprise",
          companyOrSchoolName: "",
          roleOrField: "",
          contactPhone: "",
          contactEmail: "",
        });
        setStep(1); // Reset to the first step
      } else {
        const errorData = await response.json();
        alert(`Failed to submit the request: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("An error occurred while submitting the form. Please try again.");
    }
  };

  const variants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <ParticleBackground></ParticleBackground>

      <div
        className={`container relative z-10 flex items-center justify-center  ${toggle_attr}`}
        id="container"
      >
        <div className="form-container sign-up">
          <form>
            <h1>Demande</h1>
            <motion.div
              key={step}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.5 }}
            >
              {step === 1 && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Nom"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      placeholder="Prénom"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <input
                    type="number"
                    placeholder="Téléphone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <button onClick={handleNext}>Next</button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={(e) => {
                      handleChange(e);

                      setShowAddInstitutionForm(false);
                    }}
                  >
                    <option value="entreprise">Entreprise</option>

                    <option value="ecole">École</option>
                  </select>

                  <select name="institution" onChange={handleInstitutionSelect}>
                    <option value="">Choisissez une institution</option>

                    {institutions.map((inst) => (
                      <option key={inst[0]} value={inst[0]}>
                        {inst[1]}
                      </option>
                    ))}
                  </select>

                  {!selectedInstitution && !showAddInstitutionForm && (
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                      <h6>si vous trouvez pas votre organisme!</h6>
                      <button
                        type="button"
                        onClick={() => setShowAddInstitutionForm(true)}
                      >
                        Ajouter
                      </button>
                    </div>
                  )}

                  {showAddInstitutionForm && (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          placeholder={
                            formData.type === "entreprise"
                              ? "Nom de l'entreprise"
                              : "Nom de l'école"
                          }
                          name="companyOrSchoolName"
                          value={formData.companyOrSchoolName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          placeholder={
                            formData.type === "entreprise"
                              ? "Sécteur"
                              : "Domaine d'études"
                          }
                          name="roleOrField"
                          value={formData.roleOrField}
                          onChange={handleChange}
                        />
                      </div>
                      <input
                        type="number"
                        placeholder={
                          formData.type === "entreprise"
                            ? "Téléphone de l'entreprise"
                            : "Téléphone de l'école"
                        }
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                      />
                      <input
                        type="email"
                        placeholder={
                          formData.type === "entreprise"
                            ? "Email de l'entreprise"
                            : "Email de l'école"
                        }
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  <div className="flex justify-center gap-2.5">
                    <button onClick={handlePrev}>Back</button>
                    <button onClick={handleNext}>Next</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="changefontsize">
                  <div style={{ textAlign: "left", margin: "20px 0" }}>
                    <h3>Personal Information:</h3>
                    <p>
                      <strong>Nom:</strong> {formData.firstName}
                    </p>
                    <p>
                      <strong>Prénom:</strong> {formData.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {formData.email}
                    </p>
                    <p>
                      <strong>Téléphone:</strong> {formData.phone}
                    </p>
                  </div>
                  <div style={{ textAlign: "left", margin: "20px 0" }}>
                    <h3>
                      {formData.type === "entreprise"
                        ? "Entreprise Information:"
                        : "École Information:"}
                    </h3>
                    <p>
                      <strong>
                        {formData.type === "entreprise"
                          ? "Nom de l'entreprise"
                          : "Nom de l'école"}
                        :
                      </strong>{" "}
                      {formData.companyOrSchoolName}
                    </p>
                    <p>
                      <strong>
                        {formData.type === "entreprise"
                          ? "Sécteur"
                          : "Domaine d'études"}
                        :
                      </strong>{" "}
                      {formData.roleOrField}
                    </p>
                    <p>
                      <strong>
                        {formData.type === "entreprise"
                          ? "Téléphone de l'entreprise"
                          : "Téléphone de l'école"}
                        :
                      </strong>{" "}
                      {formData.contactPhone}
                    </p>
                    <p>
                      <strong>
                        {formData.type === "entreprise"
                          ? "Email de l'entreprise"
                          : "Email de l'école"}
                        :
                      </strong>{" "}
                      {formData.contactEmail}
                    </p>
                  </div>
                  <div className="flex justify-center gap-2.5">
                    <button onClick={handlePrev}>Back</button>
                    <button onClick={handleSubmit}>Submit</button>
                  </div>
                </div>
              )}
            </motion.div>
          </form>
        </div>

        <div className="form-container sign-in">
          <form>
            <h1>Se Connecter</h1>

            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <a href="#">Mot de passe oublié?</a>
            <button>Se Connecter</button>
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Bienvenue!</h1>
              <p>Entrer votre informations ici pour envoyer une demande.</p>
              <button
                className=""
                id="login"
                onClick={() => {
                  toggle_fun("");
                }}
              >
                Se connecter
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Bienvenue!</h1>
              <p>Entrer votre informations ici</p>
              <button
                className=""
                id="register"
                onClick={() => {
                  toggle_fun("active");
                }}
              >
                Demander un compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
