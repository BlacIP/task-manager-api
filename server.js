// server.js
const express = require('express');
const { initDb } = require('./database/connect');
const errorHandler = require('./middleware/errorHandler');
//const AppError = require('./helpers/errorTypes');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// CORS middleware
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//     );
//     res.setHeader(
//         'Access-Control-Allow-Methods',
//         'GET, POST, PATCH, PUT, DELETE, OPTIONS'
//     );
//     next();
// });

// Routes
const routes = require('./routes/index');
app.use('/api', routes);

// Handle undefined routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

initDb((err, db) => {
    if (err) {
        console.error('Failed to connect to database:', err);
        process.exit(1);
    }
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log('Connected to Database');
    });
});
