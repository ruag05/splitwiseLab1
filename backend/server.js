const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const usersRouter = require('./routes/users');
const groupsRouter = require('./routes/groups');

const app = express();

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
  const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/users', usersRouter);
app.use('/groups', groupsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server is running on PORT: ' + PORT);
});