// src/components/MapRoute.jsx
import React, { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { generateRoute } from "../../api/routeGenerator";

/**
 * This file contains:
 *  - RouteMap: the detailed Leaflet map implementation (your version).
 *  - MapRoute: a small wrapper that calls generateRoute(originLabel, destLabel)
 *    and passes route + computed current/prev locations into RouteMap.
 *
 * Usage:
 * <MapRoute originLabel={...} destLabel={...} currentIndex={i} prevIndex={j} height={360} />
 *
 * You control the index in code (no UI buttons). Changing the `currentIndex` prop
 * moves the animated marker and updates polylines (MapRoute is pure prop-driven).
 */

/* FitBounds helper */
function FitBounds({ latlngs }) {
  const map = useMap();
  useEffect(() => {
    if (!latlngs || latlngs.length === 0) return;
    try {
      map.fitBounds(latlngs, { padding: [40, 40] });
    } catch (e) {
      // ignore
    }
  }, [map, latlngs]);
  return null;
}

/* Utility: normalize various location shapes into [lat, lng] */
function toLatLng(loc) {
  if (!loc) return null;

  // GeoJSON Point: { type: "Point", coordinates: [lng, lat] }
  if (loc.type === "Point" && Array.isArray(loc.coordinates)) {
    const [lng, lat] = loc.coordinates;
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];
    return null;
  }

  // Array: either [lat, lng] or [lng, lat]
  if (Array.isArray(loc) && loc.length >= 2) {
    const a = Number(loc[0]);
    const b = Number(loc[1]);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
    if (a >= -90 && a <= 90 && b >= -180 && b <= 180) return [a, b];
    return [b, a];
  }

  // Object with lat/lng fields
  if (
    (typeof loc.lat === "number" || typeof loc.lat === "string") &&
    (typeof loc.lng === "number" || typeof loc.lng === "string")
  ) {
    const lat = Number(loc.lat);
    const lng = Number(loc.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];
    return null;
  }

  if (
    (typeof loc.latitude === "number" || typeof loc.latitude === "string") &&
    (typeof loc.longitude === "number" || typeof loc.longitude === "string")
  ) {
    const lat = Number(loc.latitude);
    const lng = Number(loc.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];
    return null;
  }

  return null;
}

/* AnimatedMarker: animates marker when prev->next changes */
function AnimatedMarker({ prev, next, radius = 9, pathOptions }) {
  const markerRef = React.useRef(null);
  const rafRef = React.useRef(null);

  const ANIM_MS = 600;

  useEffect(() => {
    const from = toLatLng(prev);
    const to = toLatLng(next);

    if (!to) {
      return;
    }

    const marker = markerRef.current;
    if (!marker || !marker._map) {
      try {
        // initial set
        if (marker && marker.setLatLng) marker.setLatLng(to);
      } catch (e) {}
      return;
    }

    if (!from) {
      try {
        marker.setLatLng(to);
      } catch (e) {}
      return;
    }

    if (Math.abs(from[0] - to[0]) < 1e-7 && Math.abs(from[1] - to[1]) < 1e-7) {
      try {
        marker.setLatLng(to);
      } catch (e) {}
      return;
    }

    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / ANIM_MS);
      const lat = from[0] + (to[0] - from[0]) * t;
      const lng = from[1] + (to[1] - from[1]) * t;
      try {
        marker.setLatLng([lat, lng]);
      } catch (e) {}
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [prev, next]);

  const center = toLatLng(next) || toLatLng(prev) || [0, 0];
  return (
    <CircleMarker
      center={center}
      radius={radius}
      pathOptions={pathOptions}
      ref={markerRef}
    >
      <Tooltip direction="top" offset={[0, -10]}>
        <div style={{ fontSize: 12, fontWeight: 700 }}>Current location</div>
      </Tooltip>
    </CircleMarker>
  );
}

