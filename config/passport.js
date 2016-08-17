module.exports = function(passport, LocalStrategy, FacebookStrategy, User, configAuth, jwt, app) { 

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    passport.use('local-signup', new LocalStrategy({
        
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        process.nextTick(function() {

        User.findOne({ 'local.email' :  email}, function(err, user) {

            if (err)
            {
                return done(err);
            }

            if(req.body.email == "" || req.body.email == null)
            {
                return done(null, false, req.flash('signupMessage', 'Invalid Email'));
            }

            if(req.body.DSUID == "" || req.body.DSUID == null)
            {
                return done(null, false, req.flash('signupMessage', 'Invalid ID'));
            }

            if(req.body.password == "" || req.body.password == null)
            {
                return done(null, false, req.flash('signupMessage', 'Invalid Password'));
            }
            
            if(req.body.name == "" || req.body.name == null)
            {
                return done(null, false, req.flash('signupMessage', 'Invalid Name'));
            }
            
            if (user)
            {  
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            }
            else
            {
                User.findOne({DSUID: req.body.DSUID}, function(err, user)
                {
                    if (err)
                        throw err;

                    if (user)
                    {
                        return done(null, false, req.flash('signupMessage', 'That ID is already exist.'));
                    }
                    else
                    {

                        // if there is no user with that email
                        // create the user
                        var newUser            = new User();
                        // set the user's local credentials
                        newUser.local.name     = req.body.name ;
                        newUser.local.DSUID    = req.body.DSUID ;
                        newUser.local.email    = req.body.email ;
                        newUser.local.password = req.body.password ;

                        var token = jwt.sign(newUser, app.get('SuperSecret'), {
                            //expiresInMinutes: 1440 // expires in 24 hours
                        });

                        newUser.local.token          = token ;

                        // save the user
                        newUser.save(function(err) {
                        if (err)
                           throw err;
                        return done(null, newUser);
                        });
                    }
                
                });
            }

        });    

        });

    }));

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        User.findOne({ 'local.DSUID' :  email }, function(err, user) {

            if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            if (user.local.password != req.body.password)
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            return done(null, user);
        });

    }));

};