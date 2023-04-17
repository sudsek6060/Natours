const User = require('../model/userModel');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    });
    return newObj;
}

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

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1. Create errpr if user posts password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password update, please use /updateMypassword', 400))
    }

    // 1.Filtered out unwanted fields names that are no allowed
    const filterBody = filterObj(req.body, 'name', 'email');
    // 2. Update user document
    const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            user: updateUser
        }
    })
})
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