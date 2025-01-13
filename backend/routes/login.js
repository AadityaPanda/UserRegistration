const express = require('express');
const crypto = require('crypto');
const db = require('../config/db');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query the database for the user
        const results = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });

        if (results.length > 0) {
            const user = results[0];

            // Check if user is active
            if (!user.active) {
                req.session.message = { type: 'warning', text: 'Your account is deactivated. Please contact the administrator.' };
                return res.status(403).json({ success: false, error: 'Your account is deactivated. Please contact the administrator.' });
            }

            // Check if user is verified
            if (!user.verified) {
                req.session.message = { type: 'warning', text: 'Please verify your email before logging in.' };
                return res.status(403).json({ success: false, error: 'Please verify your email before logging in.' });
            }

            // Verify the password
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            if (user.password === hashedPassword) {
                
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    firstname: user.firstname,  
                    middlename: user.middlename, 
                    lastname: user.lastname,     
                    email: user.email,           
                    mobile_no: user.mobile_no,   
                    isAdmin: user.isAdmin,       
                };
            
                req.session.message = { type: 'success', text: 'Login successful!' };
                
                return res.json({
                    success: true,
                    user: {
                        id: user.id,
                        username: user.username,
                        firstname: user.firstname, 
                        middlename: user.middlename, 
                        lastname: user.lastname,     
                        email: user.email,           
                        mobile_no: user.mobile_no,   
                        isAdmin: user.isAdmin,       
                    }
                });
            } else {
                req.session.message = { type: 'error', text: 'Invalid username or password.' };
                return res.status(401).json({ success: false, error: 'Invalid username or password.' });
            }
        } else {
            req.session.message = { type: 'error', text: 'Invalid username or password.' };
            return res.status(401).json({ success: false, error: 'Invalid username or password.' });
        }
    } catch (err) {
        console.error('Database error:', err);
        req.session.message = { type: 'error', text: 'Database error.' };
        return res.status(500).json({ success: false, error: 'Database error.' });
    }
});

module.exports = router;