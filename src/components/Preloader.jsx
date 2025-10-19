// src/components/Preloader.jsx
import React, { useEffect, useState } from "react";

/**
 * Preloader
 * Props:
 *  - loading: boolean (required) -- show/hide
 *  - text: string (optional)  -- paragraph under the logo
 *  - logoPath: string (optional) -- path to logo image (default: /logo.png in public/)
 */
export default function Preloader({
  loading = true,
  text,
  logoPath = "/logo.png",
}) {
  const [visible, setVisible] = useState(Boolean(loading));
  const [exiting, setExiting] = useState(false);

  // Show when loading flips true
  useEffect(() => {
    if (loading) {
      setExiting(false);
      setVisible(true);
      return;
    }
    // start exit animation then unmount
    if (!loading && visible) {
      setExiting(true);
      const t = setTimeout(() => {
        setVisible(false);
        setExiting(false);
      }, 420); // match CSS fade duration
      return () => clearTimeout(t);
    }
  }, [loading, visible]);

  if (!visible) return null;

  return (
    <div
      className={`sf-preloader-veil ${exiting ? "sf-fade-out" : "sf-fade-in"}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Swiftify"
    >
      <div className="sf-preloader-card" aria-hidden={exiting}>
        <div className="sf-logo-wrap">
          <img
            src={logoPath}
            alt="Swiftify Logistics"
            className="sf-logo-img"
          />
          {/* concentric animated rings above the logo */}
          <div className="sf-ring sf-ring-1" aria-hidden />
          <div className="sf-ring sf-ring-2" aria-hidden />
          <div className="sf-ring sf-ring-3" aria-hidden />
        </div>

        <div className="sf-preloader-texts">
          <h3 className="sf-preloader-title">Swiftify Logistics</h3>
          <p className="sf-preloader-sub">
            Preparing your experience — loading secure routes and live tracking…
          </p>
        </div>
      </div>
    </div>
  );
}
