// /api/shared/routeGenerator.js
// Simple deterministic route generator: USPS NYC -> Canton, GA
// Returns ~8 realistic checkpoints (including origin + dest)

const ROUTE = [
  // Origin: United States Postal Service (421 8th Ave, New York, NY 10001)
  {
    city: "New York",
    state: "NY",
    zip: "10001",
    coords: [-73.9935, 40.7532], // [lng, lat] - approximate for 8th Ave / 34th St area
  },
  {
    city: "Philadelphia",
    state: "PA",
    zip: "19102",
    coords: [-75.1652, 39.9526],
  },
  { city: "Baltimore", state: "MD", zip: "21201", coords: [-76.6122, 39.2904] },
  {
    city: "Washington",
    state: "DC",
    zip: "20001",
    coords: [-77.0369, 38.9072],
  },
  { city: "Richmond", state: "VA", zip: "23219", coords: [-77.436, 37.5407] },
  { city: "Charlotte", state: "NC", zip: "28202", coords: [-80.8431, 35.2271] },
  { city: "Atlanta", state: "GA", zip: "30301", coords: [-84.388, 33.749] },
  // Destination: 1108 Blankets Creek Dr, Canton, GA 30114 (approx)
  { city: "Canton", state: "GA", zip: "30114", coords: [-84.4908, 34.2368] },
];

export function generateRoute(originLabel, destLabel) {
  // This generator is deterministic: it will return the slice from
  // ROUTE including origin -> ... -> dest if labels match cities,
  // otherwise return full ROUTE as default.
  if (!originLabel || !destLabel) {
    return ROUTE.map((c, i) => ({
      city: `${c.city}, ${c.state}`,
      zip: c.zip,
      location: { type: "Point", coordinates: c.coords },
      eta: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
    }));
  }

  const norm = (s) => s.toLowerCase();
  const originIdx = ROUTE.findIndex((r) =>
    norm(originLabel).includes(r.city.toLowerCase())
  );
  const destIdx = ROUTE.findIndex((r) =>
    norm(destLabel).includes(r.city.toLowerCase())
  );

  // If both found and origin before dest -> slice that direction
  let slice;
  if (originIdx >= 0 && destIdx >= 0) {
    if (originIdx <= destIdx) slice = ROUTE.slice(originIdx, destIdx + 1);
    else slice = ROUTE.slice(destIdx, originIdx + 1).reverse();
  } else {
    // default: full route
    slice = ROUTE.slice();
  }

  const now = Date.now();
  return slice.map((c, i) => ({
    city: `${c.city}, ${c.state}`,
    zip: c.zip,
    location: { type: "Point", coordinates: c.coords },
    // ETAs are +i days for demo; you can change for real data.
    eta: new Date(now + i * 24 * 60 * 60 * 1000).toISOString(),
  }));
}
