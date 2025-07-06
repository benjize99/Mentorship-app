# Mentorship Matching App

A web-based platform to match mentors with mentees based on skills, interests, and availability.

## 🚀 Features

- User authentication (mentor/mentee login & signup)
- Profile creation for both mentors and mentees
- Intelligent matching algorithm based on skills & goals
- Admin dashboard (via phpMyAdmin) to manage users and matchings
- Real-time messaging between matched users (optional feature)

---

## 🛠️ Tech Stack

- **Frontend:** JavaScript, JSX, HTML, CSS
- **Backend:** PHP (served via XAMPP)
- **Database:** MySQL (managed using phpMyAdmin)

---

## 📁 Project Structure

/mentorship-app/
├── frontend/
│ ├── index.html
│ ├── styles/
│ └── js/
│ ├── app.js
│ └── components/
│ └── matchComponent.jsx
├── backend/
│ ├── config/
│ │ └── db.php
│ ├── api/
│ │ ├── register.php
│ │ ├── login.php
│ │ ├── match.php
│ │ └── getMatches.php
│ └── utils/
│ └── auth.php
├── database/
│ └── mentorship.sql
└── README.md

yaml
Copy
Edit

---

## ⚙️ Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mentorship-app.git
cd mentorship-app
2. Setup XAMPP
Download and install XAMPP

Start Apache and MySQL via the XAMPP Control Panel

3. Import Database
Open phpMyAdmin (http://localhost/phpmyadmin)

Create a new database (e.g. mentorship_db)

Import the SQL file: database/mentorship.sql

4. Configure Database Connection
Edit backend/config/db.php:

php
Copy
Edit
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "mentorship_db"; // Match the DB name you created
5. Run the App
Place the project inside your XAMPP htdocs folder

Access the app at http://localhost/mentorship-app/frontend/

📌 API Endpoints (Basic)
Endpoint	Method	Description
/api/register	POST	Register a new user
/api/login	POST	Login and get session
/api/match	POST	Match mentees to mentors
/api/getMatches	GET	Get current matches

🧪 Development Notes
Use JSX with a tool like Babel for compatibility if needed

Ensure mod_rewrite is enabled in Apache for clean URLs (optional)

Passwords should be hashed using PHP password_hash() (included in utils)
