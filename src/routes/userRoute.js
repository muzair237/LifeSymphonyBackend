const express = require("express");
const multer = require("multer");
const { SignUp, Login, UpdateProfile, sendOTP, confirmOTP, updatePassword, profilePicture } = require("../controllers/UserController");
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/profilePictures/')
    },
    filename: function (req, file, cb) {
        const uniqueFilename = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueFilename);
    }
});

const upload = multer({ storage: storage });

router.post('/signUp', SignUp);
router.post('/login', Login);
router.put('/updateProfile/:userId', UpdateProfile);
router.post('/sendOtp', sendOTP);
router.post('/confirmOtp', confirmOTP);
router.post('/updatePassword', updatePassword);
router.post('/profilePicture', upload.single('profilePicture'), profilePicture)

module.exports = router;