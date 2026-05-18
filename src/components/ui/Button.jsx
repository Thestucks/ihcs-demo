// src/components/ui/Button.jsx
import React from "react";



// Button.jsx
export function Button({ children, type = "button", onClick }) {
  return (
    <button type={type} onClick={onClick} className="btn-primary">
      {children}
    </button>
  );
}
