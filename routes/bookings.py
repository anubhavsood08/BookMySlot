from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas

# Create a new router object for bookings.
router = APIRouter(
    prefix="/bookings",
    tags=["bookings"],
)

@router.post("/events/{event_id}/bookings", response_model=schemas.Booking, status_code=status.HTTP_201_CREATED)
def create_booking(event_id: int, booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    """
    Book a time slot for a specific event.
    
    This endpoint handles the booking logic with several validations:
    1. Checks if the event exists
    2. Checks if the time slot exists and belongs to the event
    3. Prevents double booking by the same user for the same slot
    4. Prevents overbooking (respects max_bookings_per_slot limit)
    
    Args:
        event_id: The ID of the event to book
        booking: The booking data (user name, email, time slot ID)
        db: Database session (automatically provided by FastAPI)
    
    Returns:
        Booking: The created booking with confirmation details
        
    Raises:
        HTTPException: If validation fails or booking is not allowed
    """
    # First, check if the event exists
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with ID {event_id} not found"
        )
    
    # Check if the time slot exists and belongs to this event
    time_slot = db.query(models.TimeSlot).filter(
        models.TimeSlot.id == booking.time_slot_id,
        models.TimeSlot.event_id == event_id
    ).first()
    
    if not time_slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Time slot with ID {booking.time_slot_id} not found for this event"
        )
    
    # Check for double booking by the same user for the same slot
    existing_booking = db.query(models.Booking).filter(
        models.Booking.time_slot_id == booking.time_slot_id,
        models.Booking.user_email == booking.user_email
    ).first()
    
    if existing_booking:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already booked this time slot"
        )
    
    # Check for overbooking (count existing bookings for this slot)
    current_bookings_count = db.query(models.Booking).filter(
        models.Booking.time_slot_id == booking.time_slot_id
    ).count()
    
    if current_bookings_count >= event.max_bookings_per_slot:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"This time slot is already fully booked (max {event.max_bookings_per_slot} bookings allowed)"
        )
    
    try:
        # Create the booking
        db_booking = models.Booking(
            time_slot_id=booking.time_slot_id,
            user_name=booking.user_name,
            user_email=booking.user_email
        )
        
        db.add(db_booking)
        db.commit()
        db.refresh(db_booking)
        
        return db_booking
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create booking: {str(e)}"
        )

@router.get("/users/{email}/bookings", response_model=List[schemas.Booking])
def get_user_bookings(email: str, db: Session = Depends(get_db)):
    """
    Get all bookings made by a specific user (identified by email).
    
    This endpoint returns all bookings for a user across all events,
    which is useful for users to see their booking history.
    
    Args:
        email: The email address of the user
        db: Database session (automatically provided by FastAPI)
    
    Returns:
        List[Booking]: All bookings made by the user
        
    Raises:
        HTTPException: If the email format is invalid
    """
    # Basic email validation (Pydantic EmailStr would be better, but this is simpler)
    if "@" not in email or "." not in email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )
    
    # Query all bookings for this user
    bookings = db.query(models.Booking).filter(
        models.Booking.user_email == email
    ).all()
    
    return bookings 