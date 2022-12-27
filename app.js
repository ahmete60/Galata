var createError           = require('http-errors');
var express               = require('express');
var path                  = require('path');
var cookieParser          = require('cookie-parser');
var favicon			 	        = require('serve-favicon');
var logger                = require('morgan');
    async                 = require('async');
var expressHbs            = require('express-handlebars');
var expresValid           = require('express-validator');
var session               = require('express-session');
var falsh                 = require('connect-flash');
var mongo                 = require('mongodb');
var mongoose              = require('mongoose');
var cognitoSrvc           = require('./services/cognitoSrvc.js');
const i18n            		= require('i18n');

/*
var urlMongo = process.env.URL_MONGO;
mongoose.connect(urlMongo, { useNewUrlParser: true });
var db = mongoose.connection;
db.once('open', function() {
  console.log("Db Connected");
});
db.on('error', function(err) {
  console.log(err);
});
*/

var passpost = require('passport');
var localStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');



var indexRoute = require('./routes/index');
var nufusRoute = require('./routes/nufus');
var dashboardRoute = require('./routes/dashboard');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.engine('expressHbs', expressHbs());
//app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
//var hndblrs = expressHbs.create({ extname: '.hbs',  defaultLayout: 'layout' });
var hbs = expressHbs.create({});
app.engine('.hbs', expressHbs.engine({  extname: '.hbs',  defaultLayout: 'layout',
        helpers: {
          i18: function() { return i18n.__.apply(this, arguments); },
          __: function() { return i18n.__.apply(this, arguments); },
          __n: function() { return i18n.__n.apply(this, arguments); }
} }));
app.set('view engine', '.hbs');


var imagesDir   = require('path').join(__dirname, '/images')
app.use("/images", express.static(imagesDir));
app.use(favicon(path.join(imagesDir, 'favicon.jpg')));	//or imagesDir

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


i18n.configure({
  locales: ['en', 'tr', 'nl'],
  defaultLocale :  'tr' ,
  cookie: 'locale',
  directory: "" + __dirname + "/locales"
});

app.use(i18n.init);

hbs.handlebars.registerHelper('i18', function () {
  return i18n.__.apply(this, arguments);
});
hbs.handlebars.registerHelper('__', function () {
  return i18n.__.apply(this, arguments);
});
hbs.handlebars.registerHelper('__n', function () {
  return i18n.__n.apply(this, arguments);
});

app.get('/tr', function (req, res) {
  console.log("NOW TR "+ globs.isOperator);
  res.cookie('locale', 'tr', { maxAge: 900000, httpOnly: true });
  res.redirect('back');
});
app.get('/en', function (req, res) {
  console.log("NOW EN "+ globs.isOperator);
  res.cookie('locale', 'en', { maxAge: 900000, httpOnly: true });
  res.redirect('back');
});


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

app.use('/', indexRoute);
app.use('/nufus', nufusRoute);       // any render that starts with /nufus will be searched for inside  ./routes/nufus.js with "/nufus" being stripped
app.use('/dashboard', dashboardRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var errlog = "404 "+req.method+ req.originalUrl+ JSON.stringify(req.body);
  console.log(errlog);
  next(createError(errlog));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // req.[method originalUrl body sessionID]
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  var errlog = req.method+ " "+ req.originalUrl+ " "+ err.message;  //+ " + req.body.username;
  console.log(errlog);
  console.log(err);

  // render the error page
  res.status(err.status || 500);
  res.render('error', {errlog: errlog});
});


module.exports = app;
