const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieSession = require("cookie-session");
const compression = require("compression");
const helmet = require("helmet");
require("dotenv").config(); // Load environment variables
require("./passport"); // Passport configuration

const app = express();
const PORT = process.env.PORT || 5000;

// Security and Performance Middlewares
app.use(helmet());
app.use(compression());

// Static File Serving
app.use(express.static(path.join(__dirname, "public")));

// Body Parser Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session Management
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [process.env.COOKIE_KEY], // Store the cookie key in your .env file
  })
);

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// Import and use routes
const urlRoutes = require("./routes/urlRoutes");
app.use("/url", urlRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, server };
