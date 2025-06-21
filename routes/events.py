from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas

# Create a new router object.
# We can use this to group all the event-related routes.
router = APIRouter(
    prefix="/events",  # All routes in this file will be prefixed with /events
    tags=["events"],   # Tag for OpenAPI documentation
)

@router.post("/", response_model=schemas.EventDetail, status_code=status.HTTP_201_CREATED)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    """
    Create a new event with multiple time slots.
    
    This endpoint:
    1. Creates a new Event record in the database
    2. Creates TimeSlot records for each provided time slot
    3. Returns the complete event details including all time slots
    
    Args:
        event: The event data including title, description, time slots, and max bookings
        db: Database session (automatically provided by FastAPI)
    
    Returns:
        EventDetail: The created event with all its time slots
        
    Raises:
        HTTPException: If validation fails or database operation fails
    """
    try:
        # Create the event object
        db_event = models.Event(
            title=event.title,
            description=event.description,
            max_bookings_per_slot=event.max_bookings_per_slot
        )
        
        # Add the event to the database session
        db.add(db_event)
        
        # Flush to get the event ID (needed for creating time slots)
        db.flush()
        
        # Create time slot objects for each provided time
        for slot_time in event.time_slots:
            db_time_slot = models.TimeSlot(
                event_id=db_event.id,
                start_time=slot_time
            )
            db.add(db_time_slot)
        
        # Commit all changes to the database
        db.commit()
        
        # Refresh the event object to load the time slots
        db.refresh(db_event)
        
        return db_event
        
    except Exception as e:
        # Rollback the transaction if something goes wrong
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create event: {str(e)}"
        )

@router.get("/", response_model=List[schemas.Event])
def get_all_events(db: Session = Depends(get_db)):
    """
    Get a list of all events with basic information.
    
    This endpoint returns all events but excludes the detailed time slots
    to keep the response lightweight for list views.
    
    Args:
        db: Database session (automatically provided by FastAPI)
    
    Returns:
        List[Event]: List of all events with basic metadata
    """
    events = db.query(models.Event).all()
    return events

@router.get("/{event_id}", response_model=schemas.EventDetail)
def get_event(event_id: int, db: Session = Depends(get_db)):
    """
    Get detailed information about a specific event including all time slots.
    
    Args:
        event_id: The ID of the event to retrieve
        db: Database session (automatically provided by FastAPI)
    
    Returns:
        EventDetail: The event with all its time slots and booking information
        
    Raises:
        HTTPException: If the event is not found
    """
    # Query the event by ID, including all related time slots
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with ID {event_id} not found"
        )
    
    return event 