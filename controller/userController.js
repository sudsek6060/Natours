const User = require('../model/userModel');
const catchAsync = require('../Utils/catchAsync')

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
})
exports.createUser = (req, res) => {
    res.status(500).json({
        success: 'Error',
        message: 'This outer is not defined '
    })
}
exports.getUser = (req, res) => {
    res.status(500).json({
        success: 'Error',
        message: 'This outer is not defined '
    })
}
exports.updateUser = (req, res) => {
    res.status(500).json({
        success: 'Error',
        message: 'This outer is not defined '
    })
}
exports.deleteUser = (req, res) => {
    res.status(500).json({
        success: 'Error',
        message: 'This outer is not defined '
    })
}