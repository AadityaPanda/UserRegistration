require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const homeRoutes = require('./routes/home');
const loginRoutes = require('./routes/login');
const signupRoutes = require('./routes/signup');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const logoutRoutes = require('./routes/logout');
require('./cleanup'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(session({
    key: 'connect.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,
        secure: false, 
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: 'lax', 
    }
}));

// Routes
app.use('/', homeRoutes); 
app.use('/login', loginRoutes); 
app.use('/signup', signupRoutes); 
app.use('/dashboard', dashboardRoutes); 
app.use('/admin', adminRoutes);
app.use('/logout', logoutRoutes); 

app.use(express.static(path.join(__dirname, '../frontend/userreg')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/userreg/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});