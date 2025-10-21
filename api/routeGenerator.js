// /api/shared/routeGenerator.js
// Deterministic multi-route generator for realism
// Each route includes ~8 logical city checkpoints with coordinates + ZIPs.

const ROUTES = {
  // === Route 1: USPS NYC ➜ Canton, GA ===
  ny_to_ga: [
    {
      city: "New York",
      state: "NY",
      zip: "10001",
      coords: [-73.9935, 40.7532],
    },
    {
      city: "Philadelphia",
      state: "PA",
      zip: "19102",
      coords: [-75.1652, 39.9526],
    },
    {
      city: "Baltimore",
      state: "MD",
      zip: "21201",
      coords: [-76.6122, 39.2904],
    },
    {
      city: "Washington",
      state: "DC",
      zip: "20001",
      coords: [-77.0369, 38.9072],
    },
    { city: "Richmond", state: "VA", zip: "23219", coords: [-77.436, 37.5407] },
    {
      city: "Charlotte",
      state: "NC",
      zip: "28202",
      coords: [-80.8431, 35.2271],
    },
    { city: "Atlanta", state: "GA", zip: "30301", coords: [-84.388, 33.749] },
    { city: "Canton", state: "GA", zip: "30114", coords: [-84.4908, 34.2368] },
  ],

  // === Route 2: Los Angeles, CA ➜ Seattle, WA ===
  la_to_seattle: [
    {
      city: "Los Angeles",
      state: "CA",
      zip: "90012",
      coords: [-118.2437, 34.0522],
    },
    {
      city: "Bakersfield",
      state: "CA",
      zip: "93301",
      coords: [-119.0187, 35.3733],
    },
    { city: "Fresno", state: "CA", zip: "93721", coords: [-119.7871, 36.7378] },
    {
      city: "Sacramento",
      state: "CA",
      zip: "95814",
      coords: [-121.4944, 38.5816],
    },
    {
      city: "Redding",
      state: "CA",
      zip: "96001",
      coords: [-122.3917, 40.5865],
    },
    {
      city: "Medford",
      state: "OR",
      zip: "97501",
      coords: [-122.8756, 42.3265],
    },
    {
      city: "Portland",
      state: "OR",
      zip: "97201",
      coords: [-122.6765, 45.5231],
    },
    {
      city: "Seattle",
      state: "WA",
      zip: "98101",
      coords: [-122.3321, 47.6062],
    },
  ],

  // === Route 3: Chicago, IL ➜ Dallas, TX ===
  chicago_to_dallas: [
    { city: "Chicago", state: "IL", zip: "60601", coords: [-87.6232, 41.8818] },
    {
      city: "Springfield",
      state: "IL",
      zip: "62701",
      coords: [-89.6501, 39.7989],
    },
    {
      city: "St. Louis",
      state: "MO",
      zip: "63101",
      coords: [-90.1994, 38.627],
    },
    {
      city: "Little Rock",
      state: "AR",
      zip: "72201",
      coords: [-92.2896, 34.7465],
    },
    {
      city: "Texarkana",
      state: "AR",
      zip: "71854",
      coords: [-94.0377, 33.4418],
    },
    { city: "Tyler", state: "TX", zip: "75701", coords: [-95.3011, 32.3513] },
    { city: "Dallas", state: "TX", zip: "75201", coords: [-96.7969, 32.7767] },
  ],
};

export function generateRoute(originLabel, destLabel) {
  // Determine which route best fits requested cities.
  const norm = (s) => s?.toLowerCase() || "";
  const allRoutes = Object.values(ROUTES);

  // Try to find a matching route
  let selected = allRoutes.find((route) => {
    const cities = route.map((r) => r.city.toLowerCase());
    return (
      cities.some((c) => norm(originLabel).includes(c)) &&
      cities.some((c) => norm(destLabel).includes(c))
    );
  });

  // Default to NYC→GA if no match
  if (!selected) selected = ROUTES.ny_to_ga;

  // Slice between origin and destination
  const originIdx = selected.findIndex((r) =>
    norm(originLabel).includes(r.city.toLowerCase())
  );
  const destIdx = selected.findIndex((r) =>
    norm(destLabel).includes(r.city.toLowerCase())
  );

  let slice;
  if (originIdx >= 0 && destIdx >= 0) {
    slice =
      originIdx <= destIdx
        ? selected.slice(originIdx, destIdx + 1)
        : selected.slice(destIdx, originIdx + 1).reverse();
  } else {
    slice = selected;
  }

  const now = Date.now();
  return slice.map((c, i) => ({
    city: `${c.city}, ${c.state}`,
    zip: c.zip,
    location: { type: "Point", coordinates: c.coords },
    eta: new Date(now + i * 24 * 60 * 60 * 1000).toISOString(),
  }));
}
