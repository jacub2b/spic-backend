const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const categoriesRouter = require('./routes/categories');
const picturesRouter = require('./routes/pictures');
const usersRouter = require('./routes/users');

app.use(cors({origin: '*'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({createParentPath: true}))

app.use('/', usersRouter)
app.use('/categories', categoriesRouter);
app.use('/pictures', picturesRouter);

app.listen(8000, () => {
  console.log('Server started on port 8000');
});
