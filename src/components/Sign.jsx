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
              <h1>Create Account</h1>
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

              <button>Sign Up</button>
            </form>
          </div>
          <div className="form-container sign-in">
            <form>
              <h1>Sign In</h1>

              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <a href="#">Forget Your Password?</a>
              <button>Sign In</button>
            </form>
          </div>
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <h1>Welcome Back!</h1>
                <p>Enter your personal details to use all of site features</p>
                <button
                  className=""
                  id="login"
                  onClick={() => {
                    toggle_fun("");
                  }}
                >
                  Sign In
                </button>
              </div>
              <div className="toggle-panel toggle-right">
                <h1>Hello, Friend!</h1>
                <p>
                  Register with your personal details to use all of site
                  features
                </p>
                <button
                  className=""
                  id="register"
                  onClick={() => {
                    toggle_fun("active");
                  }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
