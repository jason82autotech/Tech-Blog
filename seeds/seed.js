const sequelize = require('../config/connection');
const { User } = require('../models/User.js');
const { Post } = require('../models/Post.js');

const userData = require('./userData.json');
const posts = require('./posts.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await Post.bulkCreate(posts, {});

  process.exit(0);
};

seedDatabase();
