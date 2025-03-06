import React, { useRef, useEffect, useState } from "react";
import "./Map.css";

const loadGoogleMapsScript = (callback) => {
  if (window.google && window.google.maps) {
    callback();
    return;
  } // If window.google.maps is already available, the script has already been loaded, so we call the callback immediately.

  if (document.querySelector("script[src*='maps.googleapis.com']")) {
    console.log("Google Maps script already loaded.");
    return;
  } //If the script is already in the process of loading (<script> tag exists), we prevent duplicate requests.

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
  // The script is created and the source is set to the Google Maps API URL with the API key
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
  // Creates a new Google Maps instance in the <div> referenced by mapRef. A marker is placed at the center coordinates.

  return <div ref={mapRef} className={`map ${props.className}`} style={props.style} />;
};

export default Map;
