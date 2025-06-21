from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Event(Base):
    """
    SQLAlchemy model for an Event.
    This maps to the 'events' table in the database.
    """
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    max_bookings_per_slot = Column(Integer, default=1)

    # This creates a one-to-many relationship with the TimeSlot model.
    # The 'back_populates' argument establishes a bidirectional relationship.
    # 'cascade="all, delete-orphan"' means that if an Event is deleted,
    # all its associated TimeSlots will also be deleted.
    time_slots = relationship("TimeSlot", back_populates="event", cascade="all, delete-orphan")

class TimeSlot(Base):
    """
    SQLAlchemy model for a TimeSlot.
    This maps to the 'time_slots' table in the database.
    Each time slot belongs to a specific event.
    """
    __tablename__ = "time_slots"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    start_time = Column(DateTime)

    # Relationship back to the Event model
    event = relationship("Event", back_populates="time_slots")
    # Relationship to the Booking model
    bookings = relationship("Booking", back_populates="time_slot", cascade="all, delete-orphan")

class Booking(Base):
    """
    SQLAlchemy model for a Booking.
    This maps to the 'bookings' table in the database.
    Each booking is for a specific time slot and user.
    """
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    time_slot_id = Column(Integer, ForeignKey("time_slots.id"))
    user_name = Column(String)
    user_email = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationship back to the TimeSlot model
    time_slot = relationship("TimeSlot", back_populates="bookings") 