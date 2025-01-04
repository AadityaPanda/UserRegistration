const express = require('express');
const crypto = require('crypto');
const db = require('../config/db');
require('dotenv').config();

const router = express.Router();

// Render login page
router.get('/', (req, res) => {
    res.render('login'); 
});

// Handle login form submission
router.post('/', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            req.session.message = { type: 'error', text: 'Database error.' };
            return res.redirect('/login');
        }

        if (results.length > 0) {
            const user = results[0];

            // Check if user is active
            if (!user.active) {
                req.session.message = { type: 'error', text: 'Your account is deactivated. Please contact the administrator.' };
                return res.redirect('/login');
            }

            // Check if user is verified
            if (!user.verified) {
                req.session.message = { type: 'error', text: 'Please verify your email before logging in.' };
                return res.redirect('/login');
            }

            // Verify the password
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            if (hashedPassword === user.password) {
                req.session.user = user;
                req.session.message = { type: 'success', text: 'Login successful!' };
                return res.redirect(user.isAdmin ? '/admin' : '/dashboard');
            }
        }

        // If no user found or password incorrect
        req.session.message = { type: 'error', text: 'Invalid username/password.' };
        res.redirect('/login');
    });
});

module.exports = router;