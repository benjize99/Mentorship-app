const express = require('express');
require('dotenv').config();

const authRoutes = require('../routes/authRoutes');
exports.getUser = (req, res) => {
    res.json({ message: 'User data' });
 };

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);


app.listen(5000, () => console.log('Server started on port 5000'));


