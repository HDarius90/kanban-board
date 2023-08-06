const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');


router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));


router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, // use the storeReturnTo middleware to save the returnTo value from session to res.locals
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),// passport.authenticate logs the user in and clears req.session
        users.login);        // Now we can use res.locals.returnTo to redirect the user after login


router.get('/logout', users.logout);

module.exports = router;
