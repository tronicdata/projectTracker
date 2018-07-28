var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// New Code
var mongo = require('mongodb');

// Removing Monk
//var monk = require('monk');
//var db = monk('localhost:27017/projectTracker');

//connect mongoose to mongo
mongoose.connect('mongodb://127.0.0.1:27017/projectTracker');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
console.log('LOGGED INTO THE DB');  
// we're connected!
});



var index = require('./routes/index');
//var users = require('./routes/users');

var app = express();

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//tells express that the public folder is all static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next){
  console.log('Time', Date.now())
  next()
})


app.use('/', index);
//app.use('/users', users);
//app.use(express.static('public'));



app.use('/user/:id', function (req, res, next){
  console.log('ID:', req.params.id)
  next()
}, function (req, res, next){
  res.send('User Info')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {error: err, message: res.locals.message});
});

module.exports = app;
