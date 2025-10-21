// src/components/HeroSection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Search, ArrowUp } from "lucide-react";
import heroImage from "../assets/hero-bg.jpeg";
import { trackingData } from "../data/trackingData";

const Hero = () => {
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTrack = () => {
    const trimmedId = (trackingId || "").trim().toUpperCase();
    if (!trimmedId) {
      toast.error("Please enter a tracking ID");
      return;
    }

    setLoading(true);
    try {
      if (!trackingData[trimmedId]) {
        toast.error("Tracking ID not found");
        return;
      }

      navigate(`/track/${encodeURIComponent(trimmedId)}`, {
        state: { fromHome: true },
      });
    } catch (err) {
      console.error("track error", err);
      toast.error("Unexpected error — try again");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleTrack();
  };

  return (
    <section
      className="hero-section relative flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* ✅ Subtle greenish-dark overlay */}
      <div className="hero-overlay absolute inset-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="hero-content relative z-10 text-center px-6"
      >
        <h1 className="hero-title">
          Swiftify <span className="highlight">Logistics</span>
          <br />
          Fast. Secure. Reliable.
        </h1>

        <p className="hero-subtitle">
          Real-time shipment tracking with trusted global delivery — simplified.
        </p>

        <div className="hero-search" role="search" aria-label="Track shipment">
          <div className="hero-input-wrapper">
            <Search className="hero-input-icon" />
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter Tracking ID (e.g. A73BX9LP215F)"
              className="hero-input"
              aria-label="Tracking ID"
            />
          </div>

          <button
            onClick={handleTrack}
            disabled={loading}
            className={`hero-btn ${loading ? "loading" : ""}`}
          >
            <span className="btn-text">Track</span>
            <ArrowUp className="btn-arrow" size={16} />
          </button>
        </div>

        <p className="hero-example">
          Example: <span className="example-id">A73BX9LP215F</span>
        </p>
      </motion.div>
    </section>
  );
};

export default Hero;
