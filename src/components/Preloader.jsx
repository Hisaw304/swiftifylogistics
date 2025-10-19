// src/components/Preloader.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * Preloader
 *
 * Props:
 *  - loading: bool (control externally). If omitted and demo=true, component runs demo.
 *  - progress: number (0-100) optional — shown when provided.
 *  - demo: bool — if true runs demo auto-progress then hides itself.
 *  - text: string optional (message below animation).
 *
 * Usage (controlled):
 *   <Preloader loading={isLoading} progress={progress} />
 *
 * Usage (demo):
 *   <Preloader demo />
 */
export default function Preloader({
  loading: propLoading,
  progress: propProgress,
  demo = false,
  text,
}) {
  const [visible, setVisible] = useState(Boolean(propLoading ?? demo));
  const [progress, setProgress] = useState(
    typeof propProgress === "number" ? propProgress : 0
  );

  // If controlled mode: follow propLoading & propProgress
  useEffect(() => {
    if (typeof propLoading === "boolean") {
      setVisible(propLoading);
    }
  }, [propLoading]);

  useEffect(() => {
    if (typeof propProgress === "number") setProgress(propProgress);
  }, [propProgress]);

  // demo auto-run: simulate loading then hide
  useEffect(() => {
    if (!demo) return;
    setVisible(true);
    setProgress(4);
    let t1 = setTimeout(() => setProgress(28), 500);
    let t2 = setTimeout(() => setProgress(56), 1400);
    let t3 = setTimeout(() => setProgress(84), 2200);
    let t4 = setTimeout(() => setProgress(96), 3000);
    let t5 = setTimeout(() => {
      setProgress(100);
      // hide shortly after full
      setTimeout(() => setVisible(false), 550);
    }, 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [demo]);

  // hide when not visible
  if (!visible) return null;

  return (
    <div
      className="preloader-veil"
      role="status"
      aria-live="polite"
      aria-label="Loading, please wait"
    >
      <div className="preloader-card" aria-hidden={false}>
        {/* SVG truck + motion */}
        <div className="preloader-visual">
          <svg
            className="preloader-truck"
            width="240"
            height="84"
            viewBox="0 0 240 84"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <defs>
              <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--light-green)" />
                <stop offset="100%" stopColor="var(--forest)" />
              </linearGradient>
              <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow
                  dx="0"
                  dy="8"
                  stdDeviation="20"
                  floodColor="#05220b"
                  floodOpacity="0.12"
                />
              </filter>
            </defs>

            {/* road dash background */}
            <rect x="0" y="64" width="240" height="6" fill="#f1f5f3" rx="3" />
            <g className="truck-group" transform="translate(-20,0)">
              {/* truck body */}
              <rect
                x="40"
                y="22"
                rx="6"
                ry="6"
                width="120"
                height="34"
                fill="url(#g1)"
                filter="url(#shadow)"
              />
              {/* cab */}
              <rect
                x="160"
                y="30"
                rx="4"
                ry="4"
                width="46"
                height="24"
                fill="var(--forest)"
              />
              {/* windows */}
              <rect
                x="166"
                y="34"
                width="20"
                height="10"
                rx="2"
                fill="#fff"
                opacity="0.14"
              />
              {/* small stripe */}
              <rect
                x="44"
                y="36"
                width="80"
                height="6"
                rx="3"
                fill="rgba(255,255,255,0.08)"
              />
              {/* wheels (animated spin) */}
              <g className="wheel-left" transform="translate(76,60)">
                <circle
                  cx="0"
                  cy="0"
                  r="8"
                  fill="#fff"
                  stroke="var(--forest)"
                  strokeWidth="2"
                />
                <circle cx="0" cy="0" r="3.6" fill="var(--forest)" />
              </g>
              <g className="wheel-right" transform="translate(156,60)">
                <circle
                  cx="0"
                  cy="0"
                  r="8"
                  fill="#fff"
                  stroke="var(--forest)"
                  strokeWidth="2"
                />
                <circle cx="0" cy="0" r="3.6" fill="var(--forest)" />
              </g>
              {/* accent dot trail */}
              <g className="dot-trail" opacity="0.85">
                <circle cx="24" cy="46" r="2.2" fill="var(--light-green)" />
                <circle cx="4" cy="46" r="2.2" fill="var(--light-green)" />
                <circle cx="-16" cy="46" r="2.2" fill="var(--light-green)" />
              </g>
            </g>
          </svg>

          {/* subtle ring behind */}
          <div className="preloader-ring" aria-hidden />
        </div>

        {/* progress + text */}
        <div className="preloader-meta">
          <div className="preloader-progress">
            <div className="progress-bar-outer" aria-hidden>
              <div
                className="progress-bar-inner"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="progress-text">{progress}%</div>
          </div>

          <div className="preloader-text">{text || "Preparing Swiftify…"}</div>
        </div>
      </div>
    </div>
  );
}

Preloader.propTypes = {
  loading: PropTypes.bool,
  progress: PropTypes.number,
  demo: PropTypes.bool,
  text: PropTypes.string,
};
