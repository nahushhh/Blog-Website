const express = require('express');
const router = express.Router();
const Post = require('../models/Post')

//Home Route
router.get("/",  async(req, res)=>{
    try{
        let perPage = 4; // number of posts per page
        let page = req.query.page || 1;  // page number

        const data = await Post.aggregate([{$sort: { createdAt: -1 }}]).skip(perPage*page - perPage).limit(perPage).exec(); // sort on time created at in descending order, skip some posts as we have to show only some posts on the page and add a limit (4 in our case). exec will execute the aggregate pipeline

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count/perPage) // check if next page exists

        res.render('index', { data, current: page, nextPage: hasNextPage ? nextPage : null})
    }catch(error){
        console.error(error);
    }
})

router.get("/about", (req, res)=>{
    res.render('about'); // render an ejs page 
})

module.exports = router


// function insertPostData(){
//     Post.insertMany([
//         {
//             title: "Building a blog",
//             body: "This is a body text"
//         },
//         {
//             "title": "Introduction to JavaScript",
//             "body": "JavaScript is a versatile programming language used for web development."
//         },
//         {
//             "title": "Understanding CSS Grid",
//             "body": "CSS Grid is a powerful layout system for creating complex web designs with ease."
//         },
//         {
//             "title": "Mastering HTML5",
//             "body": "HTML5 is the latest version of Hypertext Markup Language, featuring new elements and attributes."
//         },
//         {
//             "title": "Getting Started with Node.js",
//             "body": "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine for building scalable network applications."
//         },
//         {
//             "title": "Exploring MongoDB",
//             "body": "MongoDB is a NoSQL database that provides high performance, high availability, and easy scalability."
//         },
//         {
//             "title": "Building Responsive Websites",
//             "body": "Responsive design ensures that web pages render well on a variety of devices and window or screen sizes."
//         },
//         {
//             "title": "Introduction to React",
//             "body": "React is a popular JavaScript library for building user interfaces, particularly for single-page applications."
//         },
//         {
//             "title": "The Basics of REST APIs",
//             "body": "REST APIs allow web applications to communicate with each other via HTTP requests."
//         },
//         {
//             "title": "Understanding Async/Await in JavaScript",
//             "body": "Async/Await makes it easier to write asynchronous code in JavaScript by allowing you to use synchronous-style code to handle asynchronous operations."
//         },
//         {
//             "title": "Introduction to TypeScript",
//             "body": "TypeScript is a superset of JavaScript that adds static types, making it easier to catch errors early in the development process."
//         },   
//     ])
// }

// insertPostData();