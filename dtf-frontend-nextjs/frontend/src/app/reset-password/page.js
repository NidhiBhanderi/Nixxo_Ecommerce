"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useResetPasswordMutation } from "@/store/api/authApi";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [validationError, setValidationError] = useState("");
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  useEffect(() => setToken(new URLSearchParams(window.location.search).get("token") ?? ""), []);
  const submit = async (event) => {
    event.preventDefault();
    if (!token) return setValidationError("This reset link is missing its token.");
    if (password !== confirmPassword) return setValidationError("Passwords do not match.");
    setValidationError("");
    try { const result = await resetPassword({ token, newPassword: password }).unwrap(); setSuccess(result.message); } catch { /* shown below */ }
  };
  return <div className="auth-page"><div className="auth-card">
    <h1>Choose a new password</h1><form className="form" onSubmit={submit}>
      <div className="field"><label htmlFor="password">New password</label><input id="password" type="password" minLength="8" value={password} required onChange={(e) => setPassword(e.target.value)} /></div>
      <div className="field"><label htmlFor="confirm-password">Confirm password</label><input id="confirm-password" type="password" minLength="8" value={confirmPassword} required onChange={(e) => setConfirmPassword(e.target.value)} /></div>
      {(validationError || error) && <span className="error-text">{validationError || error.data?.message || "Could not reset password."}</span>}
      {success ? <p>{success} <Link href="/login">Log in</Link></p> : <button type="submit" disabled={isLoading}>{isLoading ? "Resetting..." : "Reset password"}</button>}
    </form>
  </div></div>;
}
