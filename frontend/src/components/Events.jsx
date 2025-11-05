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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
            Campus Events
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px' }}>
            Discover and join exciting events happening on campus
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '32px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '12px'
        }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              background: filter === 'all' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: filter === 'all' ? '#6366f1' : 'rgba(255, 255, 255, 0.6)',
              fontWeight: filter === 'all' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            All Events
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              background: filter === 'upcoming' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: filter === 'upcoming' ? '#6366f1' : 'rgba(255, 255, 255, 0.6)',
              fontWeight: filter === 'upcoming' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              background: filter === 'past' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: filter === 'past' ? '#6366f1' : 'rgba(255, 255, 255, 0.6)',
              fontWeight: filter === 'past' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Past Events
          </button>
        </div>

        {/* Events Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '24px' 
        }}>
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              {/* Event Image */}
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img
                  src={event.image_url}
                  alt={event.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px'
                }}>
                  {getStatusBadge(event.status)}
                </div>
              </div>

              {/* Event Content */}
              <div style={{ padding: '20px' }}>
                {/* Club Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{event.club_icon}</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
                    {event.club_name}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  color: '#fff', 
                  marginBottom: '8px',
                  lineHeight: '1.3'
                }}>
                  {event.title}
                </h3>

                {/* Description */}
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.6)', 
                  fontSize: '14px', 
                  marginBottom: '16px',
                  lineHeight: '1.5'
                }}>
                  {event.description}
                </p>

                {/* Event Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>📅</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>🕐</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                      {event.time}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>📍</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                      {event.location}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: '#a5b4fc',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Attendees & Action */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>👥</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                      {event.attendees}/{event.max_attendees}
                    </span>
                  </div>
                  <button
                    style={{
                      background: event.status === 'upcoming' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'rgba(156, 163, 175, 0.2)',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: event.status === 'upcoming' ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s'
                    }}
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
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            <p style={{ fontSize: '18px' }}>No {filter} events found</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Events;
