// src/components/HowItWorks.jsx
import React from "react";
import { FileText, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* Forklift + TwoPeopleExchange icons inlined */
function ForkliftIcon(props) {
  return (
    <svg
      width={props.size || 28}
      height={props.size || 28}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <path
        d="M3 3h8v6H3V3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 9h4l2 4v5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        fill="currentColor"
      />
      <path
        d="M16 6v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TwoPeopleExchangeIcon(props) {
  return (
    <svg
      width={props.size || 28}
      height={props.size || 28}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <path d="M7 11a2 2 0 11-4 0 2 2 0 014 0z" fill="currentColor" />
      <path d="M16 11a2 2 0 11-4 0 2 2 0 014 0z" fill="currentColor" />
      <path
        d="M3 18c1.5-2 4-3 7-3s5.5 1 7 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 18v-2l4-1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 15l-2 0 0 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Steps content tuned for Swiftify Logistics */
const STEPS = [
  {
    id: 1,
    Icon: FileText,
    title: "Register Your Parcel",
    desc: "Quickly create a shipment online or at a Swiftify center. Provide recipient info and delivery preferences.",
  },
  {
    id: 2,
    Icon: ForkliftIcon,
    title: "Secure Handling",
    desc: "Our team inspects and secures every parcel. Fragile items receive protective packaging for safe transport.",
  },
  {
    id: 3,
    Icon: Truck,
    title: "Live in Transit",
    desc: "Shipments move via optimized routes with continuous tracking — receive ETA and location updates in real time.",
  },
  {
    id: 4,
    Icon: TwoPeopleExchangeIcon,
    title: "Delivered Securely",
    desc: "Final-mile delivery to the verified recipient. Proof of delivery is captured and shared with you.",
  },
];

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <section
      className="how-works-section container"
      aria-labelledby="how-it-works-title"
    >
      <div className="how-works-top">
        <div className="small-label">
          {/* left shape */}
          <svg width="59" height="5" viewBox="0 0 59 5" fill="none" aria-hidden>
            <rect width="50" height="5" rx="2.5" fill="var(--light-green)" />
            <circle cx="56.5" cy="2.5" r="2.5" fill="var(--light-green)" />
          </svg>

          <span className="small-label-text">HOW IT WORKS</span>

          {/* right shape (mirrored) */}
          <svg
            width="59"
            height="5"
            viewBox="0 0 59 5"
            fill="none"
            aria-hidden
            style={{ transform: "scaleX(-1)" }}
          >
            <rect width="50" height="5" rx="2.5" fill="var(--light-green)" />
            <circle cx="56.5" cy="2.5" r="2.5" fill="var(--light-green)" />
          </svg>
        </div>

        <h2 id="how-it-works-title" className="h2">
          How Swiftify delivers your parcel
        </h2>

        <p className="lead lead-with-gap">
          We combine secure handling, optimized routing, and simple tracking so
          you always know where your shipment is. Here’s how it works.
        </p>
      </div>

      <div className="how-steps" role="list" aria-label="How it works steps">
        {STEPS.map((step) => {
          const numberText = step.id.toString().padStart(2, "0");
          return (
            <article
              key={step.id}
              role="listitem"
              className="how-card"
              aria-labelledby={`how-step-${step.id}`}
            >
              <div className="step-circle" aria-hidden>
                <step.Icon size={28} />
              </div>

              <div className="step-number" aria-hidden>
                <span>{numberText}</span>
              </div>

              <div className="how-card-body">
                <h3 id={`how-step-${step.id}`} className="step-title">
                  {step.title}
                </h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="how-cta">
        <button className="btn btn-cta" onClick={() => navigate("/")}>
          Learn more
        </button>
      </div>
    </section>
  );
}
