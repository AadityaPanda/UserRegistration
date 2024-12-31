const cron = require('node-cron');
const db = require('./config/db');

// Schedule the cleanup task to run every hour
cron.schedule('0 * * * *', () => {
  const currentTime = new Date();

  // Delete unverified users and their tokens
  db.query(
    `DELETE users, email_verifications 
     FROM users 
     INNER JOIN email_verifications ON users.id = email_verifications.user_id 
     WHERE email_verifications.expires_at < ? AND users.verified = 0`,
    [currentTime],
    (err, results) => {
      if (err) {
        console.error('Error during cleanup:', err);
      } else {
        console.log('Cleanup completed:', results.affectedRows, 'records removed.');
      }
    }
  );
});

console.log('Cleanup scheduler initialized.');