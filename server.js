// Main entry point for the backend service

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth')

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



//import user rooutes 
const userRoutes = require('./routes/userRoutes');

//use user routes
app.use('/api/user', userRoutes);

// server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

