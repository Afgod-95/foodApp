const User = require('../models/users.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const emailFormat = new RegExp(/^[a-zA-Z0-9_.+]*[a-zA-Z][a-zAZ0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/);

const multer = require('multer');
const { generateKey } = require('crypto');
const storage = multer.memoryStorage()
const upload = multer({storage: storage })


//profile pic 
const uploadProfilePic = upload.single('image', async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({
          error: 'No file uploaded',
        });
      }
      const userId = req.user._id;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
        });
      }
  
      // Update the user's profilePic field with the uploaded image data
      user.proFilePic = [
        {
          image: file.buffer,
          contentType: file.mimetype,
        },
      ];
  
      await user.save();
  
      res.status(200).json({
        message: 'Profile picture uploaded successfully',
      });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({
        error: 'An error occurred while processing your request',
      });
    }
  });
  
// User registration start point
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'Please provide all credentials',
            });
        }

        if (!emailFormat.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format',
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters',
            });
        }

        const userEmail = await User.findOne({ email });
        if (userEmail) {
            return res.status(400).json({
                error: 'User already exists',
            });
        }

        const newUser = new User({
            name,
            email,
            password: await bcrypt.hash(password, 12),
        });

        const verificationCodeData = generateOTP();
        console.log(verificationCodeData)
        
        newUser.verificationCode = verificationCodeData.otp;
        newUser.verificationCodeExpiration = verificationCodeData.expirationTime;

        await newUser.save();
        res.status(200).json({ 
            message: 'A 6-digit verification code has been sent to your registered email address. Please check your inbox or spam folder for the code.'
        });

        const emailInfo = await sendVerificationEmail(email, verificationCodeData.otp);

        res.status(200).json({
            message: 'Email sent',
            emailInfo,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Verify user with entered OTP
const verifyCode = async (req, res) => {
    try {
        const { enteredCode, email } = req.body;
        console.log(req.body);

        if (!enteredCode || !email) {
            return res.status(400).json({
                error: 'Invalid OTP or email.',
            });
        }

        const user = await User.findOne({ email });
        console.log('Entered OTP:', enteredCode);
        console.log('Stored OTP:', user.verificationCode);
        console.log('Expirat', user.verificationCodeExpiration)
        if (user.verified) {
            return res.status(400).json({
                error: 'User is already verified.',
            });
        }

        // Check if the entered OTP matches the stored OTP in the user object
        if (user.verificationCode === enteredCode && user.verificationCodeExpiration > new Date()) {
            user.verified = true;
            user.verificationCode = null;
            user.verificationCodeExpiration = null;

            await user.save();
            res.status(200).json({
                message: 'Email verified successfully.',
            });
        } 
        else {
            return res.status(400).json({
                error: 'Invalid verification code or code has expired.',
            });
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({
            error: 'An error occurred while processing your request.',
        });
    }
};

// Login
const login = async (req, res) => {
    console.log(req.body);
    const secretKey = process.env.SECRET_KEY
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                error: 'Please provide necessary credentials',
            });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                error: 'Invalid email',
            });
        }

        // Compare the provided password with the hashed password in the user object
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({
                error: 'Invalid password',
            });
        }

         //check whether user is verified
         if(user.verified === false){
            return res.status(400).json({
                error: 'User not verified'
            })
        }

        // Generate a token
        const token = jwt.sign({ userId: user._id }, secretKey);

        res.status(200).json({ token });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({
            error: 'An error occurred while processing your request',
        });
    }
};

const ForgotPassword = async ( req, res ) => {
    const { email } = req.body
    try{
        const user = await User.findOne({ email })
        if (!email) {
            res.status(400).json({
                error: 'Please this field is required'
            })
        }

        if (!user){
            return res.status(400).json({
                error: 'Email not found'
            })
        }

        if(user.verified === false){
            res.status(400).json({
                error: 'User is not veried'
            })
        }

        const verificationCodeData = generateOTP();
        console.log(verificationCodeData)
        
        user.verificationCode = verificationCodeData.otp;
        user.verificationCodeExpiration = verificationCodeData.expirationTime;
        
        res.status(200).json({ 
            message: 'A 6-digit verification code has been sent to your registered email address. Please check your inbox or spam folder for the code.'
        });
    }
    catch(error){
        res.status(500).json({error: error})
        console.log(error.message)
    }
}

const resetPassword = async (req, res) => {
    try{
        const { newPassword, confirmNewPassword, email } = req.body
        if (!newPassword || !confirmNewPassword){
            res.status(400).json({
                error: 'All fields are required'
            })
        } 
        if(newPassword.length < 6) {
            res.status(400).josn({
                error: 'Password should be more than 6 characters long'
            })
        }
        const user = await User.findOneAndReplace({ password })
        await user.save({
            email: email,
            password: bcrypt.hash(confirmNewPassword, 12)
        })
        res.status(200).json({
            message: 'Password resetted succesffuly'
        })

        console.log(await user.save())
    }
    catch(error){
        res.status(500).json({
            error: error
        })
        console.log(error.message)
    }
}
// Export user functions
module.exports = {
    registerUser,
    verifyCode,
    login,
    uploadProfilePic,
    ForgotPassword,
    resetPassword
};
