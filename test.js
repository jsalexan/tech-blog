// Comment js.

async function commentFormHandler(event) {
  event.preventDefault();

  const commentBody = document.querySelector('#comment').value.trim();

  const postId = document.querySelector('input[name="post_id"]').value;

  if (commentBody) {
    const response = await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ commentBody, postId }),
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


// and this is the handlebars 

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
{{/if}}
        <div>
        {{> comments}}
        </div>
        
<script src="/public/js/comment.js"></script>




{/* And this is the Comment Routes */}

const router = require('express').Router();
const { Comment, User, Post } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', withAuth, async (req, res) => {
try {
const commentData = await Comment.findAll();
const comments = commentData.map((comment) => comment.get({ plain: true }));

res.render('singlepost', { comments, logged_in: req.session.logged_in });
} catch (err) {
  console.log(err);
res.status(500).json(err);
  }
});

router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      user_id: req.session.user_id,
      post_id: req.body.postId,
      comment_body: req.body.commentBody,
    });
    console.log(newComment);

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
      const deleteComment = await Comment.destroy({
          where: {
              id: req.params.id
          }
      });
      res.status(200).json(deleteComment);
  } catch (err) {
      console.log(err);
      res.status(400).json(err);
  }
});

module.exports = router;
