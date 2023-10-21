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
            return res.status(200).json({ message: "Invalid Credentials!", status: false });
        }
        try {
            const { email } = req.body;
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(200).json({ errors: "A user with this Email Address Already Exists", status: false });
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
                    res.send({ result: "Something Went Wrong!", status: false });
                } else {
                    res.send({ user: userObject, auth: token, status: true });
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error.", status: false });
        }
    }];

const Login = [
    body("email").isEmail().withMessage("Invalid Email Format."),
    body("password").not().isEmpty().withMessage("Password is Required"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({ message: "Invalid Email or Password!", status: false });
        }
        try {
            const { email, password } = req.body;
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(200).json({ message: "User with this Email Doesn't Exist.", status: false });
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (!isPasswordMatch) {
                return res.status(200).json({ message: "Invalid password.", status: false });
            } else {
                const userObject = user.toObject();
                delete userObject.password;
                Jwt.sign({ user: userObject }, key, { expiresIn: "2h" }, (err, token) => {
                    if (err) {
                        res.send({ message: "Something Went Wrong!", status: false });
                    } else {
                        res.send({ user: userObject, auth: token, status: true });
                    }
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error." });
        }
    }];

const UpdateProfile = [
    body("DOB").optional().isISO8601().toDate(),
    body("gender").optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    body("bloodGroup").optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood group'),
    body("weight").optional().isNumeric().withMessage('Weight should be a number'),
    body("height").optional().isNumeric().withMessage('Height should be a number'),
    async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await userModel.findById(userId, { new: true });

            if (!user) {
                return res.status(200).json({ message: "User with this Email Doesn't Exist.", status: false });
            }
            user.DOB = req.body.DOB;
            user.gender = req.body.gender;
            user.bloodGroup = req.body.bloodGroup;
            user.weight = req.body.weight;
            user.height = req.body.height;

            await user.save();

            res.send({ data: user, status: true });
        } catch (err) {
            res.send({ status: false, error: err.message });
        }
    }];

module.exports = {
    Login,
    SignUp,
    UpdateProfile
};
