const express = require('express');
const router = express.Router();
const db = require('../config/db');
const crypto = require('crypto');
const isAdmin = require('../middleware/requireLogin');
const requireLogin = require('../middleware/requireLogin');

router.use(requireLogin);
router.use(isAdmin);

router.get('/search', (req, res) => {
    const searchQuery = req.query.query;
  
    if (!searchQuery) {
      return res.json({ users: [], message: 'Please enter a search query.' });
    }
  
    let query, params;
  
    if (searchQuery.startsWith('#')) {
      query = 'SELECT * FROM users WHERE id = ?';
      params = [searchQuery.substring(1)];
    } else if (searchQuery.startsWith('@')) {
      query = 'SELECT * FROM users WHERE username = ?';
      params = [searchQuery.substring(1)];
    } else {
      query = `
        SELECT * FROM users WHERE 
        firstname LIKE ? OR 
        middlename LIKE ? OR 
        lastname LIKE ? OR 
        email LIKE ? OR 
        mobile_no LIKE ?`;
      params = [ 
        `%${searchQuery}%`, 
        `%${searchQuery}%`, 
        `%${searchQuery}%`, 
        `%${searchQuery}%`, 
        `%${searchQuery}%`
      ];
    }
  
    db.query(query, params, (err, users) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      const message = users.length === 0
        ? 'No matching users found!'
        : `${users.length} user(s) found!`;
  
      res.json({ users, message });
    });
  });  

// Get all users
router.get('/user', (req, res) => {
    db.query('SELECT * FROM users', (err, users) => {
        if (err) {
            console.error(err);
            req.session.message = { type: 'error', text: 'Database error' };
            return res.status(500).send('Database error');
        }
        res.json({ users });
    });
});

// Create user
router.post('/create', (req, res) => {
    const { username, firstname, middlename, lastname, mobile_no, email, password } = req.body;
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const middleNameValue = middlename ? middlename.trim() : null;

    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, existingUsers) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error checking user existence' });
        }

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists.' });
        }

        db.query(
            'INSERT INTO users (username, firstname, middlename, lastname, mobile_no, email, password, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [username, firstname, middleNameValue, lastname, mobile_no, email, hashedPassword, 1],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error creating user' });
                }
                res.status(201).json({ message: 'User created successfully' });
            }
        );
    });
});

// Get a user by ID
router.get('/edit/:id', (req, res) => {
    const userId = req.params.id;

    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        if (!user.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user: user[0], status: 'success', message: 'User data loaded successfully!' });
    });
});

// Update user
router.put('/edit/:id', (req, res) => {
    const userId = req.params.id;
    const { username, email, firstname, middlename, lastname, mobile_no } = req.body;
    console.log('Request body:', req.body);
    console.log('User ID:', req.params.id);


    db.query(
        'SELECT * FROM users WHERE id = ?',
        [userId],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error fetching user details' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const user = results[0];
            const updatedUsername = username || user.username;
            const updatedEmail = email || user.email;
            const updatedFirstname = firstname || user.firstname;
            const updatedMiddlename = middlename ? middlename.trim() : user.middlename;
            const updatedLastname = lastname || user.lastname;
            const updatedMobileNo = mobile_no || user.mobile_no;

            db.query(
                'UPDATE users SET username = ?, email = ?, firstname = ?, middlename = ?, lastname = ?, mobile_no = ? WHERE id = ?',
                [updatedUsername, updatedEmail, updatedFirstname, updatedMiddlename, updatedLastname, updatedMobileNo, userId],
                (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: 'Error updating user' });
                    }
                    res.json({ message: 'User updated successfully' });
                }
            );
        }
    );
});

// Delete user
router.delete('/user/:id', (req, res) => {
    const userId = req.params.id;

    db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error deleting user' });
        }
        res.json({ message: 'User deleted successfully' });
    });
});

// Activate user
router.patch('/user/:id/activate', (req, res) => {
    const userId = req.params.id;

    db.query('UPDATE users SET active = 1 WHERE id = ?', [userId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error activating user' });
        }
        res.json({ message: 'User activated successfully' });
    });
});

// Deactivate user
router.patch('/user/:id/deactivate', (req, res) => {
    const userId = req.params.id;

    db.query('UPDATE users SET active = 0 WHERE id = ?', [userId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error deactivating user' });
        }
        res.json({ message: 'User deactivated successfully' });
    });
});

module.exports = router;