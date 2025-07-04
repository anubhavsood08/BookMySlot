import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types';
import { eventApi } from '../services/api';
import './EventList.css';

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventApi.getAllEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError('Failed to load events. Please try again.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventApi.deleteEvent(eventId);
        fetchEvents();
      } catch (err) {
        alert('Failed to delete event.');
      }
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchEvents} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Available Events</h1>
        <Link to="/create" className="create-btn">
          + Create New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <p>No events available yet.</p>
          <Link to="/create" className="create-btn">
            Create the first event
          </Link>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h3>{event.title}</h3>
                <span className="max-bookings">
                  Max: {event.max_bookings_per_slot} per slot
                </span>
              </div>
              <p className="event-description">
                {event.description || 'No description provided'}
              </p>
              <div className="event-actions">
                <Link to={`/event/${event.id}`} className="view-btn">
                  View Details & Book
                </Link>
                <button onClick={() => handleDelete(event.id)} className="delete-btn" style={{ marginLeft: '10px', color: 'white', background: 'red', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList; 