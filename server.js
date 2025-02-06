const express = require('express');
const app = express();
const { initDb } = require('./database/connect');
const errorHandler = require('./middleware/errorHandler');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const routes = require('./routes/index');
const authRoutes = require('./routes/auth');  
require('./config/passport');     

process.env.NODE_ENV = process.env.NODE_ENV || 'development';


app.use(express.json());
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);
app.use('/auth', authRoutes);
app.use('/', routes);   

app.use(errorHandler);

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION!Shutting down...');
    console.error(err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION!Shutting down...');
    console.error(err);
    process.exit(1);
});

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
