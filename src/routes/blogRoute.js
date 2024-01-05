const express = require('express');
const { addBlog, getAllBlogs } = require('../controllers/BlogController');
const tryCatch = require('../middlewares/trycatch');
const router = express.Router();

router.post('/blog', tryCatch(addBlog));
router.get('/blog', tryCatch(getAllBlogs));

module.exports = router;
