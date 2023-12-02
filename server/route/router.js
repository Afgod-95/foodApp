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


module.exports = router