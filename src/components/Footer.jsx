import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-container footer-grid">
        <div className="footer-brand">
          <Link
            to="/"
            className="footer-brand-link"
            aria-label="Swiftify Logistics home"
          >
            <img
              src="/logo.png"
              alt="Swiftify Logistics"
              className="brand-logo"
            />
            <span className="brand-text">
              <span className="brand-strong">Swiftify</span>{" "}
              <span className="brand-light">Logistics</span>
            </span>
          </Link>

          <p className="small-muted mt-3">
            Reliable delivery solutions — fast, secure, and trusted worldwide.
          </p>

          <div className="socials" aria-label="Social links">
            <a href="#" aria-label="Twitter" className="social">
              <Twitter size={18} />
            </a>
            <a href="#" aria-label="Instagram" className="social">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="LinkedIn" className="social">
              <Linkedin size={18} />
            </a>
            <a
              href="mailto:support@swiftifylogistics.com"
              aria-label="Email"
              className="social"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4>Company</h4>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Support</h4>
          <ul className="footer-links">
            <li>
              <a href="/">FAQ</a>
            </li>
            <li>
              <a href="/">Help Center</a>
            </li>
            <li>
              <a href="/">Terms</a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <p className="small-muted">
            Email:{" "}
            <a href="mailto:support@swiftifylogistics.com">
              support@swiftifylogistics.com
            </a>
          </p>
          <p className="small-muted">Phone: +1 (555) 123-4567</p>
        </div>
      </div>

      <div className="site-container footer-bottom">
        <div className="copy">
          © {new Date().getFullYear()} Swiftify Logistics. All rights reserved.
        </div>
        <div className="policies">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}
