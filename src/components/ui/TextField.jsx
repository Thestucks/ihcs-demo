// src/components/ui/TextField.jsx
import React from "react";


// TextField.jsx
export function TextField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  icon,
}) {
  return (
    <div className="field-group">
      {label && <label className="field-label">{label}</label>}
      <div className="field-wrapper">
        {icon && <span>{icon}</span>}
        <input
          className="field-input"
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