/* RouteMap component (your implementation) */
function RouteMap({
  route = [],
  currentIndex = 0,
  currentLocation = null,
  prevLocation = null,
  height = 320,
}) {
  const latlngs = useMemo(() => {
    if (!Array.isArray(route)) return [];
    return route
      .map((r) => {
        const coords = r?.location?.coordinates;
        if (!coords || coords.length < 2) return null;
        return [coords[1], coords[0]];
      })
      .filter(Boolean);
  }, [route]);

  const currentLatLng = useMemo(() => {
    const c = toLatLng(currentLocation);
    return c && c.length >= 2 ? c : null;
  }, [currentLocation]);

  const prevLatLng = useMemo(() => {
    const p = toLatLng(prevLocation);
    return p && p.length >= 2 ? p : null;
  }, [prevLocation]);

  const bounds = useMemo(() => {
    const pts = [...latlngs];
    if (currentLatLng) pts.push(currentLatLng);
    return pts.length ? pts : null;
  }, [latlngs, currentLatLng]);

  if (!route || route.length === 0) {
    if (!currentLatLng) {
      return (
        <div className="text-sm text-gray-500">No route data available.</div>
      );
    }
    const center = currentLatLng;
    return (
      <div
        style={{ height }}
        className="w-full rounded overflow-hidden shadow-sm"
      >
        <MapContainer
          center={center}
          zoom={10}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
          attributionControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <CircleMarker
            center={currentLatLng}
            radius={9}
            pathOptions={{
              fillColor: "#2563eb",
              color: "#fff",
              weight: 1,
              fillOpacity: 0.95,
            }}
          >
            <Tooltip direction="top" offset={[0, -10]}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>
                Current location
              </div>
            </Tooltip>
          </CircleMarker>
        </MapContainer>
      </div>
    );
  }

  const completed = latlngs.slice(
    0,
    Math.min(currentIndex + 1, latlngs.length)
  );
  const remaining = latlngs.slice(Math.max(currentIndex, 0));

  const center = latlngs[0] || currentLatLng || [39.5, -98.35];

  return (
    <div
      style={{ height }}
      className="w-full rounded overflow-hidden shadow-sm"
    >
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {bounds && <FitBounds latlngs={bounds} />}

        {completed.length > 1 && (
          <Polyline
            positions={completed}
            pathOptions={{ color: "#16a34a", weight: 4, opacity: 0.95 }}
          />
        )}

        {remaining.length > 1 && (
          <Polyline
            positions={remaining}
            pathOptions={{
              color: "#9ca3af",
              weight: 3,
              dashArray: "6,8",
              opacity: 0.9,
            }}
          />
        )}

        {route.map((cp, i) => {
          const coords = cp?.location?.coordinates;
          if (!coords) return null;
          const pos = [coords[1], coords[0]];
          const done = i <= currentIndex;
          return (
            <CircleMarker
              key={`${i}-${cp.city || i}`}
              center={pos}
              radius={done ? 7 : 5}
              pathOptions={{
                fillColor: done ? "#16a34a" : "#374151",
                color: "#ffffff",
                weight: 1,
                fillOpacity: 1,
              }}
            >
              <Tooltip direction="top" offset={[0, -8]}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{`${i + 1}. ${
                  cp.city || "Checkpoint"
                }`}</div>
                {cp.eta && (
                  <div style={{ fontSize: 11 }}>
                    {new Date(cp.eta).toLocaleString()}
                  </div>
                )}
              </Tooltip>
            </CircleMarker>
          );
        })}

        {currentLatLng && (
          <AnimatedMarker
            prev={prevLatLng}
            next={currentLatLng}
            radius={9}
            pathOptions={{
              fillColor: "#2563eb",
              color: "#fff",
              weight: 1,
              fillOpacity: 0.95,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}

/* Small wrapper component that builds the route and computes current/prev locations */
export default function MapRoute({
  originLabel = "United States Postal Service, 421 8th Ave, New York, NY 10001",
  destLabel = "1108 Blankets Creek Dr Canton Georgia 30114",
  currentIndex = 0,
  prevIndex = null,
  height = 320,
}) {
  const route = useMemo(
    () => generateRoute(originLabel, destLabel),
    [originLabel, destLabel]
  );

  const currentLocation =
    (route && route[currentIndex] && route[currentIndex].location) || null;
  const prevLocation =
    prevIndex != null && route && route[prevIndex] && route[prevIndex].location
      ? route[prevIndex].location
      : null;

  return (
    <RouteMap
      route={route}
      currentIndex={currentIndex}
      currentLocation={currentLocation}
      prevLocation={prevLocation}
      height={height}
    />
  );
}
