// src/components/WhyShipWithUs.jsx
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const benefits = [
  "Fast and reliable delivery",
  "Real-time tracking updates",
  "Affordable shipping rates",
  "24/7 customer support",
  "Global reach with local expertise",
];

const WhyShipWithUs = () => {
  return (
    <section className="why-ship-section" aria-labelledby="why-ship-title">
      <div className="container-lg">
        <div className="why-grid">
          {/* Image card */}
          <motion.div
            className="why-image-card"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div
              className="image-inner"
              role="img"
              aria-label="Swiftify delivery truck"
            >
              <img
                src="/shipping.jpg"
                alt="Swiftify Logistics delivery truck"
                className="why-image"
              />
              <div className="image-badge">
                <span className="badge-title">Trusted network</span>
                <span className="badge-sub">Nationwide coverage</span>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="why-content"
          >
            <h2 id="why-ship-title" className="why-title">
              Why Ship with Swiftify
            </h2>

            <p className="why-lead">
              We combine operational excellence with clear communication — the
              result is reliable, trackable deliveries that businesses and
              consumers count on.
            </p>

            <ul
              className="why-list"
              role="list"
              aria-label="Benefits of shipping with Swiftify"
            >
              {benefits.map((b, i) => (
                <motion.li
                  key={b}
                  className="why-item"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  viewport={{ once: true }}
                >
                  <span className="why-icon" aria-hidden>
                    <CheckCircle size={18} />
                  </span>
                  <span className="why-text">{b}</span>
                </motion.li>
              ))}
            </ul>

            <div className="why-cta-row">
              <button
                className="btn btn-primary"
                onClick={() => window.location.assign("/contact")}
                aria-label="Get shipping quote"
              >
                Get a quote
              </button>

              <a href="/track" className="why-cta-link">
                Learn how we deliver →
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyShipWithUs;
