// src/components/TrustedBanner.jsx
import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Package, Users, Award, UserPlus, MapPin } from "lucide-react";
import trustedBg from "../assets/service-ocean.jpg"; // keep your image

const STATS = [
  {
    id: 1,
    Icon: Package,
    end: 128742, // realistic number for a mid-sized carrier
    suffix: "+",
    label: "Completed deliveries",
  },
  {
    id: 2,
    Icon: Users,
    end: 112450,
    suffix: "+",
    label: "Satisfied clients",
  },
  { id: 3, Icon: Award, end: 18, suffix: "", label: "Industry awards" },
  { id: 4, Icon: UserPlus, end: 342, suffix: "", label: "Team members" },
  {
    id: 5,
    Icon: MapPin,
    end: 3250432,
    suffix: " km",
    label: "Kilometers covered",
  },
];

export default function TrustedBanner() {
  const [ref, inView] = useInView({ threshold: 0.28, triggerOnce: true });

  return (
    <section
      ref={ref}
      className="trusted-banner relative overflow-hidden py-16"
      aria-label="Trusted by thousands"
      style={{
        backgroundImage: `url(${trustedBg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {/* soft overlay for readability (green tint, subtle) */}
      <div className="trusted-overlay" aria-hidden />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* small decorative label */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="shape shape-left" aria-hidden>
            <svg
              width="59"
              height="5"
              viewBox="0 0 59 5"
              fill="none"
              aria-hidden
            >
              <rect width="50" height="5" rx="2.5" fill="var(--light-green)" />
              <circle cx="56.5" cy="2.5" r="2.5" fill="var(--light-green)" />
            </svg>
          </span>

          <span
            className="uppercase text-sm font-semibold"
            style={{ color: "var(--forest)" }}
          >
            TRUSTED
          </span>

          <span className="shape shape-right" aria-hidden>
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
                transform="matrix(-1 0 0 1 59 0)"
                fill="var(--light-green)"
              />
              <circle
                cx="2.5"
                cy="2.5"
                r="2.5"
                transform="matrix(-1 0 0 1 5 0)"
                fill="var(--light-green)"
              />
            </svg>
          </span>
        </div>

        {/* heading */}
        <div className="text-center mb-10">
          <h2 className="trusted-title">
            How Swiftify earns trust across the USA
          </h2>
          <p className="trusted-sub">
            We combine local knowledge with real-time visibility and secure
            handling — measurable results that our customers rely on.
          </p>
        </div>

        {/* stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-stretch">
          {STATS.map(({ id, Icon, end, suffix, label }) => (
            <div
              key={id}
              className="stat-card group relative rounded-lg p-5"
              role="group"
            >
              {/* icon circle */}
              <div className="mx-auto">
                <div className="stat-circle inline-flex items-center justify-center w-16 h-16 rounded-full border-2">
                  <Icon className="stat-icon" size={22} aria-hidden />
                </div>
              </div>

              {/* number */}
              <div className="mt-4">
                <div className="stat-number">
                  <CountUp
                    start={0}
                    end={inView ? end : 0}
                    duration={2.2}
                    separator=","
                    suffix={suffix}
                  />
                </div>
                <div className="mt-1 stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* footer note */}
        <div className="mt-10 text-center">
          <p className="trusted-note">
            Swiftify Logistics — trusted by businesses and families for secure,
            on-time delivery. Learn more about our network and safety practices.
          </p>
        </div>
      </div>
    </section>
  );
}
