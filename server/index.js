const dotenv = require('dotenv');
const express = require('express');
const app = express();
const weatherRoutes = require('./weather');
const cors = require('cors');
const path = require('path');

console.log("Resolved .env Path: " +  path.join(__dirname, '.env'));
// C:\Users\AppleSauce\Portfolio\weather-app\Weather App\.env

// Load environment variables from .env file in the root directory
dotenv.config({ path: path.join(__dirname, '.env') });

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Routes
app.use('/', weatherRoutes);

console.log("This is the PORT: " + process.env.PORT);

// Access PORT after loading environment variables
const port = process.env.PORT || 3001;
const host = 'localhost';
app.listen(port, host, () => {
  console.log(`Server running on ${host} in port ${port}`);
});
