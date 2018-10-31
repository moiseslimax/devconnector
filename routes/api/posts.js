const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


//post validator
const validadePostInput = require('../../validation/post')

const Post = require('../../models/Post')

const Profile = require('../../models/Profile');

// @route GET api/posts/test
// @desc  Tests post route
// @access Public
router.get('/test', (req, res) => res.json({msg: "posts Works"}));

// @route GET api/posts/test
// @desc  get all posts
// @access Public
router.get('/', (req,res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({msg: 'no posts found'}))
})

// @route GET api/posts/:id
// @desc  Get post by id
// @access Public
router.get('/:id', (req,res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({msg: 'no post found with that id'}))
})


// @route POST api/posts
// @desc  Create post
// @access private
router.post('/', passport.authenticate('jwt', { session: false }), (req,res) => {
    const { errors, isValid } = validadePostInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors)
    }
    
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    })

    newPost.save().then(post => res.json(post))
})
// @route Delete  api/posts/:id
// @desc  Delete post
// @access private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req,res) =>{
    Profile.findOne( { user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({ notauth: 'User not authorized' });
                    }

                    post.remove().then(() => res.json({ sucess: true }))
                })
                .catch(err => res.status(404).json({ posterr: 'post not found' }))
        })
})

// @route Post  api/posts/like/:id
// @desc  Like post
// @access private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req,res) =>{
    Profile.findOne( { user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                        return res.status(400).json({ alreadyliked: 'user already liked this post'})
                    }
                    post.likes.unshift({  user:req.user.id });
                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({ posterr: 'post not found' }))
        })
})

// @route Post  api/posts/unlike/:id
// @desc  Unlike post
// @access private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req,res) =>{
    Profile.findOne( { user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                        return res.status(400).json({ disliked: 'You have not liked'})
                    }
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);

                    //remove from array
                    post.likes.splice(removeIndex, 1);

                    //save
                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({ posterr: 'post not found' }))
        })
})

module.exports = router;