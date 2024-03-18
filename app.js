const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key'; 

app.use(bodyParser.json());


const data = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
];


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Generate JWT token
function generateAccessToken(user) {
    return jwt.sign(user, SECRET_KEY, { expiresIn: '15m' });
}

// Login route to get JWT token
app.post('/login', (req, res) => {
    
    const username = req.body.username;
    const user = { username: username };
    const accessToken = generateAccessToken(user);
    res.json({ accessToken: accessToken });
});


app.get('/data', authenticateToken, (req, res) => {
    res.json(data);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
