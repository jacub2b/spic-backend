const express = require ('express');
const router = express.Router();
const connectToDB = require('../mongo');
const _ = require('lodash')
const jwt = require("jsonwebtoken");

router.get('/', async (req, res) => {
  try {
    const db = await connectToDB();
    const userToken = req.headers.authorization;
    const categories = db.collection('categories');
    const userCategories = await categories.find({ owner: { $in: ['public', userToken] } }).toArray();
    
    res.send(userCategories);
  } catch(error) {
    res.status(500).send('error fetching categories');
  }
});

router.post('/', async (req, res) => {
  try {
    const db = await connectToDB();
    const {category} = req.body;
    const value = _.camelCase(category);
    const authorization = req.headers.authorization;

    if (!authorization) return res.sendStatus(401);

    const token = authorization.split(' ')[1];
    const isValidToken = jwt.verify(token, 'secret', err => {
      if (err) {
        res.sendStatus(401)
        return false;
      } else return true
    });
    if (!isValidToken) return;

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