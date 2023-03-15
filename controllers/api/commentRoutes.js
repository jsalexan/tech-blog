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
          commentBody: req.body.commentBody,
      });
      console.log(newComment);
      res.status(200).json(newComment);
  } catch (err) {
      console.log(err);
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