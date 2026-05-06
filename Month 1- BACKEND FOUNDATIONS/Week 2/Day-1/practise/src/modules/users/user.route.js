const express = require("express");
const userController = require("./user.controller");
const userAuth = require("../../middlewares/auth");
const onlyAdmin = require("../../middlewares/only-admin.middleware");
const cacheMiddleware = require("../../middlewares/cach.middleware");

const userRouter = express.Router();

userRouter.get('/profile', userAuth, cacheMiddleware(300), userController.getUser)

userRouter.put('/:id', userAuth, onlyAdmin, userController.updateUsers)

userRouter.get('/:id', userAuth, userController.getUser)

module.exports = userRouter