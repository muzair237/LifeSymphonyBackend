const express = require('express');
const router = express.Router();

const userRoutes = require('../routes/userRoute');
const quoteRoutes = require('../routes/quoteRoute');
const blogRoutes = require('../routes/blogRoute');

router.use('/user', userRoutes);
router.use('/quote', quoteRoutes);
router.use('/blog', blogRoutes);

module.exports = router;
