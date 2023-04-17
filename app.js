/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./Utils/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express()

// Global Middleware

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour'
})
app.use('/api',limiter)

app.use(express.json());
app.use(express.static(`${__dirname}/public`))


app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next()
});

// app.get('/', (req, res) => {
//     res.status(200).json({ message: 'Hello from server side', app: 'natours' })
// })
// app.post('/', (req, res) => {
//     res.send('you can post to this endpoint...')
// })


// Routs

// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler)

module.exports = app;