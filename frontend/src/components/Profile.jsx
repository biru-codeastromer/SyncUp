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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Profile Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '32px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
              <img
                src={user.avatar}
                alt={user.name}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid rgba(99, 102, 241, 0.3)'
                }}
              />
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
                  {user.name}
                </h1>
                <p style={{ color: '#a5b4fc', fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                  {user.title}
                </p>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>
                  {user.bio}
                </p>
              </div>
              <button
                onClick={() => navigate("/profile/edit")}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 32px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginTop: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              onClick={() => setActiveTab('clubs')}
              style={{
                padding: '16px 24px',
                background: activeTab === 'clubs' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: activeTab === 'clubs' ? '#6366f1' : 'rgba(255, 255, 255, 0.6)',
                border: 'none',
                borderBottom: activeTab === 'clubs' ? '2px solid #6366f1' : 'none',
                fontWeight: activeTab === 'clubs' ? '600' : '400',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              My Clubs
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              style={{
                padding: '16px 24px',
                background: activeTab === 'posts' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: activeTab === 'posts' ? '#6366f1' : 'rgba(255, 255, 255, 0.6)',
                border: 'none',
                borderBottom: activeTab === 'posts' ? '2px solid #6366f1' : 'none',
                fontWeight: activeTab === 'posts' ? '600' : '400',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              My Posts
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '24px' }}>
            {activeTab === 'clubs' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {clubs.length > 0 ? (
                  clubs.map((club) => (
                    <div
                      key={club.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      <img
                        src={club.logo_url}
                        alt={club.name}
                        style={{
                          width: '64px',
                          height: '64px',
                          objectFit: 'cover',
                          borderRadius: '12px'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontWeight: '600', fontSize: '16px', color: '#fff', marginBottom: '4px' }}>
                          {club.name}
                        </h3>
                        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', marginBottom: '8px' }}>
                          {club.description}
                        </p>
                        <button
                          onClick={() => navigate(`/clubs/${club.id}`)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#6366f1',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          View Club →
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', padding: '40px' }}>
                    You haven't joined any clubs yet.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'posts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '20px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                        <img
                          src={post.user_avatar}
                          alt={post.user_name}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            marginRight: '12px'
                          }}
                        />
                        <div>
                          <p style={{ fontWeight: '600', color: '#fff', fontSize: '14px' }}>
                            {post.user_name}
                          </p>
                          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                            {formatDate(post.created_at)}
                          </p>
                        </div>
                      </div>
                      <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px', lineHeight: '1.5' }}>
                        {post.content}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {post.likes}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', padding: '40px' }}>
                    You haven't made any posts yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
