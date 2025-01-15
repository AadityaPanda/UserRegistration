const express = require('express');
const crypto = require('crypto');
const db = require('../config/db');
const { sendVerificationEmail } = require('../services/emailService');
require('dotenv').config();

const router = express.Router();

router.post('/', (req, res) => {
    const { firstname, middlename, lastname, username, password, verify_password, mobile_no, email } = req.body;

    // Check if passwords match
    if (password !== verify_password) {
        return res.status(400).json({ message: "Passwords don't match." });
    }

    // Validate mobile number
    if (mobile_no.length !== 10) {
        return res.status(400).json({ message: 'Mobile number must be 10 digits.' });
    }

    // Check if the username already exists
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        // Hash the password before storing it
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Insert the user into the database with active status set to true
        db.query(
            'INSERT INTO users (firstname, middlename, lastname, username, password, mobile_no, email, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [firstname, middlename, lastname, username, hashedPassword, mobile_no, email, true],
            (err, result) => {
                if (err) {
                    console.error('Database query error:', err);  // Log the error to the console
                    return res.status(500).json({ message: 'Error occurred during registration.' });
                }

                // Generate a verification token
                const token = crypto.randomBytes(20).toString('hex');
                const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

                // Insert the verification token into the database
                db.query(
                    'UPDATE users SET token = ?, expires_at = ? WHERE id = ?',
                    [token, expiresAt, result.insertId], // `result.insertId` refers to the user ID
                    (err) => {
                        if (err) {
                            return res.status(500).json({ message: 'Error saving verification token.' });
                        }
                
                        // Send verification email
                        sendVerificationEmail(email, token, firstname);
                
                        return res.status(200).json({
                            message: 'Registration successful! Please check your email for verification.',
                        });
                    }
                );
            }
        );
    });
});

// Verification route
router.get('/verify-email', (req, res) => {
    const { token } = req.query;

    db.query('SELECT * FROM users WHERE token = ?', [token], (err, results) => {
        if (err || results.length === 0) {
            console.error('Token lookup error:', err || 'No results');
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        const user = results[0];
        const currentTime = new Date();

        if (currentTime > user.expires_at) {
            return res.status(400).json({ message: 'Verification link has expired.' });
        }

        db.query('UPDATE users SET verified = 1 WHERE id = ?', [user.id], (err) => {
            if (err) {
                console.error('Error updating user verification:', err);
                return res.status(500).json({ message: 'Error verifying user.' });
            }

            db.query('UPDATE users SET token = NULL, expires_at = NULL WHERE id = ?', [user.id], (deleteErr) => {
                if (deleteErr) console.error('Error clearing token:', deleteErr);

                return res.status(200).json({ message: 'Email verified successfully!' });
            });
        });
    });
});

module.exports = router;