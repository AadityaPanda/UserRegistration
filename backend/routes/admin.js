const express = require('express');
const router = express.Router();
const db = require('../config/db');
const crypto = require('crypto');
const isAdmin = require('../middleware/requireLogin');
const requireLogin = require('../middleware/requireLogin');
const { sendVerificationEmail } = require('../services/emailService');
require('dotenv').config();

router.use(requireLogin);
router.use(isAdmin);

// Search with pagination
router.get('/search', (req, res) => {
  const searchQuery = req.query.query;

  if (!searchQuery) {
    return res.json({ users: [], message: 'Please enter a search query.' });
  }

  let query, params;

  // Check if search query starts with @ for username search
  if (searchQuery.startsWith('@')) {
    query = 'SELECT * FROM users WHERE username LIKE ?';
    params = [`%${searchQuery.substring(1)}%`];
  } else if (searchQuery.includes('@')) {
    // If @ is in the search query, but it doesn't start with @, treat it as part of the username search
    query = 'SELECT * FROM users WHERE username LIKE ?';
    params = [`%${searchQuery}%`];
  } else {
    // Fallback: search across all fields if @ is not in the query
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

// Get all users with pagination
router.get('/user', (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 users per page
  const offset = (page - 1) * limit;

  // Query to get paginated users
  db.query(
      'SELECT * FROM users LIMIT ? OFFSET ?',
      [parseInt(limit, 10), parseInt(offset, 10)],
      (err, users) => {
          if (err) {
              console.error(err);
              req.session.message = { type: 'error', text: 'Database error' };
              return res.status(500).send('Database error');
          }

          // Query to count total users
          db.query('SELECT COUNT(*) AS total FROM users', (countErr, countResult) => {
              if (countErr) {
                  console.error(countErr);
                  req.session.message = { type: 'error', text: 'Database error' };
                  return res.status(500).send('Database error');
              }

              const total = countResult[0].total;
              const totalPages = Math.ceil(total / limit);

              res.json({
                  users,
                  total,
                  page: parseInt(page, 10),
                  pages: totalPages,
              });
          });
      }
  );
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

// Admin route to send verification email to a user
router.post('/verify-email/:id', (req, res) => {
    const userId = req.params.id;
  
    // Query to fetch user data
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
      if (err || results.length === 0) {
        console.error('Error fetching user:', err || 'No user found');
        return res.status(404).json({ message: 'User not found.' });
      }
  
      const user = results[0];
  
      // Check if the user is already verified
      if (user.verified) {
        return res.status(400).json({ message: 'User is already verified.' });
      }
  
      // Generate a verification token
      const token = crypto.randomBytes(20).toString('hex');
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiration
  
      // Update the user record with the token and expiry time
      db.query(
        'UPDATE users SET token = ?, expires_at = ? WHERE id = ?',
        [token, expiresAt, userId],
        (updateErr) => {
          if (updateErr) {
            console.error('Error updating user token:', updateErr);
            return res.status(500).json({ message: 'Failed to generate verification token.' });
          }
  
          // Send the verification email
          sendVerificationEmail(user.email, token, user.firstname);
          return res.status(200).json({ message: 'Verification email sent successfully.' });
        });
    });
});
  
// Verification route (user clicks on the link)
router.get('/verify-email', (req, res) => {
    const { token } = req.query;
  
    // Fetch user by token
    db.query('SELECT * FROM users WHERE token = ?', [token], (err, results) => {
      if (err || results.length === 0) {
        console.error('Error finding token:', err || 'No results');
        return res.status(400).json({ message: 'Invalid or expired token.' });
      }
  
      const user = results[0];
  
      if (new Date() > user.expires_at) {
        return res.status(400).json({ message: 'Verification link has expired.' });
      }
  
      // Mark the user as verified
      db.query('UPDATE users SET verified = 1, token = ?, expires_at = ? WHERE id = ?', [token, expiresAt, user.id], (updateErr) => {
        if (updateErr) {
          console.error('Error updating verification status:', updateErr);
          return res.status(500).json({ message: 'Error verifying user.' });
        }
  
        return res.status(200).json({ message: 'User verified successfully!' });
      });
    });
  });  

module.exports = router;