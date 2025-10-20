// src/pages/TrackSearchPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, ArrowUp } from "lucide-react";
import HowItWorks from "../components/HowItWorks"; // updated component below
import topBg from "../assets/service-road.jpg"; // optional — will be covered by CSS overlay

const RECENT_KEY = "shiptrace_recent_tracks_v1";

export default function TrackSearchPage() {
  const [trackingId, setTrackingId] = useState("");
  const [recent, setRecent] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem(RECENT_KEY);
    if (raw) {
      try {
        setRecent(JSON.parse(raw));
      } catch {
        setRecent([]);
      }
    }
  }, []);

  const pushRecent = (id) => {
    if (!id) return;
    const normalized = id.trim();
    if (!normalized) return;
    const next = [normalized, ...recent.filter((r) => r !== normalized)].slice(
      0,
      6
    );
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {}
  };

  const handleTrack = (e) => {
    if (e) e.preventDefault();
    const id = (trackingId || "").trim();
    if (!id) {
      toast.error("Please enter a tracking ID");
      inputRef.current?.focus();
      return;
    }
    pushRecent(id);
    navigate(`/track/${encodeURIComponent(id)}`, {
      state: { fromSearch: true },
    });
  };

  const handleRecentClick = (id) => {
    setTrackingId(id);
    pushRecent(id);
    navigate(`/track/${encodeURIComponent(id)}`, {
      state: { fromSearch: true },
    });
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleTrack(e);
  };

  return (
    <div>
      {/* Top hero */}
      <section
        className="track-top"
        style={{ backgroundImage: topBg ? `url(${topBg})` : undefined }}
      >
        <div className="overlay" aria-hidden />

        <div
          className="container text-center"
          style={{ position: "relative", zIndex: 10 }}
        >
          <div className="align-center" style={{ marginBottom: 18 }}>
            <div className="small-label">
              <svg
                width="59"
                height="5"
                viewBox="0 0 59 5"
                fill="none"
                aria-hidden
              >
                <rect
                  width="50"
                  height="5"
                  rx="2.5"
                  fill="var(--light-green)"
                />
                <circle cx="56.5" cy="2.5" r="2.5" fill="var(--light-green)" />
              </svg>
              <span style={{ color: "white" }}>TRACKING</span>
              <svg
                width="59"
                height="5"
                viewBox="0 0 59 5"
                fill="none"
                aria-hidden
                style={{ transform: "scaleX(-1)" }}
              >
                <rect
                  width="50"
                  height="5"
                  rx="2.5"
                  fill="var(--light-green)"
                />
                <circle cx="56.5" cy="2.5" r="2.5" fill="var(--light-green)" />
              </svg>
            </div>
          </div>

          <div
            style={{ textAlign: "center", color: "white", marginBottom: 20 }}
          >
            <h1 className="h1" style={{ color: "white" }}>
              Track shipments with Swiftify Logistics
            </h1>
            <p
              className="lead"
              style={{ color: "rgba(255,255,255,0.9)", marginTop: 8 }}
            >
              Enter your tracking ID to see live status, history, and estimated
              delivery times — secure and reliable.
            </p>
          </div>

          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <form
              onSubmit={handleTrack}
              className="track-card"
              aria-label="Track shipment form"
            >
              <div className="search-row" style={{ display: "flex", gap: 12 }}>
                <label style={{ position: "relative", flex: 1 }}>
                  <Search
                    style={{
                      position: "absolute",
                      left: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#9aa4af",
                    }}
                  />
                  <input
                    ref={inputRef}
                    className="input-track"
                    placeholder="Enter tracking ID (e.g. A73BX9LP215F)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    onKeyDown={onKeyDown}
                    aria-label="Tracking ID"
                  />
                </label>

                <button
                  type="submit"
                  onClick={handleTrack}
                  className="btn btn-cta"
                  aria-label="Track shipment"
                  style={{ minWidth: 140 }}
                >
                  <span>Track</span>
                  <ArrowUp style={{ transform: "rotate(0deg)" }} />
                </button>
              </div>

              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "rgba(255,255,255,0.95)",
                }}
              >
                <div className="text-black">
                  Example:{" "}
                  <strong style={{ color: "var(--light-green)" }}>
                    A73BX9LP215F
                  </strong>
                </div>
                <div>
                  Need help?{" "}
                  <a
                    href="/contact"
                    style={{
                      color: "rgba(255,255,255,0.95)",
                      textDecoration: "underline",
                    }}
                  >
                    Contact support
                  </a>
                </div>
              </div>

              {recent.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <div
                    style={{ color: "rgba(255,255,255,0.92)", marginBottom: 8 }}
                  >
                    Recent searches
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {recent.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRecentClick(r)}
                        className="recent-chip"
                        aria-label={`Track ${r}`}
                      >
                        <span
                          style={{
                            maxWidth: 160,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {r}
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          localStorage.removeItem(RECENT_KEY);
                        } catch {}
                        setRecent([]);
                      }}
                      className="recent-chip"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Page content */}
      <main style={{ padding: "2.5rem 0" }} className="container">
        <section className="max-w-[980px] mx-auto mb-5 px-4 sm:px-6">
          <h2 className="h2">Quick tracking help</h2>
          <p className="text-muted mt-2">
            If you don't have a tracking ID yet, check your order confirmation
            email or contact the sender. Tracking details show on the tracking
            page after search.
          </p>
        </section>

        {/* How it works component (below) */}
        <HowItWorks />
      </main>
    </div>
  );
}
