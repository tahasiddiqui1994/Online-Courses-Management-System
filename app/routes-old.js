module.exports = function(routes, app, passport, path, User)
{
    app.get('/', function(req, res) 
    {
        res.sendFile(path.join(__dirname,'.././views/index.html'));
        //res.render('index.html'); // load the index.ejs file
    });

    app.get('/login', function(req, res)
    {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
        //res.sendFile(path.join(__dirname,'.././views/login.html'));
        //res.send(req.flash('loginMessage')) ;
    });

    app.get('/signup', function(req, res)
    {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    
    app.get('/updateInfo', function(req, res)
    {
        res.render('update.ejs', { message: req.flash('signupMessage') });
    });

    app.get('/profile', isLoggedIn, function(req, res)
    {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/facebookprofile', isLoggedIn, function(req, res)
    {
        res.render('facebookprofile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/facebookprofile',
            failureRedirect : '/'
        }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/users', function(req, res) {
        User.find({}, function(err, users) {
            res.json(users);
        });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/updateInfo', passport.authenticate('local', {
        successRedirect : '/profile',
        failureRedirect : '/updateInfo',
        failureFlash : true
    }));
    
    app.use('/', routes) ;
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
