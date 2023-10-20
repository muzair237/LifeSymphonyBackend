const express = require("express");
const { SignUp, Login } = require("../controllers/UserController");
const router = express.Router();

router.post('/signUp', SignUp);
router.post('/login', Login);

module.exports = router;