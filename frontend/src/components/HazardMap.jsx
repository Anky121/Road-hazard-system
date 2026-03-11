import { forwardRef, useImperativeHandle } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";



// Function to choose marker color based on severity
const getMarkerIcon = (severity) => {
  let color = "green";

  if (severity === "SEVERE") color = "red";
  else if (severity === "MODERATE") color = "orange";

  return new L.Icon({
    iconUrl: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
    iconSize: [32, 32]
  });
};

const HazardMap= forwardRef((props,ref) => {
    useImperativeHandle(ref, () => ({
    refreshMap() {
      fetchHazards();
    }
  }));

  const [hazards, setHazards] = useState([]);

  useEffect(() => {
    fetchHazards();

    const interval = setInterval(() => {
      fetchHazards();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchHazards = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/hazards/active");
      setHazards(response.data);
    } catch (error) {
      console.error("Error fetching hazards:", error);
    }
  };

  return (
    <MapContainer center={[25.0, 87.0]} zoom={13} style={{ height: "90vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {hazards.map((hazard) => (
        <Marker
          key={hazard._id}
          position={[hazard.latitude, hazard.longitude]}
          icon={getMarkerIcon(hazard.severityLevel)}
        >
        <Popup>
            <div style={{ minWidth: "150px" }}>
              <h4 style={{ margin: "0 0 5px 0" }}>
                {hazard.severityLevel}
              </h4>

              <p style={{ margin: "4px 0" }}>
                Severity: {hazard.severityPercentage}%
              </p>

              <p style={{ margin: "4px 0" }}>
                Status: {hazard.status}
              </p>
            </div>
        </Popup>

        </Marker>
      ))}
    </MapContainer>
  );
})

export default HazardMap;