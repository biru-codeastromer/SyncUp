import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabaseClient";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    title: "",
    avatar_url: "",
  });

  // Clubs state
  const [allClubs, setAllClubs] = useState([]);
  const [selectedClubs, setSelectedClubs] = useState([]);

  // Avatar preview
  const [avatarPreview, setAvatarPreview] = useState("");

  // Fetch user profile and clubs on mount
  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchClubs();
      fetchUserClubs();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        console.error("Error fetching profile:", error);
      }

      if (data) {
        setFormData({
          full_name: data.full_name || "",
          bio: data.bio || "",
          title: data.title || "",
          avatar_url: data.avatar_url || "",
        });
        setAvatarPreview(data.avatar_url || "");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const fetchClubs = async () => {
    try {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .order("name");

      if (error) throw error;
      setAllClubs(data || []);
    } catch (err) {
      console.error("Error fetching clubs:", err);
    }
  };

  const fetchUserClubs = async () => {
    try {
      const { data, error } = await supabase
        .from("club_memberships")
        .select("club_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setSelectedClubs(data?.map((m) => m.club_id) || []);
    } catch (err) {
      console.error("Error fetching user clubs:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClubToggle = (clubId) => {
    setSelectedClubs((prev) =>
      prev.includes(clubId)
        ? prev.filter((id) => id !== clubId)
        : [...prev, clubId]
    );
  };

  const handleAvatarUpload = async (e) => {
    try {
      setUploading(true);
      setError("");

      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      setFormData((prev) => ({ ...prev, avatar_url: publicUrl }));
      setAvatarPreview(publicUrl);
      setMessage("Avatar uploaded successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error uploading avatar:", err);
      setError("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          bio: formData.bio,
          title: formData.title,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // Update club memberships
      // First, delete all existing memberships
      await supabase
        .from("club_memberships")
        .delete()
        .eq("user_id", user.id);

      // Then, insert new memberships
      if (selectedClubs.length > 0) {
        const memberships = selectedClubs.map((clubId) => ({
          user_id: user.id,
          club_id: clubId,
        }));

        const { error: membershipError } = await supabase
          .from("club_memberships")
          .insert(memberships);

        if (membershipError) throw membershipError;
      }

      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
          bio: formData.bio,
          title: formData.title,
        },
      });

      if (authError) throw authError;

      setMessage("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-container">
          <div className="edit-profile-header">
            <h1 className="profile-name">Edit Profile</h1>
            <button
              onClick={() => navigate("/profile")}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="edit-profile-form">
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            {/* Avatar Upload Section */}
            <div className="form-section">
              <h3 className="section-title">Profile Photo</h3>
              <div className="avatar-upload-section">
                <div className="avatar-preview">
                  <img
                    src={
                      avatarPreview ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        formData.full_name || user?.email
                      )}&background=6366f1&color=fff&size=150`
                    }
                    alt="Avatar preview"
                    className="avatar-image"
                  />
                </div>
                <div className="avatar-upload-controls">
                  <label htmlFor="avatar-upload" className="upload-btn">
                    {uploading ? "Uploading..." : "Change Photo"}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                    style={{ display: "none" }}
                  />
                  <p className="upload-hint">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              
              <div className="form-group">
                <label htmlFor="full_name" className="form-label">
                  Full Name
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  className="form-input"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Title / Year
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Computer Science, 2nd Year"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio" className="form-label">
                  About Me
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  className="form-textarea"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows="4"
                  maxLength="500"
                />
                <p className="char-count">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>

            {/* Clubs Selection Section */}
            <div className="form-section">
              <h3 className="section-title">My Clubs</h3>
              <p className="section-description">
                Select the clubs you're a member of
              </p>
              <div className="clubs-selection-grid">
                {allClubs.map((club) => (
                  <label key={club.id} className="club-checkbox-card">
                    <input
                      type="checkbox"
                      checked={selectedClubs.includes(club.id)}
                      onChange={() => handleClubToggle(club.id)}
                      className="club-checkbox"
                    />
                    <div className="club-checkbox-content">
                      <span className="club-icon-large">{club.icon}</span>
                      <h4 className="club-checkbox-name">{club.name}</h4>
                      <p className="club-checkbox-description">
                        {club.description}
                      </p>
                    </div>
                    <div className="checkbox-indicator">
                      {selectedClubs.includes(club.id) && (
                        <span className="checkmark">✓</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="submit"
                className="save-btn"
                disabled={loading || uploading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditProfile;
