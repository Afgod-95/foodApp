const User = require('../models/users.js')
const crypto = require('crypto')
const multer = require('multer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const emailFormat = new RegExp(/^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
const strongPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

//upload profile image
const uploadProfileImage = async (req, res) => {
    try{
        const user = new User
        user.proFilePic.push({
            image: req.file.buffer,
            contentType: req.file.mimetype
        })

        await user.proFilePic.save()
        res.status(200).json({ message: 'Image uploaded successfully' })
        
    }
    catch (error){
        res.status(400).json({ error: error.message }) 
    }
}

//user registration start point 
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        console.log(req.body)

        //checking credentials of inputs
        if (!name ||!email ||!password) {
            return res.status(400).json({ 
                error: 'Please all credentials are required' 
            })
        }
    
        if (!emailFormat.test(email)) {
            return res.status(400).json({ 
                error: 'Invalid email format'
            })
        }
    
        if(!strongPass.test(password)){
            return res.status(400).json({ 
                error: 'Password must be at least 8 characters long and contain at least one number, one uppercase letter and one lowercase letter'
            })
        }

        //checking if email already exist
        const userEmail = await User.findOne({ email })
        if (userEmail) {
            return res.status(400).json({
                error: 'User already exists'
             })
             
        }
        //no email, then save new user
        const newUser = new User({
            name,
            email,
            password: await bcrypt.hash(password, 12)
        })

        //generating verification token
        newUser.verificationToken = crypto.randomBytes(6).toString('hex').replace(/[a-f]/g, '')
        await newUser.save()
        res.status(200).json({ message: "Registration successful"})
        console.log(newUser)

        const transporter = nodemailer.createTransport({
            service:'gmail',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'afgod98@gmail.com', // generated ethereal user
                pass: process.env.EMAIL_PASS // generated ethereal password
            }
        })
        //mail options 
        const mailOptions = {
            from: 'ShopNeest.com', // sender address
            to: email, // list of receivers
            subject: 'Account Verification', // Subject line
            text: 'Hello,\n\n' +
            'Please verify your account by clicking the link below:\n\n' +
            'https://restaurantapi-bsc7.onrender.com/verify/' + newUser.verificationToken + '\n\n' +
            'If you did not make this request, please ignore this email and your password will remain unchanged.\n'
        }
        //sending email to new users
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(400).json({ error: error.message })
            }
            res.status(200).json({
                message: 'Email sent'
            })
            console.log('Message sent: %s', info.messageId)
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        })
    } 
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//user tokin verification
const verifyToken = async (req, res) => {
    try {
        const { token } = req.params
        const user = await User.findOne({ verificationToken: token })
        if (!user) {
            return res.status(400).json({
                error: 'Invalid verification token'
            })
        }
        user.verified = true
        user.verificationToken =  undefined
        await user.save()
        res.status(200).json({
            message: 'Email verified successfully'
        })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//generate secretkey 
const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(6).toString('hex').replace(/[a-f]/g, '')
    return secretKey
}

const secretKey = generateSecretKey()
//login 
const login = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                error: "Please provide necessary credentials"
            });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                error: "Invalid email"
            });
        }

        // Compare the provided password with the hashed password in the user object
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({
                error: 'Invalid password'
            });
        }

        // Generate a token (ensure you have a valid 'secretKey' variable)
        const token = jwt.sign({ userId: user._id }, secretKey);

        res.status(200).json({ token });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({
            error: "An error occurred while processing your request"
        });
    }
};


//exporting user functions 
module.exports = {
    uploadProfileImage,
    registerUser,
    verifyToken,
    login
}