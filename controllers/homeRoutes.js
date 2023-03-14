const express = require('express');
const router = require('express').Router();
const { Post, User, Comment} = require('../models');
const withAuth = require('../utils/auth');
const path = require('path');

router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name', 'id'],
        },
        {
          model: Comment,
          attributes: ["id", "comment_body", "date_created", "post_id", "user_id"],
          include: {
              model: User,
              attributes: ["name", "id"],
          },
        }
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        }, 
        {    
        model: Comment,
        attributes: ["id", "comment_body", "date_created", "post_id", "user_id"],
        include: {
            model: User,
            attributes: ["name", "id"],
        },
      } 
      ],
    });

    const post = postData.get({ plain: true });
    console.log(post);
    res.render('post', {
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {

  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});



module.exports = router;
