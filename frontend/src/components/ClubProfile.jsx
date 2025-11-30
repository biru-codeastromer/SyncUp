import React, { useState, useEffect } from 'react';
// Move mock club data to module scope to keep useEffect deps clean
const clubsDataMap = {
  1: {
    id: 1,
    name: 'Chess Club',
    description: 'Sharpen your mind and your game.',
    category: 'Academic',
    memberCount: 125,
    image_url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&h=250&fit=crop',
    logo_url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=150&h=150&fit=crop',
    about: 'We are a group of students passionate about chess and strategic thinking. Our mission is to foster a community where members can learn, compete, and improve their game together. We hold regular tournaments, host guest speakers, and participate in various chess challenges.',
    contact: 'chessclub@university.edu',
    officers: ['Alice', 'Bob', 'Charlie']
  },
  2: {
    id: 2,
    name: 'Debate Team',
    description: 'Engage in stimulating discussions.',
    category: 'Academic',
    memberCount: 98,
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
    logo_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=150&fit=crop',
    about: 'We are a group of students passionate about debate and public speaking. Our mission is to foster a community where members can learn, collaborate, and improve their argumentation skills together. We hold regular practice sessions, host guest speakers from the industry, and participate in various debate competitions.',
    contact: 'debateteam@university.edu',
    officers: ['Alice', 'Bob', 'Charlie']
  },
  3: {
    id: 3,
    name: 'Hiking Club',
    description: 'Explore the great outdoors with us.',
    category: 'Sport',
    memberCount: 156,
    image_url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=250&fit=crop',
    logo_url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=150&h=150&fit=crop',
    about: 'We are a group of students passionate about hiking and outdoor adventures. Our mission is to foster a community where members can explore nature, stay active, and create amazing memories together. We organize regular hikes, host outdoor workshops, and participate in various adventure challenges.',
    contact: 'hikingclub@university.edu',
    officers: ['Alice', 'Bob', 'Charlie']
  },
  4: {
    id: 4,
    name: 'Art Society',
    description: 'Unleash your creativity.',
    category: 'Social',
    memberCount: 142,
    image_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop',
    logo_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=150&h=150&fit=crop',
    about: 'We are a group of students passionate about art and creativity. Our mission is to foster a community where members can learn, collaborate, and create amazing artworks together. We hold regular workshops, host guest artists, and participate in various art exhibitions.',
    contact: 'artsociety@university.edu',
    officers: ['Alice', 'Bob', 'Charlie']
  },
  5: {
    id: 5,
    name: 'Tech Innovators',
    description: 'Build the future of technology.',
    category: 'Academic',
    memberCount: 125,
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop',
    logo_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&h=150&fit=crop',
    about: 'We are a group of students passionate about technology and innovation. Our mission is to foster a community where members can learn, collaborate, and create amazing things together. We hold regular workshops, host guest speakers from the industry, and participate in various tech challenges.',
    contact: 'techinnovators@university.edu',
    officers: ['Alice', 'Bob', 'Charlie']
  },
  6: {
    id: 6,
    name: 'Film Club',
    description: 'For aspiring filmmakers and cinephiles.',
    category: 'Social',
    memberCount: 89,
    image_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=250&fit=crop',
    logo_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=150&h=150&fit=crop',
    about: 'We are a group of students passionate about film and cinematography. Our mission is to foster a community where members can learn, collaborate, and create amazing films together. We hold regular screenings, host guest filmmakers, and participate in various film festivals.',
    contact: 'filmclub@university.edu',
    officers: ['Alice', 'Bob', 'Charlie']
  }
};
import { useParams, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { useAuth } from '../context/AuthContext';

const ClubProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [club, setClub] = useState(null);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  // likedPosts and handleLike were unused; removed to clean lint warnings

  // Mock club data - in real app, fetch by id
  // clubsDataMap moved to module scope to avoid hook dependency warnings
  

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const clubData = clubsDataMap[id];
      if (clubData) {
        setClub(clubData);
        
        // Mock posts for this club
        setPosts([
          {
            id: 1,
            user_name: 'Alice',
            user_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face',
            content: 'Check out the photos from our last workshop! Everyone did an amazing job.',
            image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            likes: 15,
            comments: 3
          },
          {
            id: 2,
            user_name: 'Bob',
            user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
            content: "Don't forget to sign up for the hackathon this weekend. It's going to be epic! Link in the events section.",
            image_url: null,
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            likes: 8,
            comments: 1
          }
        ]);

        // Mock events for this club
        setEvents([
          {
            id: 1,
            title: 'Guest Speaker: CEO of a Local Startup',
            date: 'Oct 25, 7:00 PM',
            location: 'Main Auditorium',
            rsvp: true
          },
          {
            id: 2,
            title: 'Weekly Coding Session',
            date: 'Every Wednesday, 6:00 PM',
            location: 'Engineering Bldg. Room 301',
            rsvp: true
          },
          {
            id: 3,
            title: 'End of Semester Social',
            date: 'Dec 10, 8:00 PM',
            location: 'Student Union',
            rsvp: true
          }
        ]);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return date.toLocaleDateString();
  };

  

  const handlePost = () => {
    if (postContent.trim()) {
      const newPost = {
        id: posts.length + 1,
        user_name: user?.name || 'You',
        user_avatar: user?.profile_pic_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        content: postContent,
        image_url: null,
        created_at: new Date().toISOString(),
        likes: 0,
        comments: 0
      };
      setPosts([newPost, ...posts]);
      setPostContent('');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="club-profile-loading">
          <p>Loading club...</p>
        </div>
      </Layout>
    );
  }

  if (!club) {
    return (
      <Layout>
        <div className="club-profile-error">
          <p>Club not found</p>
          <button onClick={() => navigate('/clubs')}>Back to Clubs</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="club-profile-page">
        {/* Club Banner/Hero Section */}
        <div className="club-banner">
          <div className="club-banner-image" style={{ backgroundImage: `url(${club.image_url})` }}></div>
          <div className="club-hero-content">
            <div className="club-logo-container">
              <div className="club-logo" style={{ backgroundImage: `url(${club.logo_url})` }}>
                <div className="club-logo-icon">⚡</div>
              </div>
              <div className="club-logo-text">{club.name}</div>
            </div>
            <div className="club-info-header">
              <h1 className="club-name-large">{club.name}</h1>
              <p className="club-member-count">{club.memberCount} Members</p>
              <button className="club-join-button">Join Club</button>
            </div>
          </div>
        </div>

        {/* Main Content - Three Columns */}
        <div className="club-profile-content">
          {/* Left Column - About Us */}
          <div className="club-sidebar-left">
            <div className="club-about-section">
              <h2 className="club-section-title">About Us</h2>
              <p className="club-about-text">{club.about}</p>
              
              <div className="club-contact-section">
                <h3 className="club-subsection-title">Contact</h3>
                <p className="club-contact-email">{club.contact}</p>
              </div>

              <div className="club-officers-section">
                <h3 className="club-subsection-title">Officers</h3>
                <p className="club-officers-list">{club.officers.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Middle Column - Club Feed */}
          <div className="club-feed-center">
            {/* Post Input */}
            <div className="club-post-input-card">
              <img
                src={user?.profile_pic_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'}
                alt="User"
                className="club-post-avatar"
              />
              <input
                type="text"
                placeholder={`What's on your mind, ${club.name.toLowerCase().split(' ')[0]}?`}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="club-post-input"
              />
              <button onClick={handlePost} className="club-post-button">Post</button>
            </div>

            {/* Posts */}
            <div className="club-posts-list">
              {posts.map(post => (
                <div key={post.id} className="club-post-card">
                  <div className="club-post-header">
                    <img src={post.user_avatar} alt={post.user_name} className="club-post-user-avatar" />
                    <div className="club-post-user-info">
                      <h4 className="club-post-user-name">{post.user_name}</h4>
                      <p className="club-post-time">{formatDate(post.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="club-post-body">
                    <p className="club-post-text">{post.content}</p>
                    {post.image_url && (
                      <div className="club-post-image">
                        <img src={post.image_url} alt="Post" />
                      </div>
                    )}
                  </div>

                  <div className="club-post-stats">
                    <span className="club-post-stat">👍 {post.likes} Likes</span>
                    <span className="club-post-stat">💬 {post.comments} Comments</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Upcoming Events */}
          <div className="club-sidebar-right">
            <div className="club-events-section">
              <h2 className="club-section-title">Upcoming Events</h2>
              <div className="club-events-list">
                {events.map(event => (
                  <div key={event.id} className="club-event-card">
                    <h3 className="club-event-title">{event.title}</h3>
                    <div className="club-event-details">
                      <div className="club-event-detail">
                        <span className="club-event-icon">📅</span>
                        <span>{event.date}</span>
                      </div>
                      <div className="club-event-detail">
                        <span className="club-event-icon">📍</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <button className="club-event-rsvp">RSVP</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClubProfile;

