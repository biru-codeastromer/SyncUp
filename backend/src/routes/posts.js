import express from "express";
import prisma from "../config/db.js";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const { page = "1", limit = "10" } = req.query;
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
  const skip = (parsedPage - 1) * parsedLimit;

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { visibility: "public" },
        include: {
          user: {
            select: { name: true, profile_pic_url: true },
          },
        },
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: parsedLimit,
      }),
      prisma.post.count({ where: { visibility: "public" } }),
    ]);

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

export default router;
