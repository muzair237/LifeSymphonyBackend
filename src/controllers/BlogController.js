const express = require('express');
const router = express.Router();
const blogModel = require('../models/Blog');
const { getRandomNumber } = require('../utils/funcHelper');

router.use(express.json());

const addBlog = async (req, res, next) => {
  const { blogs } = req.body;

  if (!blogs) {
    const { author, description, title } = req.body;
    await blogModel.create({ author, description, title });

    res.json({ message: 'Blog Inserted Successfully!' });
  } else if (Array.isArray(blogs) && blogs.length > 0) {
    // If 'blogs' is an array, insert each blog as a separate document
    await Promise.all(
      blogs.map(async individualBlog => {
        const { author, description, title } = individualBlog;
        await blogModel.create({ author, description, title });
      }),
    );

    res.json({ message: 'Blogs Inserted Successfully!' });
  } else {
    res.status(400).json({ error: 'Invalid input for blogs' });
  }
};

const getAllBlogs = async (req, res, next) => {
  const blogs = await blogModel.find({}).sort({ createdAt: '-1' });

  res.json({ success: true, message: 'Blogs fetched successfully', blogs: blogs });
};

module.exports = {
  addBlog,
  getAllBlogs,
};
