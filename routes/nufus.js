var express               = require('express');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var passport              = require('passport');
var cognitoSrvc           = require('../services/CognitoSrvc.js');

var router = express.Router();

const redirectTodashboard = (req, res, next) => {
    console.log(req.session);
    if(!req.session.passport) {
        next();
    } else {
        res.redirect('/dashboard');
    }
}
  
router.get('/', redirectTodashboard, function (req, res, next) {
    res.render('index');
});
  
router.post('/', (req, res, next) => {
    console.log("Hey what am I doing here !!!!!!");
});

/**
 * Go To Nufus page
 */
router.get('/signup', (req, res, next) => {
    res.render('nufus/signup', {});
});
router.post('/signup', (req, res, next) => {
    // console.log("submited");
    // return;
    var nickname = req.body.nickname;
    var email = req.body.email;
    var password = req.body.password;
    var cpassword = req.body.cpassword;
    req.checkBody('nickname', 'Nick Name is Required').notEmpty();
    req.checkBody('email', 'Enter A valid Email id').isEmail();
    req.checkBody('password', 'Password is Required').notEmpty();
    req.checkBody('cpassword', 'Password And Confim Password Should Be Same').equals(req.body.password);
    
    /**     * Check Valdations Erros    */
    errors = req.validationErrors();
    if (errors) {
        res.render('nufus/signup', { errors: errors });
        console.log(errors);
    } else {
        var reqAttrib = [];
        reqAttrib.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"nickname",Value:nickname}));
        reqAttrib.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:email}));
        cognitoSrvc.RegisterUser(email, password, reqAttrib);
        // console.log(userData);
        req.flash('success', 'User Added');
        res.redirect('/nufus/code_ok/'+email);
    }
});

router.get('/requestNewCode/:theEmail', (req, res, next) => {
    cognitoSrvc.requestNewCode(req.params.theEmail);
    res.render('nufus/code_ok', {theEmail:req.params.theEmail});
});

router.get('/code_ok/:theEmail', (req, res, next) => {
    res.render('nufus/code_ok', {theEmail:req.params.theEmail});
});
router.post('/code_ok', passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: true
  }), function (req, res, next) {
    var theEmaşl = req.body.email;
    // console.log("user",req.user);
    cognitoSrvc.verifyCode(theEmail);
    req.flash('success', 'Signup Success..');
    res.redirect('/staticWeb/index.html');
});


router.get('/', (req, res, next) => {
    res.render('nufus/login', {});
});
router.get('/login', (req, res, next) => {
    res.render('nufus/login', {});
});
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: true
  }), function (req, res, next) {
    // console.log("user",req.user);
    req.flash('success', 'Login Success..');
    //res.redirect('/dashboard');
    res.redirect('/staticWeb/index.html');
});

module.exports = router;