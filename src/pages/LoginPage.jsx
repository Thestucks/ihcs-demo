// src/pages/LoginPage.jsx
import React from "react";
import { LoginForm } from "../features/auth/LoginForm";
import lgnbImg from "../assets/lgnb.png";
import ihcsImg from "../assets/IHCS.png";
import bgImg from "../assets/bg.png";
import BankScene from "../components/BankScene";
import "../styles/LoginNew.css";

export default function LoginPage() {
  return (
    <div className="login-modern-root" style={{ backgroundImage: `url(${bgImg})` }}>
      {/* Background decorative shapes */}
      <div className="login-bg-shape shape-1"></div>
      <div className="login-bg-shape shape-2"></div>

      <div className="login-modern-container">
        {/* Left Side - 3D Showcase */}
        <div className="login-showcase">
          <div className="showcase-header">
            <div className="showcase-text">
              <h1>Welcome to IHCS</h1>
              <p>Integrated Human Capital System - Empowering your workforce management</p>
            </div>
          </div>

          {/* 3D Scene Container */}
          <div className="scene-container">
            <BankScene />
          </div>


        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-wrapper">
          <div className="login-form-content">
            {/* Partner Logos */}
            <div className="partner-logos">
              <img src={lgnbImg} alt="lgnb" className="partner-logo" />
              <img src={ihcsImg} alt="IHCS" className="partner-logo2" />
            </div>

            <div className="login-header-right">
              <h2>Sign In</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            <LoginForm />

            <div className="powered-by">
              Powered by NEXUS & IHCS Team
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



