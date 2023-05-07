const express = require ('express');
const router = express.Router();
const connectToDB = require('../mongo');
const fs = require("fs");
const {getTokenFromHeader, checkTokenFromHeader} = require("../utils");

router.get('/', (req, res) => {
  res.send("you've gotta specify a category bro");
});

router.get('/categories/:category', async (req, res) => {
  try {
    const db = await connectToDB();
    const category = req.params.category;
    const userToken = getTokenFromHeader(req.headers.authorization);

    const categoryPictures = await db.collection('pictures')
    .find({category: category, owner: { $in: ['public', userToken] }}).toArray();
    res.send(categoryPictures);
  } catch(error) {
    console.error(error);
    res.status(500).send('error fetching pictures');
  }
});

router.post('/categories/:category', async (req, res) => {
    const isValidToken = checkTokenFromHeader(req.headers.authorization)
    if (!isValidToken) return res.sendStatus(401)

    const file = req.files.file
    const pictureName = req.body.title
    const category = req.params.category
    const src = `/pictures/categories/${category}/${file.name}`
    const token = getTokenFromHeader(req.headers.authorization)
    await file.mv(`./${src}`)

    try {
        const db = await connectToDB();
        await db.collection('pictures').insertOne({
            title: pictureName, category, src, owner: token
        });

        res.sendStatus(200)
    } catch(error) {
        res.status(500).send('error creating picture');
    }
})

router.get('/categories/:category/:name', (req, res) => {
    res.sendFile(decodeURI(req.originalUrl), {root: '.'} )
});

router.delete('/categories/:category/:name', async (req, res) => {
    try {
        const category = req.params.category
        const name = req.params.name

        fs.unlinkSync(`${__dirname}/../pictures/categories/${category}/${name}`)

        const db = await connectToDB()
        await db.collection('pictures').findOneAndDelete({category: category, src: decodeURI(req.originalUrl)})
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
});

module.exports = router;