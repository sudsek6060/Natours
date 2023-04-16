const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const User = require('../model/userModel');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync( async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
      });

    const token = signToken(newUser._id)
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
});

exports.login = catchAsync( async (req, res, next) => {
    const {email, password} = req.body;

    // 1.Check if email and password exist
    if(!email || !password){
      return next(new AppError('please provide email and password', 400))
    }
    // 2.Check if user exists and password is correct
    const user = await User.findOne({email}).select('+password');

    if(!user || !await user.correctPassword(password, user.password)) {
        return next( new AppError('Invalid email or password', 401))
    }
    // 3.If everything ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
});

exports.protect = catchAsync( async (req, res, next) => {
    // 1.Getting token and check if it is there or not
    let token ;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }   

    if(!token) {
        return next ( new AppError('you are not logged in please log in to get access', 401))
    }
    // 2.Verification Token
    const decode = await promisify (jwt.verify)(token, process.env.JWT_SECRET);
    
    // 3.Check if user still exists
    const currentUser = await User.findById(decode.id);
    if(!currentUser){
        return next(new AppError('The user belonging to this token does no longer exist.', 401))
    }
    // 4.Check if user changed password after the token was issued
    if (currentUser.changePasswordAfter(decode.iat)){
        return next(new AppError('User recently changed password! please log in', 01) )
    }
    // Grant access to protected route
    req.user = currentUser;
    next()
})