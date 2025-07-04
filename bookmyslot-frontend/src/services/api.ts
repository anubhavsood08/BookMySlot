import axios from 'axios';
import { Event, EventDetail, EventCreate, Booking, BookingCreate } from '../types';

// Configure axios to connect to our FastAPI backend
// Use environment variable for production, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Event API functions
export const eventApi = {
  // Get all events
  getAllEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events/');
    return response.data;
  },

  // Get single event with details
  getEvent: async (eventId: number): Promise<EventDetail> => {
    const response = await api.get(`/events/${eventId}/`);
    return response.data;
  },

  // Create new event
  createEvent: async (eventData: EventCreate): Promise<EventDetail> => {
    const response = await api.post('/events/', eventData);
    return response.data;
  },

  // Delete event
  deleteEvent: async (eventId: number): Promise<void> => {
    await api.delete(`/events/${eventId}/`);
  },
};

// Booking API functions
export const bookingApi = {
  // Create a booking
  createBooking: async (eventId: number, bookingData: BookingCreate): Promise<Booking> => {
    const response = await api.post(`/bookings/events/${eventId}/bookings`, bookingData);
    return response.data;
  },

  // Get user bookings
  getUserBookings: async (email: string): Promise<Booking[]> => {
    const response = await api.get(`/bookings/users/${encodeURIComponent(email)}/bookings`);
    return response.data;
  },
};

// Utility function to format datetime for display
export const formatDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
};

// Utility function to check if a time slot is available
export const isTimeSlotAvailable = (timeSlot: any, maxBookings: number): boolean => {
  return timeSlot.bookings.length < maxBookings;
};

export default api; 