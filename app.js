var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var auth = require('./routes/auth')(passport);
var app = express();
var dbConfig = require('./db.js');
var profile = require('./routes/profile')
var mongoose = require('mongoose');
var expressSession = require('express-session');
var http = require('http').Server(app);
var io = require('socket.io')(http);
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

app.use('/', profile);
app.use('/', auth);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
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

io.on('connect', function(sock) {
  console.log('a user has connected');
  sock.on('liked', function() {
    console.log('liked post');
  });
  sock.on('sendingmsg', function(msg) {
    sock.emit('returnmsg', msg)
  });
});
module.exports = app;