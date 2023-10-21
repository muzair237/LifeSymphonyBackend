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
