const User = require('../models/users.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const emailFormat = new RegExp(/^[a-zA-Z0-9_.+]*[a-zA-Z][a-zAZ0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/);

const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({storage: storage })
const secretKey = process.env.SECRET_KEY


const generateOTPData = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = new Date().getTime() + 1800000;
    console.log("Generated OTP:", otp);
    console.log("Expiration Time:", expirationTime);
    return { otp, expirationTime };
};

const generateResetOTPData = () => {
    const otp = Math.floor(Math.random() * 900000) + 100000;
    const expirationTime = new Date().getTime() + 1800000;
    return { otp, expirationTime };
};

// Usage:


  


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

        const verificationCodeData = generateOTPData();
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
                error: 'All fields are required.',
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
            console.log('Stored OTP Expiration:', user.verificationCodeExpiration);
            console.log('Current Time:', new Date());

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
        
        res.status(200).json({message: 'Login successful', token });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({
            error: 'An error occurred while processing your request',
        });
    }
};


const getUsers = async (req, res) => {
    try {
        // Checking if the Authorization header is present
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: {
                    message: 'Authorization token is missing or invalid.',
                },
            });
        }

        // Extracting the token from the Authorization header
        const token = authHeader.replace('Bearer ', '');

        // Verifying the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                error: {
                    message: 'User not found.',
                },
            });
        }

        // Returning the user details
        res.status(200).json({
            userId: user,
        });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: {
                    message: 'Invalid token.',
                },
            });
        }
        res.status(500).json({
            error: {
                message: 'Internal Server Error.',
            },
        });
    }
};



const getUserID = async (req, res) => {
    try {
      const { id } = req.params; // Use req.params to get the user ID from the URL
      const userId = await User.findById({_id: id}); // Use findById directly with the provided user ID
      console.log(userId)
      if (!userId) {
        return res.status(404).json({
          message: 'User not found', userId
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

        const resetCodeData = generateResetOTPData();
        const otp = resetCodeData.otp
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

        const user = await User.findOne({ email: email })

        if (!user){
            return res.status(400).json({
                error: 'Email not found'
            })
        }
        const verificationCodeData = generateResetOTPData();
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
                error: 'This field is required.',
            });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }

        
        if (user.verificationCode === enteredCode) {
            const currentTime = new Date().getTime();
            console.log('Entered Code:', enteredCode);
            console.log('Stored Code:', user.verificationCode);
            console.log('Expiration Time:', user.verificationCodeExpiration);

            
            if (user.verificationCodeExpiration && currentTime < user.verificationCodeExpiration.getTime()) {
                // Verification successful
                user.verificationCodeExpiration = null; // Reset expiration to prevent reuse
                await user.save();

                return res.status(200).json({
                    message: 'OTP verification successful.',
                });
            } else {
                // Verification code expired
                return res.status(400).json({
                    error: 'Verification code has expired.',
                });
            }
        } else {
            // Invalid OTP
            return res.status(400).json({
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


  //reset password 
  const resetPassword = async (req, res) => {
    try{
        const { email, newPassword, confirmNewPassword } = req.body
        if ( !email || !newPassword || ! confirmNewPassword ){
            res.status(400).json({
                error: 'All fields are required'
            })
        }

        if (newPassword.length < 8 ){
            res.status(400).json({
                error: 'Password should be more than 8 characters long'
            })
        }

        if (newPassword !== confirmNewPassword){
            res.status(400).json({
                error: 'Password mismatch'
            })
        }

        const hashedPassword = await bcrypt.hash(confirmNewPassword, 12);

        const user = await User.findOneAndUpdate(
            { email: email },
            { $set: { password: hashedPassword } },
            { new: true, useFindAndModify: false }
        );
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }
        return res.status(200).json({
            message: 'Password updated and saved successfully',
        })
    }
    catch (error){
        res.status(500).json({
            error: error.message,
            errorMessage: 'An an error occured whilst processing your request'
        })
    }
  }

// Export user functions
module.exports = {
    registerUser,
    verifyCode,
    login,
    getUsers,
    getUserID,
    uploadProfilePic,
    ForgotPassword,
    sendResetPasswordEmail,
    verifyResetOTP,
    resetPassword
};
