const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');

router.use('/', (req, res, next) => {
    swaggerFile.host = req.get('host');
    swaggerFile.schemes = process.env.NODE_ENV === 'production' ? ['https'] : [req.protocol];
    req.swaggerDoc = swaggerFile;
    next();
}, swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = router;
