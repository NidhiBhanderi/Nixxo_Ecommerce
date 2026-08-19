"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useResetPasswordMutation } from "@/store/api/authApi";
import PasswordField from "@/components/PasswordField";

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
      <PasswordField id="password" label="New password" value={password} minLength={8} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
      <PasswordField id="confirm-password" label="Confirm password" value={confirmPassword} minLength={8} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
      {(validationError || error) && <span className="error-text">{validationError || error.data?.message || "Could not reset password."}</span>}
      {success ? <p>{success} <Link href="/login">Log in</Link></p> : <button type="submit" disabled={isLoading}>{isLoading ? "Resetting..." : "Reset password"}</button>}
    </form>
  </div></div>;
}
