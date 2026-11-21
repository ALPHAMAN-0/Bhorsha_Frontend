/** Mirrors the backend's safety module (bhorsha/src/modules/safety): SOS alerts, emailed to the safety inbox. */
import { api } from '@/lib/api/client';
import type { LatLng } from '@/lib/geo';

export interface SosAlert {
  status: 'SENT';
  user_id: number;
  ride_id: number | null;
  lat: number | null;
  lng: number | null;
  sent_to: string;
  sent_at: string;
}

/** POST /sos: with or without a ride. */
export const sendSos = (input: Partial<LatLng> & { ride_id?: number }) => api.post<SosAlert>('/sos', input);

/** POST /rides/{id}/sos: for a ride you are on. */
export const sendRideSos = (rideId: number, input: Partial<LatLng>) => api.post<SosAlert>(`/rides/${rideId}/sos`, input);
