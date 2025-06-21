import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventCreate } from '../types';
import { eventApi } from '../services/api';
import './CreateEvent.css';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EventCreate>({
    title: '',
    description: '',
    time_slots: [],
    max_bookings_per_slot: 1,
  });
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'max_bookings_per_slot' ? parseInt(value) || 1 : value,
    }));
  };

  const addTimeSlot = () => {
    const now = new Date();
    const defaultTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
    const timeString = defaultTime.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM format
    
    setTimeSlots(prev => [...prev, timeString]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(prev => prev.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, value: string) => {
    setTimeSlots(prev => prev.map((slot, i) => i === index ? value : slot));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Event title is required.');
      return;
    }

    if (timeSlots.length === 0) {
      setError('At least one time slot is required.');
      return;
    }

    // Convert local datetime strings to ISO strings
    const isoTimeSlots = timeSlots.map(slot => {
      const date = new Date(slot);
      return date.toISOString();
    });

    try {
      setLoading(true);
      setError(null);
      
      const eventData: EventCreate = {
        ...formData,
        time_slots: isoTimeSlots,
      };

      const createdEvent = await eventApi.createEvent(eventData);
      
      // Navigate to the created event
      navigate(`/event/${createdEvent.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create event. Please try again.');
      console.error('Error creating event:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="create-event-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Events
        </button>
        <h1>Create New Event</h1>
      </div>

      <form onSubmit={handleSubmit} className="create-event-form">
        <div className="form-group">
          <label htmlFor="title">Event Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter event title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter event description (optional)"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="max_bookings_per_slot">Maximum Bookings per Slot</label>
          <input
            type="number"
            id="max_bookings_per_slot"
            name="max_bookings_per_slot"
            value={formData.max_bookings_per_slot}
            onChange={handleInputChange}
            min="1"
            max="100"
          />
        </div>

        <div className="form-group">
          <label>Time Slots *</label>
          <div className="time-slots-container">
            {timeSlots.length === 0 ? (
              <p className="no-slots">No time slots added yet.</p>
            ) : (
              <div className="time-slots-list">
                {timeSlots.map((slot, index) => (
                  <div key={index} className="time-slot-input">
                    <input
                      type="datetime-local"
                      value={slot}
                      onChange={(e) => updateTimeSlot(index, e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeTimeSlot(index)}
                      className="remove-slot-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={addTimeSlot}
              className="add-slot-btn"
            >
              + Add Time Slot
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="create-btn"
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent; 