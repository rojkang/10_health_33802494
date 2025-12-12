require('dotenv').config();

const express = require('express');
const session = require('express-session');
const sanitizer = require('express-sanitizer');
const mysql = require('mysql2');
const path = require('path');
const ejs = require('ejs');
const bcrypt = require('bcrypt');
const app = express();
const port = 8000;

// DATABASE CONNECTION
const db = mysql.createConnection({
    host: process.env.HEALTH_HOST,
    user: process.env.HEALTH_USER,
    password: process.env.HEALTH_PASSWORD,
    database: process.env.HEALTH_DATABASE,
    port: process.env.HEALTH_PORT
});

db.connect((err) => {
    if (err) {
        console.log("Database connection error:", err);
    } else {
        console.log("Connected to MySQL database.");
    }
});

app.use((req, res, next) => {
    req.db = db;
    next();
});
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(sanitizer());

app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 20 }
}));
app.use(express.static(path.join(__dirname, 'public')));
// ROUTES
const exerciseRoutes = require('./routes/exercises');
const logRoutes = require('./routes/logs');
const pagesRoutes = require('./routes/pages');


app.use('/', pagesRoutes.router);
app.use('/exercises', exerciseRoutes);
app.use('/logs', logRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
