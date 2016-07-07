var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var auth = require('./routes/auth')(passport);
var alerts = require('./routes/alerts')(io);
var profile = require('./routes/profile')
var hashtags = require('./routes/hashtagsearch')
var usersearch = require('./routes/usersearch')
var follow = require('./routes/follow')
var dbConfig = require('./db.js');
var mongoose = require('mongoose');
var expressSession = require('express-session');
var mongoose = require('mongoose')
require('./models/user')
var User = mongoose.model('User');
mongoose.connect(dbConfig.url);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.get('/', function(req, res, next) {
    res.render('index');
  })
  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  secret: 'mySecretKey'
}));

// set up passport
app.use(passport.initialize());
app.use(passport.session());
var initPassport = require('./passport/init');
initPassport(passport);

// set up routes
app.use('/', profile);
app.use('/', auth);
app.use('/', hashtags);
app.use('/', usersearch);
app.use('/', follow);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error');
  });
}

http.listen("4000");
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
module.exports = app;