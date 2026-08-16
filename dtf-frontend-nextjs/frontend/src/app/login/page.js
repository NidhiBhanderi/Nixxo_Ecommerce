"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/store/api/authApi";
import { setCredentials } from "@/store/slices/authSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials(result));
      router.push("/");
    } catch { /* error is shown below */ }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        <p className="auth-intro">Welcome back. Sign in to continue shopping.</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="field"><label htmlFor="login-email">Email address</label><input id="login-email" type="email" placeholder="you@example.com" value={email} required onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="field"><label htmlFor="login-password">Password</label><input id="login-password" type="password" placeholder="Enter your password" value={password} required onChange={(e) => setPassword(e.target.value)} /></div>
          {error && <span className="error-text">{error.data?.message ?? "Login failed."}</span>}
          <button type="submit" disabled={isLoading}>{isLoading ? "Logging in..." : "Login"}</button>
        </form>
      </div>
    </div>
  );
}
