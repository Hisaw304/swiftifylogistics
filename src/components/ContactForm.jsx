// src/components/ContactForm.jsx
import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";
import { MapPin, Mail } from "lucide-react";

/**
 * ContactForm
 * - modern contact form (client-side validation)
 * - simulated send (replace the send simulation with EmailJS or your API)
 * - lazy-loading Leaflet map with custom truck SVG markers
 */

// Sample hubs (you provided these; kept for map markers)
const LOCATIONS = [
  { id: "ny", label: "New York, NY", coords: [40.7128, -74.006] },
  { id: "la", label: "Los Angeles, CA", coords: [34.0522, -118.2437] },
  { id: "chi", label: "Chicago, IL", coords: [41.8781, -87.6298] },
  { id: "hou", label: "Houston, TX", coords: [29.7604, -95.3698] },
  { id: "mia", label: "Miami, FL", coords: [25.7617, -80.1918] },
  { id: "atl", label: "Atlanta, GA", coords: [33.749, -84.388] },
  { id: "dal", label: "Dallas, TX", coords: [32.7767, -96.797] },
  { id: "sf", label: "San Francisco, CA", coords: [37.7749, -122.4194] },
  { id: "sea", label: "Seattle, WA", coords: [47.6062, -122.3321] },
  { id: "den", label: "Denver, CO", coords: [39.7392, -104.9903] },
  { id: "phx", label: "Phoenix, AZ", coords: [33.4484, -112.074] },
  { id: "bos", label: "Boston, MA", coords: [42.3601, -71.0589] },
  { id: "phl", label: "Philadelphia, PA", coords: [39.9526, -75.1652] },
  { id: "det", label: "Detroit, MI", coords: [42.3314, -83.0458] },
  { id: "min", label: "Minneapolis, MN", coords: [44.9778, -93.265] },
  { id: "las", label: "Las Vegas, NV", coords: [36.1699, -115.1398] },
  { id: "slc", label: "Salt Lake City, UT", coords: [40.7608, -111.891] },
  { id: "cha", label: "Charlotte, NC", coords: [35.2271, -80.8431] },
  { id: "orl", label: "Orlando, FL", coords: [28.5383, -81.3792] },
  { id: "por", label: "Portland, OR", coords: [45.5152, -122.6784] },
];

const MAP_CENTER = [39.5, -98.35]; // continental US center

