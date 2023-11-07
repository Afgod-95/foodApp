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
})

const Admin = mongoose.model('Admin', AdminSchema)
module.exports = Admin