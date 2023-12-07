const User = require('../models/users.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const emailFormat = new RegExp(/^[a-zA-Z0-9_.+]*[a-zA-Z][a-zAZ0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/);

const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({storage: storage })
const secretKey = process.env.SECRET_KEY

const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = new Date().getTime() + 1800000;
    console.log("Generated OTP:", otp);
    console.log("Expiration Time:", expirationTime);
    return { otp, expirationTime };
};


const generateResetOTP = () => {
    const otp = Math.floor(Math.random() * 900000) + 100000;
    const expirationTime = new Date().getTime() + 1800000; // 30 minutes in milliseconds
    return { otp, expirationTime };
  };
  


//otp token generation
const generateUniqueToken = (userId) => {
    const token = jwt.sign({ userId }, secretKey);
    return token
}
// Function to send an email with OTP
const sendVerificationEmail = async (email, otp) => {
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
                user: 'afgod98@gmail.com',
                pass: process.env.EMAIL_PASS,
            },
        });
        const verificationToken = generateUniqueToken();
        const verificationLink = `https://restaurantapi-bsc7.onrender.com/verify?token=${verificationToken}`;

        const mailOptions = {
            from: 'ShopNeest.com',
            to: email,
            subject: 'Account Verification',
            html: `
                <p>Hello,</p>
                <p>Your verification code is: <strong style="font-size: 20px;">${otp}</strong></p>
                <p>Verification link: <a href="${verificationLink}">${verificationLink}</a></p>
                <p>OTP expires in 30 minutes</p>
                <p>If you did not make this request, please ignore this email, and your password will remain unchanged.</p>
            `,
        };
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });
    }
    catch (error){
        console.log(error.message)
    }
   
};



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

// Verify Code
const verifyCode = async (req, res) => {
    try {
        const { enteredCode, email } = req.body;
        console.log(enteredCode, email)

        if (!enteredCode || !email) {
            return res.status(400).json({
                error: 'Invalid OTP or email.',
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }

        // Check if the entered OTP matches the stored OTP in the user object
        if (user.verificationCode === enteredCode && user.verificationCodeExpiration.getTime() > new Date().getTime()) {
            user.verified = true;
            user.verificationCode = null;
            user.verificationCodeExpiration = null;

            // Save changes to the user
            await user.save();

            // Generate a token
            const token = generateUniqueToken(user._id);

            // Return the token in the response
            return res.status(200).json({
                message: 'OTP verification successful.',
                token,
            });
        } 
        else {
            return res.status(400).json({
                error: 'Invalid OTP or email.',
            });
        }
    } 
    catch (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({
            error: 'An error occurred while processing your request.',
        });
    }
};


// Login
const login = async (req, res) => {
    console.log(req.body);
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

        //checking whether user exist 
        if(!user){
            return res.status(400).json({
                message: 'Email not found'
            })
        }
        // Generate a token
        const token = generateUniqueToken(user._id)

        res.status(200).json({ token });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({
            error: 'An error occurred while processing your request',
        });
    }
};

const getUserID = async (req, res) => {
    try {
      const { id } = req.params; // Use req.params to get the user ID from the URL
      const userId = await User.findById(id); // Use findById directly with the provided user ID
      if (!userId) {
        return res.status(404).json({
          message: 'User not found',
        });
      }
      return res.status(200).json({
        message: 'User ID retrieved successfully',
        userId,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        message: 'Internal Server Error',
      });
    }
  };
  

//reset password email 
const sendResetPasswordEmail = async (email, otp) => {
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
                user: 'afgod98@gmail.com',
                pass: process.env.EMAIL_PASS,
            },
        })
        const verificationToken = generateUniqueToken();
        const verificationLink = `https://restaurantapi-bsc7.onrender.com/verify?token=${verificationToken}`;

        const mailOptions = {
            from: 'ShopNeest.com',
            to: email,
            subject: 'Account Verification',
            html: `
                <p>Hello,</p>
                <p>Your reset password verification code is: <strong style="font-size: 20px;">${otp}</strong></p>
                <p>Verification link: <a href="${verificationLink}">${verificationLink}</a></p>
                <p>OTP expires in 30 minutes</p>
                <p>If you did not make this request, please ignore this email, and your password will remain unchanged.</p>
            `,
        };
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });
    }
    catch(error) {
        console.log(error)
    }
}


const ForgotPassword = async ( req, res ) => {
    const { email } = req.body
    try{
        
        if (!email) {
            res.status(400).json({
                error: 'Please this field is required'
            })
        }

        const user = await User.findOne({ email })

        if (!user){
            return res.status(400).json({
                error: 'Email not found'
            })
        }
        const verificationCodeData = generateResetOTP();
        console.log(verificationCodeData)
        user.verificationCode = verificationCodeData.otp;
        user.verificationCodeExpiration = verificationCodeData.expirationTime;
        
        res.status(200).json({ 
            message: 'A 6-digit verification code has been sent to your registered email address. Please check your inbox or spam folder for the code.'
        });
        const emailInfo = await sendResetPasswordEmail(email, verificationCodeData.otp);
        
        if(emailInfo){
            res.status(200).json({
                message: 'Email sent', 
                emailInfo,
            });
        }
        
        else {
            res.status(400).json({
                error: 'An error occured'
            })
        }
    }
    catch(error){
        res.status(500).json({error: error})
        console.log(error.message)
    }
}

const verifyResetOTP = async (req, res) => {
    try {
      const { enteredCode, email } = req.body;
  
      if (!enteredCode || !email) {
        return res.status(400).json({
          error: 'Invalid OTP or email.',
        });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
        });
      }
  
      // Check if the entered OTP matches the stored OTP in the user object
      if (user.verificationCode === enteredCode && user.verificationCodeExpiration.getTime() > new Date().getTime()) {
        // Verification successful
        user.verified = true;
        user.verificationCode = null;
        user.verificationCodeExpiration = null;
  
        await user.save();
  
        res.status(200).json({
          message: 'OTP verification successful.',
        });
      } else {
        // Invalid OTP
        res.status(400).json({
          error: 'Invalid OTP or email.',
        });
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).json({
        error: 'An error occurred while processing your request.',
      });
    }
  };

// Export user functions
module.exports = {
    registerUser,
    verifyCode,
    login,
    getUserID,
    uploadProfilePic,
    ForgotPassword,
    sendResetPasswordEmail,
    verifyResetOTP
};
