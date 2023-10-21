const express = require("express");
const { SignUp, Login, UpdateProfile } = require("../controllers/UserController");
const router = express.Router();

router.post('/signUp', SignUp);
router.post('/login', Login);
router.post('/updateProfile/:userId', UpdateProfile);

module.exports = router;