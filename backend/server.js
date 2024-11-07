const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json()); // To parse incoming JSON requests
app.use(cors()); // To handle Cross-Origin Resource Sharing

// Connect to MongoDB
connectDB();

// // Basic routes for testing
// app.get('/', (req, res) => {
//   res.send('Welcome to the CanteenEase Backend!');
// });

// // Routes setup
// const userRoutes = require('./routes/userRoutes');
// const mealRoutes = require('./routes/mealRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const canteenRoutes = require('./routes/canteenRoutes');

// app.use('/api/users', userRoutes);
// app.use('/api/meals', mealRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/canteens', canteenRoutes);

// // Error handling middleware (optional)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
