const express = require('express');
const router = express.Router();
const { requireLogin } = require('./pages');

// VIEW ALL EXERCISES
router.get('/', requireLogin, (req, res) => {
    const db = req.db;

    db.query("SELECT * FROM exercises", (err, results) => {
        if (err) return res.send("Database error");

        res.render('exercises', {
            user: req.session.user,
            exercises: results
        });
    });
});


// ADD EXERCISE FORM
router.get('/add', requireLogin, (req, res) => {
    res.render('exercises_add', { user: req.session.user, error: null });
});


// ADD EXERCISE POST
router.post('/add', requireLogin, (req, res) => {
    const name = req.sanitize(req.body.name);
    const body_part = req.sanitize(req.body.body_part);
    const difficulty = req.sanitize(req.body.difficulty);
    const instructions = req.sanitize(req.body.instructions);

    if (!name || !body_part || !difficulty || !instructions) {
        return res.render("exercises_add", { user: req.session.user, error: "All fields are required." });
    }

    const db = req.db;

    db.query(
        "INSERT INTO exercises (name, body_part, difficulty, instructions) VALUES (?, ?, ?, ?)",
        [name, body_part, difficulty, instructions],
        (err) => {
            if (err) return res.send("Database error");
            res.redirect('/exercises');
        }
    );
});

// SEARCH EXERCISES
router.get('/search', requireLogin, (req, res) => {
    const db = req.db;

    const body = req.query.body_part || "";
    const diff = req.query.difficulty || "";
    const key = req.query.keyword || "";

    let sql = "SELECT * FROM exercises WHERE 1=1";
    let params = [];

    if (body) {
        sql += " AND body_part = ?";
        params.push(body);
    }

    if (diff) {
        sql += " AND difficulty = ?";
        params.push(diff);
    }

    if (key) {
        sql += " AND (name LIKE ? OR instructions LIKE ?)";
        params.push("%" + key + "%", "%" + key + "%");
    }

    db.query(sql, params, (err, results) => {
        if (err) return res.send("Database error");

        res.render("exercises_search", {
            user: req.session.user,
            exercises: results,
            body_part: body,
            difficulty: diff,
            keyword: key
        });
    });
});

module.exports = router;
