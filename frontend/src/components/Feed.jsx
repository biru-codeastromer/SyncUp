import React, { useState } from 'react';
import Layout from './Layout';
import { useAuth } from './MockAuthContext';

const Feed = () => {
  const [filter, setFilter] = useState('all');
  const [likedPosts, setLikedPosts] = useState({});
  const { user } = useAuth();

  // Hardcoded clubs data
  const myClubs = [
    { id: 1, name: 'Coding Club', icon: '💻', active: true },
    { id: 2, name: 'Gaming Society', icon: '🎮', active: false },
    { id: 3, name: 'Art Collective', icon: '🎨', active: false },
    { id: 4, name: 'Debate Team', icon: '🎤', active: false }
  ];

  // Hardcoded posts data - will be fetched from API later
  const posts = [
    {
      post_id: 1,
      user_id: 1,
      user_name: "Coding Club",
      user_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      club_id: 1,
      club_name: "Coding Club",
      content: "Our annual hackathon is just around the corner! 🚀 Get ready for 24 hours of coding, innovation, and fun. Prizes for the top 3 teams. Sign up link in bio!",
      image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
      visibility: "public",
      created_at: "2024-10-20T14:30:00Z",
      likes: 1200,
      comments: 345,
      shares: 123,
      isLiked: false
    },
    {
      post_id: 2,
      user_id: 2,
      user_name: "Art Collective",
      user_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      club_id: 3,
      club_name: "Art Collective",
      content: "Join our plein air painting session this Saturday at the campus botanical gardens. All skill levels welcome! We'll provide some basic materials, but feel free to bring your own. Let's get creative together in nature!",
      image_url: null,
      visibility: "public",
      created_at: "2024-10-19T18:45:00Z",
      likes: 487,
      comments: 98,
      shares: 56,
      isLiked: false
    }
  ];

  // Hardcoded comments data
  const commentsData = {
    1: [
      {
        comment_id: 1,
        user_name: "Jane Smith",
        user_avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
        content: "This looks amazing! Can't wait to be there.",
        likes: 15,
        created_at: "2024-10-20T15:00:00Z"
      }
    ]
  };

  // Hardcoded announcements data
  const announcements = [
    {
      id: 1,
      title: "Library Hours Extended for Finals",
      subtitle: "The main library will be open 24/7 starting next week...",
      date: "Today"
    },
    {
      id: 2,
      title: "Fall Career Fair Registration",
      subtitle: "Don't miss the chance to meet top employers...",
      date: "Yesterday"
    },
    {
      id: 3,
      title: "COVID-19 Policy Update",
      subtitle: "Masks are now optional in most campus buildings...",
      date: "2 days ago"
    }
  ];

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'public') return post.visibility === 'public';
    if (filter === 'following') return post.isLiked || Math.random() > 0.5;
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

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
        {/* Left Sidebar - My Clubs */}
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
        </div>

        {/* Center - Feed */}
        <div className="feed-center">
          {/* Create Post Card */}
          <div className="create-post-card">
            <div className="create-post-header">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" 
                alt="User" 
                className="create-post-avatar" 
              />
              <input 
                type="text" 
                placeholder="What's on your mind?" 
                className="create-post-input"
                readOnly
              />
            </div>
            <div className="create-post-actions">
              <button className="create-action-btn">
                <span>📷</span> Photo
              </button>
              <button className="create-action-btn">
                <span>🎥</span> Video
              </button>
              <button className="create-action-btn">
                <span>📅</span> Event
              </button>
            </div>
          </div>

          <div className="feed-posts">
            {filteredPosts.map(post => (
              <div key={post.post_id} className="post-card">
                <div className="post-header">
                  <div className="post-user-info">
                    <img src={post.user_avatar} alt={post.user_name} className="post-avatar" />
                    <div className="post-user-details">
                      <h4 className="post-user-name">{post.user_name}</h4>
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
                  <span className="stat">👍 {post.likes}k</span>
                  <span className="stat">💬 {post.comments}</span>
                  <span className="stat">🔗 {post.shares}</span>
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

                {commentsData[post.post_id] && (
                  <div className="comments-section">
                    {commentsData[post.post_id].map(comment => (
                      <div key={comment.comment_id} className="comment-item">
                        <img src={comment.user_avatar} alt={comment.user_name} className="comment-avatar" />
                        <div className="comment-body">
                          <div className="comment-header">
                            <span className="comment-name">{comment.user_name}</span>
                            <span className="comment-time">{formatDate(comment.created_at)}</span>
                          </div>
                          <p className="comment-text">{comment.content}</p>
                          <button className="comment-like">👍 {comment.likes}</button>
                        </div>
                      </div>
                    ))}
                    <input type="text" placeholder="Write a comment..." className="comment-input" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Announcements */}
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
