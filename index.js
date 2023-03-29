const express = require('express');
const app = express();
const port = 1234;
const categories = require('./models/categories.json');

app.get('/categories', (req, res) => {
  res.send(categories);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
