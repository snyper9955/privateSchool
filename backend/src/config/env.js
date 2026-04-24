const dotenv = require('dotenv');

// Typically, this file would just load dotenv and export the variables for centralized access
dotenv.config({ path: '.env' });

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    // Add other env variables here
};
