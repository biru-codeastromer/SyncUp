import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { supabase } from '../lib/supabaseClient';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('name');

      if (error) throw error;
      setClubs(data || []);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  };

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
