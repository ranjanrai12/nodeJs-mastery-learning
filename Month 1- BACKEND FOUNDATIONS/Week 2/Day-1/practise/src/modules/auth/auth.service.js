const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { fetchUser, createUser } = require("./auth.repository")

const getLoggedInService = async (email, password) => {
    const user = await fetchUser(email)

    if (!user) {
        const error = new Error("User Not Found");
        error.statusCode = 404
        throw error
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        const error = new Error("Unauthorized")
        error.statusCode = 401;
        throw error
    }

    return user
}

const signupUser = async (userPayload) => {
    const { email, password, age, role } = userPayload;

    const hashPassword = await bcrypt.hash(password, 10);
    return await createUser({ id: new Date().getTime(), email, password: hashPassword, age, role })
}

const generateToken =  (userId) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: "15m" }
    )
    // Why not jwt token because if someone stolen refresh jwt they can get both short term and long term access
    const refreshToken = crypto.randomBytes(64).toString("hex")

    return {accessToken, refreshToken}
}

const logOutUser = async(incomingRefreshToken) => {

    if(incomingRefreshToken) {
        const tokenDocs = await RefreshToken.find({ userId: req.user.id });

        // delete token from DB
        for(const doc of tokenDocs) {
            const isMatch = await bcrypt.compare(incomingRefreshToken, doc.refreshToken);

            if(isMatch) {
                await RefreshToken.deleteOne({_id: doc._id})
                break
            }
        }

        // clear cookies
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: false,
            sameSite: 'strict'
        })

        return {message: "Logout successfully"}
    }

}

module.exports = { getLoggedInService, signupUser, generateToken, logOutUser }