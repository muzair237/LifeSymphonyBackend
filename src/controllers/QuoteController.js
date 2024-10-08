const express = require("express");
const router = express.Router();
const quoteModel = require("../models/Quote");
const { getRandomNumber } = require("../utils/funcHelper");

router.use(express.json());

const addQuote = async (req, res, next) => {
  try {
    const { quotes } = req.body;

    if (!quotes) {
      const { author, quote } = req.body;
      await quoteModel.create({ author, quote });

      res.json({ message: "Quote Inserted Successfully!" });
    } else if (Array.isArray(quotes) && quotes.length > 0) {
      // If 'quotes' is an array, insert each quote as a separate document
      await Promise.all(
        quotes.map(async (quotes) => {
          const { author, quote } = quotes;
          await quoteModel.create({ author, quote });
        })
      );

      res.json({ message: "Quotes Inserted Successfully!" });
    } else {
      res.status(400).json({ error: "Invalid input for quotes" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getQuote = async (req, res, next) => {
  try {
    const count = await quoteModel.countDocuments();

    const randomIndex = getRandomNumber(count);

    const randomQuote = await quoteModel.findOne().skip(randomIndex);

    res.json({ success: true, message: "Quote fetched successfully", quote: randomQuote });
  } catch (error) {
    console.error("Error fetching random quote:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addQuote,
  getQuote
};
