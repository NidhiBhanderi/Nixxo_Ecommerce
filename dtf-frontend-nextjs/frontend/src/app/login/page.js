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
    } catch {
      // error is already surfaced via the `error` state below
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} required
          onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} required
          onChange={(e) => setPassword(e.target.value)} />
        {error && <span className="error-text">{error.data?.message ?? "Login failed."}</span>}
        <button type="submit" disabled={isLoading}>{isLoading ? "Logging in..." : "Login"}</button>
      </form>
    </div>
  );
}
