import React, { useRef, useEffect, useState } from "react";
import "./Map.css";

const loadGoogleMapsScript = (callback) => {
  if (window.google && window.google.maps) {
    callback();
    return;
  }

  if (document.querySelector("script[src*='maps.googleapis.com']")) {
    console.log("Google Maps script already loaded.");
    return;
  }

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
  script.async = true;
  script.defer = true;
  script.onload = callback;

  document.body.appendChild(script);
};

const Map = ({ center, zoom, ...props }) => {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadGoogleMapsScript(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (isLoaded && window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
      });

      new window.google.maps.Marker({ position: center, map: map });
    }
  }, [isLoaded, center, zoom]);

  return <div ref={mapRef}  className={`map ${props.className}`}
  style={props.style} />;
};

export default Map;
