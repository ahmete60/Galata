var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var async = require('async');
var expressHbs = require('express-handlebars');
var expresValid = require('express-validator');
var session = require('express-session');
var falsh = require('connect-flash');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var urlMongo = 'mongodb+srv://Amongo:<n6b5v4c3>@cluster0.dvcqn.mongodb.net/<shopping>?retryWrites=true&w=majority:27017/shopping';
mongoose.connect(urlMongo,{ useNewUrlParser: true });
var db = mongoose.connection;
db.once('open', function() {
  console.log("Db Connected");
});
db.on('error', function(err) {
  console.log(err);
});

var regAttrib = [];
regAttrib.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"nickname",Value:"mad"}));
regAttrib.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:theEmail}));

var passpost = require('passport');
var localStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');



var indexRouter = require('./routes/index');
var register = require('./routes/register');
var dashboard = require('./routes/dashboard');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.engine('expressHbs', expressHbs());
//app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
//var hndblrs = expressHbs.create({ extname: '.hbs',  defaultLayout: 'layout' });
app.engine('hbs', expressHbs.engine({  extname: '.hbs',  defaultLayout: 'layout' }));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Express Sessions
app.use(session({
  secret: 'secret',
  saveUninitialized: false,
  resave: false
}));

// Passport
app.use(passpost.initialize());
app.use(passpost.session());


app.use(expresValid());
  /* / Express Validator

app.use(expresValid({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;

    while(namespace.length) {
      formParam += `[${namespace.shift()}]`; 
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));
*/ // bcrypt

// Connect-flash

app.use(falsh());

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null
  if(res.locals.user) {
    // console.log(res.locals.user);
  }
  next();
});
// Global Vars

app.use(function(req, res, next) {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use('/', indexRouter);
app.use('/register', register);
app.use('/dashboard', dashboard);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
