const express = require('express');
const prisma = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST api/posts/:postId/like
// @desc    Like a post
// @access  Private
router.post('/:postId/like', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await prisma.post.findUnique({
      where: { post_id: parseInt(postId) },
    });

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        user_id_post_id: {
          user_id: userId,
          post_id: parseInt(postId),
        },
      },
    });

    if (existingLike) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    const newLike = await prisma.like.create({
      data: {
        user_id: userId,
        post_id: parseInt(postId),
      },
    });

    res.json(newLike);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/:postId/like
// @desc    Unlike a post
// @access  Private
router.delete('/:postId/like', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await prisma.post.findUnique({
      where: { post_id: parseInt(postId) },
    });

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const like = await prisma.like.findUnique({
      where: {
        user_id_post_id: {
          user_id: userId,
          post_id: parseInt(postId),
        },
      },
    });

    if (!like) {
      return res.status(400).json({ msg: 'Post not yet liked' });
    }

    await prisma.like.delete({
      where: {
        user_id_post_id: {
          user_id: userId,
          post_id: parseInt(postId),
        },
      },
    });

    res.json({ msg: 'Post unliked' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
