const express = require('express');
const { addQuote, getQuote } = require('../controllers/QuoteController');
const router = express.Router();

router.get('/', getQuote);
router.post('/', addQuote);

module.exports = router;
