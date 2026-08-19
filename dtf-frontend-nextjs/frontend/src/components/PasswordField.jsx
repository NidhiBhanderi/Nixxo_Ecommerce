"use client";

import { useState } from "react";

export default function PasswordField({ id, label, value, onChange, placeholder, minLength, autoComplete }) {
  const [visible, setVisible] = useState(false);
  return <div className="field"><label htmlFor={id}>{label}</label><div className="password-control">
    <input id={id} type={visible ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder} minLength={minLength} autoComplete={autoComplete} required />
    <button className="password-toggle" type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible}>{visible ? "Hide" : "Show"}</button>
  </div></div>;
}
