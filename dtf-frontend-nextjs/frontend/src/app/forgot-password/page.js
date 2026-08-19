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
    <h1>Forgot password</h1><p className="auth-intro">Enter your email to generate a secure reset link.</p>
    <form className="form" onSubmit={submit}>
      <div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" value={email} required onChange={(e) => setEmail(e.target.value)} /></div>
      {error && <span className="error-text">{error.data?.message ?? "Could not request a reset link."}</span>}
      {result && <div className="reset-result"><span>{result.message}</span>{result.resetUrl && <Link className="button" href={result.resetUrl}>Open reset link</Link>}</div>}
      {!result && <button type="submit" disabled={isLoading}>{isLoading ? "Generating..." : "Generate reset link"}</button>}
    </form><p><Link href="/login">Back to login</Link></p>
  </div></div>;
}
