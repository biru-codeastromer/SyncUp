import React, { useState, useEffect } from 'react';
import Layout from './Layout';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setClubs([
        {
          id: 1,
          name: 'Coding Club',
          description: 'A club for coding enthusiasts to learn and build projects together. Weekly hackathons and workshops.',
          member_count: 250,
          category: 'Technology',
          icon: '💻',
          color: '#3b82f6',
          image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop'
        },
        {
          id: 2,
          name: 'Art Collective',
          description: 'Express yourself through various forms of art and creativity. Exhibitions, workshops, and collaborative projects.',
          member_count: 180,
          category: 'Arts',
          icon: '🎨',
          color: '#ec4899',
          image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=200&fit=crop'
        },
        {
          id: 3,
          name: 'Debate Society',
          description: 'Sharpen your public speaking and critical thinking skills through competitive debates and discussions.',
          member_count: 120,
          category: 'Academics',
          icon: '🎤',
          color: '#8b5cf6',
          image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=200&fit=crop'
        },
        {
          id: 4,
          name: 'Music Club',
          description: 'For music lovers and musicians to collaborate and perform. Open mic nights, jam sessions, and concerts.',
          member_count: 200,
          category: 'Music',
          icon: '🎵',
          color: '#f59e0b',
          image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=200&fit=crop'
        },
        {
          id: 5,
          name: 'Gaming Society',
          description: 'Connect with fellow gamers, participate in tournaments, and explore the world of esports and game development.',
          member_count: 310,
          category: 'Gaming',
          icon: '🎮',
          color: '#10b981',
          image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop'
        },
        {
          id: 6,
          name: 'Photography Club',
          description: 'Capture moments and tell stories through the lens. Photo walks, workshops, and exhibitions.',
          member_count: 145,
          category: 'Arts',
          icon: '📷',
          color: '#06b6d4',
          image_url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=200&fit=crop'
        },
        {
          id: 7,
          name: 'Robotics Club',
          description: 'Design, build, and program robots. Participate in competitions and learn about automation and AI.',
          member_count: 95,
          category: 'Technology',
          icon: '🤖',
          color: '#6366f1',
          image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop'
        },
        {
          id: 8,
          name: 'Drama Club',
          description: 'Explore the world of theater through acting, directing, and stage production. Annual plays and improv nights.',
          member_count: 167,
          category: 'Arts',
          icon: '🎭',
          color: '#ef4444',
          image_url: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=200&fit=crop'
        },
        {
          id: 9,
          name: 'Environmental Club',
          description: 'Make a difference for our planet. Organize clean-ups, sustainability workshops, and awareness campaigns.',
          member_count: 203,
          category: 'Social',
          icon: '🌱',
          color: '#22c55e',
          image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=200&fit=crop'
        },
        {
          id: 10,
          name: 'Dance Crew',
          description: 'Express yourself through movement. Hip-hop, contemporary, and cultural dance styles. Performances and battles.',
          member_count: 189,
          category: 'Arts',
          icon: '💃',
          color: '#a855f7',
          image_url: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=200&fit=crop'
        },
        {
          id: 11,
          name: 'Entrepreneurship Club',
          description: 'Turn your ideas into reality. Network with founders, attend pitch competitions, and learn about startups.',
          member_count: 134,
          category: 'Business',
          icon: '💼',
          color: '#0ea5e9',
          image_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop'
        },
        {
          id: 12,
          name: 'Fitness Club',
          description: 'Stay healthy and active together. Group workouts, yoga sessions, sports activities, and wellness workshops.',
          member_count: 278,
          category: 'Sports',
          icon: '💪',
          color: '#f97316',
          image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=200&fit=crop'
        }
      ]);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="clubs-page">
        <div className="clubs-container">
          <div className="clubs-header">
            <h1 className="clubs-title">Discover Clubs</h1>
            <p className="clubs-subtitle">Find and join clubs that match your interests</p>
            
            <div className="clubs-search">
              <input
                type="text"
                placeholder="Search clubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="clubs-search-input"
              />
            </div>
          </div>

          {loading ? (
            <div className="clubs-loading">
              <p>Loading clubs...</p>
            </div>
          ) : (
            <div className="clubs-grid">
              {filteredClubs.length > 0 ? (
                filteredClubs.map(club => (
                  <div key={club.id} className="club-card">
                    <div 
                      className="club-card-header"
                      style={{ 
                        backgroundColor: club.color || '#6366f1',
                        backgroundImage: club.image_url ? `url(${club.image_url})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="club-icon-wrapper">
                        {club.icon ? (
                          <span className="club-icon-large">{club.icon}</span>
                        ) : (
                          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2">
                            <circle cx="30" cy="30" r="22" />
                            <circle cx="30" cy="30" r="14" />
                            <path d="M30 16 L30 44 M16 30 L44 30" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="club-card-body">
                      <h3 className="club-card-title">{club.name}</h3>
                      <p className="club-card-description">{club.description}</p>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        marginTop: '12px',
                        marginBottom: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '14px'
                      }}>
                        <span>👥</span>
                        <span>{club.member_count} members</span>
                        <span style={{ margin: '0 4px' }}>•</span>
                        <span>{club.category}</span>
                      </div>
                      <div className="club-card-footer">
                        <button className="club-join-btn">Join Club</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="clubs-empty">
                  <p>No clubs found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Clubs;
