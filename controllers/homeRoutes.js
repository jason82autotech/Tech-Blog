const express = require('express');
const router = express.Router();
const { Post } = require('../models');
const withAuth = require('../utils/auth.js');

// Async wrapper function to handle asynchronous code
const asyncHandler = (callback) => (req, res, next) => {
  Promise.resolve(callback(req, res, next)).catch(next);
};

// Get homepage populated with all posts
router.get('/', asyncHandler(async (req, res) => {
  const postData = await Post.findAll();
  const posts = postData.map((post) => post.get({ plain: true }));
  res.render('homepage', { posts, logged_in: req.session.logged_in });
}));

// Get login page
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login');
});

// Get signup page
router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('signup');
});

// Get dashboard
router.get('/dashboard', withAuth, asyncHandler(async (req, res) => {
  const postData = await Post.findAll({
    where: { user_id: req.session.user_id },
  });
  const posts = postData.map((post) => post.get({ plain: true }));
  res.render('dashboard', { posts, logged_in: req.session.logged_in });
}));

module.exports = router;
