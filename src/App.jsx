import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TrackingPage from "./pages/TrackingPage";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import TrackingSearchPage from "./pages/TrackingSearchPage";
import Preloader from "./components/Preloader";

const App = () => {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowPreloader(false), 2200);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--forest)", // your dark forest green
            color: "var(--bg)", // white text (matches body background)
            fontWeight: 500,
            borderRadius: "var(--radius-md)", // consistent with your global radius
            padding: "12px 18px",
            boxShadow: "var(--shadow-sm)",
          },
          success: {
            iconTheme: {
              primary: "var(--light-green)",
              secondary: "var(--bg)",
            },
          },
          error: {
            iconTheme: {
              primary: "#ff6b6b",
              secondary: "var(--bg)",
            },
          },
        }}
      />
      <Preloader
        loading={showPreloader}
        onHidden={() => setShowPreloader(false)}
      />

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/track" element={<TrackingSearchPage />} />
          <Route path="/track/:id" element={<TrackingPage />} />
        </Routes>
      </main>

      {/* Footer can be added later if needed */}
      <Footer />
    </div>
  );
};

export default App;
