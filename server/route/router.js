const express = require('express')
const router = express.Router()
const multer = require('multer')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { OAuth2Client } = require('google-auth-library');
const mongoose = require('mongoose');
const User = require('../models/googleModel.js')

const roles = {
    user: 'user',
    admin: 'admin'
}

//middleware for checking roles of users
const checkRole = (requiredRole) => {
    return (req, res, next) => {
        const userRole = req.user.role
    }
}

const {
    registerUser,
    verifyCode,
    login,
    ForgotPassword,
    resetPassword,
    OneTimePassword,
    uploadProfilePic,
    sendResetPasswordEmail,
} = require('../controller/userAuth.js')

const {
    postProducts,
    getAllProduct,
    updateSingleProduct,
    deleteSingleProduct,
    getProductById
} = require('../controller/products.js')

//uploading profile pic
router.post('/profilePic', uploadProfilePic)

//user auth
router.post('/auth/register', registerUser)
router.post('/auth/otpVerification', verifyCode )
router.post('/auth/login', login)

//forgot password
router.post('/auth/forgot-password', ForgotPassword)
router.post('/auth/password-reset-request',OneTimePassword)
router.post('/auth/reset-password', resetPassword)

//products api
router.get('/api/products', getAllProduct )
router.get('/api/products/id', getProductById)
router.post('/api/postproducts', postProducts)
router.put('/api/products/id', updateSingleProduct)
router.delete('/api/products/id', deleteSingleProduct)



// Configure passport and Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://restaurantapi-bsc7.onrender.com/auth/google/callback',
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
  passReqToCallback: true,
}));

// Define route for Google login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route after Google authentication
router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/Main',
  failureRedirect: '/sign-up',
}));

// Route to handle user information after login
router.get('/', (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  const { displayName, email } = req.user.profile;
  res.send(`Welcome, ${displayName}! Your email is ${email}`);
});

// Signup logic (example using MongoDB)



router.post('/signup', async (req, res) => {
    const { name, email, googleId } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        // Already signed up
        return res.status(400).send({ message: 'User already exists' });
      }
  
      const newUser = await User.create({ name, email, googleId });
      // Send success response or redirect to login
      res.status(200).send({ message: 'User successfully signed up' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error signing up user' });
    }
  });
  

module.exports = router