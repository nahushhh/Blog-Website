// import .env file
require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const connectDB = require('./server/config/db')

const app = express();
const PORT = 5000 || process.env.PORT;

// Connect to DB
connectDB();

// express.static('public') is a built-in middleware function in Express. It serves static files such as HTML, CSS, JavaScript, and images from the public directory.
app.use(express.static('public'))

//Template engine
app.use(expressLayout);

// 'layout' is the setting name, and ./layouts/main is the value. This sets the default layout to be used for all views to ./layouts/main.ejs.
app.set('layout', './layouts/main');

app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'))

app.listen(PORT, ()=>{
    console.log(`App listening on - ${PORT}`);
})
