from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routes import events, bookings

# This line creates the database tables.
# It checks if the tables defined in models.py exist in the database 
# specified by the engine, and if they don't, it creates them.
# This is great for development, but for production, you would typically
# use a database migration tool like Alembic.
models.Base.metadata.create_all(bind=engine)

# Create an instance of the FastAPI class.
# This instance will be the main point of interaction for creating all your API.
app = FastAPI(
    title="BookMySlot API",
    description="A simple API for booking event slots, inspired by Calendly.",
    version="0.1.0",
)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers from the routes module.
# This makes the endpoints defined in events.py and bookings.py available.
app.include_router(events.router)
app.include_router(bookings.router)

# Define a root endpoint.
# This is a simple GET request that returns a welcome message.
# It's useful for a basic health check to see if the server is running.
@app.get("/")
def read_root():
    """
    Root endpoint to welcome users to the API.
    """
    return {"message": "Welcome to the BookMySlot API!"} 