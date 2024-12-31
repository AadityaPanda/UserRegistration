const express = require('express');
const router = express.Router();
const db = require('../config/db');
const crypto = require('crypto');

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        return next();
    }
    res.redirect('/login');
};

// Search by ID
router.get('/searchById', isAdmin, (req, res) => {
    const searchId = req.query.id;

    if (!searchId) {
        return res.redirect('/admin');
    }

    db.query('SELECT * FROM users WHERE id = ?', [searchId], (err, users) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        if (users.length === 0) {
            req.session.message = { type: 'error', text: 'User ID not found!' };
            return res.redirect('/admin');
        }

        req.session.message = { type: 'success', text: 'User ID found!' };
        res.render('admin', { users, message: req.session.message });
    });
});

// Search by username
router.get('/searchByText', isAdmin, (req, res) => {
    const searchTerm = req.query.query;

    db.query(
        `SELECT * FROM users WHERE 
        username LIKE ? OR 
        email LIKE ? OR 
        firstname LIKE ? OR 
        middlename LIKE ? OR 
        lastname LIKE ?`,
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`],
        (err, users) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }

            let message = '';
            if (users.length === 0) {
                message = 'No matching users found!';
            } else if (users.length === 1) {
                message = '1 user found!';
            } else {
                message = `${users.length} users found!`;
            }

            req.session.message = { type: 'success', text: message };
            res.render('admin', { users, message: req.session.message });
        }
    );
});

// Route for viewing users
router.get('/', isAdmin, (req, res) => {
    db.query('SELECT * FROM users', (err, users) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.render('admin', { users, message: req.session.message }); // Render admin view with users data
        delete req.session.message; // Clear the message after it is displayed
    });
});

// Route to create a new user
router.get('/create', isAdmin, (req, res) => {
    res.render('createUser'); // Render the create user form
});

// Handle the create user form submission
router.post('/create', isAdmin, (req, res) => {
    const { username, firstname, middlename, lastname, mobile_no, email, password } = req.body;

    // Check if username or email already exists
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, existingUsers) => {
        if (err) {
            console.error(err);
            req.session.message = { type: 'error', text: 'Error checking user existence' };
            return res.redirect('/admin/create');
        }

        if (existingUsers.length > 0) {
            req.session.message = { type: 'error', text: 'Username or email already exists. Please choose a different one.' };
            return res.redirect('/admin/create');
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const middleNameValue = middlename.trim() === '' ? null : middlename;

        db.query(
            'INSERT INTO users (username, firstname, middlename, lastname, mobile_no, email, password, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [username, firstname, middleNameValue, lastname, mobile_no, email, hashedPassword, 1], 
            (err) => {
                if (err) {
                    console.error(err);
                    req.session.message = { type: 'error', text: 'Error creating user' };
                    return res.redirect('/admin');
                }
                req.session.message = { type: 'success', text: 'User created successfully!' };
                res.redirect('/admin');
            }
        );
    });
});

// Route to edit a user
router.get('/edit/:id', isAdmin, (req, res) => {
    const userId = req.params.id;

    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        if (!user.length) {
            return res.status(404).send('User not found');
        }
        res.render('editUser', { user: user[0], message: req.session.message }); 
        delete req.session.message; 
    });
});

// Handle the user edit form submission
router.post('/edit/:id', isAdmin, (req, res) => {
    const { username, email, firstname, middlename, lastname, mobile_no } = req.body;
    const userId = req.params.id;

    const middleNameValue = middlename ? middlename : null;

    db.query('UPDATE users SET username = ?, email = ?, firstname = ?, middlename = ?, lastname = ?, mobile_no = ? WHERE id = ?', 
    [username, email, firstname, middleNameValue, lastname, mobile_no, userId], 
    (err) => {
        if (err) {
            console.error(err);
            req.session.message = { type: 'error', text: 'Error updating user' };
            return res.redirect('/admin');
        }
        req.session.message = { type: 'success', text: 'User details updated successfully!' };
        res.redirect('/admin');
    });
});

// Route to delete a user
router.post('/delete/:id', isAdmin, (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
        if (err) {
            console.error(err);
            req.session.message = { type: 'error', text: 'Error deleting user' };
            return res.redirect('/admin');
        }
        req.session.message = { type: 'success', text: 'User deleted successfully!' };
        res.redirect('/admin');
    });
});

module.exports = router;