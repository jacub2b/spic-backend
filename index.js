const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const categoriesRouter = require('./routes/categories');
const picturesRouter = require('./routes/pictures');
const usersRouter = require('./routes/users');

const testMongoConnection = require('./testMongo');

app.use(cors({origin: '*'}));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', usersRouter)
app.use('/categories', categoriesRouter);
app.use('/pictures', picturesRouter);


testMongoConnection('mongodb://localhost:27017').then((result) => console.log(result)); 

app.listen(8000, () => {
  console.log('Server started on port 8000');
});
