# USER REGISTRATION APP

This is a Node.js-based user registration application that allows users to sign up, receive email verification, and log in. It includes user registration functionality with email verification using Nodemailer for sending verification emails.


## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Installation](#installation)
- [Routes Overview](#routes-overview)
- [Scheduled Cleanup](#scheduled-cleanup)
- [License](#license)
- [Contributing](#contributing)
- [Contact](#contact)


## Features
- **User Registration**: Users can register with their details.
- **Email Verification**: Sends a verification email with a link to activate the account.
- **Login Functionality**: Users can log in after verifying their email.
- **Admin Dashboard**: Admins can manage users.
- **Basic CRUD operations**: For user management.


## Tech Stack
- **Backend**: Node.js, Express.js, MySQL
- **Frontend**: EJS (for rendering views)
- **Email Service**: Nodemailer
- **Database**: MySQL
- **Environment Variables**: `.env` file for sensitive configurations


## Project Structure

```plaintext
backend/
├── config/
│   └── db.js                    # MySQL database connection
├── node_modules/                 # Project dependencies
├── routes/                       # Backend route handlers
│   ├── admin.js                  # Admin dashboard route
│   ├── dashboard.js              # User dashboard route
│   ├── home.js                   # Home route
│   ├── login.js                  # Login route
│   └── signup.js                 # User signup route
├── services/
│   └── emailService.js           # Email sending service
├── .env                          # Environment variables (ignored in Git)
├── .env.example                  # Template for environment variables
├── .gitignore                    # Git ignore file
├── cleanup.js                    # Scheduled cleanup for unverified users
└── server.js                     # Main server file

frontend/
├── admin.ejs                     # Admin dashboard page
├── createUser.ejs                # Create user page
├── dashboard.ejs                 # User dashboard page
├── editUser.ejs                  # Edit user page
├── home.ejs                      # Home page
├── login.ejs                     # Login page
└── signup.ejs                    # Signup page
```

## Setup

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (Version 14.x or above)
- **MySQL**
- **Git**

## Installation

Follow these steps to install and run the application:

1. **Clone the Repository**:
```bash
git clone  https://github.com/Aaditya/User-Registration.git
cd user-registration-app
```

2. **Install Dependencies**:
```bash
npm install
```

3. **Set up Environment Variables**:
Create a `.env` file by copying the `.env.example` file and editing it with your configuration details.
```bash
cp .env.example .env
```
Edit the `.env` file and update the placeholders with your actual configuration details:
```plaintext
# Database Configuration
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# Session Secret
SESSION_SECRET=your_session_secret

# Server Configuration
PORT=3000

# SMTP Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=587
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
SMTP_SECURE=false

# Base URL
BASE_URL=http://localhost:3000
```

4. **Create the Database**:
Run the provided SQL queries to set up your MySQL database.
```sql
CREATE DATABASE myform;
USE myform;

CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(30) NOT NULL,
    middlename VARCHAR(30),
    lastname VARCHAR(30) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL,
    mobile_no VARCHAR(15) NOT NULL, 
    email VARCHAR(50) NOT NULL UNIQUE,
    isAdmin BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE email_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE email_verifications AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;

-- Example: Make a specific user an admin
UPDATE users SET isAdmin = TRUE WHERE username = 'aaditya@23';
```

5. **Run the Application**:
```bash
npm start
```
The application will now be accessible at `http://localhost:3000`.


## Routes Overview

| Route       | Description                               |
|-------------|-------------------------------------------|
| `/`         | The landing page of the application.     |
| `/signup`   | User registration page.                   |
| `/login`    | User login page.                          |
| `/dashboard`| User dashboard (post-login).              |
| `/admin`    | Admin page to manage users.               |

## Scheduled Cleanup

The app includes a scheduled cleanup task (`cleanup.js`) that runs every hour to remove unverified users from the database. This is done by deleting records where the verification token has expired and the user is still unverified.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it in your projects.

## Contributing

Contributions are welcome! Here's how you can help:
1. Fork the repository.
2. Create a new branch:
```bash
git checkout -b feature/YourFeatureName
```
3. Commit your changes:
```bash
git commit -m "Add YourFeatureName"
```
4. Push to the branch:
```bash
git push origin feature/YourFeatureName
```
5. Open a pull request.

Check the [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Contact

- **Developer**: Aaditya Panda  
- **Email**: [aadityapanda23@gmail.com](mailto:aadityapanda23@gmail.com)  
- **GitHub**: [AadityaPanda](https://github.com/AadityaPanda)
