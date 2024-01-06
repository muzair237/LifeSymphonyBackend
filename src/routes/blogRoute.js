const express = require('express');
const { addBlog, getAllBlogs } = require('../controllers/BlogController');
const tryCatch = require('../middlewares/trycatch');
const router = express.Router();

router.get('/', tryCatch(getAllBlogs));
router.post('/', tryCatch(addBlogs));

module.exports = router;
