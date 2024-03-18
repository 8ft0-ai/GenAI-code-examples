
import { Airport } from '../shared/types';

// Haversine formula to calculate distance between two points on Earth
export function calculateDistance(airport1: Airport, airport2: Airport) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = deg2rad(airport2.latitude - airport1.latitude);
  const dLon = deg2rad(airport2.longitude - airport1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(airport1.latitude)) *
      Math.cos(deg2rad(airport2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

