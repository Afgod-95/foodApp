const express = require('express')
const router = express.Router()

const {
    registerUser,
    verifyToken,
    uploadProfileImage,
    login
} = require('../controller/userAuth.js')

router.post('uploadImage', uploadProfileImage)
router.post('/auth/register', registerUser)
router.get('/auth/verifyToken', verifyToken)
router.post('/auth/login', login)


module.exports = router