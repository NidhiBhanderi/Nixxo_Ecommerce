"use client";

import { useEffect } from "react";

export default function AdminSidebar({ open, title, onClose, children }) {
  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  if (!open) return null;
  return <div className="sidebar-overlay" onMouseDown={onClose}>
    <aside className="admin-sidebar" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
      <div className="sidebar-header"><h2>{title}</h2><button className="sidebar-close" type="button" onClick={onClose} aria-label="Close sidebar">×</button></div>
      {children}
    </aside>
  </div>;
}
