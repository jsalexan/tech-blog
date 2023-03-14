// Post Handlebars

<div class="text-center">
  <h2>{{title}}</h2>
  <p>{{body}}</p>
  <p>Created by {{user.name}} on {{format_date date_created}}</p>
   <p>{{comment_body}}</p>

</div>

{{#if logged_in}}

<form class="comment-form" id="comment-form">
        <div class="input-field">
            <label>Comment:</label>
            <textarea type="text" id="comment" rows="20" placeholder="What's on your mind?"></textarea>
        </div>
        <input type="hidden" name="post_id" value="{{id}}">
        <button type="submit">Add Comment</button>
    </form>
{{comments}}


{{/if}}
<script src="/public/js/comments.js"></script>



{/* Comments handlebars partial */}

{{#each this}}
  <div class="comments">

  <section class="comment">
    <div class="meta">
      {{user.name}} on
      {{format_date date_created}}
    </div>
    <div class="text">
      {{comment_body}}
    </div>
  </section>

</div>
  {{/each}}

{/* Comment model */}
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Comment extends Model { }

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    comment_body: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateCreated: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "post",
        key: "id",
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "comment",
  }
);

module.exports = Comment;

{/* Comments.js */}

async function commentFormHandler(event) {
  event.preventDefault();

  const commentBody = document.querySelector('#comment').value.trim();

  const post_id = document.querySelector('input[name="post_id"]').value;

  if (commentBody) {
    const response = await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ comment_body, post_id }),
      headers: { 'Content-Type': 'application/json' },
    });

    try {
      if (response.ok) {
        document.location.reload();
      } else {
        alert('Failed to add comment');
      }
    } catch (err) {
      console.log(err.message);
    }
  }
};
document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);

{/* Comment Routes */}

const router = require('express').Router();
const { Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      include: [User],
    });
    // serialize 
    const comments = commentData.map((comment) => comment.get({ plain: true, include: [User] }));
    console.log(comments);

    res.render('singlepost', { comments, loggedIn: req.session.loggedIn });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      user_id: req.session.user_id,
      post_id: req.body.post_id,
      comment_body: req.body.comment_body,
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
  console.log(newComment)
});

module.exports = router;


{/* Home Routes */}

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
          attributes: ['name'],
        },
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

          Comment,
         
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
