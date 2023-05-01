const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const users = require('../models/users.json');

router.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  if(!users.find(user => user.username == username)) {
    const token = jwt.sign({username}, 'secret');
    users.push({username, password, email, token});
    console.log(users);

    res.send({token});
    
  } else res.sendStatus(409)
});

router.post('login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password; 
  const user = users.find(user => user.username == username && user.password == password);

  console.log(user);

  if(user) {
    const token = user.token;
    res.send({token})
  } else res.sendStatus(401);
});

module.exports = router;

