const express = require('express');
const router = express.Router();
const Post = require('../models/Post')
const User = require('../models/User')


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

// Route to get posts
router.get('/post/:id', async(req, res)=>{
    try{
        const id = req.params.id
        const data = await Post.findById({ _id: id })
        const locals = {
            title: data.title,
            description: "Simple Blog created using NodeJS, Express and MongoDB"
        }
        res.render('post', { locals, data })
    }catch(error){
        console.error(error);
    }
})

// Search route
router.post('/search', async(req, res)=>{
    try {
        const locals = {
            title: "Search",
            description: "Simple Blog created using NodeJS, Express and MongoDB"
        }
        let searchTerm = req.body.searchTerm
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        const data = await Post.find({
            $or: [
                {title: { $regex: new RegExp(searchNoSpecialChar, 'i')}}, //search condition 1
                {body: { $regex: new RegExp(searchNoSpecialChar, 'i')}}, //search condition 2
            ]
        })

        //$or will perform search if either of the 2 conditions satisfy. 'i' is the ignore case flag. $regex... check the regular exp defined above
        
        res.render('search', { data, locals })
    } catch (error) {
        console.error(error);
    }
})

router.get("/about", (req, res)=>{
    res.render('about'); // render an ejs page 
})

module.exports = router
