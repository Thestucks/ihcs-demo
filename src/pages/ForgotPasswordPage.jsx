import React from "react";
import { ForgotPasswordForm } from "../features/auth/ForgotPasswordForm";
import lgnbImg from "../assets/lgnb.png";
import ihcsImg from "../assets/IHCS.png";
import bgImg from "../assets/bg.png";

export default function ForgotPasswordPage() {
  return (
    <div className="login-root" style={{ backgroundImage: `url(${bgImg})` }}>
      <img
        src={lgnbImg}
        alt="lgnb"
        className="login-logo"
      />
      <img
        src={ihcsImg}
        alt="IHCS"
        className="login-logo-right"
      />
      <div className="login-card">
        <div className="login-left">
          <div>
            <h2 className="login-left-title">Reset Password,</h2>
            <p className="login-left-subtitle">di integrated Human Capital System</p>
            <p style={{
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: '#6b7280',
              lineHeight: '1.6'
            }}>
              Kami akan membantu Anda untuk mereset password akun Anda dengan aman.
            </p>
          </div>
        </div>

        <div className="login-right">
          <div className="login-right-inner">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
