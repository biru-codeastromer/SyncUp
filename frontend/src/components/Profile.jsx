import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabaseClient";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("clubs");
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState([]);
  const [posts, setPosts] = useState([]);

  // Extract user data from Supabase auth
  const [profile, setProfile] = useState(null);
  const user = {
    name: profile?.full_name || authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || "User",
    title: profile?.title || authUser?.user_metadata?.title || "Student",
    bio: profile?.bio || authUser?.user_metadata?.bio || "Welcome to my profile!",
    avatar: profile?.avatar_url || authUser?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.user_metadata?.full_name || authUser?.email)}&background=6366f1&color=fff&size=150`
  };

  // Fetch user data on mount
  useEffect(() => {
    if (authUser) {
      fetchUserData();
    }
  }, [authUser]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch user's clubs
      const { data: clubsData } = await supabase
        .from("club_memberships")
        .select(`
          club_id,
          clubs (
            id,
            name,
            description,
            image_url,
            icon,
            color
          )
        `)
        .eq("user_id", authUser.id);

      if (clubsData) {
        setClubs(clubsData.map(m => m.clubs));
      }

      // Fetch user's posts
      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (postsData) {
        setPosts(postsData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-container">
          {/* Profile Header */}
          <div className="profile-header-section">
            <div className="profile-info-wrapper">
              <div className="profile-avatar-large">
                <img src={user.avatar} alt={user.name} />
              </div>
              <div className="profile-details">
                <h1 className="profile-name">{user.name}</h1>
                <p className="profile-title">{user.title}</p>
                <p className="profile-bio">{user.bio}</p>
              </div>
            </div>
            <button 
              className="edit-profile-btn"
              onClick={() => navigate("/profile/edit")}
            >
              Edit Profile
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="profile-tabs">
            <button
              className={`profile-tab ${activeTab === "clubs" ? "active" : ""}`}
              onClick={() => setActiveTab("clubs")}
            >
              My Clubs
            </button>
            <button
              className={`profile-tab ${activeTab === "activity" ? "active" : ""}`}
              onClick={() => setActiveTab("activity")}
            >
              My Activity
            </button>
            <button
              className={`profile-tab ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="profile-content">
            {activeTab === "clubs" && (
              <div className="clubs-grid-profile">
                {loading ? (
                  <div className="empty-state">
                    <p>Loading clubs...</p>
                  </div>
                ) : clubs.length > 0 ? (
                  clubs.map(club => (
                    <div key={club.id} className="club-card-profile">
                      <div 
                        className="club-card-image" 
                        style={{ 
                          backgroundColor: club.color || '#6366f1',
                          backgroundImage: club.image_url ? `url(${club.image_url})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className="club-icon-overlay">
                          {club.icon ? (
                            <span style={{ fontSize: '48px' }}>{club.icon}</span>
                          ) : (
                            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
                              <circle cx="25" cy="25" r="18" />
                              <circle cx="25" cy="25" r="12" />
                              <path d="M25 13 L25 37 M13 25 L37 25" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="club-card-content">
                        <h3 className="club-card-title">{club.name}</h3>
                        <p className="club-card-description">{club.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>You haven't joined any clubs yet.</p>
                    <button 
                      className="edit-profile-btn"
                      onClick={() => navigate("/profile/edit")}
                      style={{ marginTop: '16px' }}
                    >
                      Join Clubs
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "activity" && (
              <div className="activity-content">
                {loading ? (
                  <div className="empty-state">
                    <p>Loading activity...</p>
                  </div>
                ) : posts.length > 0 ? (
                  <div className="activity-list">
                    {posts.map(post => (
                      <div key={post.id} className="activity-item">
                        <div className="activity-header">
                          <span className="activity-icon">📝</span>
                          <div className="activity-info">
                            <p className="activity-text">
                              You posted: <strong>{post.content.substring(0, 100)}{post.content.length > 100 ? '...' : ''}</strong>
                            </p>
                            <span className="activity-time">{formatDate(post.created_at)}</span>
                          </div>
                        </div>
                        {post.image_url && (
                          <img src={post.image_url} alt="Post" className="activity-image" />
                        )}
                        <div className="activity-stats">
                          <span>👍 {post.likes_count}</span>
                          <span>💬 {post.comments_count}</span>
                          <span>🔗 {post.shares_count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No recent activity to display.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="settings-content">
                <div className="empty-state">
                  <p>Settings panel coming soon.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
