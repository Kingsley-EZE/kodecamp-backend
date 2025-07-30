const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const authRouter = require('./routes/auth_router');
const productRouter = require('./routes/products_router');
const brandRouter = require('./routes/brand_router');

mongoose.connect(process.env.DB_URL).then(() => {
    console.log('Connected to DB');
}).catch((err) => {
    console.error('Error connecting to DB:', err);
});

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/brands', brandRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send('Not Found');
});


app.listen(8080, () => {
  console.log('Server is running on port 8080');
})
