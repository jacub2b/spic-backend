const express = require ('express');
const router = express.Router();
const connectToDB = require('../mongo');
const _ = require('lodash')
const {checkTokenFromHeader, getTokenFromHeader} = require("../utils");

router.get('/', async (req, res) => {
  try {
    const db = await connectToDB();
    const userToken = getTokenFromHeader(req.headers.authorization);
    const categories = db.collection('categories');
    const userCategories = await categories.find({ owner: { $in: ['public', userToken] } }).toArray();
    res.send(userCategories);
  } catch(error) {
    res.status(500).send('error fetching categories');
  }
});

router.post('/', async (req, res) => {
  if (!checkTokenFromHeader(req.headers.authorization)) return res.sendStatus(401);
  const token = getTokenFromHeader(req.headers.authorization)

  try {
    const db = await connectToDB();
    const {category} = req.body;
    const value = _.camelCase(category);

    const isExists = await db.collection('categories').findOne({value: value});
    if (isExists) return res.sendStatus(409);
    else {
      const newCategory = {title: category, value, icon: 'mdi-star', owner: token};
      await db.collection('categories').insertOne(newCategory);
      res.send({newCategory});
    }
  } catch(error) {
    res.status(500).send('error creating category');
  }
});

module.exports = router;