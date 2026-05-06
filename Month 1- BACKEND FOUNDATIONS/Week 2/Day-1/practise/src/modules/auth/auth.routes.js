const express = require("express");
const authController = require("./auth.controller");
const userAuth = require("../../middlewares/auth");
const { loginRateLimiter, ipRateLimiter } = require("../../middlewares/login.middleware");

const router = express.Router();

router.post('/login', loginRateLimiter, authController.getLoggedIn)

router.get('/refresh', authController.doRefreshToken)

router.post('/signup', ipRateLimiter, authController.doSignUp)

router.get('/logout', userAuth, authController.doLogout)

module.exports = router