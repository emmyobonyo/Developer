const { response } = require('express');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth')
const Post = require('../../models/Posts')
const User = require('../../models/User')
const Profile = require('../../models/Profile')

// @route   POST api/posts
// @desc    Test Route
// @access  Public

router.post('/', [ auth, [
  check('text', 'Text is required').not().isEmpty()
] ], async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }) // it's res, not response
  }

  try {
    const user = await User.findById(req.user.id).select('-password')
    const newPost = new Post ({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    })

    const post = await newPost.save()
    res.json(post)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')    
  }
})

// @route   GET api/posts
// @desc    GET All Posts
// @access  Private

router.get('/', auth, async(req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })
    res.json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')    
  }
})

// @route   GET api/posts/:id
// @desc    GET a single post by ID
// @access  Private

router.get('/:id', auth, async(req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if(!post) {
      return res.status(404).json({msg: 'Post not found'})
    }
    res.json(post)
  } catch (err) {
    console.error(err.message)
    if(err.kind == 'ObjectId') {
      return res.status(404).json({msg: 'Post not found'})
    }
    res.status(500).send('Server Error')    
  }
})

// @route   DELETE api/posts/:id
// @desc    DELETE post by id
// @access  Private

router.delete('/:id', auth, async(req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // If post doesn't exist
    if(!post) {
      return res.status(404).json({msg: 'Post not found'})
    }

    // Check on the User
    if(post.user.toString() != req.user.id){
      return res.status(401).json({msg: 'User not authorized'})
    }

    await post.remove()
    res.json({ msg: 'Post removed' })
  } catch (err) {
    console.error(err.message)
    if(err.kind == 'ObjectId') {
      return res.status(404).json({msg: 'Post not found'})
    }
    res.status(500).send('Server Error')    
  }
})

// @route   PUT api/posts/like/:id
// @desc    Like a Post
// @access  Private

router.put('/like/:id', auth, async(req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    //Check if the post has already been liked by this user
    if (post.likes.filter(like => like.user.toString() == req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already liked' })
    }

    post.likes.unshift({ user: req.user.id })

    await post.save();
    res.json(post.likes)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')    
  }
})
module.exports = router