// create an L.divIcon with an inline truck SVG — lightweight, avoids external images
function createTruckIcon() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="24" viewBox="0 0 36 24" fill="none">
      <rect x="1" y="6" width="20" height="10" rx="2" fill="#ffffff" stroke="#6b21a8" stroke-width="1.5"/>
      <rect x="21" y="9" width="10" height="7" rx="1" fill="#ffffff" stroke="#6b21a8" stroke-width="1.5"/>
      <path d="M21 12h4" stroke="#6b21a8" stroke-width="1.2" stroke-linecap="round"/>
      <circle cx="8" cy="18" r="2.5" fill="#6b21a8"/>
      <circle cx="26" cy="18" r="2.5" fill="#6b21a8"/>
    </svg>
  `.trim();

  return L.divIcon({
    className: "truck-div-icon",
    html: `
      <div class="truck-marker-wrapper" style="
        display:flex;
        align-items:center;
        justify-content:center;
        width:36px;
        height:24px;
        overflow:visible;
      ">
        ${svg}
      </div>
    `,
    iconSize: [36, 24],
    iconAnchor: [18, 12],
  });
}

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) return;
    try {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [40, 40] });
    } catch (e) {
      // ignore
    }
  }, [map, points]);
  return null;
}

export default function ContactForm() {
  // form state
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // lazy-load map when scrolled into view
  const [mapRef, mapInView] = useInView({
    rootMargin: "300px",
    triggerOnce: true,
  });
  const [mapActive, setMapActive] = useState(false);
  useEffect(() => {
    if (mapInView) setMapActive(true);
  }, [mapInView]);

  // marker icon instance (memo)
  const truckIcon = createTruckIcon();

  // simple validation
  const validate = () => {
    if (!values.name.trim()) return "Please enter your name.";
    if (!values.email.trim()) return "Please enter your email.";
    if (!/^\S+@\S+\.\S+$/.test(values.email))
      return "Please enter a valid email.";
    if (!values.subject.trim()) return "Please enter a subject.";
    if (!values.message.trim()) return "Please enter a message.";
    return null;
  };

  // Simulate send — replace the internals below to call emailjs.sendForm or your API
  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setSubmitting(true);
    try {
      // -------------------------
      // TODO: Replace with EmailJS call:
      // emailjs.sendForm(serviceId, templateId, formRef.current, publicKey)
      // -------------------------

      // Demo send: small delay then success
      await new Promise((res) => setTimeout(res, 900));
      toast.success("Message sent — we’ll get back to you shortly.");
      setValues({ name: "", email: "", subject: "", message: "" });
    } catch (sendErr) {
      console.error(sendErr);
      toast.error("Failed to send — please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      {/* Heading with left/right shapes */}
      <div className="contact-heading">
        <svg
          width="59"
          height="5"
          viewBox="0 0 59 5"
          aria-hidden
          className="heading-shape"
        >
          <rect width="50" height="5" rx="2.5" fill="var(--light-green)" />
          <circle cx="56.5" cy="2.5" r="2.5" fill="var(--light-green)" />
        </svg>

        <h2 className="contact-h2">Contact Swiftify</h2>

        <svg
          width="59"
          height="5"
          viewBox="0 0 59 5"
          aria-hidden
          className="heading-shape"
          style={{ transform: "scaleX(-1)" }}
        >
          <rect width="50" height="5" rx="2.5" fill="var(--light-green)" />
          <circle cx="56.5" cy="2.5" r="2.5" fill="var(--light-green)" />
        </svg>
      </div>

      <div className="contact-wrapper container-lg">
        {/* form column */}
        <div className="contact-form-card">
          <p className="contact-intro">
            Have a question about shipping, quotes, or partnership? Fill the
            form and our team will reply within one business day.
          </p>

          <form className="form-grid" onSubmit={handleSubmit} noValidate>
            <label className="field">
              <span className="label-text">Full name</span>
              <input
                name="name"
                value={values.name}
                onChange={(e) =>
                  setValues((s) => ({ ...s, name: e.target.value }))
                }
                placeholder="Jane Peters"
                disabled={submitting}
              />
            </label>

            <label className="field">
              <span className="label-text">Email address</span>
              <input
                name="email"
                type="email"
                value={values.email}
                onChange={(e) =>
                  setValues((s) => ({ ...s, email: e.target.value }))
                }
                placeholder="you@example.com"
                disabled={submitting}
              />
            </label>

            <label className="field full">
              <span className="label-text">Subject</span>
              <input
                name="subject"
                value={values.subject}
                onChange={(e) =>
                  setValues((s) => ({ ...s, subject: e.target.value }))
                }
                placeholder="E.g. Shipping quote for 200kg"
                disabled={submitting}
              />
            </label>

            <label className="field full">
              <span className="label-text">Message</span>
              <textarea
                name="message"
                rows={6}
                value={values.message}
                onChange={(e) =>
                  setValues((s) => ({ ...s, message: e.target.value }))
                }
                placeholder="Tell us about your shipment, schedule, or question..."
                disabled={submitting}
              />
            </label>

            <div className="form-actions">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send message"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() =>
                  setValues({ name: "", email: "", subject: "", message: "" })
                }
                disabled={submitting}
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Map column */}
        <div className="contact-map-column">
          <div ref={mapRef} className="map-card">
            {mapActive ? (
              <MapContainer
                center={MAP_CENTER}
                zoom={4}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <FitBounds points={LOCATIONS.map((l) => l.coords)} />
                {LOCATIONS.map((loc) => (
                  <Marker key={loc.id} position={loc.coords} icon={truckIcon}>
                    <Popup>
                      <strong>{loc.label}</strong>
                      <div className="muted">Swiftify service hub</div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="map-placeholder">
                <MapPin size={28} className="map-placeholder-icon" />
                <div className="muted mt-2">Map loading…</div>
              </div>
            )}

            {/* floating card */}
            <div className="map-floating">
              <div className="flex items-center gap-2">
                <MapPin size={14} />{" "}
                <span className="small-bold">Nationwide coverage</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Mail size={14} />{" "}
                <a
                  className="underline small-bold"
                  href="mailto:support@swiftifylogistics.com"
                >
                  support@swiftifylogistics.com
                </a>
              </div>
              <div className="mt-2 muted">Mon–Fri • 9:00 AM – 6:00 PM</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
