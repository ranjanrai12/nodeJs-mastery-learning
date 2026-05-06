const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = rateLimit

const { RedisStore } = require("rate-limit-redis");
const redis = require("../config/redis");

const ipRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 15,
    store: new RedisStore({ sendCommand: (...args) => redis.call(...args) }),
    keyGenerator: (req) => {
        return `ip: ${ipKeyGenerator(req.ip)}`
    },
    message: 'Too many request from this IP',
    skipSuccessfulRequests: false
})

const loginRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    store: new RedisStore({ sendCommand: (...args) => redis.call(...args) }),
    keyGenerator: (req) => {
        // For logged-in users,
        if (req.body.email) {
            return `login:${req.body.email}`;
        }
        // For non-logged-in users (e.g., showing a public page), fallback to the safe IP key
        return `login:${ipKeyGenerator(req.ip)}`;
    },
    message: "Too many login request, please try again later",
    skipSuccessfulRequests: true
})

const userRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    store: new RedisStore({ sendCommand: (...args) => redis.call(...args) }),
    keyGenerator: (req) => {
        if (req && req.user) {
            return `user: ${req.user.id}`
        }
        // fallback for unauthenticated users
        return `user: ${ipKeyGenerator(req.ip)}`
    },
    message: 'Too many requests, please slow down'
})


const tokenBucketLimiter = rateLimit({

})

module.exports = { loginRateLimiter, ipRateLimiter, userRateLimiter }