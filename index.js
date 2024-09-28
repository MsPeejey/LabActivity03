// Import the Express library
const express = require('express');
const bodyParser = require('body-parser');

// Create an instance of an Express application
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Array to store user data
const users = [];

// Function to validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Function to validate that the password contains letters, numbers, symbols, and is at least 8 characters long
const isValidPassword = (password) => {
    // Regex to ensure password contains at least one letter, one number, one symbol, and is 8+ characters
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
};

// Route to handle GET requests
app.get('/users', (req, res) => {
    console.log('GET /users endpoint was accessed');
    res.status(200).json(users);
});

// Route to handle POST requests for user registration
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    console.log("Request received: ", req.body); // Log request body for debugging

    // Check for valid email format
    if (!isValidEmail(email)) {
        console.log("Invalid email format");
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if the email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        console.log("Email already registered");
        return res.status(409).json({ error: 'Email already registered' });
    }

    // Check if the password contains letters, numbers, symbols, and is at least 8 characters long
    if (!isValidPassword(password)) {
        console.log("Invalid password format");
        return res.status(400).json({
            error: 'Password must contain letters, symbols, and numbers and be at least 8 characters long'
        });
    }

    // If everything is valid, register the user
    users.push({ name, email, password });
    console.log("User registered successfully:", { name, email }); // Log successful registration
    res.status(201).json({ message: 'User registered successfully' });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
