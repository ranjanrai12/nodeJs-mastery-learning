const globalError = (err, req, res, next) => {
    const errorCode = err.statusCode || 500;
    const errorMsg = err.message || "Something went wrong"

    res.status(errorCode).json({
        success: false,
        message: errorMsg
    })
}

module.exports = globalError