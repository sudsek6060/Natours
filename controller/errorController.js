const AppError = require('../Utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message, 400)
}

const handleDuplicateErrorDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}, please use another value!`
    return new AppError(message, 400)
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err, res) => {
    // Operational trusted error: send message to client
    if(err.isOperational) {
        res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
    // programing or other unknown error: dont leak error details
    } else { 
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong'
        })
    }
    
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'
    
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = {...err}
        if(error.name === 'CastError') error = handleCastErrorDB(error)
        if(error.code === 11000) error = handleDuplicateErrorDB(error)

        sendErrorProd(error, res)
    }
}