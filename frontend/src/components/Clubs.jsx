import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

const Clubs = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Academic', 'Social', 'Sport'];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setClubs([
        {
          id: 1,
          name: 'Chess Club',
          description: 'Sharpen your mind and your game.',
          category: 'Academic',
          image_url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&h=250&fit=crop'
        },
        {
          id: 2,
          name: 'Debate Team',
          description: 'Engage in stimulating discussions.',
          category: 'Academic',
          image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop'
        },
        {
          id: 3,
          name: 'Hiking Club',
          description: 'Explore the great outdoors with us.',
          category: 'Sport',
          image_url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=250&fit=crop'
        },
        {
          id: 4,
          name: 'Art Society',
          description: 'Unleash your creativity.',
          category: 'Social',
          image_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop'
        },
        {
          id: 5,
          name: 'Tech Innovators',
          description: 'Build the future of technology.',
          category: 'Academic',
          image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop'
        },
        {
          id: 6,
          name: 'Film Club',
          description: 'For aspiring filmmakers and cinephiles.',
          category: 'Social',
          image_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=250&fit=crop'
        }
      ]);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout >
      <div  className="clubs-page">
        <div  className="clubs-container">
          <div  className="clubs-header">
            <h1 className="clubs-title">Discover Clubs</h1>
            <p className="clubs-subtitle">Find your community on campus. Join clubs that match your interests and passions.</p>
            
            <div className="clubs-search-filter">
              <div className="clubs-search">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="9" r="6"/>
                  <path d="m17 17-4-4"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search for clubs by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="clubs-search-input"
                />
              </div>
              <div className="clubs-categories">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
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
                  <div 
                    key={club.id} 
                    className="club-card"
                    onClick={() => navigate(`/clubs/${club.id}`)}
                  >
                    <div 
                      className="club-card-image"
                      style={{ 
                        backgroundImage: club.image_url ? `url(${club.image_url})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div className="club-card-body">
                      <h3 className="club-card-title">{club.name}</h3>
                      <p className="club-card-description">{club.description}</p>
                      <button 
                        className="club-join-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/clubs/${club.id}`);
                        }}
                      >
                        Join
                      </button>
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
