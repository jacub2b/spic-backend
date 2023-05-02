const express = require ('express');
const router = express.Router();
const connectToDB = require('../mongo');

const categoriesJson = require('../models/categories.json');

router.get('/', async (req, res) => {
  const db = await connectToDB();
  const userToken = req.headers.authorization;
  const categories = db.collection('Categories');
  
  res.send(categories.find({ owner: { $in: ['public', userToken] } }));
})


module.exports = router;