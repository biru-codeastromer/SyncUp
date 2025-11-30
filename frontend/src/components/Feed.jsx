import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './Layout';
import { API_BASE_URL, useAuth } from '../context/AuthContext';

const Feed = () => {
  const [filter, setFilter] = useState('all');
  const [likedPosts, setLikedPosts] = useState({});
  const [posts, setPosts] = useState([]);
  const [feedError, setFeedError] = useState('');
  const [loadingPosts, setLoadingPosts] = useState(true);
  const { user, token } = useAuth();
  const [newContent, setNewContent] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [posting, setPosting] = useState(false);

  const myClubs = [
    { id: 1, name: 'Coding Club', icon: '💻', active: true },
    { id: 2, name: 'Gaming Society', icon: '🎮', active: false },
    { id: 3, name: 'Art Collective', icon: '🎨', active: false },
    { id: 4, name: 'Debate Team', icon: '🎤', active: false }
  ];

  const announcements = [
    {
      id: 1,
      title: 'Library Hours Extended for Finals',
      subtitle: 'The main library will be open 24/7 starting next week...',
      date: 'Today'
    },
    {
      id: 2,
      title: 'Fall Career Fair Registration',
      subtitle: "Don't miss the chance to meet top employers...",
      date: 'Yesterday'
    },
    {
      id: 3,
      title: 'COVID-19 Policy Update',
      subtitle: 'Masks are now optional in most campus buildings...',
      date: '2 days ago'
    }
  ];

  // fetchPosts is used on mount and after creating a post so we expose it here
  const fetchPosts = async (page = 1, limit = 20) => {
    try {
      setLoadingPosts(true);
      const response = await axios.get(`${API_BASE_URL}/api/posts`, {
        params: { page, limit },
      });
      const payload = Array.isArray(response.data) ? response.data : response.data?.data;
      setPosts(payload || []);
      setFeedError('');
    } catch (err) {
      console.error('Failed to load posts:', err.response?.data?.error || err.message);
      setFeedError(err.response?.data?.error || 'Failed to load posts. Please try again.');
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'public') return post.visibility === 'public';
    if (filter === 'following') return likedPosts[post.post_id];
    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (Number.isNaN(diffInHours)) return 'Just now';
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const handleLike = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <Layout>
      <div className="feed-wrapper">
        <div className="feed-sidebar-left">
          <div className="sidebar-section">
            <h3 className="sidebar-title">My Clubs</h3>
            <div className="clubs-list">
              {myClubs.map(club => (
                <div key={club.id} className={`club-item ${club.active ? 'active' : ''}`}>
                  <span className="club-icon">{club.icon}</span>
                  <span className="club-name">{club.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn">📢 Create Announcement</button>
              <button className="quick-action-btn">📝 Draft Post</button>
              <button className="quick-action-btn">📅 Schedule Event</button>
            </div>
          </div>
        </div>

        <div className="feed-center">
          <div className="create-post-card">
            <div className="create-post-header">
              <img
                src={user?.profile_pic_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'}
                alt={user?.name || 'User'}
                className="create-post-avatar"
              />
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={`What's on your mind, ${user?.name || 'there'}?`}
                className="create-post-input"
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
              <input
                type="text"
                placeholder="Optional image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="create-post-image-input"
                style={{ flex: 1 }}
              />
              <button
                className="create-post-submit"
                onClick={async () => {
                  if (!newContent || !newContent.trim()) return setFeedError('Please enter post content.');
                  setPosting(true);
                  setFeedError('');
                  try {
                    const payload = { content: newContent.trim() };
                    if (newImageUrl && newImageUrl.trim()) payload.image_url = newImageUrl.trim();

                    // include Authorization header explicitly as a fallback
                    const headers = token ? { Authorization: `Bearer ${token}` } : {};

                    await axios.post(`${API_BASE_URL}/api/posts`, payload, { headers });

                    // refresh first page after successful create to keep pagination consistent
                    await fetchPosts(1, 20);

                    setNewContent('');
                    setNewImageUrl('');
                  } catch (err) {
                    console.error('Create post failed:', err.response?.data || err.message);
                    setFeedError(err.response?.data?.error || 'Failed to create post.');
                  } finally {
                    setPosting(false);
                  }
                }}
                disabled={posting}
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>

          <div className="feed-filters">
            {['all', 'public', 'following'].map(option => (
              <button
                key={option}
                className={`filter-btn ${filter === option ? 'active' : ''}`}
                onClick={() => setFilter(option)}
              >
                {option === 'all' && 'All Posts'}
                {option === 'public' && 'Public'}
                {option === 'following' && 'Following'}
              </button>
            ))}
          </div>

          <div className="feed-posts">
            {feedError && (
              <div className="post-card" style={{ borderColor: '#fecaca', background: '#fef2f2' }}>
                <p style={{ color: '#b91c1c', margin: 0 }}>{feedError}</p>
              </div>
            )}

            {loadingPosts && (
              <div className="post-card">
                <p style={{ margin: 0 }}>Loading posts...</p>
              </div>
            )}

            {!loadingPosts && !feedError && filteredPosts.length === 0 && (
              <div className="post-card">
                <p style={{ margin: 0 }}>No posts to show yet. Check back soon!</p>
              </div>
            )}

            {!loadingPosts && !feedError && filteredPosts.map(post => {
              const displayName = post.user?.name || 'Club Member';
              const avatar = post.user?.profile_pic_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff&size=128`;
              const postLikes = post.likes_count ?? 0;
              const postComments = post.comments_count ?? 0;

              return (
                <div key={post.post_id} className="post-card">
                  <div className="post-header">
                    <div className="post-user-info">
                      <img src={avatar} alt={displayName} className="post-avatar" />
                      <div className="post-user-details">
                        <h4 className="post-user-name">{displayName}</h4>
                        <p className="post-time">Posted {formatDate(post.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="post-body">
                    <p className="post-text">{post.content}</p>
                    {post.image_url && (
                      <div className="post-image">
                        <img src={post.image_url} alt="Post" />
                      </div>
                    )}
                  </div>

                  <div className="post-stats">
                    <span className="stat">👍 {postLikes}</span>
                    <span className="stat">💬 {postComments}</span>
                    <span className="stat">🔗 0</span>
                  </div>

                  <div className="post-footer">
                    <button
                      className={`post-action ${likedPosts[post.post_id] ? 'liked' : ''}`}
                      onClick={() => handleLike(post.post_id)}
                    >
                      👍 Like
                    </button>
                    <button className="post-action">💬 Comment</button>
                    <button className="post-action">🔗 Share</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="feed-sidebar-right">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Campus Announcements</h3>
            <div className="announcements-list">
              {announcements.map(announcement => (
                <div key={announcement.id} className="announcement-item">
                  <h4 className="announcement-title">{announcement.title}</h4>
                  <p className="announcement-subtitle">{announcement.subtitle}</p>
                  <span className="announcement-date">{announcement.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Feed;
