import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load environment variables from a .env file
load_dotenv()

# Get the database URL from the environment variable
# If not set, use a default SQLite database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./bookmyslot.db")

# Handle PostgreSQL URL format for Render
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# The engine is the entry point to the database.
# It's configured with the database URL and some settings for connection pooling.
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, 
        # The 'connect_args' is specific to SQLite. It's needed to allow
        # the database connection to be shared across different threads.
        connect_args={"check_same_thread": False}
    )
else:
    # For PostgreSQL (production)
    engine = create_engine(DATABASE_URL)

# Each instance of SessionLocal will be a new database session.
# The session is the primary interface for all database operations.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base will be used as a base class for our SQLAlchemy models.
# When we define our models, we will inherit from this class.
Base = declarative_base()

# This is a dependency function that will be used in our API routes.
# It creates a new database session for each request and ensures it's closed afterward.
def get_db():
    """
    FastAPI dependency to get a database session.
    Yields a SQLAlchemy session and ensures it's closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 