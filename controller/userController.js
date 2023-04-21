/* eslint-disable node/no-unsupported-features/es-syntax */
const User = require('../model/userModel');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');
const factory = require('./handlerFactory')


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    });
    return newObj;
}

exports.getAllUsers = factory.getAll(User)
exports.createUser = (req, res) => {
    res.status(500).json({
        success: 'Error',
        message: 'This outer is not defined '
    })
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
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
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false})

    res.status(204).json({
        status: 'success',
        data: null
    })
})
exports.getUser = factory.getOne(User)
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)