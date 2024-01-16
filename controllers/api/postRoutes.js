const express = require('express');
const router = express.Router();
const { Post, Comment } = require('../../models');

const asyncHandler = (callback) => (req, res, next) =>
  Promise.resolve(callback(req, res, next)).catch(next);

// Create new post
router.post('/', asyncHandler(async (req, res) => {
  const newPost = await Post.create({
    title: req.body.title,
    creator: req.session.username,
    created_on: req.body.created_on,
    post: req.body.post,
    user_id: req.session.user_id,
  });

  res.status(200).json(newPost);
}));

// Get post by id
router.get('/:id', asyncHandler(async (req, res) => {
  const postData = await Post.findByPk(req.params.id, {
    include: [{ model: Comment, attributes: ['content', 'creator', 'created_on'] }],
  });

  if (!postData) {
    res.status(404).json({ message: 'No post found with this id!' });
    return;
  }

  const post = postData.get({ plain: true });
  res.render('singlePost', { post, logged_in: req.session.logged_in });
}))
