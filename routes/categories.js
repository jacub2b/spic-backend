const express = require ('express');
const router = express.Router();
const connectToDB = require('../mongo');

const categoriesJson = require('../models/categories.json');

router.get('/', async (req, res) => {
  try {
    const db = await connectToDB();
    const userToken = req.headers.authorization;
    console.log("token:" + userToken);
    const categories = db.collection('categories');
    const userCategories = await categories.find({ owner: { $in: ['public', userToken] } }).toArray();
    
    res.send(userCategories);
  } catch(error) {
    console.error(error);
    res.status(500).send('error fetching categories');
  }
});

router.post('/', async (req, res) => {
  try {
    const db = await connectToDB();
    const {title, value, icon} = req.body;
    const userToken = req.headers.authorization;
    const owner = userToken ? userToken : 'public';

    const result = await db.collection('categories').insertOne({
      title, value, icon, owner
    });
    
    res.send(result);
  } catch(error) {
    console.error(error);
    res.status(500).send('error creating category');
  }
});

module.exports = router;