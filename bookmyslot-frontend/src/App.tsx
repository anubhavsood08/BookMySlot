import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';
import CreateEvent from './components/CreateEvent';
import UserBookings from './components/UserBookings';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav className="navbar">
            <div className="nav-brand">
              <Link to="/" className="nav-link">
                📅 BookMySlot
              </Link>
            </div>
            <div className="nav-links">
              <Link to="/" className="nav-link">Events</Link>
              <Link to="/create" className="nav-link">Create Event</Link>
              <Link to="/bookings" className="nav-link">My Bookings</Link>
            </div>
          </nav>
        </header>

        <main className="App-main">
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/bookings" element={<UserBookings />} />
          </Routes>
        </main>

        <footer className="App-footer">
          <p>&copy; 2024 BookMySlot - Simple Event Scheduling</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
