const express = require('express')
const router = express.Router()
const multer = require('multer')

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
    uploadProfilePic
} = require('../controller/userAuth.js')

//uploading profile pic
router.post('/profilePic', uploadProfilePic)
router.post('/auth/register', registerUser)
router.post('/auth/otpVerification', verifyCode )
router.post('/auth/login', login)


module.exports = router