"use client";

import Link from "next/link";
import { useState } from "react";
import { useForgotPasswordMutation } from "@/store/api/authApi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();
  const submit = async (event) => {
    event.preventDefault();
    try { setResult(await forgotPassword({ email }).unwrap()); } catch { /* shown below */ }
  };
  return <div className="auth-page"><div className="auth-card">
    <h1>Forgot password</h1><p className="auth-intro">Enter your email and we’ll send you a reset link.</p>
    <form className="form" onSubmit={submit}>
      <div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" value={email} required onChange={(e) => setEmail(e.target.value)} /></div>
      {error && <span className="error-text">{error.data?.message ?? "Could not request a reset link."}</span>}
      {result && <span>{result.message}{result.resetUrl && <> <Link href={result.resetUrl}>Open reset link</Link></>}</span>}
      <button type="submit" disabled={isLoading}>{isLoading ? "Sending..." : "Send reset link"}</button>
    </form><p><Link href="/login">Back to login</Link></p>
  </div></div>;
}
