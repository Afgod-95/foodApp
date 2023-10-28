const express = require('express')
const router = express.Router()

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
    login
} = require('../controller/userAuth.js')

router.post('/auth/register', registerUser)
router.post('/auth/otpVerification', verifyCode )
router.post('/auth/login', login)


module.exports = router