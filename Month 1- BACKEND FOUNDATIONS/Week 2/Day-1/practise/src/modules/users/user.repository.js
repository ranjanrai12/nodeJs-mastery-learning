const User = require("./user.model")


// here mongo db or sql db fetch will come 
const usersProfile = [
    {
        email: "ranjan@gmail.com",
        age: 32,
        name: "Ranjan",
        department: 'Full Stack',
        id: '4535',
        password: "Ranjan@123",
        role: 'admin'
    },
    {
        email: "ram@gmail.com",
        age: 22,
        name: "Ram",
        department: 'QA',
        id: '23423',
        password: "Ram@123",
        role: 'inquiry'
    },
    {
        id: "1777644571855",
        email: 'rahul@gmail.com',
        password: '$2b$10$SHBO3pFfuO4/jDQRcHTNJesJbijwvll3mhd5GQ.SlQdDg4opgspIC',
        role: 'admin'
    }
]

const fetchUserById = async(id) => {
    const user = await User.find({_id: id})
    return user
    
}

const fetchAllUsers = async() => {
    return [...usersProfile]
}



module.exports = { fetchUserById, fetchAllUsers }