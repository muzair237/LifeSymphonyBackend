const express = require("express");
const { addBlog, getAllBlogs } = require("../controllers/BlogController");
const router = express.Router();


router.post('/blog', addBlog);
router.get('/blog', getAllBlogs);

module.exports = router;