"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "@/store/api/authApi";
import { setCredentials } from "@/store/slices/authSlice";

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phoneNumber: "" });
  const [register, { isLoading, error }] = useRegisterMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { const result = await register(form).unwrap(); dispatch(setCredentials(result)); router.push("/"); } catch { /* error is shown below */ }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create an Account</h1>
        <p className="auth-intro">Create your account and bring your designs to life.</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="field"><label htmlFor="full-name">Full name</label><input id="full-name" placeholder="Your full name" value={form.fullName} required onChange={update("fullName")} /></div>
          <div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" placeholder="you@example.com" value={form.email} required onChange={update("email")} /></div>
          <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" placeholder="Create a password" value={form.password} required onChange={update("password")} /></div>
          <div className="field"><label htmlFor="phone">Phone number <em>(optional)</em></label><input id="phone" placeholder="Your phone number" value={form.phoneNumber} onChange={update("phoneNumber")} /></div>
          {error && <span className="error-text">{error.data?.message ?? "Registration failed."}</span>}
          <button type="submit" disabled={isLoading}>{isLoading ? "Creating account..." : "Create account"}</button>
        </form>
      </div>
    </div>
  );
}
