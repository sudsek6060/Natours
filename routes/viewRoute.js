const express = require('express');
const viewsController = require('../controller/viewsController');
const authController = require('../controller/authController')

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview)

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour)

router.get('/login', authController.isLoggedIn, viewsController.getLogInForm)

router.get('/me', authController.protect, viewsController.getAccount);

module.exports = router;