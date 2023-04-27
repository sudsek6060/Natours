/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet')
const mongoSantize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser')


const AppError = require('./Utils/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoute')

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

// Global Middleware
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// set security HTTP headers
const scriptSrcUrls = [
    'https://unpkg.com/',
    'https://tile.openstreetmap.org',
    'https://*.cloudflare.com/',
    'https://cdnjs.cloudflare.com/ajax/libs/axios/',
    'https://*.stripe.com',
    'https:',
    'data:'
  ];
  const styleSrcUrls = [
    'https://unpkg.com/',
    'https://tile.openstreetmap.org',
    'https://fonts.googleapis.com/',
    'https:'
  ];
  const connectSrcUrls = [
    'https://unpkg.com',
    'https://tile.openstreetmap.org',
    'https://*.cloudflare.com/',
    'http://127.0.0.1:3000'
  ];
  const fontSrcUrls = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'https:',
    'data:'
  ];
  const frameSrcUrls = ['https://*.stripe.com'];
   
  app.use(
    helmet({ crossOriginResourcePolicy: false, crossOriginEmbedderPolicy: false })
  );
   
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:'],
        baseUri: ["'self'"],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", 'data:', 'blob:'],
        objectSrc: ["'none'"],
        imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
        fontSrc: ["'self'", ...fontSrcUrls],
        childSrc: ["'self'", 'blob:'],
        frameSrc: ["'self'", ...frameSrcUrls],
        upgradeInsecureRequests: []
      }
    })
  );
// Development logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour'
})
app.use('/api',limiter)

// Body parser, reading data from body into req.body
app.use(express.json({limit: '200kb'}));
app.use(cookieParser())

// Data sanitization against NoSQL query injection
app.use(mongoSantize());

// Data sanitization xss
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration', 'maxGroupSize',
        'ratingsAverage',
        'ratingsQuantity',
        'price',
        'difficulty'
    ]
}));


// Test middleware
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



app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler)

module.exports = app;