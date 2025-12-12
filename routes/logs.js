const express = require('express');
const router = express.Router();
const { requireLogin } = require('./pages');

// VIEW ALL LOGS (JOIN exercises + logs)
router.get('/', requireLogin, (req, res) => {
    const db = req.db;

    const sql = `
        SELECT logs.*, exercises.name AS exercise_name, exercises.body_part
        FROM logs
        JOIN exercises ON logs.exercise_id = exercises.id
        WHERE logs.user_id = ?
        ORDER BY logs.log_date DESC
    `;

    db.query(sql, [req.session.user.id], (err, results) => {
        if (err) return res.send("Database error");

        res.render('logs', {
            user: req.session.user,
            logs: results
        });
    });
});

// ADD LOG FORM
router.get('/add', requireLogin, (req, res) => {
    const db = req.db;

    // Load exercises for the dropdown
    db.query("SELECT id, name FROM exercises", (err, results) => {
        if (err) return res.send("Database error");

        res.render('logs_add', {
            user: req.session.user,
            exercises: results,
            error: null
        });
    });
});

// ADD LOG POST
router.post('/add', requireLogin, (req, res) => {
    const db = req.db;

    const exercise_id = req.sanitize(req.body.exercise_id);
    const log_date = req.sanitize(req.body.log_date);
    const pain_level = req.sanitize(req.body.pain_level);
    const notes = req.sanitize(req.body.notes);

    if (!exercise_id || !log_date || !pain_level) {
        return res.redirect('/logs/add');
    }

    const sql = `
        INSERT INTO logs (user_id, exercise_id, log_date, pain_level, notes)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql,
        [req.session.user.id, exercise_id, log_date, pain_level, notes],
        (err) => {
            if (err) return res.send("Database error");
            res.redirect('/logs');
        }
    );
});

// SEARCH LOGS
router.get('/search', requireLogin, (req, res) => {
    
    const db = req.db;
    const body_part = req.query.body_part || "";
    const minPain = req.query.minPain || "";
    const maxPain = req.query.maxPain || "";
    const start = req.query.start || "";
    const end = req.query.end || "";
    const keyword = req.query.keyword || "";

    let sql = `
        SELECT logs.*, exercises.name AS exercise_name, exercises.body_part
        FROM logs
        JOIN exercises ON logs.exercise_id = exercises.id
        WHERE logs.user_id = ?
    `;
    let params = [req.session.user.id];

    if (body_part) {
        sql += " AND exercises.body_part = ?";
        params.push(body_part);
    }

    if (minPain) {
        sql += " AND logs.pain_level >= ?";
        params.push(minPain);
    }

    if (maxPain) {
        sql += " AND logs.pain_level <= ?";
        params.push(maxPain);
    }

    if (start) {
        sql += " AND log_date >= ?";
        params.push(start);
    }

    if (end) {
        sql += " AND log_date <= ?";
        params.push(end);
    }

    if (keyword) {
        sql += " AND (logs.notes LIKE ?)";
        params.push("%" + keyword + "%");
    }

    sql += " ORDER BY logs.log_date DESC";

    db.query(sql, params, (err, results) => {
        if (err) return res.send("Database error");

        res.render('logs_search', {
            user: req.session.user,
            logs: results,
            body_part,
            minPain,
            maxPain,
            start,
            end,
            keyword
        });
    });
});

module.exports = router;
