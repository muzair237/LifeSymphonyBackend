const express = require("express");
const { SignUp, Login, UpdateProfile, sendOTP, confirmOTP, updatePassword } = require("../controllers/UserController");
const router = express.Router();

router.post('/signUp', SignUp);
router.post('/login', Login);
router.put('/updateProfile/:userId', UpdateProfile);
router.post('/sendOtp', sendOTP);
router.post('/confirmOtp', confirmOTP);
router.post('/updatePassword', updatePassword);

module.exports = router;