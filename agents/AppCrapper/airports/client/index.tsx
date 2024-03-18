
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import axios from 'axios';
import { Airport, DistanceResponse } from '../shared/types';
import 'leaflet/dist/leaflet.css';
import './index.css';

const airportIcon = new Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function App() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [selectedAirports, setSelectedAirports] = useState<Airport[]>([]);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    axios.get<Airport[]>('/api/airports').then(response => {
      setAirports(response.data);
    });
  }, []);

  useEffect(() => {
    if (selectedAirports.length === 2) {
      const [from, to] = selectedAirports;
      axios.get<DistanceResponse>(`/api/distance?from=${from.code}&to=${to.code}`).then(response => {
        setDistance(response.data.distance);
      });
    } else {
      setDistance(null);
    }
  }, [selectedAirports]);

  function handleAirportClick(airport: Airport) {
    setSelectedAirports(prevSelected => {
      if (prevSelected.length < 2 && !prevSelected.includes(airport)) {
        return [...prevSelected, airport];
      } else if (prevSelected.includes(airport)) {
        return prevSelected.filter(a => a !== airport);
      } else {
        return [airport];
      }
    });
  }

  return (
    <div>
      <h1>Australian Airport Distance Calculator</h1>
      <MapContainer center={[-25.2744, 133.7751]} zoom={4} style={{ height: '400px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {airports.map(airport => (
          <Marker
            key={airport.code}
            position={[airport.latitude, airport.longitude]}
            icon={airportIcon}
            eventHandlers={{
              click: () => handleAirportClick(airport),
            }}
          >
            <Popup>
              <b>{airport.name}</b>
              <br />
              {airport.city}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="selected-airports">
        <h2>Selected Airports:</h2>
        <ul>
          {selectedAirports.map(airport => (
            <li key={airport.code}>
              {airport.name} ({airport.code})
            </li>
          ))}
        </ul>
        {distance !== null && <p>Distance: {distance.toFixed(2)} km</p>}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

