const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 5500;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your database username
    password: '', // replace with your database password
    database: 'voting_game'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// Login endpoint for different roles
app.post('/api/:role-login', (req, res) => {
    const { role } = req.params;
    const { username, password } = req.body;

    // Define the table based on the role
    let tableName;
    if (role === 'admin') {
        tableName = 'admin_login';
    } else if (role === 'cadet') {
        tableName = 'cadet_login';
    } else if (role === 'voter') {
        tableName = 'user_login';
    } else {
        return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    // Query the database for the user
    const query = `SELECT * FROM ${tableName} WHERE username = ? AND password = ?`;
    db.execute(query, [username, password], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length > 0) {
            // User found
            return res.json({ success: true });
        } else {
            // Invalid credentials
            return res.json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});