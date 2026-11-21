/**
 * Mirrors the backend's fleet module (bhorsha/src/modules/fleet):
 * vehicles and the driver's own profile (status and location).
 */
import type { User } from '@/features/identity/types';

export type VehicleType = 'BIKE' | 'CAR' | 'CNG';

/** Seats a passenger can use, per type (fleet/vehicles.service.ts, SEAT_CAPACITY). */
export const VEHICLE_SEATS: Record<VehicleType, number> = { BIKE: 1, CAR: 3, CNG: 2 };

export const VEHICLE_LABEL: Record<VehicleType, string> = { BIKE: 'Bike', CAR: 'Car', CNG: 'CNG' };

export type Verification = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type Availability = 'OFFLINE' | 'ONLINE';

/** A vehicle (POST /vehicles, GET /vehicles/my, GET|PATCH /vehicles/{id}). */
export interface Vehicle {
  id: number;
  driverId: number;
  type: VehicleType;
  regNo: string;
  seats: number;
  createdAt: string;
  deletedAt: string | null;
}

export type CreateVehicleInput = { type: VehicleType; regNo: string };
export type UpdateVehicleInput = { regNo: string };

/** The driver's own profile (GET /drivers/me, PATCH /drivers/me/status, PUT /drivers/me/location). */
export interface DriverProfile {
  userId: number;
  user: User;
  licenceNo: string;
  verification: Verification;
  rejectionReason: string | null;
  status: Availability;
  lastLat: number | null;
  lastLng: number | null;
  lastLocationAt: string | null;
  reviewedBy: number | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
