const { response } = require('express');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth')
const Post = require('../../models/Posts')

// @route   GET api/posts
// @desc    Test Route
// @access  Public

router.get('/', [ auth, [
  check('text', 'Text is required').not().isEmpty()
] ], async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() })
  }

  const user = await User 
})

module.exports = router