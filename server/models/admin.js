const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        unique: true,
        required: true,
    },

    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        }
    ]
})

const Admin = mongoose.model('Admin', AdminSchema)
module.exports = Admin