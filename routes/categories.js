const express = require ('express');
const router = express.Router();

const categoriesJson = require('../models/categories.json');

router.get('/', (req, res) => {
  res.send(categoriesJson);
})


module.exports = router;