# USER REGISTRATION APP

This is a Node.js-based user registration application that allows users to sign up, receive email verification, and log in. It includes user registration functionality with email verification using Nodemailer for sending verification emails. Additionally, the application features an **Admin Dashboard**, where administrators can manage user accounts. The admin can:

1. Create new user accounts.
2. Edit existing user details.
3. Delete user accounts.
4. Activate or Deactivate user accounts based on their status.

The application ensures secure user management and provides a seamless experience for both regular users and administrators.


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
- **Frontend**: React.js
- **Email Service**: Nodemailer
- **Database**: MySQL
- **Environment Variables**: `.env` file for sensitive configurations


## Project Structure

```plaintext
backend/
├── config/
│   └── db.js                     # MySQL database connection
├── middleware
│   ├── isAdmin.js                # Middleware to verify whether user is an Admin
│   └── requireLogin.js           # Middleware to check for user's session
├── node_modules/                 # Project dependencies
├── routes/                       # Backend route handlers
│   ├── admin.js                  # Admin dashboard route
│   ├── dashboard.js              # User dashboard route
│   ├── home.js                   # Home route
│   ├── login.js                  # Login route
│   ├── logout.js                 # Logout route. Destroys existing sessions.
│   └── signup.js                 # User signup route
├── services/
│   └── emailService.js           # Email sending service
├── .env                          # Environment variables (ignored in Git)
├── .env.example                  # Template for environment variables
├── .gitignore                    # Git ignore file
├── cleanup.js                    # Scheduled cleanup for unverified users
└── server.js                     # Main server file

frontend/userreg
├── src
│   ├── App.jsx                   # Main React component
│   ├── main.jsx                  # Entry point for React
│   ├── components
│   │   ├── AdminNavbar
│   │   │   ├── AdminNavbar.css   # CSS for AdminNavbar
│   │   │   └── AdminNavbar.jsx   # Admin Navbar component
│   │   ├── AdminSidebar
│   │   │   ├── AdminSidebar.css  # CSS for AdminSidebar
│   │   │   └── AdminSidebar.jsx  # Admin Sidebar component
│   │   └── Navbar
│   │       ├── Navbar.css        # CSS for Navbar
│   │       └── Navbar.jsx        # Navbar component
│   ├── pages
│   │   ├── Admin.jsx             # Admin dashboard page
│   │   ├── CreateUser.jsx        # Create user page
│   │   ├── Dashboard.jsx         # User dashboard page
│   │   ├── EditUser.jsx          # Edit user page
│   │   ├── Home.jsx              # Home page
│   │   ├── Login.jsx             # Login page
│   │   ├── ManageUsers.jsx       # Manage users page
│   │   └── Signup.jsx            # Signup page
│   └── styles
│       ├── Admin.css             # Styling for Admin page
│       ├── CreateUser.css        # Styling for CreateUser page
│       ├── Dashboard.css         # Styling for Dashboard page
│       ├── EditUser.css          # Styling for EditUser page
│       ├── Home.css              # Styling for Home page
│       ├── Login.css             # Styling for Login page
│       ├── ManageUsers.css       # Styling for ManageUsers page
│       └── Signup.css            # Styling for Signup page
├── public                        # Public assets
├── .gitignore                    # Git ignore file
├── index.html                    # HTML entry point
├── package.json                  # Project dependencies and scripts
└── vite.config.js                # Vite configuration
```

## Setup

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (Version 14.x or above)
- **MySQL**
- **Git**
- **React** (Install using `npm create vite@latest`)

## Installation

Follow these steps to install and run the application:

### Backend Setup

1. **Clone the Repository**:
```bash
git clone  https://github.com/Aaditya/User-Registration.git
cd user-registration-app
```

2. **Install Dependencies**:
```bash
npm i
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

### Database Setup

4. **Create the Database**:
Run the provided SQL queries to set up your MySQL database.
```sql
-- Create the database
CREATE DATABASE myform;

-- Switch to the 'myform' database
USE myform;

-- Create the 'users' table
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- Unique identifier
    firstname VARCHAR(30) NOT NULL, -- First name
    middlename VARCHAR(30), -- Middle name (optional)
    lastname VARCHAR(30) NOT NULL, -- Last name
    username VARCHAR(50) NOT NULL UNIQUE, -- Unique username
    password VARCHAR(64) NOT NULL, -- User's password (hashed)
    mobile_no VARCHAR(15) NOT NULL, -- Mobile number
    email VARCHAR(50) NOT NULL UNIQUE, -- Unique email address
    isAdmin BOOLEAN DEFAULT FALSE, -- Flag for admin users
    verified BOOLEAN DEFAULT FALSE, -- Verification status
    active BOOLEAN DEFAULT TRUE -- Active status of the user
);

-- Make a specific user an admin
UPDATE users SET isAdmin = TRUE WHERE username = 'admin';

-- Create the 'email_verifications' table to store verification tokens
CREATE TABLE email_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for verification records
    user_id INT UNSIGNED NOT NULL, -- Reference to the user
    token VARCHAR(255) NOT NULL, -- Verification token
    expires_at DATETIME NOT NULL, -- Expiration date of the token
    FOREIGN KEY (user_id) REFERENCES users(id) -- Foreign key relation to 'users' table
);

-- Reset auto-increment to start from 1 for both tables
ALTER TABLE email_verifications AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;

-- Clean up by deleting all data in the 'email_verifications' and 'users' tables
DELETE FROM email_verifications;
DELETE FROM users;

-- Retrieve all users
SELECT * FROM users;

-- Retrieve all email verification records
SELECT * FROM email_verifications;
```

5. **Run the Application**:
```bash
npm start
```
The application will now be accessible at `http://localhost:3000`.

### Frontend Setup

1. **Create the React frontend**:
```bash
cd frontend
```
Create a new Vite React App:
```bash
npm create vite@latest
```

2. **Navigate to the project folder**
```bash
cd your-project-name
```

3. **Install frontend dependencies**
```bash
npm i
```

4. **Create the build folder for development**
```bash
npm run build
```

5. **Run the development server**
```bash
npm run dev
```
You now have both the backend and frontend running on their respective ports:

Backend: `http://localhost:3000`
Frontend: `http://localhost:5173`
Ensure the frontend and backend communicate effectively by updating API URLs in the frontend as needed.


## Routes Overview

| Route               | Description                               |
|---------------------|-------------------------------------------|
| `/`                 | The landing page of the application.      |
| `/signup`           | User registration page.                   |
| `/login`            | User login page.                          |
| `/dashboard`        | User dashboard (post-login).              |
| `/admin`            | Admin home page.                          |
| `/admin/user`       | Admin page to manage users.               |
| `/admin/create`     |	Create new user (admin action).           |
| `/admin/edit/:id`   |	Edit existing user details (admin action).|

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