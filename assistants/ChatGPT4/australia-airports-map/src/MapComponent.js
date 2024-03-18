import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import airportData from './airports.json'; // Ensure this file exists with the correct data

function MapComponent({ updateDistance, updateSelectedAirports }) {
  const center = [-25.2744, 133.7751]; // Center of Australia
  const zoom = 4;

  // Fix the default marker icon issue with webpack
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

  // State for the selected airports
  const [selectedAirports, setSelectedAirports] = useState({ firstAirport: null, secondAirport: null });

  

  function LocationMarkers() {
    // useMapEvents({
    //   click() {
    //     setSelectedAirport(null); // Deselect airport on map click
    //   },
    // });

    return (
      <>
        {airportData.map((airport) => (
          <Marker
            key={airport.code}
            position={airport.coordinates}
            eventHandlers={{
              click: () => {
                setSelectedAirports(prevSelectedAirports => {
                  // If the first airport hasn't been selected yet, set it
                  if (!prevSelectedAirports.firstAirport) {
                    return { ...prevSelectedAirports, firstAirport: airport };
                  }
                  // If the first airport is already selected, set the second one
                  // If the second airport is already selected, replace it with the new selection
                  return { firstAirport: prevSelectedAirports.firstAirport, secondAirport: airport };
                });
              },
            }}
          >
            <Popup>{airport.name}</Popup>
          </Marker>
        ))}
      </>
    );
  }

  function calculateDistance(coords1, coords2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (coords2[0] - coords1[0]) * Math.PI / 180;
    const dLon = (coords2[1] - coords1[1]) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coords1[0] * Math.PI / 180) * Math.cos(coords2[0] * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  // Function to handle airport selection
  function handleAirportSelect(airport) {
    setSelectedAirports((prevState) => {
      const newState = !prevState.firstAirport
        ? { ...prevState, firstAirport: airport }
        : { firstAirport: prevState.firstAirport, secondAirport: airport };
      if (newState.firstAirport && newState.secondAirport) {
        const distance = calculateDistance(
          newState.firstAirport.coordinates,
          newState.secondAirport.coordinates
        ).toFixed(2); // Rounds the distance to 2 decimal places
        updateSelectedAirports([newState.firstAirport, newState.secondAirport]); // Update the airports in the App component
        updateDistance(`Distance: ${distance} km`); // Update the distance in the App component
        
      }
      return newState;
    });
  }

  // Calculate distance when two airports are selected
  useEffect(() => {
    if (selectedAirports.firstAirport && selectedAirports.secondAirport) {
      const distance = calculateDistance(
        selectedAirports.firstAirport.coordinates,
        selectedAirports.secondAirport.coordinates
      ).toFixed(2); // Rounds the distance to 2 decimal places

      updateDistance(`Distance: ${distance} km`);
    }
  }, [selectedAirports, updateDistance]);

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        // Using OpenStreetMap tile layer as an example
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright"> OpenStreetMap</a> contributors'
      />
      <LocationMarkers />
    </MapContainer>
  );
}

export default MapComponent;
