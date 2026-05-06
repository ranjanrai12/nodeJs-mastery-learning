const { Schema, mongo, mongoose } = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true,
        uniq: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isRevoke: {
        type: Boolean,
        default: false
    }
})

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)

module.exports = RefreshToken