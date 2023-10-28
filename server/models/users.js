const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    proFilePic: [
        {
          image: {
            type: Buffer,  // Store image data as a Buffer
            required: true
          },
          contentType: {
            type: String,  // Store content type, e.g., 'image/jpeg', 'image/png'
            required: true
          }
        }
    ],
    
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },

    verificationCode: Number,
    addresses: [
        {
            name: String,
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
       
})

const User = mongoose.model('User', userSchema)
module.exports = User