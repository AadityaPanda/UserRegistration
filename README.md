# 🔐 User Registration App

<div align="center">

![Screenshot 2025-01-13 144947](https://github.com/user-attachments/assets/a9e8af7a-d56b-4f82-805a-4a5e73796090)

**A comprehensive Node.js user registration system with admin dashboard and email verification**

[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com/)
[![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/Overview.en.html)

</div>

---

## 📖 Overview

This is a full-stack Node.js application that provides a complete user registration system with email verification and an administrative dashboard. The application offers secure user management capabilities, allowing both regular users to register and authenticate, while providing administrators with comprehensive user management tools.

### 🎯 Key Capabilities

The application ensures secure user management and provides a seamless experience for both regular users and administrators through:

- **User Registration & Authentication** - Complete signup and login workflow
- **Email Verification System** - Automated email verification using Nodemailer
- **Administrative Dashboard** - Comprehensive user management interface
- **CRUD Operations** - Full create, read, update, and delete functionality
- **User Status Management** - Activate/deactivate user accounts
- **Automated Cleanup** - Scheduled removal of unverified accounts

---

## 📋 Table of Contents

- [🚀 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Setup](#️-setup)
- [🔧 Installation](#-installation)
- [🛣️ Routes Overview](#️-routes-overview)
- [🧹 Scheduled Cleanup](#-scheduled-cleanup)
- [📄 License](#-license)
- [🤝 Contributing](#-contributing)
- [📞 Contact](#-contact)

---

## 🚀 Features

<table>
<tr>
<td width="50%">

### 👥 User Features
- ✅ **User Registration** - Secure account creation
- ✅ **Email Verification** - Automated verification emails
- ✅ **User Authentication** - Login/logout functionality
- ✅ **User Dashboard** - Personal account interface

</td>
<td width="50%">

### 👨‍💼 Admin Features
- ✅ **Admin Dashboard** - Comprehensive management interface
- ✅ **User Management** - Create, edit, delete users
- ✅ **Account Control** - Activate/deactivate accounts
- ✅ **User Overview** - View all registered users

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-0F1419?style=for-the-badge&logo=nodemailer&logoColor=white)

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### Database & Tools
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

</div>

---

## 📁 Project Structure

<details>
<summary>🔍 Click to expand project structure</summary>

```
📦 UserRegistration
├── 📁 backend/
│   ├── 📁 config/
│   │   └── 📄 db.js                     # MySQL database connection
│   ├── 📁 middleware/
│   │   ├── 📄 isAdmin.js                # Admin verification middleware
│   │   └── 📄 requireLogin.js           # Session check middleware
│   ├── 📁 routes/
│   │   ├── 📄 admin.js                  # Admin dashboard routes
│   │   ├── 📄 dashboard.js              # User dashboard routes
│   │   ├── 📄 home.js                   # Home page routes
│   │   ├── 📄 login.js                  # Authentication routes
│   │   ├── 📄 logout.js                 # Session management
│   │   └── 📄 signup.js                 # User registration routes
│   ├── 📁 services/
│   │   └── 📄 emailService.js           # Email sending service
│   ├── 📄 .env                          # Environment variables
│   ├── 📄 .env.example                  # Environment template
│   ├── 📄 cleanup.js                    # Automated cleanup task
│   └── 📄 server.js                     # Main server file
│
└── 📁 frontend/your-project-name/
    ├── 📁 src/
    │   ├── 📄 App.jsx                   # Main React component
    │   ├── 📄 main.jsx                  # React entry point
    │   ├── 📁 components/
    │   │   ├── 📁 AdminNavbar/
    │   │   │   ├── 📄 AdminNavbar.css
    │   │   │   └── 📄 AdminNavbar.jsx
    │   │   ├── 📁 AdminSidebar/
    │   │   │   ├── 📄 AdminSidebar.css
    │   │   │   └── 📄 AdminSidebar.jsx
    │   │   └── 📁 Navbar/
    │   │       ├── 📄 Navbar.css
    │   │       └── 📄 Navbar.jsx
    │   ├── 📁 pages/
    │   │   ├── 📄 Admin.jsx             # Admin dashboard
    │   │   ├── 📄 CreateUser.jsx        # User creation
    │   │   ├── 📄 Dashboard.jsx         # User dashboard
    │   │   ├── 📄 EditUser.jsx          # User editing
    │   │   ├── 📄 Home.jsx              # Landing page
    │   │   ├── 📄 Login.jsx             # Authentication
    │   │   ├── 📄 ManageUsers.jsx       # User management
    │   │   └── 📄 Signup.jsx            # Registration
    │   └── 📁 styles/
    │       ├── 📄 Admin.css
    │       ├── 📄 CreateUser.css
    │       ├── 📄 Dashboard.css
    │       ├── 📄 EditUser.css
    │       ├── 📄 Home.css
    │       ├── 📄 Login.css
    │       ├── 📄 ManageUsers.css
    │       └── 📄 Signup.css
    ├── 📁 public/
    ├── 📄 index.html
    ├── 📄 package.json
    └── 📄 vite.config.js
```

</details>

---

## ⚙️ Setup

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Description |
|-------------|---------|-------------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) | 14.x or above | JavaScript runtime |
| ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) | Latest | Database server |
| ![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white) | Latest | Version control |
| ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) | Latest | Frontend framework |

---

## 🔧 Installation

### 🖥️ Backend Setup

<details>
<summary>📥 Step 1: Clone the Repository</summary>

```bash
git clone https://github.com/AadityaPanda/UserRegistration.git
cd backend
```

</details>

<details>
<summary>📦 Step 2: Install Dependencies</summary>

```bash
npm install
```

</details>

<details>
<summary>🔧 Step 3: Environment Configuration</summary>

Create your environment file:
```bash
cp .env.example .env
```

Configure your `.env` file with the following variables:

```env
# 🗄️ Database Configuration
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# 🔐 Session Configuration
SESSION_SECRET=your_session_secret

# 🌐 Server Configuration
PORT=3000
BASE_URL=http://localhost:3000

# 📧 SMTP Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=587
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
SMTP_SECURE=false
```

</details>

### 🗄️ Database Setup

<details>
<summary>📊 Step 4: Database Configuration</summary>

Execute the following SQL commands to set up your database:

```sql
-- Create the database
CREATE DATABASE myform;

-- Switch to the database
USE myform;

-- Create the users table
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
    verified BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE
);

-- Create an admin user
UPDATE users SET isAdmin = TRUE WHERE username = 'admin';

-- Reset auto-increment
ALTER TABLE users AUTO_INCREMENT = 1;
```

</details>

<details>
<summary>🚀 Step 5: Start the Backend Server</summary>

```bash
npm start
```

✅ Backend server will be running at `http://localhost:3000`

</details>

### 🎨 Frontend Setup

<details>
<summary>⚛️ Step 1: Create React Frontend</summary>

```bash
cd frontend
npm create vite@latest your-project-name -- --template react
cd your-project-name
```

</details>

<details>
<summary>📦 Step 2: Install Frontend Dependencies</summary>

```bash
npm install
```

</details>

<details>
<summary>🏗️ Step 3: Build and Run</summary>

```bash
# Create production build
npm run build

# Start development server
npm run dev
```

✅ Frontend will be running at `http://localhost:5173`

</details>

---

## 🛣️ Routes Overview

<table>
<thead>
<tr>
<th>🌐 Route</th>
<th>📝 Description</th>
<th>🔒 Access</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>/</code></td>
<td>🏠 Landing page</td>
<td>🌍 Public</td>
</tr>
<tr>
<td><code>/signup</code></td>
<td>📝 User registration</td>
<td>🌍 Public</td>
</tr>
<tr>
<td><code>/login</code></td>
<td>🔐 User authentication</td>
<td>🌍 Public</td>
</tr>
<tr>
<td><code>/dashboard</code></td>
<td>👤 User dashboard</td>
<td>🔒 Authenticated</td>
</tr>
<tr>
<td><code>/admin</code></td>
<td>👨‍💼 Admin homepage</td>
<td>🛡️ Admin only</td>
</tr>
<tr>
<td><code>/admin/user</code></td>
<td>👥 User management</td>
<td>🛡️ Admin only</td>
</tr>
<tr>
<td><code>/admin/create</code></td>
<td>➕ Create new user</td>
<td>🛡️ Admin only</td>
</tr>
<tr>
<td><code>/admin/edit/:id</code></td>
<td>✏️ Edit user details</td>
<td>🛡️ Admin only</td>
</tr>
</tbody>
</table>

---

## 🧹 Scheduled Cleanup

The application includes an automated cleanup system (`cleanup.js`) that:

- 🕐 **Runs every hour** to maintain database hygiene
- 🗑️ **Removes unverified users** whose verification tokens have expired
- 📧 **Prevents spam registrations** by cleaning up abandoned accounts
- ⚡ **Optimizes database performance** by removing inactive records

This ensures your database stays clean and performs optimally over time.

---

## 📄 License

<div align="center">

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

**This project is licensed under the MIT License**

Feel free to use, modify, and distribute it in your projects.

</div>

---

## 🤝 Contributing

We welcome contributions! Here's how you can help improve this project:

### 🔧 Development Workflow

1. **🍴 Fork the repository**
2. **🌿 Create a feature branch**
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. **💾 Commit your changes**
   ```bash
   git commit -m "Add YourFeatureName"
   ```
4. **📤 Push to the branch**
   ```bash
   git push origin feature/YourFeatureName
   ```
5. **🔄 Open a pull request**

### 📋 Contribution Guidelines

- 🧪 Ensure all tests pass before submitting
- 📝 Update documentation for new features
- 🎨 Follow the existing code style
- 💬 Provide clear commit messages

Check [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📞 Contact

<div align="center">

**👨‍💻 Aaditya Panda**

[![Email](https://img.shields.io/badge/Email-aadityapanda23@gmail.com-red?style=for-the-badge&logo=gmail&logoColor=white)](mailto:aadityapanda23@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-AadityaPanda-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AadityaPanda)

---

<sub>💝 **Thank you for using the User Registration App!**</sub>

*If you found this project helpful, please consider giving it a ⭐ on GitHub!*

</div>
