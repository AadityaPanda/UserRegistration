const express = require('express');
const crypto = require('crypto');
const db = require('../config/db');
const { sendVerificationEmail } = require('../services/emailService');
require('dotenv').config();

const router = express.Router();

router.get('/', (req, res) => {
  res.render('signup');
});

router.post('/', (req, res) => {
  const { firstname, middlename, lastname, username, password, verify_password, mobile_no, email } = req.body;

  // Check if passwords match
  if (password !== verify_password) {
    req.session.message = { type: 'error', text: "Passwords don't match." };
    return res.redirect('/signup');
  }

  // Validate mobile number
  if (mobile_no.length !== 10) {
    req.session.message = { type: 'error', text: 'Mobile number must be 10 digits.' };
    return res.redirect('/signup');
  }

  // Check if the username already exists
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      req.session.message = { type: 'error', text: 'Database error.' };
      return res.redirect('/signup');
    }

    if (results.length > 0) {
      req.session.message = { type: 'error', text: 'Username already exists.' };
      return res.redirect('/signup');
    }

    // Hash the password before storing it
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Insert the user into the database
    db.query(
      'INSERT INTO users (firstname, middlename, lastname, username, password, mobile_no, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [firstname, middlename, lastname, username, hashedPassword, mobile_no, email],
      (err, result) => {
        if (err) {
          req.session.message = { type: 'error', text: 'Error occurred during registration.' };
          return res.redirect('/signup');
        }

        // Generate a verification token
        const token = crypto.randomBytes(20).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000);  // Token expires in 1 hour

        // Insert the verification token into the database
        db.query(
          'INSERT INTO email_verifications (user_id, token, expires_at) VALUES (?, ?, ?)',
          [result.insertId, token, expiresAt],
          (err) => {
            if (err) {
              req.session.message = { type: 'error', text: 'Error saving verification token.' };
              return res.redirect('/signup');
            }

            // Send verification email
            sendVerificationEmail(email, token, firstname);

            req.session.message = { type: 'success', text: 'Registration successful! Please check your email for verification.' };
            res.redirect('/login');
          }
        );
      }
    );
  });
});

// Verification route
router.get('/verify-email', (req, res) => {
  const { token } = req.query;

  db.query('SELECT * FROM email_verifications WHERE token = ?', [token], (err, results) => {
    if (err || results.length === 0) {
      console.error('Token lookup error:', err || 'No results');
      req.session.message = { type: 'error', text: 'Invalid or expired token.' };
      return res.redirect('/login');
    }

    const verification = results[0];
    const currentTime = new Date();

    if (currentTime > verification.expires_at) {
      req.session.message = { type: 'error', text: 'Verification link has expired.' };
      return res.redirect('/login');
    }

    db.query('UPDATE users SET verified = 1 WHERE id = ?', [verification.user_id], (err) => {
      if (err) {
        console.error('Error updating user verification:', err);
        req.session.message = { type: 'error', text: 'Error verifying user.' };
        return res.redirect('/login');
      }

      db.query('DELETE FROM email_verifications WHERE token = ?', [token], (deleteErr) => {
        if (deleteErr) console.error('Error deleting token:', deleteErr);

        req.session.message = { type: 'success', text: 'Email verified successfully!' };
        res.redirect('/login');
      });
    });
  });
});

module.exports = router;