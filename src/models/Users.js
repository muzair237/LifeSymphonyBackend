const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: false
    },
    profilePicture: {
        type: String,
        default: "https://p.kindpng.com/picc/s/21-211456_user-icon-hd-png-download.png"
    },
    role: {
        type: String,
        default: "User"
    },
    otp: {
        type: String,
    },
    otpExpiration: {
        type: String,
    },
    country: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    DOBmonths:{
        type: String,
        required: false
    },
    DOBdays:{
        type: String,
        required: false
    },
    DOByears:{
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    bloodGroup: {
        type: String,
        required: false
    },
    weight: {
        type: String,
        required: false
    },
    height: {
        type: String,
        required: false
    },
    provider: {
        type: String,
        default: 'email',
    }
}, { timestamps: true });

module.exports = new mongoose.model('Users', userSchema);
