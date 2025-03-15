import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../CSS/Map.css";
import emailjs from "@emailjs/browser";

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
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitCount, setSubmitCount] = useState(0);
  const [formData, setFormData] = useState({});

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    console.log("Form Data Before Sending:", formData);

    e.preventDefault();

    if (submitCount >= 5) {
      setSubmitError("You have reached the maximum number of submissions.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/save-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitCount(submitCount + 1);
        alert("Form submitted successfully!");
        setShowForm(false);
        setSubmitError("");

        const emailResponse = await sendEmail(formData);
        if (emailResponse) {
          console.log("Email sent successfully");
        } else {
          console.log("Error sending email");
        }
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  // Handle Email Sending
  const sendEmail = async (formData) => {
    const emailTemplateParams = {
      to_name: "Admin",
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      store_name: formData.storeName,
    };

    try {
      const result = await emailjs.send(
        "service_i5w8e6j",
        "template_gzgzjrq",
        emailTemplateParams,
        "jbtlMNNQBfxu8oioy"
      );
      return result;
    } catch (error) {
      console.error("Error sending email:", error);
      return null;
    }
  };

  return (
    <>
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
  
      {/* Button to toggle form visibility */}
{/* Button to toggle form visibility */}
<button onClick={() => setShowForm(true)} className="unique-toggle-button">
  Contact Us
</button>

{/* Contact Form */}
{showForm && (
  <div className="unique-form-container">
<button 
  style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#333",
    width: "30px",
    height: "30px",
    lineHeight: "30px",
    textAlign: "center",
    borderRadius: "50%",
  }} 
  onClick={() => setShowForm(false)}
>
  ✖
</button>

    <h3>Contact Us</h3>
    {submitError && <div style={{ color: "red" }}>{submitError}</div>}

    <form onSubmit={handleFormSubmit}>
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
      </label>
      <label>
        Store Name:
        <input type="text" name="storeName" value={formData.storeName} onChange={handleInputChange} required />
      </label>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
      </label>
      <label>
        Message:
        <textarea name="message" value={formData.message} onChange={handleInputChange} required />
      </label>
      <button type="submit">Submit</button>
    </form>
  </div>
)}


    </>
  );
  
};

export default MergedMap;
