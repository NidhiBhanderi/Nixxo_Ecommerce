"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, selectIsAdmin, logout } from "@/store/slices/authSlice";

export default function Navbar() {
  const user = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);
  const dispatch = useDispatch();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <nav className="navbar">
      <Link href="/" className="brand">DTF <span>Sticker Shop</span></Link>
      <div className="navbar-links">
        <Link href="/products">Shop</Link>
        {isHydrated && user ? (
          <>
            {isAdmin && <Link href="/admin">Admin</Link>}
            <Link href="/profile">{user.fullName}</Link>
            <button onClick={() => dispatch(logout())}>Logout</button>
          </>
        ) : !isHydrated ? null : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
