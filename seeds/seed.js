const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const userData = require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, { individualHooks: true });
    console.log("Users Seeded");

    await Post.bulkCreate(postData, { individualHooks: true });
    console.log("Posts Seeded");

    await Comment.bulkCreate(commentData, { individualHooks: true });
    console.log("Comments Seeded");
  
  process.exit(0);
};

seedDatabase();