const bcrypt = require("bcrypt");
const User = require("../users/user.model");

const fetchUser = async(email) => {
    const user = await User.findOne({email});
    return user
}

const createUser = async(req) => {
    const { firstName, email, lastName, password, age } = req;
    const existingUser = await User.findOne({email});

    if (existingUser) {
        const error = new Error("User already exists");
        error.statusCode = 400;
        throw error;
    }
    const bcryptPassword = await bcrypt.hash(password, 10);
    const user = new User({
        firstName,
        lastName,
        email,
        password: bcryptPassword,
        age,
    })
    const saveUser = await user.save();
    return saveUser
}

module.exports = { fetchUser, createUser }