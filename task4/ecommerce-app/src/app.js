const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const port = process.env.PORT || 8080;

const authRouter = require('./routes/auth_router');
const productRouter = require('./routes/products_router');
const brandRouter = require('./routes/brand_router');
const orderRouter = require('./routes/orders_router');
const profileRouter = require('./routes/profile_router');

mongoose.connect(process.env.DB_URL).then(() => {
    console.log('Connected to DB');
}).catch((err) => {
    console.error('Error connecting to DB:', err);
});

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/brands', brandRouter);
app.use('/order', orderRouter);
app.use('/profile', profileRouter);

app.use(function(req, res, next) {
  res.status(404).send('Not Found');
});


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('room', (userId) => {
    socket.join(userId);
    console.log(`User ${socket.id} joined room: ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
