import React, { useState, useEffect } from 'react';
import Layout from './Layout';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    // Mock events data
    const mockEvents = [
    {
      id: 1,
      title: 'Annual Hackathon 2025',
      description: 'Join us for 24 hours of coding, innovation, and fun! Build amazing projects, win prizes, and network with fellow developers.',
      club_name: 'Coding Club',
      club_icon: '💻',
      date: '2025-11-15',
      time: '9:00 AM - 9:00 AM (Next Day)',
      location: 'Engineering Building, Room 301',
      attendees: 156,
      max_attendees: 200,
      image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
      status: 'upcoming',
      tags: ['Technology', 'Competition', 'Networking']
    },
    {
      id: 2,
      title: 'Art Exhibition: Student Showcase',
      description: 'Explore the creative works of our talented student artists. Paintings, sculptures, digital art, and more!',
      club_name: 'Art Collective',
      club_icon: '🎨',
      date: '2025-11-20',
      time: '2:00 PM - 6:00 PM',
      location: 'Campus Art Gallery',
      attendees: 89,
      max_attendees: 150,
      image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=400&fit=crop',
      status: 'upcoming',
      tags: ['Art', 'Exhibition', 'Culture']
    },
    {
      id: 3,
      title: 'Debate Championship Finals',
      description: 'Watch the best debaters compete in the final round. Topic: "Technology: Friend or Foe to Democracy?"',
      club_name: 'Debate Society',
      club_icon: '🎤',
      date: '2025-11-12',
      time: '5:00 PM - 8:00 PM',
      location: 'Main Auditorium',
      attendees: 234,
      max_attendees: 300,
      image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop',
      status: 'upcoming',
      tags: ['Debate', 'Competition', 'Public Speaking']
    },
    {
      id: 4,
      title: 'Live Music Night',
      description: 'An evening of live performances by student bands and solo artists. Free entry, food available!',
      club_name: 'Music Club',
      club_icon: '🎵',
      date: '2025-11-18',
      time: '7:00 PM - 11:00 PM',
      location: 'Student Center Plaza',
      attendees: 312,
      max_attendees: 500,
      image_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop',
      status: 'upcoming',
      tags: ['Music', 'Performance', 'Entertainment']
    },
    {
      id: 5,
      title: 'Gaming Tournament: League of Legends',
      description: '5v5 tournament with cash prizes! Register your team now. All skill levels welcome.',
      club_name: 'Gaming Society',
      club_icon: '🎮',
      date: '2025-11-25',
      time: '1:00 PM - 8:00 PM',
      location: 'Computer Lab B',
      attendees: 78,
      max_attendees: 100,
      image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
      status: 'upcoming',
      tags: ['Gaming', 'Competition', 'Esports']
    },
    {
      id: 6,
      title: 'Photography Workshop',
      description: 'Learn professional photography techniques from industry experts. Bring your camera!',
      club_name: 'Photography Club',
      club_icon: '📷',
      date: '2025-10-28',
      time: '10:00 AM - 4:00 PM',
      location: 'Media Center',
      attendees: 45,
      max_attendees: 50,
      image_url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=400&fit=crop',
      status: 'past',
      tags: ['Photography', 'Workshop', 'Learning']
    }
  ];

    // Simulate loading
    const timer = setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getStatusBadge = (status) => {
    const styles = {
      upcoming: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', text: 'Upcoming' },
      past: { bg: 'rgba(156, 163, 175, 0.1)', color: '#9ca3af', text: 'Past' }
    };
    const style = styles[status] || styles.upcoming;
    
    return (
      <span style={{
        background: style.bg,
        color: style.color,
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        {style.text}
      </span>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="events-page">
        <div className="events-container">
          {/* Header */}
          <div className="events-header">
            <h1 className="events-title">
              Campus Events
            </h1>
            <p className="events-subtitle">
              Discover and join exciting events happening on campus
            </p>
          </div>

        {/* Filter Tabs */}
        <div className="events-filters">
          <button
            onClick={() => setFilter('all')}
            className={`events-filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`events-filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`events-filter-btn ${filter === 'past' ? 'active' : ''}`}
          >
            Past Events
          </button>
        </div>

        {/* Events Grid */}
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="event-card"
            >
              {/* Event Image */}
              <div className="event-image-container">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="event-image"
                />
                <div className="event-status-badge">
                  {getStatusBadge(event.status)}
                </div>
              </div>

              {/* Event Content */}
              <div className="event-content">
                {/* Club Info */}
                <div className="event-club-info">
                  <span className="event-club-icon">{event.club_icon}</span>
                  <span className="event-club-name">
                    {event.club_name}
                  </span>
                </div>

                {/* Title */}
                <h3 className="event-title">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="event-description">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="event-details">
                  <div className="event-detail-item">
                    <span className="event-detail-icon">📅</span>
                    <span className="event-detail-text">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <div className="event-detail-item">
                    <span className="event-detail-icon">🕐</span>
                    <span className="event-detail-text">
                      {event.time}
                    </span>
                  </div>
                  <div className="event-detail-item">
                    <span className="event-detail-icon">📍</span>
                    <span className="event-detail-text">
                      {event.location}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="event-tags">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="event-tag"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Attendees & Action */}
                <div className="event-footer">
                  <div className="event-attendees">
                    <span className="event-attendees-icon">👥</span>
                    <span className="event-attendees-text">
                      {event.attendees}/{event.max_attendees}
                    </span>
                  </div>
                  <button
                    className={`event-register-btn ${event.status === 'past' ? 'disabled' : ''}`}
                    disabled={event.status === 'past'}
                  >
                    {event.status === 'upcoming' ? 'Register' : 'Ended'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Events Message */}
        {filteredEvents.length === 0 && (
          <div className="events-empty">
            <p>No {filter} events found</p>
          </div>
        )}
        </div>
      </div>
    </Layout>
  );
};

export default Events;
