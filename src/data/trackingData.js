// src/data/tracking.js
// Centralized tracking dataset used by TrackingPage
// Each object uses realistic checkpoints via the routeGenerator (originLabel/destLabel)
// Image uses public folder path (e.g. /img_6502.png) — update later as you want.

export const trackingData = {
  // Original example (NYC -> Canton GA)
  R57LX3PA912F: {
    id: "R57LX3PA912F",
    status: "On Hold",
    product: "Safe Box",
    quantity: 1,
    name: "Gene Barber",
    address: "1108 Blankets Creek Dr, Canton, GA 30114, USA",
    // Shipping metadata / display fields
    serviceDescription: "Service · Shipment from New York → Atlanta",
    contents: "Fireproof safe box",
    declaredValue: "$3,000,000",
    note: "Password sealed in tamper-proof envelope and delivered only to verified recipient.",
    senderName: "Natasha Lorena",
    senderAddress:
      "United States Postal Service, 421 8th Ave, New York, NY 10001, USA",
    shippedDate: "October 20, 2025",
    expectedDate: "October 22, 2025",
    // route generator labels (used by MapRoute)
    originLabel:
      "United States Postal Service, 421 8th Ave, New York, NY 10001",
    destLabel: "1108 Blankets Creek Dr Canton Georgia 30114",
    // image stored in public folder -> accessible at /img_6502.png
    image: "/img_6502.png",
    routeIndex: 5,
  },

  // West coast route (Los Angeles -> Seattle)
  LA2SE12345: {
    id: "LA2SE12345",
    status: "On Hold",
    product: "Vintage Vinyl Bundle",
    quantity: 4,
    name: "Alex Johnson",
    address: "1201 1st Ave, Seattle, WA 98101, USA",
    serviceDescription: "Service · Shipment from Los Angeles → Seattle",
    contents: "Assortment of collectible vinyl records",
    declaredValue: "$1,200",
    note: "Package held for additional signature verification.",
    senderName: "Claire Morales",
    senderAddress:
      "Los Angeles Warehouse, 200 W 6th St, Los Angeles, CA 90014, USA",
    shippedDate: "October 20, 2025",
    expectedDate: "October 22, 2025",
    originLabel: "Los Angeles, CA 90012",
    destLabel: "Seattle, WA 98101",
    image: "/img_6502.png",
    routeIndex: 1,
  },

  // Midwest -> South route (Chicago -> Dallas)
  CHIDAL67890: {
    id: "CHIDAL67890",
    status: "Delivered",
    product: "Electronics Kit",
    quantity: 2,
    name: "Samantha Lee",
    address: "1500 Commerce St, Dallas, TX 75201, USA",
    serviceDescription: "Service · Shipment from Chicago → Dallas",
    contents: "Assorted electronics components and peripherals",
    declaredValue: "$2,850",
    note: "Left at front desk. Recipient signed.",
    senderName: "Martin Gomez",
    senderAddress:
      "Chicago Fulfillment Center, 500 S Clark St, Chicago, IL 60605, USA",
    shippedDate: "October 20, 2025",
    expectedDate: "October 22, 2025",
    originLabel: "Chicago, IL 60601",
    destLabel: "Dallas, TX 75201",
    image: "/img_6502.png",
  },

  // fallback/demo example (keeps same shape)
  DEMO00000001: {
    id: "DEMO00000001",
    status: "Shipped",
    product: "Demo item",
    quantity: 1,
    name: "Demo Recipient",
    address: "Demo address",
    serviceDescription: "Service · Demo Shipment",
    contents: "Demo contents",
    declaredValue: "$0.00",
    note: "Demo note.",
    senderName: "Demo Sender",
    senderAddress: "Demo Sender Address",
    shippedDate: "October 20, 2025",
    expectedDate: "October 22, 2025",
    originLabel: "New York, NY",
    destLabel: "Atlanta, GA",
    image: "/img_6502.png",
    routeIndex: 3,
  },
};
