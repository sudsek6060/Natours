const mongoose = require('mongoose')
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('UNHANDLER EXCEPTION!  Shutting down....');
    console.log(err.name, err.message);
    process.exit(1);
})

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('DB connected sucessfully'))




// console.log(process.env);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App is running on por ${port}`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLER REJECTION!  Shutting down....');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
});

