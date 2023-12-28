const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    quote: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = new mongoose.model('Quote', quoteSchema);
