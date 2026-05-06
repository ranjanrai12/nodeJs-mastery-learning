const jwt = require("jsonwebtoken");

const asyncHandler = require("../utils/async-handler");

const userAuth = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const error = new Error("please provide the token")
        error.statusCode = 401
        return next(error)
    }

    const token = authHeader.split(' ')[1];
    console.log(token)
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        req.user = decoded
        return next()
    } catch (err) {
        const error = new Error()
        console.log(err)
        if (err.name === 'TokenExpiredError') {
            error.message = 'Token is Expired'
            error.statusCode = 401
        } else {
            error.message = 'Token is Invalid'
            error.statusCode = 403
        }
        return next(error)
    }
})

module.exports = userAuth