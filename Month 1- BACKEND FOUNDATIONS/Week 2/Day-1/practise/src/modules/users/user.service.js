const {fetchUserById, fetchAllUsers} = require('./user.repository')

const getUserById = async(id) => {
        const user = await fetchUserById(id)
    
        if(!user) {
            const error = new Error('User Not found')
            error.statusCode = 404;
            throw error
        }
        return user
}

const getAllUsers = async() => {
    return await fetchAllUsers()
}

const updateUser = async(userId, reqBody) => {

    if(!userId) {
        const error = new Error("Please provide the userId to update")
        error.statusCode = 400;
        throw error;
    }

    const newRequestToUpdate = reqBody;

    const existingUser = await fetchUserById(userId);
    if (!existingUser) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    const updatedUser = { ...existingUser, ...newRequestToUpdate}

    return updatedUser;
}

const deleteUser = async(id) => {

}

module.exports = { getUserById, getAllUsers, updateUser, deleteUser }