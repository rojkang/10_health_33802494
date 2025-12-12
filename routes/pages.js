const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


// LOGIN CHECK MIDDLEWARE
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect(`${BASE_PATH}/login`);
    }
    next();
}

// HOME PAGE
router.get('/', (req, res) => {
    res.render('home', { user: req.session.user });
});

// ABOUT PAGE
router.get('/about', (req, res) => {
    res.render('about', { user: req.session.user });
});

// LOGIN FORM
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// LOGIN POST
router.post('/login', (req, res) => {
    const username = req.body.username.trim();
    const password = req.body.password;
    const db = req.db;

    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
        if (err) return res.send("Database error");

        if (results.length === 0) {
            return res.render("login", { error: "Invalid username or password" });
        }

        const user = results[0];

        bcrypt.compare(password, user.password_hash, (err, match) => {
            if (match) {
                req.session.user = { id: user.id, username: user.username };
                return res.redirect('/');
            } else {
                return res.render("login", { error: "Invalid username or password" });
            }
        });
    });
});

// LOGOUT
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// REGISTER (GET)
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// REGISTER (POST)
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render('register', { error: "All fields required" });
    }

    const db = req.db; 

    const checkSql = "SELECT * FROM users WHERE username = ?";
    db.query(checkSql, [username], (err, results) => {
        if (err) {
            console.log(err);
            return res.render('register', { error: "Database error" });
        }

        if (results.length > 0) {
            return res.render('register', { error: "Username already taken" });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.log(err);
                return res.render('register', { error: "Error hashing password" });
            }

            const insertSql = "INSERT INTO users (username, password_hash) VALUES (?, ?)";
            db.query(insertSql, [username, hash], (err) => {
                if (err) {
                    console.log(err);
                    return res.render('register', { error: "Error saving user" });
                }

                res.redirect('/login');
            });
        });
    });
});

module.exports = {
    router,
    requireLogin
};
