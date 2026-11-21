/**
 * Places for the pickers. The course release has no maps or geocoding (Barikoi
 * and OSRM are out of scope), so riders and drivers choose a known Dhaka place,
 * use the device location, or type coordinates.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Place extends LatLng {
  label: string;
}

export const DHAKA_PLACES: readonly Place[] = [
  { label: 'Agargaon', lat: 23.7778, lng: 90.3802 },
  { label: 'Airport (HSIA)', lat: 23.8433, lng: 90.3978 },
  { label: 'Badda', lat: 23.7806, lng: 90.4267 },
  { label: 'Banani', lat: 23.794, lng: 90.4043 },
  { label: 'Bashundhara R/A', lat: 23.8193, lng: 90.4526 },
  { label: 'Dhanmondi 27', lat: 23.7465, lng: 90.376 },
  { label: 'Farmgate', lat: 23.7577, lng: 90.3897 },
  { label: 'Gulshan 1', lat: 23.7782, lng: 90.4182 },
  { label: 'Gulshan 2', lat: 23.7925, lng: 90.4078 },
  { label: 'Jatrabari', lat: 23.7104, lng: 90.434 },
  { label: 'Kamalapur Station', lat: 23.732, lng: 90.426 },
  { label: 'Karwan Bazar', lat: 23.7509, lng: 90.3935 },
  { label: 'Kuril', lat: 23.8135, lng: 90.4245 },
  { label: 'Malibagh', lat: 23.7491, lng: 90.413 },
  { label: 'Mirpur 10', lat: 23.8069, lng: 90.3687 },
  { label: 'Mohakhali', lat: 23.7806, lng: 90.407 },
  { label: 'Mohammadpur', lat: 23.7662, lng: 90.3589 },
  { label: 'Motijheel', lat: 23.733, lng: 90.4172 },
  { label: 'New Market', lat: 23.734, lng: 90.3846 },
  { label: 'Notun Bazar', lat: 23.7979, lng: 90.4234 },
  { label: 'Rampura', lat: 23.7614, lng: 90.4198 },
  { label: 'Sadarghat', lat: 23.7085, lng: 90.411 },
  { label: 'Shahbagh', lat: 23.7387, lng: 90.3958 },
  { label: 'Uttara Sector 7', lat: 23.8728, lng: 90.3984 },
];

/**
 * Straight-line distance in km, two decimals. The backend measures the same way
 * when no route distance is sent; sending it explicitly keeps the quote and the
 * booked fare identical.
 */
export function distanceKm(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(6371 * 2 * Math.asin(Math.sqrt(h)) * 100) / 100;
}

/** The device's position, or null when the user refuses or the browser has none. */
export function currentPosition(): Promise<LatLng | null> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: round(pos.coords.latitude), lng: round(pos.coords.longitude) }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30_000 },
    );
  });
}

function round(value: number): number {
  return Math.round(value * 1e6) / 1e6;
}
