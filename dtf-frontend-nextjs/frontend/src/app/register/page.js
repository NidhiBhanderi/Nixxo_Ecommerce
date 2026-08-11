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
    try {
      const result = await register(form).unwrap();
      dispatch(setCredentials(result));
      router.push("/");
    } catch {
      // error is already surfaced via the `error` state below
    }
  };

  return (
    <div className="container">
      <h1>Create an Account</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Full Name" value={form.fullName} required onChange={update("fullName")} />
        <input type="email" placeholder="Email" value={form.email} required onChange={update("email")} />
        <input type="password" placeholder="Password" value={form.password} required onChange={update("password")} />
        <input placeholder="Phone Number (optional)" value={form.phoneNumber} onChange={update("phoneNumber")} />
        {error && <span className="error-text">{error.data?.message ?? "Registration failed."}</span>}
        <button type="submit" disabled={isLoading}>{isLoading ? "Creating account..." : "Register"}</button>
      </form>
    </div>
  );
}
