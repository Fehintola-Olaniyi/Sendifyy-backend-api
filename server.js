// Main entry file for setting up the server and API routing

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const emailRoutes = require('./routes/emailRoutes');


//initialize the app
dotenv.config();
const app = express();

//middleware to parse JSON
app.use(express.json());

//connect to mongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));


//Routes 
app.use('/api/auth', authRoutes);

//sample route
app.get('/', (req, res) => {
    res.send('Sendifyy backend API is running');
});


app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running' });
});


//use user routes
app.use('/api/user', userRoutes);

//use email routes
app.use('/api/email', emailRoutes);

// server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

