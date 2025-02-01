const exress = require("express");
const app = exress();
const port = process.env.PORT || 8000;
require ("dotenv").config();


app.use('/', require('./routes')); 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});