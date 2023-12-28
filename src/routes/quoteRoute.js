const express = require("express");
const { QuoteModel } = require("../controllers/QuoteController");
const router = express.Router();


router.get('/getquote', QuoteModel);

module.exports = router;