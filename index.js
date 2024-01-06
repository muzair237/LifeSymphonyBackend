require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./src/config/db');
const routes = require('./src/routes');
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
  }),
);
app.use('/assets', express.static('assets'));

app.use(helmet());
app.use(morgan(':date[iso] - :req[X-Real-IP] - :method - :url - :status - :response-time ms'));

app.use('/lifeSymphony', routes);

app.listen(port, () => {
  console.log(`App Listening on Port ${port}`);
});
