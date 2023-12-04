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
    uploadProfilePic,
    verifyResetOTP,
} = require('../controller/userAuth.js')

const {
    postProducts,
    getAllProduct,
    updateSingleProduct,
    deleteSingleProduct,
    getProductById
} = require('../controller/products.js');

const { userOrder, orderHistory } = require('../controller/order.js');

//uploading profile pic
router.post('/profilePic', uploadProfilePic)

//user auth
router.post('/auth/register', registerUser)
router.post('/auth/otpVerification', verifyCode )
router.post('/auth/reset-password-otp-verification', verifyResetOTP)
router.post('/auth/login', login)

//forgot password
router.post('/auth/forgot-password', ForgotPassword)


//products api
router.get('/api/products', getAllProduct )
router.get('/api/products/id', getProductById)
router.post('/api/postproducts', postProducts)
router.put('/api/products/id', updateSingleProduct)
router.delete('/api/products/id', deleteSingleProduct)

//order
router.get('/api/orders', orderHistory)
router.post('/api/userOrders', userOrder)


const CLIENT_ID = 'foodapp-403604';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';

// Callback URL where Google redirects after user authorization
const CALLBACK_URL = 'http://localhost:3000/auth/google/callback';

// Configure Passport with Google strategy
passport.use(new GoogleStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: CALLBACK_URL,
  scope: ['profile', 'email'],
}, (accessToken, refreshToken, profile, done) => {
  // Check if user already exists
  User.findOne({ googleId: profile.id }, (err, user) => {
    if (err) { return done(err); }

    if (user) {
      // User already exists, log them in
      return done(null, user);
    } else {
      // New user, create and log them in
      const newUser = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      });

      newUser.save((err, savedUser) => {
        if (err) { return done(err); }
        return done(null, savedUser);
      });
    }
  });
}));

// Define routes for login and signup with Google

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/profile', // Redirect to profile page on success
  failureRedirect: '/login', // Redirect to login page on failure
}));

// Generate JWT token for authenticated user
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized');
  }

  const token = jwt.sign({ id: req.user.id }, 'YOUR_JWT_SECRET', { expiresIn: '1h' });
  res.send({ token });
});

  

module.exports = router