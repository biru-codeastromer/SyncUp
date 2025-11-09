import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { useAuth } from "./MockAuthContext";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("clubs");
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState([]);
  const [posts, setPosts] = useState([]);

  // Set mock data on mount
  useEffect(() => {
    const mockClubs = [
      {
        club_id: 1,
        clubs: {
          name: 'Coding Club',
          description: 'A club for coding enthusiasts',
          logo_url: 'https://img.icons8.com/color/96/000000/code.png',
          id: 1
        },
        role: 'Admin'
      },
      {
        club_id: 2,
        clubs: {
          name: 'Art Collective',
          description: 'Express yourself through art',
          logo_url: 'https://img.icons8.com/color/96/000000/paint-palette.png',
          id: 2
        },
        role: 'Member'
      }
    ];

    const mockPosts = [
      {
        id: 1,
        content: 'Just joined the Coding Club! Excited to learn and build projects together.',
        created_at: '2024-10-22T10:30:00Z',
        likes: 15,
        comments: 3,
        user_name: 'You',
        user_avatar: 'https://ui-avatars.com/api/?name=You&background=6366f1&color=fff&size=150'
      },
      {
        id: 2,
        content: 'Check out this cool project I built with React and Node.js!',
        created_at: '2024-10-20T15:45:00Z',
        likes: 42,
        comments: 12,
        user_name: 'You',
        user_avatar: 'https://ui-avatars.com/api/?name=You&background=6366f1&color=fff&size=150'
      }
    ];
    
    const timer = setTimeout(() => {
      setClubs(mockClubs.map(club => club.clubs));
      setPosts(mockPosts);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Mock user data
  const user = {
    name: authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || "User",
    title: authUser?.user_metadata?.title || "Student",
    bio: authUser?.user_metadata?.bio || "Welcome to my profile!",
    avatar: authUser?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.user_metadata?.full_name || authUser?.email || 'User')}&background=6366f1&color=fff&size=150`
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Layout>
      <div className="profile-page-wrapper">
        <div className="profile-container">
          {/* Profile Header */}
          <div className="profile-header-card">
            <div className="profile-header-content">
              <div className="profile-header-main">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="profile-avatar-img"
                />
                <div className="profile-header-text">
                  <h1 className="profile-name-text">
                    {user.name}
                  </h1>
                  <p className="profile-title-text">
                    {user.title}
                  </p>
                  <p className="profile-bio-text">
                    {user.bio}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="profile-edit-button"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

        {/* Tabs */}
        <div className="profile-tabs-card">
          <div className="profile-tabs-header">
            <button
              onClick={() => setActiveTab('clubs')}
              className={`profile-tab-button ${activeTab === 'clubs' ? 'active' : ''}`}
            >
              My Clubs
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`profile-tab-button ${activeTab === 'posts' ? 'active' : ''}`}
            >
              My Posts
            </button>
          </div>

          {/* Tab Content */}
          <div className="profile-tab-content">
            {activeTab === 'clubs' && (
              <div className="profile-clubs-grid">
                {clubs.length > 0 ? (
                  clubs.map((club) => (
                    <div
                      key={club.id}
                      className="profile-club-card"
                      onClick={() => navigate(`/clubs/${club.id}`)}
                    >
                      <img
                        src={club.logo_url}
                        alt={club.name}
                        className="profile-club-logo"
                      />
                      <div className="profile-club-info">
                        <h3 className="profile-club-name">
                          {club.name}
                        </h3>
                        <p className="profile-club-description">
                          {club.description}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/clubs/${club.id}`);
                          }}
                          className="profile-club-view-btn"
                        >
                          View Club →
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="profile-empty-message">
                    You haven't joined any clubs yet.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="profile-posts-list">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="profile-post-card"
                    >
                      <div className="profile-post-header">
                        <img
                          src={post.user_avatar}
                          alt={post.user_name}
                          className="profile-post-avatar"
                        />
                        <div className="profile-post-user-info">
                          <p className="profile-post-user-name">
                            {post.user_name}
                          </p>
                          <p className="profile-post-time">
                            {formatDate(post.created_at)}
                          </p>
                        </div>
                      </div>
                      <p className="profile-post-content">
                        {post.content}
                      </p>
                      <div className="profile-post-stats">
                        <span className="profile-post-stat">
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {post.likes}
                        </span>
                        <span className="profile-post-stat">
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="profile-empty-message">
                    You haven't made any posts yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Profile;
