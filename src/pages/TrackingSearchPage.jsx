import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, ArrowUp } from "lucide-react";
import HowItWorks from "../components/HowItWorks";
import topBg from "../assets/service-road.jpg";
import { trackingData } from "../data/trackingData";

const RECENT_KEY = "shiptrace_recent_tracks_v1";

// single canonical finder (used both here and in TrackingPage)
const findTrackingKey = (maybeId) => {
  if (!maybeId) return null;
  const normalized = String(maybeId).trim().toUpperCase();
  if (trackingData[normalized]) return normalized;
  const found = Object.keys(trackingData).find(
    (k) => String(k).toUpperCase() === normalized
  );
  return found || null;
};

export default function TrackingSearchPage() {
  const [trackingId, setTrackingId] = useState("");
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {
      setRecent([]);
    }
  }, []);

  // store canonical (normalized uppercase) IDs
  const pushRecent = (id) => {
    if (!id) return;
    const normalized = String(id).trim().toUpperCase();
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

  const handleTrack = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    const raw = String(trackingId || "").trim();
    if (!raw) {
      toast.error("Please enter a tracking ID");
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      const key = findTrackingKey(raw);
      console.debug("TrackSearch: raw=", raw, "foundKey=", key);
      if (!key) {
        toast.error("Tracking ID not found");
        inputRef.current?.focus();
        return;
      }

      pushRecent(key);
      // update input to canonical form so user sees normalized value
      setTrackingId(key);

      // IMPORTANT: navigate using the canonical key (no extra encoding)
      navigate(`/track/${key}`, { state: { fromHome: true } });
    } catch (err) {
      console.error("Track error:", err);
      toast.error("Unexpected error — try again");
    } finally {
      setLoading(false);
    }
  };

  const handleRecentClick = (rawId) => {
    if (!rawId) return;
    const key = findTrackingKey(rawId);
    console.debug("Recent click:", rawId, "->", key);
    if (!key) {
      toast.error("Tracking ID not found");
      return;
    }
    // set input to canonical key, store and navigate using canonical key
    setTrackingId(key);
    pushRecent(key);
    navigate(`/track/${key}`, { state: { fromHome: true } });
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleTrack(e);
  };

  return (
    <div>
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

          <div className="track-container">
            <form
              onSubmit={handleTrack}
              className="track-card"
              aria-label="Track shipment form"
            >
              <div className="search-row">
                <label className="input-wrapper">
                  <Search className="input-icon" />
                  <input
                    ref={inputRef}
                    className="input-track"
                    placeholder="Enter tracking ID (e.g. A73BX9LP215F)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    onKeyDown={onKeyDown}
                    aria-label="Tracking ID"
                    autoComplete="off"
                  />
                </label>

                <button
                  type="submit"
                  className="btn btn-cta track-btn"
                  aria-label="Track shipment"
                  disabled={loading}
                >
                  <span className="track-btn-label">
                    {loading ? "Checking..." : "Track"}
                  </span>
                  <ArrowUp className="track-btn-icon" />
                </button>
              </div>

              <div className="form-footer">
                <div className="example">
                  Example:{" "}
                  <strong className="example-code">A73BX9LP215F</strong>
                </div>
                <div className="help-link">
                  Need help? <a href="/contact">Contact support</a>
                </div>
              </div>

              {recent.length > 0 && (
                <div className="recent-section">
                  <div className="recent-title">Recent searches</div>
                  <div className="recent-list">
                    {recent.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRecentClick(r)}
                        className="recent-chip"
                        aria-label={`Track ${r}`}
                      >
                        <span className="recent-chip-text">{r}</span>
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

      <main style={{ padding: "2.5rem 0" }} className="container">
        <section className="max-w-[980px] mx-auto mb-5 px-4 sm:px-6">
          <h2 className="h2">Quick tracking help</h2>
          <p className="text-muted mt-2">
            If you don't have a tracking ID yet, check your order confirmation
            email or contact the sender. Tracking details show on the tracking
            page after search.
          </p>
        </section>

        <HowItWorks />
      </main>
    </div>
  );
}
