import express from "express";
import prisma from "../config/db.js";
import authMiddleware from "../middleware/auth.js";
import jwt from "jsonwebtoken";
const router = express.Router();

// List posts (public). If Authorization header present, include liked_by_user flag
router.get("/", async (req, res) => {
  const { page = "1", limit = "10" } = req.query;
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
  const skip = (parsedPage - 1) * parsedLimit;

  try {
    // Try to decode auth token (optional) to know current user id
    let currentUserId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        currentUserId = decoded.userId;
      } catch (_) {
        // ignore invalid token for public listing
      }
    }

    const [rawPosts, total] = await Promise.all([
      prisma.post.findMany({
        where: { visibility: "public" },
        include: {
          user: { select: { name: true, profile_pic_url: true } },
          _count: { select: { likes: true, comments: true } },
        },
        orderBy: { created_at: "desc" },
        skip,
        take: parsedLimit,
      }),
      prisma.post.count({ where: { visibility: "public" } }),
    ]);

    // If we have a user, fetch which of these posts they liked
    let likedSet = new Set();
    if (currentUserId && rawPosts.length) {
      const likedRows = await prisma.like.findMany({
        where: { user_id: currentUserId, post_id: { in: rawPosts.map(p => p.post_id) } },
        select: { post_id: true },
      });
      likedSet = new Set(likedRows.map(r => r.post_id));
    }

    const posts = rawPosts.map(p => ({
      post_id: p.post_id,
      user_id: p.user_id,
      club_id: p.club_id,
      content: p.content,
      image_url: p.image_url,
      visibility: p.visibility,
      created_at: p.created_at,
      updated_at: p.updated_at,
      user: p.user,
      likes_count: p._count.likes,
      comments_count: p._count.comments,
      liked_by_user: likedSet.has(p.post_id),
    }));

    const totalPages = Math.max(Math.ceil(total / parsedLimit), 1);

    res.status(200).json({
      data: posts,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages,
        hasNextPage: parsedPage < totalPages,
        hasPrevPage: parsedPage > 1,
      },
    });
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const { content, club_id, visibility = "public", image_url } = req.body;
  const userId = req.user.userId;

  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Post content is required." });
  }

  if (!["public", "club_only"].includes(visibility)) {
    return res.status(400).json({ error: "Visibility must be 'public' or 'club_only'." });
  }

  try {
    const post = await prisma.post.create({
      data: {
        user_id: userId,
        content: content.trim(),
        visibility,
        club_id: club_id ? Number(club_id) : null,
        image_url: image_url ? String(image_url) : null,
      },
      include: {
        user: {
          select: { name: true, profile_pic_url: true },
        },
      },
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("Failed to create post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a post (only owner can delete)
router.delete("/:id", authMiddleware, async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const userId = req.user.userId;

  if (!postId || isNaN(postId)) {
    return res.status(400).json({ error: "Invalid post ID." });
  }

  try {
    // Check if post exists and belongs to user
    const post = await prisma.post.findUnique({
      where: { post_id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({ error: "You can only delete your own posts." });
    }

    // Delete related records first (likes, comments)
    await prisma.like.deleteMany({ where: { post_id: postId } });
    await prisma.comment.deleteMany({ where: { post_id: postId } });

    // Delete the post
    await prisma.post.delete({
      where: { post_id: postId },
    });

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (err) {
    console.error("Failed to delete post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Toggle like on a post
router.post("/:id/like", authMiddleware, async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const userId = req.user.userId;
  if (!postId || isNaN(postId)) {
    return res.status(400).json({ error: "Invalid post ID." });
  }
  try {
    const post = await prisma.post.findUnique({ where: { post_id: postId } });
    if (!post) return res.status(404).json({ error: "Post not found." });

    const existing = await prisma.like.findUnique({ where: { user_id_post_id: { user_id: userId, post_id: postId } } });
    let liked;
    if (existing) {
      await prisma.like.delete({ where: { like_id: existing.like_id } });
      liked = false;
    } else {
      await prisma.like.create({ data: { user_id: userId, post_id: postId } });
      liked = true;
    }
    const likesCount = await prisma.like.count({ where: { post_id: postId } });
    res.status(200).json({ post_id: postId, liked, likes_count: likesCount });
  } catch (err) {
    console.error("Failed to toggle like:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get likes count for a post
router.get("/:id/likes", async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  if (!postId || isNaN(postId)) {
    return res.status(400).json({ error: "Invalid post ID." });
  }
  try {
    const likesCount = await prisma.like.count({ where: { post_id: postId } });
    res.status(200).json({ post_id: postId, likes_count: likesCount });
  } catch (err) {
    console.error("Failed to get likes count:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// List comments for a post (public for now if post is public)
router.get("/:id/comments", async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const { page = "1", limit = "10" } = req.query;
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
  const skip = (parsedPage - 1) * parsedLimit;
  if (!postId || isNaN(postId)) {
    return res.status(400).json({ error: "Invalid post ID." });
  }
  try {
    const post = await prisma.post.findUnique({ where: { post_id: postId }, select: { visibility: true } });
    if (!post) return res.status(404).json({ error: "Post not found." });
    if (post.visibility !== 'public') {
      // For simplicity only public comments exposed until club auth implemented
      return res.status(403).json({ error: "Comments not accessible for this post." });
    }
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { post_id: postId },
        include: { user: { select: { name: true, profile_pic_url: true } } },
        orderBy: { created_at: 'desc' },
        skip,
        take: parsedLimit,
      }),
      prisma.comment.count({ where: { post_id: postId } }),
    ]);
    const totalPages = Math.max(Math.ceil(total / parsedLimit), 1);
    res.status(200).json({
      data: comments,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages,
        hasNextPage: parsedPage < totalPages,
        hasPrevPage: parsedPage > 1,
      }
    });
  } catch (err) {
    console.error('Failed to list comments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create comment on a post
router.post("/:id/comments", authMiddleware, async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const userId = req.user.userId;
  const { content } = req.body;
  if (!postId || isNaN(postId)) {
    return res.status(400).json({ error: "Invalid post ID." });
  }
  if (!content || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: "Comment content is required." });
  }
  try {
    const post = await prisma.post.findUnique({ where: { post_id: postId }, select: { post_id: true, visibility: true } });
    if (!post) return res.status(404).json({ error: "Post not found." });
    if (post.visibility !== 'public') {
      return res.status(403).json({ error: "Cannot comment on non-public post yet." });
    }
    const comment = await prisma.comment.create({
      data: { post_id: postId, user_id: userId, content: content.trim() },
      include: { user: { select: { name: true, profile_pic_url: true } } }
    });
    res.status(201).json(comment);
  } catch (err) {
    console.error('Failed to create comment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
