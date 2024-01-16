const express = require('express');
const router = express.Router();
const { User } = require('../../models');

const asyncHandler = (callback) => (req, res, next) =>
  Promise.resolve(callback(req, res, next)).catch(next);

// Create new user
router.post('/', asyncHandler(async (req, res) => {
  const userData = await User.create({
    username: req.body.username,
    password: req.body.password,
  });

  req.session.save(() => {
    req.session.user_id = userData.id;
    req.session.username = userData.username;
    req.session.logged_in = true;

    res.status(200).json(userData);
  });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const userData = await User.findOne({
    where: { username: req.body.username },
  });

  if (!userData || !(await userData.checkPassword(req.body.password))) {
    res.status(400).json({ message: 'Incorrect username or password. Please try again!' });
    return;
  }

  req.session.save(() => {
    req.session.user_id = userData.id;
    req.session.username = userData.username;
    req.session.logged_in = true;

    res.status(200).json({ user: userData, message: 'You are now logged in!' });
  });
}));

// Logout
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exp
