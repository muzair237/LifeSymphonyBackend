const express = require("express");
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const Jwt = require('jsonwebtoken');
const key = 'blog';
const { body, validationResult } = require('express-validator');
const router = express.Router();
const userModel = require("../models/Users");
router.use(express.json());

const SignUp = [
    body("firstname").isLength({ min: 3 }).withMessage("First Name is required."),
    body("lastname").isLength({ min: 3 }).withMessage("Last Name is required."),
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

//UPDATE PROFILE
const UpdateProfile = [
    body("firstname").optional().isLength({ min: 3 }).withMessage("First Name is required."),
    body("lastname").optional().isLength({ min: 3 }).withMessage("Last Name is required."),
    body("DOB").optional().isString(),
    body("gender").optional().isString(),
    body("bloodGroup").optional().isString(),
    body("weight").optional().isString(),
    body("height").optional().isString(),
    body("age").optional().isString(),
    body("country").optional().isString(),
    body("city").optional().isString(),

    async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await userModel.findById(userId);

            if (!user) {
                return res.status(200).json({ message: "User with this Email Doesn't Exist.", status: false });
            }
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.email = req.body.email;
            user.DOBdays = req.body.DOBdays;
            user.DOBmonths = req.body.DOBmonths;
            user.DOByears = req.body.DOByears;
            user.gender = req.body.gender;
            user.bloodGroup = req.body.bloodGroup;
            user.weight = req.body.weight;
            user.height = req.body.height;
            user.age = req.body.age;
            user.country = req.body.country;
            user.city = req.body.city;

            await user.save();
            console.log(user);
            res.send({ data: user, status: true, message: "Profile Updated Successfully!." });
        } catch (err) {
            res.send({ status: false, message: err.message });
        }
    }];

const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

//SEND OTP
const sendOTP = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.send({ status: false, message: "User not found...!" });
        }

        // Generate OTP and set its expiration time (e.g., 15 minutes from now)
        const otp = generateOTP();
        const otpExpiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Update user document with the OTP and expiration time
        user.otp = otp;
        user.otpExpiration = otpExpiration;
        await user.save();
        const transporter = nodemailer.createTransport({
            service: "Gmail", // e.g., Gmail, Outlook, etc.
            auth: {
                user: "uzair.ejaz2001@gmail.com",
                pass: "vpyf rmsv yrsy ldhd",
            },
        });
        const mailOptions = {
            from: "uzair.ejaz2001@gmail.com",
            to: email,
            subject: "OTP",
            text: `Dear ${user.firstname + " " + user.lastname},\n\nYour OTP for the Account is: ${otp}`,
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.send({ status: false, message: "Failed to send OTP email." });
            }
            console.log("OTP email sent: " + info.response);
            res.send({ status: true, message: "OTP sent successfully." });
        });
    } catch (err) {
        res.send({ message: err.message, status: false });
        next(err);
    }
};


const confirmOTP = async (req, res, next) => {
    const { email, otp } = req.body;

    try {
        // Find the user by email
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.send({ status: false, message: "User not found...!" });
        }

        // Check if the OTP matches the one stored in the user's document
        if (user.otp !== otp || user.otpExpiration < Date.now()) {
            console.log("Invalid OTP or OTP has expired");
            return res.send({ status: false, message: "Invalid OTP or OTP has expired...!" });
        }
        res.send({ status: true, message: "OTP has Confirmed." });
    } catch (err) {
        console.error("Error in confirmOTP:", err);
        res.send({ message: err.message, status: false });
        next(err);
    }
};

//UPDATE PASSWORD
const updatePassword = async (req, res, next) => {
    const { email, newPassword } = req.body;

    try {
        // Find the user by email
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.send({ status: false, message: "User not found...!" });
        }

        // Update the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        user.otp = null; // Clear the OTP after successful password update
        await user.save();

        // Generate a new JWT token with the updated user information if needed

        res.send({ status: true, message: "Password updated successfully." });
    } catch (err) {
        console.error("Error in updatePassword:", err);
        res.send({ message: err.message, status: false });
        next(err);
    }
};

module.exports = {
    Login,
    SignUp,
    UpdateProfile,
    sendOTP,
    confirmOTP,
    updatePassword
};
