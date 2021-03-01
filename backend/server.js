'use strict';

const express = require('express');
const path = require('path');

const app = express();

app.use('/users', (req,res)=>{
    
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server listening at port#${PORT}`);
})