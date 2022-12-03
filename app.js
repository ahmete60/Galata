var createError           = require('http-errors');
var express               = require('express');
var path                  = require('path');
var cookieParser          = require('cookie-parser');
var logger                = require('morgan');
    async                 = require('async');
var expressHbs            = require('express-handlebars');
var expresValid           = require('express-validator');
var session               = require('express-session');
var falsh                 = require('connect-flash');
var mongo                 = require('mongodb');
var mongoose              = require('mongoose');
var cognitoSrvc           = require('./services/CognitoSrvc.js');

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

app.use('/', indexRoute);
app.use('/nufus', nufusRoute);       // any render that starts with /nufus will be searched for inside  ./routes/nufus.js with "/nufus" being stripped
app.use('/dashboard', dashboardRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(req.method, req.originalUrl, req.body);
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // req.[method originalUrl body sessionID]
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(req.method, req.originalUrl, req.body);
  console.log(err);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
