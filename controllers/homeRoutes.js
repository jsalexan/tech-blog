const router = require('express').Router();
const { Post, User, Comment} = require('../models');
const withAuth = require('../utils/auth');

// -------------GET posts ----------------
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

// -------------GET posts by ID with comments ----------------
router.get('/:id', async (req, res) => {
  try {
      const postData = await Post.findOne({
          where: { id: req.params.id },
          include: [
              {  model: Comment,
                attributes: ["id", "comment_body", "post_id", "user_id", "createdAt"],
                include: {
                    model: User,
                    attributes: ["name", "id"],
                },
            },
            {
                model: User,
                attributes: ["name", "id"],
              }]
      });
      if (!postData) {
          return res.status(404).send('404 not found');
      }
      const post = postData.get({ plain: true });
      console.log(post)
        res.render('post', {
            ...post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// -------------GET user dashboard ----------------
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

// -------------GET login ----------------
router.get('/login', (req, res) => {

  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

// -------------GET create account ----------------
router.get("/createac", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("createac");
});


module.exports = router;
