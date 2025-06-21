// TypeScript interfaces that match our FastAPI backend schemas

export interface Event {
  id: number;
  title: string;
  description: string | null;
  max_bookings_per_slot: number;
}

export interface TimeSlot {
  id: number;
  event_id: number;
  start_time: string; // ISO 8601 datetime string
  bookings: Booking[];
}

export interface EventDetail extends Event {
  time_slots: TimeSlot[];
}

export interface EventCreate {
  title: string;
  description?: string;
  time_slots: string[]; // Array of ISO 8601 datetime strings
  max_bookings_per_slot: number;
}

export interface Booking {
  id: number;
  time_slot_id: number;
  user_name: string;
  user_email: string;
  created_at: string; // ISO 8601 datetime string
}

export interface BookingCreate {
  time_slot_id: number;
  user_name: string;
  user_email: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
} 