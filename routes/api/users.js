const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const { check, validationResult } = require('express-validator')
const User = require('../../models/User');
const bcrypt = require('bcryptjs/dist/bcrypt');

// @route   POST api/users
// @desc    Register User
// @access  Public

router.post(
  '/',
  [ 
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    check('email', 'Please enter a valid password')
    .isEmail(),
    check('password', 'Please should be at least 6 characters')
    .isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body

    try {
      // See if user exists
      let user = await User.findOne({ email })

      if (user) {
        res.status(400).json({ errors: [{msg: 'User already exists'}]})
      }

      // Fetch gravtar

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })

      user = new User({
        name,
        email,
        avatar,
        password
      })

      // Encrypt Password

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt)

      // Return jsonwebtoken

    res.send('Users ...')
    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server Error')
    }
  })

module.exports = router