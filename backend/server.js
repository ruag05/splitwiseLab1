'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
    const origin = req.headers.origin;
    console.log(origin);
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    console.log(req.headers);
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening at port#${PORT}`);
})