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
        type: Number,
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
    country: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    DOB: {
        type: Date,
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
        type: Number,
        required: false
    },
    height: {
        type: Number,
        required: false
    }
}, { timestamps: true });

module.exports = new mongoose.model('Users', userSchema);
