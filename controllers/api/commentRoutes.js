const router = require('express').Router();
const { Comment, User, Post } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', withAuth, async (req, res) => {
try {
const commentData = await Comment.findAll({
where: { 
});
const comments = commentData.map((comment) => comment.get({ plain: true }));
res.render('singlepost', { comments, logged_in: req.session.logged_in });
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