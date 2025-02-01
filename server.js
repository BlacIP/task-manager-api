// server.js
const express = require('express');
const { initDb } = require('./database/connect');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const cors = require('cors');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

// Middleware
app.use(express.json());

// CORS middleware
app.use(cors());

// Routes
const routes = require('./routes/index');
app.use('/api', routes);
app.use('/', routes);   

app.use('/api-docs', (req, res, next) => {
    swaggerFile.host = req.get('host');
    swaggerFile.schemes = [req.protocol];
    req.swaggerDoc = swaggerFile;
    next();
}, swaggerUi.serve, swaggerUi.setup(swaggerFile));


// Error handling middleware
app.use(errorHandler);

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION!Shutting down...');
    console.error(err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION!Shutting down...');
    console.error(err);
    process.exit(1);
});



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
