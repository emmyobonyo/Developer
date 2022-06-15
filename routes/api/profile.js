const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private

router.get('/me', auth, async(req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']) // find a user with that ID //populate it with the information that you need from the user model
    if (!profile) {
      return res.status(400).json({msg: `There is no profile for this user`}); 
    }
    res.json(profile)
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
})

// @route   POST api/profile
// @desc    Create or Update a User Profile
// @access  Private

router.post('/', [
  auth,
  [ 
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(404).json({ errors: errors.array() })
  }
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body

  //Build profile object
  const profileFields = {}
  profileFields.user = req.user.id
  if(company) profileFields.company = company
  if(website) profileFields.website = website
  if(location) profileFields.location = location
  if(bio) profileFields.bio = bio
  if(status) profileFields.status = status
  if(githubusername) profileFields.githubusername = githubusername
  if(skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim())
  }
  console.log(profileFields.skills)

  //Build social objects
  profileFields.social = {}
  if (youtube) profileFields.social.youtube = youtube
  if (twitter) profileFields.social.twitter = twitter
  if (facebook) profileFields.social.facebook = facebook
  if (linkedin) profileFields.social.linkedin = linkedin
  if (instagram) profileFields.social.instagram = instagram
  // console.log(profileFields)
  
  try {
    let profile = await Profile.findOne({ user: req.user.id })
    // console.log(`profile + ${profile}`)

    if (profile) {
      //Update Profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      )
      return res.json(profile)
    }

    //Create a Profile
    profile = new Profile(profileFields)
    await profile.save()
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public

router.get('/', async(req,res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'], User)
    // console.log(profiles)
    res.json(profiles)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('server error')
    
  }
})

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/user/:user_id', async(req,res) => {
  try {
    // get profile by user_id. The user id is in the url
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'], User)
    if (!profile) return res.status(400).send({ msg: 'Profile not found' })
    // console.log(profiles)
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    if (err.kind == 'ObjectId'){
      return res.status(400).send({ msg: 'Profile not found' })
    }
    res.status(500).send('server error')
    
  }
})
module.exports = router