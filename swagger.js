// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Task Manager APi',
        description: 'API documentation for the Contacts application',
    },
    schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
    //basePath: '/contacts',
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);