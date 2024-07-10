const express = require('express');
const router = express.Router();
const Post = require('../models/Post')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adminLayout = '../views/layouts/admin'
const jwtSecret = process.env.JWT_SECRET

// Middleware for auth

const authMiddleware = (req, res, next)=>{
    const token = req.cookies.token //get the token
    if(!token){
        return res.status(401).json({msg:"Unauthorized"})
    }
    try {
        const decoded = jwt.verify(token, jwtSecret)
        req.userId = decoded.userId
        next()
    } catch (error) {
        return res.status(401).json({msg:"Unauthorized"})
    }
}

router.get('/admin', async(req, res)=>{
    try {
        const locals = {
            title: "Admin",
            description: "Admin page"
        }

        res.render('admin/index', { locals, layout: adminLayout })
    } catch (error) {
        console.error(error);
    }
})

router.post('/admin', async(req, res)=>{
    try {
        const { username, password } = req.body
        
        const user = await User.findOne({ username })
        
        if(!user){
            return res.status(401).json({ msg:"Invalid credentials" })
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid){
            return res.status(401).json({ msg:"Invalid credentials" })
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret)
        res.cookie('token', token, {httpOnly: true})
        res.redirect('/dashboard')
        
    } catch (error) {
        console.error(error);
    }
})


router.get('/dashboard', authMiddleware, async(req, res)=>{
    try {
        const data=await Post.find()
        const id = req.userId
        const user = await User.findById({_id:id})
        const username = user.username
        res.render('admin/dashboard', {data, username, layout: adminLayout})
    } catch (error) {
        console.error(error);
    }
})

router.get('/add-post', authMiddleware, async(req, res)=>{
    try {
        const data=await Post.find()
        res.render('admin/add-post', {data, layout: adminLayout})
    } catch (error) {
        console.error(error);
    }
})

router.post('/add-post', authMiddleware, async(req, res)=>{
    try{
        const post = new Post({
            title: req.body.title,
            body: req.body.body
        })

        await Post.create(post)
        res.redirect('/dashboard')
    }catch(err){
        console.error(err);
    }
})

router.get('/edit-post/:id', authMiddleware, async(req, res)=>{
    try {
        const id = req.params.id
        const data=await Post.findById({ _id: id })
        res.render('admin/edit-post', {data, layout: adminLayout})
    } catch (error) {
        console.error(error);
    }
})

router.put('/edit-post/:id', authMiddleware, async(req, res)=>{
    try{
        await Post.findByIdAndUpdate(req.params.id,{
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()  
        })
        res.redirect(`/edit-post/${req.params.id}`);
    }catch(err){
        console.error(err);
    }
})

router.delete('/delete-post/:id', authMiddleware, async(req, res)=>{
   try {
        await Post.deleteOne({_id:req.params.id})
        res.redirect('/dashboard')
    }catch(err){
        console.error(err);
    }
})

router.get('/logout', (req, res)=>{
    res.clearCookie('token')
    res.redirect('/')
})

router.post("/register", async(req, res)=>{
    
    try {
        const { username, password } = req.body
        const saltRounds = 10
       
        // Generate salt
        const salt = await bcrypt.genSalt(saltRounds);
        // Hash password
        const hash = await bcrypt.hash(password, salt);
        try {
            // create the user
            const user = await User.create({username, password: hash})
            res.render('../views/success_register')
        } catch (error) {
            if(error.code===11000){
                res.status(409).json({msg: "User already in use"})
            }
            res.status(500).json({msg: "Internal Server Error"})
        }
    } catch (error) {
        console.error(error);
    }
})

router.get('/logout', (req, res) => {
    res.cookie('token', '', { expires: new Date(0), httpOnly: true });
    res.redirect('/');
});

module.exports = router