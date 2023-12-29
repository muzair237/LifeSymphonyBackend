const express = require("express");
const { addQuote, getQuote } = require("../controllers/QuoteController");
const router = express.Router();


router.post('/quote', addQuote);
router.get('/quote', getQuote);

module.exports = router;