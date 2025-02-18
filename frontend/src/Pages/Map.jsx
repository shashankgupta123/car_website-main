import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../CSS/Map.css";

// Fix marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Component to track zoom level
const ZoomTracker = ({ setZoomLevel }) => {
  const map = useMap();
  useEffect(() => {
    const handleZoom = () => setZoomLevel(map.getZoom());
    map.on("zoomend", handleZoom);
    return () => map.off("zoomend", handleZoom);
  }, [map, setZoomLevel]);
  return null;
};

// Component to recenter the map
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
};

const MergedMap = () => {
  const [zoomLevel, setZoomLevel] = useState(12);
  const [userLocation, setUserLocation] = useState(null);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);

  // Fetch Cars from API
  useEffect(() => {
    axios.get("http://localhost:5000/api/cars")
      .then((response) => {
        console.log("Cars API Response:", response.data);
        const carsData = response.data.map(car => ({
          ...car,
          locations: car.locations?.filter(loc => 
            loc.latitude !== undefined && loc.longitude !== undefined
          ) || []
        }));
        setCars(carsData);
      })
      .catch((err) => setError("Error fetching data: " + err.message));
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("User location:", latitude, longitude);
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (err) => setError("Geolocation error: " + err.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Group cars by location
  const locationMap = {};
  cars.forEach(car => {
    car.locations.forEach(loc => {
      const locKey = `${loc.latitude},${loc.longitude}`;
      if (!locationMap[locKey]) {
        locationMap[locKey] = { placeName: loc.placeName, cars: [] };
      }
      locationMap[locKey].cars.push({ name: car.name, quantity: loc.quantity });
    });
  });

  return (
    <div className="map-wrapper">
      <h2>Current Zoom Level: {zoomLevel}</h2>
      {error && <div className="error-message">{error}</div>}

      <MapContainer center={userLocation || [19.076, 72.8777]} zoom={zoomLevel} className="map-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ZoomTracker setZoomLevel={setZoomLevel} />

        {/* User Location Marker */}
        {userLocation && (
          <>
            <RecenterMap center={[userLocation.lat, userLocation.lng]} />
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>You are here</Popup>
            </Marker>
          </>
        )}

        {/* Markers for each unique location */}
        {Object.entries(locationMap).map(([key, { placeName, cars }]) => {
          const [lat, lng] = key.split(",").map(Number);
          return (
            <Marker key={key} position={[lat, lng]}>
              <Popup>
                <b>{placeName}</b>
                <hr />
                {cars.map((car, index) => (
                  <div key={index}>
                    <b>{car.name}</b> 
                  </div>
                ))}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MergedMap;
