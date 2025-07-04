import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EventDetail as EventDetailType, BookingCreate } from '../types';
import { eventApi, bookingApi, formatDateTime, isTimeSlotAvailable } from '../services/api';
import './EventDetail.css';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingCreate>({
    time_slot_id: 0,
    user_name: '',
    user_email: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEvent(parseInt(id));
    }
  }, [id]);

  const fetchEvent = async (eventId: number) => {
    try {
      setLoading(true);
      const data = await eventApi.getEvent(eventId);
      setEvent(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load event details.');
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !bookingForm.time_slot_id || !bookingForm.user_name || !bookingForm.user_email) {
      setBookingError('Please fill in all fields and select a time slot.');
      return;
    }
    if (!bookingForm.user_email.includes('@')) {
      setBookingError('Please enter a valid email address containing "@".');
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError(null);
      await bookingApi.createBooking(event.id, bookingForm);
      setBookingSuccess(true);
      setBookingForm({
        time_slot_id: 0,
        user_name: '',
        user_email: '',
      });
      // Refresh event data to show updated bookings
      await fetchEvent(event.id);
    } catch (err: any) {
      setBookingError(err.response?.data?.detail || 'Failed to create booking. Please try again.');
      console.error('Error creating booking:', err);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleTimeSlotSelect = (timeSlotId: number) => {
    setBookingForm(prev => ({ ...prev, time_slot_id: timeSlotId }));
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading event details...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container">
        <div className="error">
          <p>{error || 'Event not found'}</p>
          <button onClick={() => navigate('/')} className="back-btn">
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="event-detail-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Events
        </button>
        <h1>{event.title}</h1>
      </div>

      <div className="event-info">
        <p className="event-description">{event.description || 'No description provided'}</p>
        <p className="event-max-bookings">
          Maximum bookings per slot: {event.max_bookings_per_slot}
        </p>
      </div>

      <div className="content-grid">
        <div className="time-slots-section">
          <h2>Available Time Slots</h2>
          {event.time_slots.length === 0 ? (
            <p className="no-slots">No time slots available for this event.</p>
          ) : (
            <div className="time-slots-grid">
              {event.time_slots.map((slot) => {
                const isAvailable = isTimeSlotAvailable(slot, event.max_bookings_per_slot);
                const isSelected = bookingForm.time_slot_id === slot.id;
                const currentBookings = slot.bookings.length;

                return (
                  <div
                    key={slot.id}
                    className={`time-slot-card ${isSelected ? 'selected' : ''} ${!isAvailable ? 'unavailable' : ''}`}
                    onClick={() => isAvailable && handleTimeSlotSelect(slot.id)}
                  >
                    <div className="slot-time">{formatDateTime(slot.start_time)}</div>
                    <div className="slot-status">
                      {isAvailable ? (
                        <span className="available">
                          {currentBookings}/{event.max_bookings_per_slot} booked
                        </span>
                      ) : (
                        <span className="unavailable">Fully booked</span>
                      )}
                    </div>
                    {isSelected && <div className="selected-indicator">✓ Selected</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="booking-section">
          <h2>Book Your Slot</h2>
          {bookingSuccess ? (
            <div className="success-message">
              <h3>🎉 Booking Confirmed!</h3>
              <p>Your slot has been successfully booked. You will receive a confirmation email shortly.</p>
              <button onClick={() => setBookingSuccess(false)} className="book-another-btn">
                Book Another Slot
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="booking-form">
              <div className="form-group">
                <label htmlFor="user_name">Full Name *</label>
                <input
                  type="text"
                  id="user_name"
                  value={bookingForm.user_name}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, user_name: e.target.value }))}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="user_email">Email Address *</label>
                <input
                  type="email"
                  id="user_email"
                  value={bookingForm.user_email}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, user_email: e.target.value }))}
                  required
                  placeholder="Enter your email address"
                />
              </div>

              {bookingForm.time_slot_id > 0 && (
                <div className="selected-slot-info">
                  <p>Selected: {formatDateTime(event.time_slots.find(s => s.id === bookingForm.time_slot_id)?.start_time || '')}</p>
                </div>
              )}

              {bookingError && (
                <div className="error-message">
                  <p>{bookingError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={bookingLoading || bookingForm.time_slot_id === 0}
                className="book-btn"
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail; 