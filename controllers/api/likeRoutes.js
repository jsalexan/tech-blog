const router = require('express').Router();
const { Like} = require('../../models');
const withAuth = require('../../utils/auth');


// add a document to the DB collection recording the click event
router.post('/clicked', (req, res) => {
    const click = {clickTime: new Date()};
    console.log(click);
    console.log(db);
  
    db.collection('clicks').save(click, (err, result) => {
      if (err) {
        return console.log(err);
      }
      console.log('click added to db');
      res.sendStatus(201);
    });
  });
  
  // get the click data from the database
router.get('/clicks', (req, res) => {
  
    db.collection('clicks').find().toArray((err, result) => {
      if (err) return console.log(err);
      res.send(result);
    });
  });

  module.exports = router;