const asyncHandler = require("../../utils/async-handler");
const RefreshToken = require("./auth.model");
const { getLoggedInService, signupUser, generateToken, logOutUser } = require("./auth.service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const getLoggedIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await getLoggedInService(email, password);

    // const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET_KEY, {expiresIn: "1h"})

    const { accessToken, refreshToken } = await generateToken(user.id)

    // Store inside the DB the refreshtoken after hash
    const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
    await RefreshToken.create({
        refreshToken: hashRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })

    // http cookies with only refresh token
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    // access token in response body
    res.json({ accessToken, user: { email: user.email, id: user.id } })
})

const doSignUp = asyncHandler(async (req, res, next) => {
    const data = await signupUser(req.body)
    res.status(201).json({ message: data })
})

const doRefreshToken = asyncHandler(async (req, res, next) => {
    // take cookies from refresh token
    const incomingRefreshToken = req.cookies.refreshToken

    // search token in DB with userId
    const allRefreshToken = await RefreshToken.find({ expiresAt: { $gt: new Date() } });
    let matchDoc = null;
    for (doc of allRefreshToken) {
        const isMatched = await bcrypt.compare(incomingRefreshToken, doc.refreshToken)
        if (isMatched) {
            matchDoc = doc
            break
        }
    }

    // if token did not fnid means token is stolen
    if (!matchDoc) {
        return res.status(401).send("Unauthorized")
    }

    // Token Rotation
    await RefreshToken.deleteOne({ _id: matchDoc._id })

    // generate new token
    const { accessToken, refreshToken } = generateToken(matchDoc.userId)

    const hashRefreshToken = await bcrypt.hash(refreshToken, 10);

    await RefreshToken.create({
        refreshToken: hashRefreshToken,
        userId: matchDoc.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ accessToken })
})

const doLogout = asyncHandler(async (req, res, next) => {
    const incomingRefreshToken = res.cookies.refreshToken;
    const data = await logOutUser(incomingRefreshToken)
    res.json(data)
})


module.exports = { getLoggedIn, doSignUp, doRefreshToken, doLogout }