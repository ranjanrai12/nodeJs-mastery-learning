const globalError = require("./src/middlewares/error-middleware");
const userRouter = require("./src/modules/users/user.route");
const authRoutes = require("./src/modules/auth/auth.routes");
const cookieParser = require("cookie-parser");
const express = require("express");
const connectDB = require("./src/config/database");
const { ipRateLimiter } = require("./src/middlewares/login.middleware");
const helmet = require("helmet");

const app = express();

const PORT = process.env.PORT || 3000;
app.use(cookieParser())

app.use(express.json())

app.use(helmet())

app.use(ipRateLimiter)

//Routers
app.use("/api/auth", authRoutes)

app.use("/api/user", userRouter)

// GLobal Error Handler
app.use(globalError)


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on the port ${PORT}`)
    })
}).catch((err) => {
    console.log("Database connection failed", err)
})
