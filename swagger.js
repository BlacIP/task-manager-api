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

console.log('Generating Swagger documentation...');
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation generated successfully.');
}).catch((err) => {
    console.error('Error generating Swagger documentation:', err);
});