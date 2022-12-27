var express               = require('express');
var router                = express.Router();
var passport              = require('passport');
var LocalStrategy         = require('passport-local').Strategy;
//var User                  = require('../models/nufus');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var cognitoSrvc           = require('../services/cognitoSrvc.js');

/* GET home page. */

const redirectTodashboard = (req, res, next) => {
  console.log(req.session);
  if(!req.session.passport) {
      next();
  } else {
      res.redirect('/dashboard', );//{ Admin: true, Sales: true, Firm: "GBC" }
  }
}

router.get('/', redirectTodashboard, function (req, res, next) {
  res.render('index');
});

router.post('/', function (req, res, next) {  //passport.authenticate('local', { failureRedirect: '/', failureFlash: true}), 
  // console.log("user",req.user);
  req.flash('success', 'Login Success..');
  res.redirect('/dashboard');//, { Admin: true, Sales: true, Firm: "GBC" });
  //res.redirect('/staticWeb/index.html');
});


/*
passport.serializeUser (function (user, done) {
  done(null, user._id);
})  


passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});
* /

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: true
  }), function (req, res, next) {
    // console.log("user",req.user);
    req.flash('success', 'Login Success..');
    res.redirect('/dashboard');//, { Admin: true, Sales: true, Firm: "GBC" });
});

/*
passport.use(new LocalStrategy(function (username, password, done) {
  User.getUserByUsername(username, function (err, user) {
    if (err) console.log(err);
    if (!user) {
      return done(null, false, {
        message: `Unknown user ${username}`
      });
    }
    User.comparePassword(password, user.password, function (err, isMatch) {
      if (err) throw err;
      if (isMatch) {
        return done(null, user);
      } else {
        console.log("Invalid Password");
        return done(null, false, {
          message: 'Invalid Password'
        });
      }
    });
  });
}));
*/


router.get('/dashboard', (req, res, next) => {
      res.render('dashboard');//, { Admin: true, Sales: true, Firm: "GBC" });
});


module.exports = router;