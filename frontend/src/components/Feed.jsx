import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './Layout';
import { API_BASE_URL, useAuth } from '../context/AuthContext';

const Feed = () => {
  const [filter, setFilter] = useState('all');
  const [likedPosts, setLikedPosts] = useState({}); // maps post_id -> boolean
  const [posts, setPosts] = useState([]);
  const [feedError, setFeedError] = useState('');
  const [loadingPosts, setLoadingPosts] = useState(true);
  const { user, token } = useAuth();
  const [newContent, setNewContent] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [posting, setPosting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [commentsByPost, setCommentsByPost] = useState({}); // post_id -> array of comments
  const [commentsLoading, setCommentsLoading] = useState({}); // post_id -> boolean
  const [commentInputs, setCommentInputs] = useState({}); // post_id -> draft content

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
  const fetchPosts = async (pageNum = 1, limit = 20) => {
    try {
      setLoadingPosts(true);
      console.log('[Feed] Fetching posts, page:', pageNum);
      const response = await axios.get(`${API_BASE_URL}/api/posts`, {
        params: { page: pageNum, limit },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log('[Feed] Response:', response.data);
      const payload = Array.isArray(response.data) ? response.data : response.data?.data;
      console.log('[Feed] Setting posts:', payload?.length, 'items');
      setPosts(payload || []);
      // build likedPosts map from payload
      const likedMap = {};
      (payload || []).forEach(p => { likedMap[p.post_id] = !!p.liked_by_user; });
      setLikedPosts(likedMap);
      // pagination metadata (if available)
      const meta = response.data?.pagination;
      if (meta) {
        setPage(meta.page);
        setTotalPages(meta.totalPages);
        setHasNextPage(Boolean(meta.hasNextPage));
        setHasPrevPage(Boolean(meta.hasPrevPage));
      } else {
        setPage(1);
        setTotalPages(1);
        setHasNextPage(false);
        setHasPrevPage(false);
      }
      setFeedError('');
    } catch (err) {
      console.error('[Feed] Failed to load posts:', err.response?.data?.error || err.message);
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

  const handleLike = async (postId) => {
    if (!token) return alert('Please log in to like posts.');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/posts/${postId}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
      const { liked, likes_count } = res.data;
      // update likedPosts map
      setLikedPosts(prev => ({ ...prev, [postId]: liked }));
      // update posts array counts & liked flag
      setPosts(prev => prev.map(p => p.post_id === postId ? { ...p, likes_count, liked_by_user: liked } : p));
    } catch (err) {
      console.error('Like toggle failed:', err.response?.data || err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`${API_BASE_URL}/api/posts/${postId}`, { headers });
      // Refresh posts after deletion
      await fetchPosts(page, 20);
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err.message);
      setFeedError(err.response?.data?.error || 'Failed to delete post.');
    }
  };

  const fetchComments = async (postId) => {
    setCommentsLoading(prev => ({ ...prev, [postId]: true }));
    try {
      const res = await axios.get(`${API_BASE_URL}/api/posts/${postId}/comments`, { params: { page: 1, limit: 25 } });
      setCommentsByPost(prev => ({ ...prev, [postId]: res.data.data || [] }));
    } catch (err) {
      console.error('Failed to load comments:', err.response?.data || err.message);
    } finally {
      setCommentsLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleToggleComments = async (postId) => {
    if (commentsByPost[postId]) {
      // collapse
      setCommentsByPost(prev => ({ ...prev, [postId]: undefined }));
    } else {
      await fetchComments(postId);
    }
  };

  const handleAddComment = async (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;
    if (!token) return alert('Login required to comment');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/posts/${postId}/comments`, { content: text }, { headers: { Authorization: `Bearer ${token}` } });
      setCommentsByPost(prev => ({
        ...prev,
        [postId]: prev[postId] ? [res.data, ...prev[postId]] : [res.data]
      }));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      // increment comments_count for that post locally
      setPosts(prev => prev.map(p => p.post_id === postId ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p));
    } catch (err) {
      console.error('Create comment failed:', err.response?.data || err.message);
    }
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
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    setUploading(true);
                    setSelectedFileName(file.name);
                    try {
                      const form = new FormData();
                      form.append('file', file);
                      const headers = token ? { Authorization: `Bearer ${token}` } : {};
                      const res = await axios.post(`${API_BASE_URL}/api/uploads`, form, {
                        headers: { 'Content-Type': 'multipart/form-data', ...headers },
                      });
                      if (res.data?.url) setNewImageUrl(res.data.url);
                    } catch (err) {
                      console.error('Upload failed:', err.response?.data || err.message);
                      setFeedError('Image upload failed.');
                    } finally {
                      setUploading(false);
                    }
                  }}
                />
                <div style={{ flex: 1 }}>
                  {uploading ? <span>Uploading {selectedFileName}...</span> : (newImageUrl ? <img src={newImageUrl} alt="preview" style={{ maxHeight: 80 }} /> : <span className="muted">No image selected</span>)}
                </div>
              </div>
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
              const isOwnPost = user && post.user_id === user.user_id;

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
                    {isOwnPost && (
                      <button
                        className="post-delete-btn"
                        onClick={() => handleDeletePost(post.post_id)}
                        title="Delete post"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '1.1rem',
                          padding: '4px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        🗑️
                      </button>
                    )}
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
                      title={likedPosts[post.post_id] ? 'Unlike' : 'Like'}
                    >
                      {likedPosts[post.post_id] ? '💙 Liked' : '👍 Like'}
                    </button>
                    <button
                      className="post-action"
                      onClick={() => handleToggleComments(post.post_id)}
                    >
                      {commentsByPost[post.post_id] ? '🔽 Hide' : '💬 Comments'}
                    </button>
                    <button className="post-action">🔗 Share</button>
                  </div>
                  {commentsByPost[post.post_id] && (
                    <div className="post-comments" style={{ marginTop: 12 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentInputs[post.post_id] || ''}
                          onChange={e => setCommentInputs(prev => ({ ...prev, [post.post_id]: e.target.value }))}
                          style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #444', background: '#121225', color: '#fff' }}
                        />
                        <button
                          onClick={() => handleAddComment(post.post_id)}
                          style={{ padding: '8px 12px', borderRadius: 6, background: '#6366f1', color: '#fff', border: 'none' }}
                        >Post</button>
                      </div>
                      {commentsLoading[post.post_id] && <p style={{ margin: 0 }}>Loading comments...</p>}
                      {!commentsLoading[post.post_id] && commentsByPost[post.post_id]?.length === 0 && (
                        <p style={{ margin: 0 }} className="muted">No comments yet.</p>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {commentsByPost[post.post_id]?.map(c => (
                          <div key={c.comment_id} style={{ background: '#24264a', padding: '10px 12px', borderRadius: 8, border: '1px solid #343a5e' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <img
                                src={c.user?.profile_pic_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user?.name || 'User')}&background=8b5cf6&color=fff&size=64`}
                                alt={c.user?.name || 'User'}
                                style={{ width: 28, height: 28, borderRadius: '50%' }}
                              />
                              <strong style={{ fontSize: '0.75rem', color: '#f5f7ff' }}>{c.user?.name || 'User'}</strong>
                              <span style={{ fontSize: '0.65rem', color: '#b3b9d9' }}>{formatDate(c.created_at)}</span>
                            </div>
                            <p style={{ margin: '6px 0 0', fontSize: '0.78rem', lineHeight: 1.3, color: '#e6e9f8' }}>{c.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
            <button onClick={() => { if (hasPrevPage) { fetchPosts(page - 1, 20); } }} disabled={!hasPrevPage}>Prev</button>
            <span style={{ alignSelf: 'center' }}>Page {page} / {totalPages}</span>
            <button onClick={() => { if (hasNextPage) { fetchPosts(page + 1, 20); } }} disabled={!hasNextPage}>Next</button>
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
