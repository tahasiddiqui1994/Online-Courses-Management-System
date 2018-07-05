// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE '+dbconfig.database);
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize student out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        /*console.log("\n In serialize: ","\n") ;
        console.log("username: ", user.username, "\n") ;
        console.log("password: ", user.password, "\n") ;
        console.log("dateofadmission: ", user.dateofadmission, "\n") ;
        console.log("email: ", user.email, "\n") ;
        console.log("firstname: ", user.firstname, "\n") ;
        console.log("lastname: ", user.lastname, "\n") ;
        console.log("gender: ", user.gender, "\n") ;
        console.log("cnic: ", user.cnic, "\n") ;
        console.log("address: ", user.address, "\n") ;
        console.log("mobile: ", user.mobile, "\n") ;
        console.log("age: ", user.age, "\n") ;*/

        done(null, user.username);
    });
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        //console.log("\n id in deserialize: ", id, "\n") ;

        connection.query("SELECT * FROM student WHERE username = ? ", [id], function(err, rows) {
            done(err, rows[0]) ;
        });
    });
    passport.use(
        'local-signup',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                connection.query("SELECT * FROM student WHERE username = ?", [username], function(err, rows) {
            if (err)
            {
                return done(err);
            }

            if(req.body.email == "" || req.body.email == null)
            {
                return done(null, false, req.flash('signupMessage', 'Invalid Email'));
            }

            if(req.body.username == "" || req.body.username == null)
            {
                return done(null, false, req.flash('signupMessage', 'Invalid ID'));
            }

            if(req.body.password == "" || req.body.password == null)
            {
                return done(null, false, req.flash('signupMessage', 'Invalid Password'));
            }
            
            if(rows.length)
            {
                return done(null, false, req.flash('signupMessage', 'Username/Email Already Taken'));
            }
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUserMysql = {
                            //id: "cs151071",
                            username: username,
                            password: bcrypt.hashSync(password, null, null), // use the generateHash function in our user model
                            dateofadmission: req.body.dateofadmission,
                            email: req.body.email,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            gender: req.body.gender,
                            cnic: req.body.cnic,
                            address: req.body.address,
                            mobile: req.body.mobile,
                            age: req.body.age,
                            semester: req.body.semester
                        };
                        newUserMysql.firstname = newUserMysql.firstname.toLowerCase() ;
                        newUserMysql.lastname = newUserMysql.lastname.toLowerCase() ;
                        newUserMysql.firstname[0] = newUserMysql.firstname[0].toUpperCase() ;
                        newUserMysql.lastname[0] = newUserMysql.lastname[0].toUpperCase() ;
                        newUserMysql.gender = newUserMysql.gender.toUpperCase() ;

                        console.log("username: ", newUserMysql.username, "\n") ;
                        console.log("password: ", newUserMysql.password, "\n") ;
                        console.log("dateofadmission: ", newUserMysql.dateofadmission, "\n") ;
                        console.log("email: ", newUserMysql.email, "\n") ;
                        console.log("firstname: ", newUserMysql.firstname, "\n") ;
                        console.log("lastname: ", newUserMysql.lastname, "\n") ;
                        console.log("gender: ", newUserMysql.gender, "\n") ;
                        console.log("cnic: ", newUserMysql.cnic, "\n") ;
                        console.log("address: ", newUserMysql.address, "\n") ;
                        console.log("mobile: ", newUserMysql.mobile, "\n") ;
                        console.log("age: ", newUserMysql.age, "\n") ;
                        console.log("semester: ", newUserMysql.semester, "\n") ;

                        var insertQuery = "INSERT INTO student (firstname, lastname, username, password, cnic, address, age, cellNumber, dateOfAdmission, gender, email, semester_id) values (?,?,?,?,?,?,?,?,?,?,?,?)";

                        connection.query(insertQuery, [newUserMysql.firstname, newUserMysql.lastname, newUserMysql.username, newUserMysql.password, newUserMysql.cnic, newUserMysql.address, newUserMysql.age, newUserMysql.mobile, newUserMysql.dateOfAdmission, newUserMysql.gender, newUserMysql.email, newUserMysql.semester], function(err, rows) {
                            console.log(err) ;

                            //newUserMysql.id = rows.insertId;

                            return done(null, newUserMysql);
                        });
                    }
                });
            })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) { // callback with email and password from our form
                connection.query("SELECT * FROM student WHERE username = ?", [username], function(err, rows) {

                    if (err) {
                        console.log("QUERYING USER NAME ERROR: ", err);
                        return done(err)
                    }

                    if (!rows.length) {
                        console.log('No user found');
                        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                    }

                    // if the user is found but the password is wrong
                    console.log("DDDDDDDDDDDDDDDDDDD: ", password);
                    console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFF", rows[0].password);
                    if (!bcrypt.compareSync(password, rows[0].password)) {
                        console.log('Oops! Wrong password.');
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                    }

                    // all is well, return successful user
                    console.log("LOGIN", rows[0])
                    return done(null, rows[0]);
                });
            })
    );

    passport.use(
            'local-modify',
            new LocalStrategy({
                    // by default, local strategy uses username and password, we will override with email
                    usernameField: 'username',
                    passwordField: 'password',
                    passReqToCallback: true // allows us to pass back the entire request to the callback
                },
                function(req, username, password, done) { // callback with email and password from our form
                        console.log(" HERE in modify") ;
                       
                        var newUserMysql = {
                            //id: "cs151071",
                            username: username,
                            password: bcrypt.hashSync(password, null, null), // use the generateHash function in our user model
                            dateofadmission: req.body.dateofadmission,
                            email: req.body.email,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            gender: req.body.gender,
                            cnic: req.body.cnic,
                            address: req.body.address,
                            mobile: req.body.mobile,
                            age: req.body.age
                        };
                        newUserMysql.firstname = newUserMysql.firstname.toLowerCase() ;
                        newUserMysql.lastname = newUserMysql.lastname.toLowerCase() ;
                        newUserMysql.firstname[0] = newUserMysql.firstname[0].toUpperCase() ;
                        newUserMysql.lastname[0] = newUserMysql.lastname[0].toUpperCase() ;
                        newUserMysql.gender = newUserMysql.gender.toUpperCase() ;

                        var insertQuery = "UPDATE student SET firstname = ?, lastname = ?, username = ?, password = ?, cnic = ?, address = ?, age = ?, dateofadmission = ?, gender = ?, email = ?, cellNumber = ? WHERE username = ?" ;
                        connection.query(insertQuery, [newUserMysql.firstname, newUserMysql.lastname, newUserMysql.username, newUserMysql.password, newUserMysql.cnic, newUserMysql.address, newUserMysql.age, newUserMysql.dateOfAdmission, newUserMysql.gender, newUserMysql.email, newUserMysql.mobile, newUserMysql.username], function(err, rows) {

                        console.log(" HERE connection.query\n") ;
                        console.log(rows, "\n") ;
                        
                        if (err) {
                            console.log("QUERYING USER NAME ERROR: ", err);
                            return done(err) ;
                        }
                        return done(null, newUserMysql) ;
                    });
                })
        );

};

