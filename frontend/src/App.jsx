import { useRef } from "react";
import HazardMap from "./components/HazardMap";
import SimulationPanel from "./components/SimulationPanel";

function App() {
  const mapRef = useRef();

  const refreshMap = () => {
    if (mapRef.current) {
      mapRef.current.refreshMap();
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>
        Cloud-Based Crowdsourced Road Hazard Detection (Prototype)
      </h2>

      <SimulationPanel onSimulationComplete={refreshMap} />

      <HazardMap ref={mapRef} />
    </div>
  );
}

export default App;
