import React, { useState } from 'react';
import { Booking } from '../types';
import { bookingApi, formatDateTime } from '../services/api';
import './UserBookings.css';

const UserBookings: React.FC = () => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await bookingApi.getUserBookings(email.trim());
      setBookings(data);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch bookings. Please try again.');
      console.error('Error fetching bookings:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  return (
    <div className="container">
      <div className="user-bookings-header">
        <h1>My Bookings</h1>
        <p>Enter your email address to view your booking history</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="search-input-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email address"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="search-btn"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {hasSearched && !loading && (
        <div className="bookings-results">
          <h2>Your Bookings</h2>
          
          {bookings.length === 0 ? (
            <div className="no-bookings">
              <p>No bookings found for this email address.</p>
              <p>Make sure you've entered the correct email address used for your bookings.</p>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h3>Booking #{booking.id}</h3>
                    <span className="booking-date">
                      {formatDateTime(booking.created_at)}
                    </span>
                  </div>
                  <div className="booking-details">
                    <p><strong>Name:</strong> {booking.user_name}</p>
                    <p><strong>Email:</strong> {booking.user_email}</p>
                    <p><strong>Time Slot ID:</strong> {booking.time_slot_id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserBookings; 