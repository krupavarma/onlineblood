var express = require('express');    //including the module express
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');    //These are given at the time of installation


var mongoose=require('mongoose');       //mongoose to access to MONGO Data Base
var flash = require('connect-flash');   //To display any flash messages if any
var passport = require('passport');     //To take,verify the E-mail Id's & Passwords

// Modules to store session
var session = require('express-session');        //To Create Sessions
var MongoStore = require('connect-mongo')(session);  //To create session with Mongo DB


var routes = require('./server/routes/index');
var donors = require('./server/routes/donors');    //including the route modules

// Database configuration
var config = require('./server/config/config.js');
// connect to our database
mongoose.connect(config.url);
// Check if MongoDB is running
mongoose.connection.on('error', function() {
   console.error('MongoDB Connection Error. Make sure   MongoDB is running.');
});

var app = express();

// Passport configuration
require('./server/config/passport')(passport);

// view engine setup Given at installation time itself
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// required for passport
//secret for session
app.use(session({
  secret: 'sometextgohere',
  saveUninitialized: true,
  resave: true,
  //store session on MongoDB using express-session + connect mongo
  store: new MongoStore({
    url: config.url,
    collection : 'sessions'
  })
}));


//flash warning message
app.use(flash());
// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());

app.use('/', routes);     //to use the modules
app.use('/',donors);
app.use('/api/donors', donors);

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

//Set the server to port 3000
app.set('port',process.env.PORT || 3000);
var server=app.listen(app.get('port'),function(){
    console.log('Express Server is Running on Port :'+server.address().port);
});