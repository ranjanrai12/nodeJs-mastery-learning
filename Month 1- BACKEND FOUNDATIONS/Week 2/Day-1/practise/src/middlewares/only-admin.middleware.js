const asyncHandler = require("../utils/async-handler")

const onlyAdmin = asyncHandler(async(req, res, next) => {
    const loggedInUser = req.user;
    const userIdFromParams = req.params.id;

    if(loggedInUser.role === "admin" || loggedInUser.id === userIdFromParams) {
        return next()
    }

    const error = new Error("Access denied");
    error.statusCode = 403;
    return next(error);
})

module.exports = onlyAdmin