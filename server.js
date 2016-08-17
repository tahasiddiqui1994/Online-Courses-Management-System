// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express') ;
var app      = express() ;
var mongoose = require('mongoose') ;
var passport = require('passport') ;
var flash    = require('connect-flash') ;
var path     = require('path');
var jwt      = require('jsonwebtoken');
var port     = process.env.PORT || 3000 ;

var apiRoutes	   = express.Router()	;
var morgan       = require('morgan') ;
var cookieParser = require('cookie-parser') ;
var bodyParser   = require('body-parser') ;
var session      = require('express-session') ;
var routes 	  	 = express.Router();

var configDB 	       = require('./config/database.js') ;
var configSecret     = require('./config/SuperSecret.js') ;
// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
// load up the user model
var User             = require('./app/models/user');
var configAuth       = require('./config/auth');

// configuration ===============================================================
mongoose.connect(configDB.url) ; // connect to our database

require('./config/passport')(passport, LocalStrategy, FacebookStrategy, User, configAuth, jwt, app) ; // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs'); // set up ejs for templating
app.set('SuperSecret', configSecret.secret) ;

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(__dirname + '/views'));

routes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

// routes ======================================================================
require('./app/routes.js')(routes, app, passport, path, User); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('Server is running on http://localhost:' + port);
