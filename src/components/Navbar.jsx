import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null); // NEW: ref for the hamburger button

  // lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // close when clicking outside mobile menu
  useEffect(() => {
    const onPointerDown = (e) => {
      if (!open) return;

      const target = e.target;

      // If click is inside the menu, do nothing
      if (menuRef.current && menuRef.current.contains(target)) return;

      // If click is on the toggle button (or its children), ignore it
      // (prevents pointerdown closing first and then click toggling it back open)
      if (toggleRef.current && toggleRef.current.contains(target)) return;

      // Otherwise close
      setOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const Nav = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-link ${isActive ? "nav-active" : ""}`}
      onClick={() => setOpen(false)}
    >
      {children}
    </NavLink>
  );

  return (
    <header className="site-header" role="banner">
      <div className="site-container header-inner">
        {/* Brand */}
        <Link to="/" className="brand" aria-label="Swiftify Logistics home">
          <img
            src="/logo.png"
            alt="Swiftify Logistics logo"
            className="brand-logo"
          />
          <span className="brand-text">
            <span className="brand-strong">Swiftify</span>{" "}
            <span className="brand-light">Logistics</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-links" aria-label="Main navigation">
          <Nav to="/">Home</Nav>
          <Nav to="/track">Track</Nav>
          <Nav to="/about">About</Nav>
          <Nav to="/contact">Contact</Nav>
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          <Link
            to="/track"
            className="btn-primary desktop-cta"
            aria-label="Track Package"
          >
            Track Package
          </Link>

          <button
            ref={toggleRef} // NEW: attach ref
            onClick={() => setOpen((s) => !s)}
            aria-controls="mobile-menu"
            aria-expanded={open}
            className="mobile-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU (overlay panel) */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-menu ${open ? "open" : "closed"}`}
        aria-hidden={!open}
      >
        <div className="mobile-menu-inner">
          <nav aria-label="Mobile navigation" className="mobile-nav">
            <Nav to="/">Home</Nav>
            <Nav to="/track">Track</Nav>
            <Nav to="/about">About</Nav>
            <Nav to="/contact">Contact</Nav>
          </nav>

          <div className="mobile-cta">
            <Link
              to="/track"
              className="btn-primary btn-block"
              onClick={() => setOpen(false)}
            >
              Track Package
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
