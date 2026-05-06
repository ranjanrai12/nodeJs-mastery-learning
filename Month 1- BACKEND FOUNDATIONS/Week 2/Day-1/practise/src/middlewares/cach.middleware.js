const redis = require("../config/redis")
const asyncHandler = require("../utils/async-handler")

const cacheMiddleware = (duration) => {
    return asyncHandler(async(req, res, next) => {
        const userId = req.user?.userId || "guest";
        const key = `cache:${userId}:${req.originalUrl}`;

        const cacheData = await redis.get(key);
        if(cacheData) {
            // cache hit
            console.log('Cache Hit', cacheData)
            return res.json(JSON.parse(cacheData))
        }

        req.cacheKey = key;
        req.cacheDuration = duration
        next()
    })
}

module.exports = cacheMiddleware