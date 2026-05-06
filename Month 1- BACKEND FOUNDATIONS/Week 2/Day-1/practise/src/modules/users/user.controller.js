const { getUserById, getAllUsers,updateUser } = require('./user.service');
const asyncHandler  = require('../../utils/async-handler');
const redis = require('../../config/redis');

const getUser = asyncHandler(async(req, res) => {
    const userId = req.user.id;
    const userData = await getUserById(userId)

    const {password, ...safeData } = userData

    if(req.cacheKey) {
        redis.set(req.cacheKey, JSON.stringify({data: safeData}, {EX: req.cacheDuration || 60}))
    }
    res.json({data: safeData})
})

const getUsers = asyncHandler(async(req, res, next) => {
    const allUsers= await getAllUsers()
    res.json({data: allUsers})
})

const updateUsers = asyncHandler(async(req, res, next) => {
    const updatedUser = await updateUser(req.params?.id, req.body);
    res.json({data: updatedUser})
})

module.exports = { getUser, getUsers, updateUsers }