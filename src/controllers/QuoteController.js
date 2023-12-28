const express = require("express");
const router = express.Router();
const quoteModel = require("../models/Quote");

router.use(express.json());

const QuoteModel = async (req, res, next) => {
  try {
    // Get the count of documents in the collection
    const count = await quoteModel.countDocuments();

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * count);

    // Retrieve a random document
    const randomQuote = await quoteModel.findOne().skip(randomIndex);

    // Send the random quote as a JSON response
    res.json(randomQuote);
  } catch (error) {
    console.error("Error fetching random quote:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
    QuoteModel
};
