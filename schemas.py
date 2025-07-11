from pydantic import BaseModel, EmailStr
from typing import List, Optional
import datetime

# Pydantic models (schemas) are used for data validation and serialization.
# They define the shape of the data that the API expects in requests
# and sends in responses.

# ==================================
#       Booking Schemas
# ==================================

# Base schema for a booking, containing common attributes.
class BookingBase(BaseModel):
    user_name: str
    user_email: EmailStr # Pydantic validates this is a valid email format.

# Schema for creating a new booking.
# It inherits from BookingBase and adds the time_slot_id.
class BookingCreate(BookingBase):
    time_slot_id: int

# Schema for reading a booking's details.
# It includes the 'id' and 'created_at' fields from the database model.
class Booking(BookingBase):
    id: int
    time_slot_id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# ==================================
#       TimeSlot Schemas
# ==================================

# Base schema for a time slot.
class TimeSlotBase(BaseModel):
    start_time: datetime.datetime

# Schema for creating a time slot (usually not used directly by the user).
class TimeSlotCreate(TimeSlotBase):
    pass

# Schema for reading a time slot's details.
# It includes the bookings made for this slot.
class TimeSlot(TimeSlotBase):
    id: int
    event_id: int
    bookings: List[Booking] = [] # A list of booking objects

    class Config:
        from_attributes = True

# ==================================
#        Event Schemas
# ==================================

# Base schema for an event.
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    max_bookings_per_slot: int = 1

# Schema for creating a new event.
# It requires a list of ISO 8601 formatted time slot strings.
class EventCreate(EventBase):
    time_slots: List[datetime.datetime]

# Schema for reading an event, used for list views.
# It doesn't include the detailed time slots list.
class Event(EventBase):
    id: int
    
    class Config:
        from_attributes = True

# Schema for reading a single event with all its details.
# It includes the list of associated time slots.
class EventDetail(Event):
    time_slots: List[TimeSlot] = [] 