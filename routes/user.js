const express = require('express');
const userController = require('../controllers/user');
const {check, validationResult} = require('express-validator/check');
const isLoggedIn = require('../middleware/isLoggedIn');

const registrationValidation = [
    check('email').isEmail(),
    check('username').isLength({min:5}), 
    check('password').isLength({min:5})
];

const router = new express.Router();


router.get('/create', isLoggedIn, userController.create);

router.post('/create', registrationValidation, userController.registerProcess);

router.get('/logout', userController.logout);

router.get('/login', isLoggedIn, userController.login);

router.post('/login', userController.loginProcess);



module.exports = router;