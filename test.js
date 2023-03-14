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
{{#each comments}}
<div class="comment">
  <p>{{comment_body}}</p>
  <p>By {{user.name}} on {{format_date date_created}}</p>
</div>
{{/each}}


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

  const postId = document.querySelector('input[name="post_id"]').value;

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
