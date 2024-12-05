import "../css/sign.css";
import { useState } from "react";
import ParticleBackground from "./ui/ParticleBackground";
export default function Sign() {
  const [toggle_attr, toggle_fun] = useState("");

  return (
    <>
      <ParticleBackground></ParticleBackground>

      <div className="background-test">
        {/* <SimpleFramerBackground></SimpleFramerBackground> */}
        <div
          className={`container relative z-10 flex items-center justify-center  ${toggle_attr}`}
          id="container"
        >
          <div className="form-container sign-up">
            <form>
              <h1>Demande</h1>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <input type="text" placeholder="Nom" />
                <input type="text" placeholder="Prénom" />
              </div>
              <input type="email" placeholder="Email" />
              <input type="number" placeholder="Téléphone" />

              <button>Demander</button>
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
    </>
  );
}
