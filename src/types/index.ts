// ===========================
// User & Auth Types
// ===========================

/** Represents an authenticated user in the system */
export interface User {
  id: string;
  email: string;
  name: string;
}

/** Credentials submitted from the login form */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Fields submitted from the signup form */
export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

/** Fields submitted from the reset-password form (step 1 — request email) */
export interface ResetPasswordCredentials {
    email: string;
}

/** Fields submitted from the set-new-password form (step 2 — after clicking email link) */
export interface NewPasswordCredentials {
    token: string;       // reset token from the URL query param
    newPassword: string;
}

/** Fields submitted from the verify-email form */
export interface VerifyEmailCredentials {
  code: string;
}

/** Response shape returned after a successful login */
export interface LoginResponse {
  user: User;
  token: string; // JWT stored client-side via js-cookie
  message: string;
}

/** Response shape returned after a successful signup */
export interface SignupResponse {
  user: User;
  token: string;
  message: string;
}

/** Response shape returned when fetching the user profile */
export interface ProfileResponse {
  user: User;
}

// ===========================
// JWT Types
// ===========================

/** Custom JWT payload embedded inside every signed token */
export interface JWTPayload {
  sub?: string;   // User ID
  token?: string; // Original token
  email: string;
  name: string;
  iat?: number;   // Issued-at timestamp
  exp?: number;   // Expiration timestamp
  [key: string]: any; // Allow extra fields if needed
}

// ===========================
// API Types
// ===========================

/** Standard error returned by service calls */
export interface ApiError {
  message: string;
  status: number;
}

/** Generic wrapper for successful responses */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}




export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
}

export interface Airline {
  code: string;
  name: string;
  logo: string;
}

export interface FlightSegment {
  airline: Airline;
  flightNumber: string;
  origin: Airport;
  destination: Airport;
  departureTime: string;
  arrivalTime: string;
  duration: number; // minutes
  aircraft: string;
}

export type StopType = "nonstop" | "1-stop" | "2-stop";

export interface Flight {
  id: string;
  segments: FlightSegment[];
  totalPrice: number;
  currency: string;
  stops: StopType;
  totalDuration: number; // minutes
  isRefundable: boolean;
  seatsAvailable: number;
  tags?: string[];
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  [key: string]: any;
}

export interface SortOption {
  label: string;
  value: SortField;
  direction: "asc" | "desc";
}

export type SortField = "price" | "duration" | "departure" | "arrival";

export interface FilterState {
  maxPrice: number;
  stops: StopType[];
  airlines: string[];
  departureTimeRange: [number, number]; // hours 0-24
  maxDuration: number; // minutes
}

export interface PassengerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  passportNumber: string;
  nationality: string;
}

export interface BookingData {
  flightId: string;
  passengers: PassengerInfo[];
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
}

export interface BookingConfirmation {
  bookingReference: string;
  flight: Flight;
  passengers: PassengerInfo[];
  totalPrice: number;
  currency: string;
  bookingDate: string;
  status: "confirmed" | "pending" | "cancelled";
}

export type BookingStep = "review" | "passengers" | "payment" | "confirmation";

export const STOP_TYPE_LABELS: Record<StopType, string> = {
  nonstop: "Non-stop",
  "1-stop": "1 Stop",
  "2-stop": "2+ Stops",
};
