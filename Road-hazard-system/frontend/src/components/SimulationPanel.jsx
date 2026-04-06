import { useState } from "react";
import axios from "axios";

export default function SimulationPanel({ onSimulationComplete }) {
  const [latitude, setLatitude] = useState(25.0);
  const [longitude, setLongitude] = useState(87.0);

  const sendData = async (reported) => {
    try {
      await axios.post("http://localhost:5000/api/hazards/report", {
        latitude: Number(latitude),
        longitude: Number(longitude),
        reported: reported
      });

      alert("Simulation Sent Successfully");

      // Refresh map after simulation
      if (onSimulationComplete) {
        onSimulationComplete();
      }

    } catch (error) {
      console.error("Simulation error:", error);
    }
  };

  return (
    <div style={{ padding: "20px", borderBottom: "1px solid #ccc" }}>
      <h3>Simulation Panel (Prototype Testing)</h3>

      <input
        type="number"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
        placeholder="Latitude"
        style={{ marginRight: "10px" }}
      />

      <input
        type="number"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
        placeholder="Longitude"
        style={{ marginRight: "10px" }}
      />

      <button
        onClick={() => sendData(true)}
        style={{ marginRight: "10px" }}
      >
        Report Hazard
      </button>

      <button
        onClick={() => sendData(false)}
      >
        Safe Vehicle Pass
      </button>
    </div>
  );
}
