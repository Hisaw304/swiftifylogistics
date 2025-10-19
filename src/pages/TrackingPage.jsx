// src/pages/TrackingPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import productImage from "../assets/img_6502.png";
import MapRoute from "../components/MapRoute";
import { generateRoute } from "../../api/routeGenerator";
import { Package } from "lucide-react"; // optional icon; remove if not available

// --- small inline ProgressBar component used in the layout ---
function ProgressBar({ progress = 0, status = "Shipped" }) {
  const colorClass =
    status === "Delivered"
      ? "bg-green-500"
      : progress >= 60
      ? "bg-blue-500"
      : "bg-yellow-500";
  return (
    <div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className={`h-full ${colorClass}`}
        />
      </div>
      <div className="mt-2 text-xs text-gray-500">{progress}% complete</div>
    </div>
  );
}

// --- small helpers used in UI ---
function formatTime(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  } catch (e) {
    return dateStr;
  }
}

function formatLocation(loc) {
  if (!loc) return "—";
  if (typeof loc === "string") return loc;
  if (loc.city && loc.state) return `${loc.city}, ${loc.state}`;
  return "—";
}

// basic statusInfo object for CTA note
const statusInfo = {
  shipped: {
    text: "Your package is on the way.",
    link: null,
    color: "text-blue-700",
  },
  delivered: {
    text: "Your package has been delivered.",
    link: null,
    color: "text-green-700",
  },
  "on hold": {
    text: "⚠️ Your order is currently on hold. Delivery pending tax clearance. Please contact support for more details.",
    link: "/contact",
    color: "text-red-700",
  },
};

const TrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // keep original guard you had
  useEffect(() => {
    if (!location.state?.fromHome) {
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  // minimal/mock tracking data (fall back)
  // Mock tracking data (kept for demonstration)
  const trackingData = {
    R57LX3PA912F: {
      status: "Shipped",
      deliveryDate: "Arriving Monday, July 29",
      product: "Safe Box",
      quantity: 1,
      name: "Gene Barber",
      address: "1108 Blankets Creek Dr Canton Georgia 30114, USA",
    },
    T84QZ7NK305H: {
      status: "Delivered",
      deliveryDate: "Delivered Friday, July 19",
      product: "Running Shoes - Size 10",
      quantity: 2,
      name: "Emily Carter",
      address: "123 Main Street, Austin, TX 73301, USA",
    },
    M29DW6VC478J: {
      status: "On Hold",
      deliveryDate: "Pending — awaiting clearance",
      product: "Safe Box (contains confidential items)",
      quantity: 1,
      name: "Michael Smith",
      address: "456 Oak Drive, San Diego, CA 92103, USA",
    },
  };

  const data = trackingData[id] || {
    status: "Shipped",
    deliveryDate: "Pending",
    product: "Demo item",
    quantity: 1,
    name: "Demo Recipient",
    address: "Demo address",
    shipmentDate: "2025-10-15",
  };

  const status = data.status || "Shipped";

  // --- route + index state (index controlled in code / console) ---
  const defaultRoute = useMemo(
    () =>
      generateRoute(
        "United States Postal Service, 421 8th Ave, New York, NY 10001",
        "1108 Blankets Creek Dr Canton Georgia 30114"
      ),
    []
  );

  const route = defaultRoute || [];
  const [routeIndex, setRouteIndex] = useState(2);
  const [prevRouteIndex, setPrevRouteIndex] = useState(null);

  // prevRouteIndex for animated marker interpolation
  useEffect(() => {
    setPrevRouteIndex(routeIndex - 1 >= 0 ? routeIndex - 1 : null);
  }, [routeIndex]);

  // compute progress; Delivered forces 100%
  const progress = useMemo(() => {
    if (!route.length) return 0;
    if (status === "Delivered") return 100;
    const len = Math.max(1, route.length - 1);
    const clamped = Math.max(0, Math.min(routeIndex, route.length - 1));
    return Math.round((clamped / len) * 100);
  }, [routeIndex, route.length, status]);

  // expose safe dev helpers on window for manual control in console
  useEffect(() => {
    window.setRouteIndex = (n) => {
      if (typeof n !== "number" || Number.isNaN(n)) return;
      const clamped = Math.max(0, Math.min(Math.floor(n), route.length - 1));
      setRouteIndex(clamped);
    };
    window.incRouteIndex = () =>
      setRouteIndex((i) => Math.min(i + 1, route.length - 1));
    window.decRouteIndex = () => setRouteIndex((i) => Math.max(i - 1, 0));
    window.getRouteIndex = () => routeIndex;

    return () => {
      try {
        delete window.setRouteIndex;
        delete window.incRouteIndex;
        delete window.decRouteIndex;
        delete window.getRouteIndex;
      } catch (e) {}
    };
  }, [route.length, routeIndex]);

  // small image fallback state (optional)
  const [imgError, setImgError] = useState(false);
  const imgSrc = imgError ? "/placeholder.png" : productImage;

  // helper values used in layout
  const currentIndex = routeIndex;
  const indexForRender = currentIndex;
  const prevLocation =
    prevRouteIndex != null && route[prevRouteIndex]
      ? route[prevRouteIndex].location
      : null;
  const routeToRender = route;

  const statusNote = statusInfo[status?.toLowerCase()];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="tracking-container max-w-6xl mx-auto mt-8 px-4 pb-12"
    >
      {/* decorative small TRACKING label */}
      <div className="flex items-center gap-3 mb-3">
        <span className="shape shape-left" aria-hidden>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="59"
            height="5"
            viewBox="0 0 59 5"
            fill="none"
          >
            <rect width="50" height="5" rx="2.5" fill="var(--light-green)" />
            <circle cx="56.5" cy="2.5" r="2.5" fill="var(--light-green)" />
          </svg>
        </span>

        <span
          className="uppercase text-sm font-semibold"
          style={{ color: "var(--forest)" }}
        >
          TRACKING
        </span>

        <span className="shape shape-right" aria-hidden>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="59"
            height="5"
            viewBox="0 0 59 5"
            fill="none"
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

      {/* Header + progress (progress moved here) */}
      {/* === Tracking Information Section === */}
      <div className="flex items-start justify-between gap-4 mb-4 mt-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-h1">
            Tracking Information
          </h1>
        </div>
      </div>

      {/* === Progress Section Wrapper === */}
      <div className="progress-section-wrapper">
        <div className="md:col-span-1 mb-6 bg-white rounded-lg p-4 shadow-sm trk-card progress-card">
          <div className="text-xs text-gray-500">Delivery Progress</div>
          <div className="mt-2">
            <ProgressBar progress={progress} status={status} />
            <div className="text-xs text-gray-400 mt-1">
              {progress}% • Checkpoint{" "}
              {Math.min(currentIndex + 1, route.length)} of{" "}
              {route.length || "?"}
            </div>
          </div>
        </div>
      </div>

      {/* CTA-style tracking summary card (prominent) */}
      <div className="tracking-cta trk-card rounded-lg p-4 shadow-md mb-6 card-bordered">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="inline-block card-heading-inline">Tracking ID</div>
            <div className="mt-2 text-lg md:text-2xl font-bold break-words card-id">
              {id}
            </div>
            <div className="mt-1 text-sm text-muted card-product">
              {data?.product || ""}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full md:w-auto">
            {/* Left section: Shipped / Expected */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div>
                <div className="card-heading">Shipped</div>
                <div className="mt-1 text-sm md:text-base font-medium">
                  October 20, 2025
                </div>
              </div>

              <div>
                <div className="card-heading">Expected</div>
                <div className="mt-1 text-sm md:text-base font-medium">
                  October 22, 2025
                </div>
              </div>
            </div>

            {/* Right section: Status */}
            <div>
              <div className="card-heading">Status</div>
              <div className="mt-1">
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium status-pill-inline">
                  {status}
                </div>
              </div>
            </div>
          </div>
        </div>

        {statusNote && (
          <div
            className={`mt-4 trk-status-note p-3 rounded border ${
              status === "Delivered"
                ? "bg-green-50 border-green-200"
                : status === "Shipped" || status === "On the Way"
                ? "bg-blue-50 border-blue-200"
                : status === "On Hold"
                ? "bg-red-50 border-red-200"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div
              className={`text-sm font-medium ${
                status === "Delivered"
                  ? "text-green-800"
                  : status === "Shipped" || status === "On the Way"
                  ? "text-blue-800"
                  : status === "On Hold"
                  ? "text-red-800"
                  : "text-gray-800"
              }`}
            >
              {statusNote.text}
            </div>

            {statusNote.link && (
              <div className="mt-2">
                <a
                  href={statusNote.link}
                  className={`underline ${
                    status === "Delivered"
                      ? "text-green-700 hover:text-green-900"
                      : status === "Shipped" || status === "On the Way"
                      ? "text-blue-700 hover:text-blue-900"
                      : status === "On Hold"
                      ? "text-red-700 hover:text-red-900"
                      : "text-blue-700 hover:text-blue-900"
                  }`}
                >
                  Contact support
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* main grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="md:col-span-1 card card-bordered">
          {/* Image */}
          <div className="w-full h-64 bg-gray-50 rounded overflow-hidden flex items-center justify-center mb-4 image-wrap">
            <img
              src={imgSrc}
              alt={data?.product || "Product image"}
              onError={() => setImgError(true)}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Shipment Summary Card */}
          <div className="card-section bg-card card-bordered">
            <div className="flex items-center justify-between text-sm text-muted">
              <div className="flex items-center gap-2">
                <Package size={14} />
                <div>
                  <div className="font-medium text-dark">
                    {data?.product || "Secure Safe Box"}
                  </div>
                  <div className="text-xs text-muted">
                    Service · Shipment from New York → Atlanta
                  </div>
                </div>
              </div>

              <div>Qty: {data?.quantity ?? 1}</div>
            </div>

            <div className="mt-3 text-sm text-dark space-y-1 border-top pt-2">
              <div>
                <span className="font-medium">Contents:</span> Fireproof safe
                box
              </div>
              <div>
                <span className="font-medium">Declared Value:</span> $3,000,000
              </div>
              <div>
                <span className="font-medium">Note:</span> Password sealed in
                tamper-proof envelope and delivered only to verified recipient.
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs text-muted">Current status</div>
              <div className="mt-1">
                <div className="status-pill-inline">{status}</div>
              </div>
            </div>
          </div>

          {/* Progress Card (kept as small summary) */}
          <div className="card-section mt-4 card-bordered">
            <div className="card-heading-small">Delivery Progress</div>
            <div className="mt-2">
              <div className="small-progress-wrap">
                <div className="small-progress-bar">
                  <div
                    className="small-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-muted mt-1">
                  {progress}% • Checkpoint{" "}
                  {Math.min(indexForRender + 1, routeToRender.length)} of{" "}
                  {routeToRender.length || "?"}
                </div>
              </div>
            </div>
          </div>

          {/* Recipient Information Card */}
          <div className="card-section mt-4 card-bordered">
            <div className="card-heading">Recipient Information</div>
            <div className="text-sm text-dark space-y-1 mt-2">
              <div>
                <span className="font-medium">Name:</span> {data?.name || "—"}
              </div>
              <div>
                <span className="font-medium">Address:</span>{" "}
                {data?.address || "—"}
              </div>
            </div>
          </div>

          {/* Sender Information */}
          <div className="card-section mt-4 card-bordered">
            <div className="card-heading">Sender Information</div>
            <div className="text-sm text-dark space-y-1 mt-2">
              <div>
                <span className="font-medium">Sender:</span> Natasha Lorena
              </div>
              <div>
                <span className="font-medium">Sender Address:</span> 421 8th
                Ave, New York, NY 10001, USA
              </div>
            </div>
          </div>

          {/* Dates Card */}
          <div className="card-section mt-4 card-bordered">
            <div className="card-heading">Dates</div>
            <div className="text-sm text-dark mt-2">
              <div>
                <span className="font-medium">Shipped:</span> July 15, 2025
              </div>
              <div className="mt-1">
                <span className="font-medium">Expected:</span> July 29, 2025
              </div>
            </div>
          </div>
        </div>

        {/* Right column (map + route card) */}
        <div className="md:col-span-2 space-y-6">
          <div className="card card-bordered">
            <div className="card-heading">Route & Map</div>
            <div className="rounded overflow-hidden h-[420px] bg-gray-50 mt-3">
              {routeToRender.length > 0 ? (
                <MapRoute
                  originLabel="United States Postal Service, 421 8th Ave, New York, NY 10001"
                  destLabel="1108 Blankets Creek Dr Canton Georgia 30114"
                  currentIndex={indexForRender}
                  prevIndex={prevRouteIndex}
                  height={420}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-muted">
                  Map will appear when route data is available
                </div>
              )}
            </div>
          </div>

          {/* small note area (keeps previous status note styling) */}
          {statusNote && (
            <div className="text-center font-medium status-note-plain">
              {statusNote.text}
              {statusNote.link && (
                <>
                  {" "}
                  <a
                    href={statusNote.link}
                    className="underline status-note-link"
                  >
                    Contact support
                  </a>
                  .
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TrackingPage;
