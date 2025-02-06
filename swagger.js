// const swaggerAutogen = require('swagger-autogen')();
// require('dotenv').config();

// const doc = {
//     info: {
//         title: 'Task Manager APi',
//         description: 'API documentation for the Task Manager application',
//     },
//     schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
// };

// const outputFile = './swagger-output.json';
// const endpointsFiles = ['./routes/index.js'];

// console.log('Generating Swagger documentation...');
// swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
//     console.log('Swagger documentation generated successfully.');
// }).catch((err) => {
//     console.error('Error generating Swagger documentation:', err);
// });

const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();

const doc = {
    info: {
        title: 'Task Manager APi',
        description: 'API documentation for the Task Manager application',
    },
    schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
    securityDefinitions: {
        OAuth2: {
            type: 'oauth2',
            authorizationUrl: 'https://github.com/login/oauth/authorize',
            flow: 'implicit',
            scopes: {
                'user:email': 'Access user email'
            }
        }
    },
    security: [
        {
            OAuth2: []
        }
    ]
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

console.log('Generating Swagger documentation...');
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation generated successfully.');
}).catch((err) => {
    console.error('Error generating Swagger documentation:', err);
});