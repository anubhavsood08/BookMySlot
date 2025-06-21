# BookMySlot - Event Scheduling Platform

A full-stack event scheduling application built with FastAPI (Python) and React (TypeScript), inspired by Calendly. Users can create events, manage time slots, and book appointments with validation to prevent double bookings.

## 🚀 Features

- **Event Management**: Create events with custom time slots and booking limits
- **Smart Booking**: Book time slots with real-time availability checking
- **Double Booking Prevention**: Automatic validation to prevent conflicts
- **User Bookings**: View all bookings by email address
- **Modern UI**: Clean, responsive React frontend with TypeScript
- **RESTful API**: FastAPI backend with automatic documentation
- **Database**: SQLite with SQLAlchemy ORM for data persistence

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation using Python type annotations
- **SQLite** - Lightweight database
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **CSS3** - Modern styling

## 📁 Project Structure

```
BookMySlot/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── routes/
│   │   ├── events.py        # Event-related endpoints
│   │   └── bookings.py      # Booking-related endpoints
│   └── requirements.txt     # Python dependencies
├── bookmyslot-frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript interfaces
│   │   └── App.tsx          # Main application component
│   ├── package.json         # Node.js dependencies
│   └── tsconfig.json        # TypeScript configuration
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd BookMySlot
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the FastAPI server:**
   ```bash
   uvicorn main:app --reload
   ```

   The backend will be available at: http://127.0.0.1:8000
   API Documentation: http://127.0.0.1:8000/docs

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd bookmyslot-frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```

   The frontend will be available at: http://localhost:3000

## 📖 Usage Guide

### Creating Events
1. Go to http://localhost:3000/create-event
2. Fill in event details:
   - Title
   - Description (optional)
   - Time slots (start time, end time, max bookings)
3. Click "Create Event"

### Booking Slots
1. Browse events at http://localhost:3000
2. Click on an event to view details
3. Select an available time slot
4. Enter your name and email
5. Click "Book Slot"

### Viewing Bookings
1. Go to http://localhost:3000/my-bookings
2. Enter your email address
3. View all your bookings

## 🔌 API Endpoints

### Events
- `POST /events` - Create a new event
- `GET /events` - List all events
- `GET /events/{id}` - Get event details with slots

### Bookings
- `POST /bookings/events/{event_id}/bookings` - Book a slot
- `GET /bookings/users/{email}/bookings` - Get user bookings

## 🧪 Testing the API

### Using Swagger UI
1. Open http://127.0.0.1:8000/docs
2. Test endpoints directly in the browser

### Using curl

**Create an event:**
```bash
curl -X POST "http://127.0.0.1:8000/events" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Team Meeting",
    "description": "Weekly team sync",
    "time_slots": [
      {
        "start_time": "2024-01-15T10:00:00",
        "end_time": "2024-01-15T11:00:00",
        "max_bookings": 5
      }
    ]
  }'
```

**Book a slot:**
```bash
curl -X POST "http://127.0.0.1:8000/bookings/events/1/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "slot_id": 1,
    "user_name": "John Doe",
    "user_email": "john@example.com"
  }'
```

## 🔧 Development

### Backend Development
- The backend uses FastAPI with automatic reload
- Database is automatically created on first run
- API documentation is auto-generated

### Frontend Development
- React with TypeScript for type safety
- Axios for API communication
- Responsive design with CSS

## 📝 Environment Variables

Create a `.env` file in the root directory for environment-specific configurations:

```env
DATABASE_URL=sqlite:///./bookmyslot.db
DEBUG=True
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:
1. Check the API documentation at http://127.0.0.1:8000/docs
2. Review the browser console for frontend errors
3. Check the terminal for backend logs

## 🎯 Future Enhancements

- [ ] User authentication and authorization
- [ ] Email notifications for bookings
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Recurring events
- [ ] Payment integration
- [ ] Mobile app
- [ ] Multi-language support 