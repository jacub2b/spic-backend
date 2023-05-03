const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const connectToDB = require('../mongo');

router.post('/register', async (req, res) => {
  try {
    const {username, password, email} = req.body;
    const db = await connectToDB();
    const users = await db.collection('users').find().toArray();

    if(!users.find(user => user.username === username)) {
      const token = jwt.sign({username}, 'secret', {noTimestamp: true});
      await db.collection('users').insertOne({username, password, email, token});

      res.send({token});
    } else res.status(409).send('username already in use');
  } catch(error) {
    console.error(error);
    res.status(500).send('error registering user');
  }
});

router.post('/login', async (req, res) => {
  try {
    const {username, password} = req.body;
    const db = await connectToDB();
    const user = await db.collection('users').findOne({username: username, password: password});

    if(user) {
      const token = user.token;
      res.send({token})
    } else res.status(401).send('incorrect username or password');
  } catch (error) {
    console.error(error);
    res.status(500).send('error logging in user')
  }
});

module.exports = router;