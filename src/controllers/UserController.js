const express = require("express");
const bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const key = 'blog';
const { body, validationResult } = require('express-validator');
const router = express.Router();
const userModel = require("../models/Users");
router.use(express.json());

const SignUp = [
    body("firstname").isLength({ min: 1 }).withMessage("First Name is required."),
    body("lastname").isLength({ min: 1 }).withMessage("Last Name is required."),
    body("email").isEmail().withMessage("Invalid email address."),
    body("password")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long.")
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/)
        .withMessage("Password must contain at least one capital letter and one special character."),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        try {
            const { email } = req.body;
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ errors: "A user with this email address already exists" });
            }
            const { firstname, lastname, password } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new userModel({
                firstname,
                lastname,
                email,
                password: hashedPassword

            });
            const savedUser = await newUser.save();
            const userObject = savedUser.toObject();
            delete userObject.password;
            Jwt.sign({ user: userObject }, key, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    res.send({ result: "Something Went Wrong!" });
                } else {
                    res.send({ user: userObject, auth: token });
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }
];

const Login = [
    body("email").isEmail().withMessage("Invalid Email Format."),
    body("password").not().isEmpty().withMessage("Password is Required"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map(error => error.msg) });
        }
        try {
            const { email, password } = req.body;
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors: "User with this Email Doesn't Exist." });
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (!isPasswordMatch) {
                return res.status(200).json({ errors: "Invalid password." });
            } else {
                const userObject = user.toObject();
                delete userObject.password;
                Jwt.sign({ user: userObject }, key, { expiresIn: "2h" }, (err, token) => {
                    if (err) {
                        res.send({ result: "Something Went Wrong!" });
                    } else {
                        res.send({ user: userObject, auth: token,status: true });
                    }
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ errors: "Server error." });
        }
    }
];
module.exports = {
    Login,
    SignUp,
};
