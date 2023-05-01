const express = require ('express');
const router = express.Router();

const pictures = require('../models/pictures.json');

router.get('/', (req, res) => {
  res.send("you've gotta specify a category bro");
});

router.get('/categories/:category', (req, res) => {
  var category = req.params.category;
  res.send(pictures);

  console.log("yey " + category);
});

module.exports = router;