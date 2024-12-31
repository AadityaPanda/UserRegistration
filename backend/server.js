require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const homeRoutes = require('./routes/home');
const loginRoutes = require('./routes/login');
const signupRoutes = require('./routes/signup');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
require('./cleanup'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
}));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('../frontend'));

// Middleware to make session messages available to frontend
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message; 
    next();
});

// Middleware to restrict access to admin routes
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        return next();
    }
    res.redirect('/login'); // Redirect if not admin
};

// Routes
app.use('/', homeRoutes);
app.use('/login', loginRoutes);
app.use('/signup', signupRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admin', isAdmin, adminRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});