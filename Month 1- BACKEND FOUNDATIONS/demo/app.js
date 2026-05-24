const express = require("express");

const app = express();

// global middleware

// parse all incoming request
app.use(express.json())

// 
app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})