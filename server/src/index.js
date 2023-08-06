require('dotenv').config();
const express = require('express');
const app = express();
const weatherRoutes = require('./weather');

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/', weatherRoutes);

// Start the server
const port = process.env.PORT || 3001;
const host = 'localhost';
app.listen(port, host, () => {
  console.log(`Server running on ${host} in port ${port}`);
});
