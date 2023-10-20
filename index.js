require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./src/config/db");
const router = require("./src/routes/userRoute");
const port = process.env.PORT || 3000;
const session = require('express-session');

app.use(cors());
connectDB();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET,
    })
);

app.use("/lifeSymphony", router);

app.listen(port, () => {
    console.log(`App Listening on Port ${port}`);
});
