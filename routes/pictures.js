const express = require ('express');
const router = express.Router();
const connectToDB = require('../mongo');

const pictures = require('../models/pictures.json');

router.get('/', (req, res) => {
  res.send("you've gotta specify a category bro");
});

router.get('/categories/:category', async (req, res) => {
  const db = await connectToDB();
  var category = req.params.category;
  var user = req.headers.authorization;
  res.send(pictures);

  console.log("yey " + category);
});

module.exports = router;