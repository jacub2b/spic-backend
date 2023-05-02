const express = require ('express');
const router = express.Router();
const connectToDB = require('../mongo');

const pictures = require('../models/pictures.json');

router.get('/', (req, res) => {
  res.send("you've gotta specify a category bro");
});

router.get('/categories/:category', async (req, res) => {
  try {
    console.log('got pictures request');
    const db = await connectToDB();
    const category = req.params.category;
    const userToken = req.headers.authorization;

    const categoryPictures = await db.collection('pictures')
    .find({category: category, owner: { $in: ['public', userToken] }}).toArray();
    res.send(categoryPictures);
  } catch(error) {
    console.error(error);
    res.status(500).send('error fetching pictures');
  }
});

router.post('/categories/:category', async (req, res) => {
  try{
    const db = await connectToDB();
    const category = req.params.category;
    const {title, src} = req.body;
    const userToken = req.headers.authorization;
    const owner = userToken ? userToken : 'public';

    const result = await db.collection('pictures').insertOne({
      title, category, src, owner
    });

    res.send(result);
  } catch(error) {
    console.error(error);
    res.status(500).send('error creating picture');
  }
})

module.exports = router;