/*

    passport.use(
            'local-delete',
            new LocalStrategy({
                    // by default, local strategy uses username and password, we will override with email
                    usernameField: 'username',
                    passwordField: 'password',
                    passReqToCallback: true // allows us to pass back the entire request to the callback
                },
                function(req, username, password, done) { // callback with email and password from our form
                        console.log(" HERE in delete") ;
                       
                        var newUserMysql = {
                            id:req.body.id,
                            username: username,
                            password: bcrypt.hashSync(password, null, null), // use the generateHash function in our user model
                            name: req.body.name,
                            email: req.body.email
                        };

                    connection.query("DELETE FROM student WHERE id = ?", newUserMysql.id, function(err, rows) {
                        console.log(" HERE") ;
                    if (err) {
                        console.log("QUERYING USER NAME ERROR: ", err);
                        return done(err)
                    }
                        return done(null, newUserMysql) ;
                    });
                })
        );

    passport.use(
            'local-modify',
            new LocalStrategy({
                    // by default, local strategy uses username and password, we will override with email
                    usernameField: 'username',
                    passwordField: 'password',
                    passReqToCallback: true // allows us to pass back the entire request to the callback
                },
                function(req, username, password, done) { // callback with email and password from our form
                    console.log(" HERE") ;
                    connection.query("UPDATE * student SET username = ? password = ? name = ? email = ? WHERE id = ?",
                     [username, password, req.body.name, req.body.email, 1], function(err, rows) {
                        console.log(" HERE") ;
                    if (err) {
                        console.log("QUERYING USER NAME ERROR: ", err);
                        return done(err)
                    }
                    console.log(rows) ;
                        return done(null, true) ;
                    });
                })
        );
*/

/*
    passport.use(
            'local-enroll',
            new LocalStrategy({qop: 'auth'},
                function(username, done) {
                    console.log("\n TTTTTTTTTTTTTTTTTTTTTTTTTT",req.body.dsuid,"\nTTTTTTTTTTTTTTTTTTTTT") ;
                    connection.query("SELECT * FROM course WHERE id = ?", [req.body.dsuid], function(err, rows) {
                        
                        if (err)
                            return done(err);

                        if (rows.length)
                            return done(null, false, req.flash('signupMessage', 'Username/Email Already Taken'));
                        else
                        {
                            var newUserMysql = {
                            };
                        }

                    });
                }),
                      function(params, done) {
                        // validate nonces as necessary
                        done(null, true)
                      }
        );

    passport.use(
            'local-withdraw',
            new LocalStrategy(
                function(req, username, password, done) {
                    console.log("\n TTTTTTTTTTTTTTTTTTTTTTTTTT",req.body.dsuid,"\nTTTTTTTTTTTTTTTTTTTTT") ;
                    connection.query("SELECT * FROM courseregistration WHERE c_id = ?, ", [req.body.dsuid], function(err, rows) {
                        
                        if (err)
                            return done(err);

                        if (rows.length)
                            return done(null, false, req.flash('signupMessage', 'Username/Email Already Taken'));
                        else
                        {
                            var newUserMysql = {
                            };
                        }

                    });
                })
        );
*/