// Middleware to ensure the user is an admin
const isAdmin = (req, res, next) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    next();
};

module.exports = isAdmin;