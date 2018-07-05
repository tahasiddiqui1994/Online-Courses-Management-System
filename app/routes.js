// app/routes.js

var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE '+dbconfig.database);


module.exports = function(app, passport, jwt) {

    // HOME PAGE (with login links) ========
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // LOGIN ===============================
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    //process the login form
    app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/profile', // redirect to the secure profile section
            failureRedirect: '/login', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }),
        function(req, res) {
            console.log("hello");
            res.redirect('/');
        });

    // SIGNUP ==============================
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      console.log(req.user);
        res.render('profile.ejs', {
            user: req.user, // get the user out of session and pass to template
            message: "",
            message1: "",
                    MyCoursesData: null,
                    AllCoursesData: null,
            failureFlash: true // allow flash messages
        });
    });

    app.get('/updateInfo', function(req, res)
    {
        res.render('update.ejs', {
            user: req.user,
            message: req.flash('signupMessage')

        });
    });

    app.post('/updateInfo', passport.authenticate('local-modify',
    {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/updateInfo', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages    });
    }));
    app.post('/enroll', function(req,res){

        if (req.body.course_id == null || req.body.course_id == 0 || req.body.course_id > 24) {
                    res.render('profile.ejs', {
                        user: req.user, // get the user out of session and pass to template
                        message1: '',
                        message: 'Invalid course ID',
                        MyCoursesData: null,
                        AllCoursesData: null
                    });
        }
        else{
            connection.query("select (count(corse_id) < 5 || count(corse_id) = 5) as AAA, (course.semester_id = student.semester_id || course.semester_id < student.semester_id)as BBB from courseregitration, course, student where student.username = ? && courseregitration.username = ? && course.id = ?",[req.body.username,req.body.username,req.body.course_id], function(err, rows, next){

                if (err) {
                    res.send(err) ;
                }
                console.log("\nAAAAAAAAAAAAAAAAAAAAAAA: ", rows, "\n") ;
                console.log("\nAAAAAAAAAAAAAAAAAAAAAAA: ", rows[0].AAA, "\n") ;
                console.log("\nAAAAAAAAAAAAAAAAAAAAAAA: ", rows[0].BBB, "\n") ;

                if (rows[0].AAA && rows[0].BBB) {
                    connection.query("SELECT * FROM courseregitration WHERE corse_id = ? AND username = ?", [req.body.course_id, req.body.username], function(err, rows) {

                    if (err){
                        res.send(err);
                    }
                    if (rows.length){
                            res.render('profile.ejs', {
                                user: req.user, // get the user out of session and pass to template
                                message: 'You are already enrolled to this course',
                                message1: '',
                                MyCoursesData: null,
                                AllCoursesData: null
                            });
                    }
                    else
                    {
                        var newData = {
                            username: req.body.username,
                            courseId: req.body.course_id
                        };
                        connection.query("INSERT INTO courseregitration (corse_id, username) values(?, ?)", [newData.courseId, newData.username], function(err, rows) {
                            newData.id = rows.insertId;
                            if (err)
                                res.send(err);
                            
                            res.render('profile.ejs', {
                                user: req.user, // get the user out of session and pass to template
                                message1: 'Course enrolled Successfully.',
                                message: '',
                                MyCoursesData: null,
                                AllCoursesData: null
                            });

                        });
                    }

                    });
                }
                else if(rows[0].AAA == 0 && rows[0].BBB == 1){
                    res.render('profile.ejs', {
                        user: req.user, // get the user out of session and pass to template
                        message: 'You have exceeded your course registration limit',
                        message1: '',
                        MyCoursesData: null,
                        AllCoursesData: null
                    });
                }
                else if(rows[0].AAA == 1 && rows[0].BBB == 0){
                    res.render('profile.ejs', {
                        user: req.user, // get the user out of session and pass to template
                        message: 'You have to clear previous courses to take this course',
                        message1: '',
                        MyCoursesData: null,
                        AllCoursesData: null
                    });
                }
                else if(rows[0].AAA == 0 && rows[0].BBB == 0){
                    res.render('profile.ejs', {
                        user: req.user, // get the user out of session and pass to template
                        message: 'You are exceeding the maximum course registering limit as well as your select course can\'t be offered to you',
                        message1: '',
                        MyCoursesData: null,
                        AllCoursesData: null
                    });
                }
            });
        }

    });

    app.post('/withdraw', function(req, res){
        
        if (req.body.course_id == null || req.body.course_id == 0) {
                    res.render('profile.ejs', {
                        user: req.user, // get the user out of session and pass to template
                        message1: '',
                        message: 'Invalid course ID',
                        MyCoursesData: null,
                        AllCoursesData: null
                    });
        }
        else{
            connection.query("SELECT * FROM courseregitration WHERE corse_id = ? AND username = ?", [req.body.course_id, req.body.username], function(err, rows) {

            if (err){
                res.send(err) ;
            }
            if (rows.length){
                var newData = {
                    username: req.body.username,
                    courseId: req.body.course_id
                };
                connection.query("DELETE FROM courseregitration WHERE corse_id = ? AND username = ?", [newData.courseId, newData.username], function(err, rows) {
                    
                    if (err){
                        res.send(err);
                    }
                    res.render('profile.ejs', {
                        user: req.user, // get the user out of session and pass to template
                        message1: 'Course withdrawled Successfully',
                        message: '',
                        MyCoursesData: null,
                        AllCoursesData: null
                    });
                    //req.flash('profileMessage', 'Course withdrawled Successfully') ;

                });
            }
            else{
                    res.render('profile.ejs', {
                        user: req.user, // get the user out of session and pass to template
                        message: 'You are not enrolled in this course',
                        message1: '',
                        MyCoursesData: null,
                        AllCoursesData: null
                    });
            }

            }) ;
        }
    });

    app.post('/showAllCourse', function(req, res){
        connection.query("select course.id, course.name, course.creditHours, course.semester_id, teacher.firstName as Teacher_Name from course, teacher, teachercourse where course.semester_id = (select student.semester_id from student where student.username = ?) AND teachercourse.c_id = course.id AND teacher.id = teachercourse.t_id ;", [req.body.username], function(err, rows) {

            if (err){
                res.send(err);
            }
            if (rows.length){
                res.render('profile.ejs', {
                    user: req.user, // get the user out of session and pass to template
                    message: '',
                    message1: '',
                    AllCoursesData: rows,
                    MyCoursesData: null
                });
                //res.json(rows);

            }
            else{
                res.render('profile.ejs', {
                    user: req.user, // get the user out of session and pass to template
                    message: 'There is no course to show',
                    message1: '',
                    MyCoursesData: null,
                    AllCoursesData: null
                });
            }
        });
    });
    app.post('/showMyCourse', function(req, res){
        connection.query("SELECT courseregitration.corse_id, course.name, course.creditHours, course.semester_id from courseregitration inner join course on course.id=courseregitration.corse_id where courseregitration.username = ?", [req.body.username], function(err, rows) {

            if (err){
                res.send(err);
            }
            if (rows.length){
                console.log(rows) ;
                res.render('profile.ejs', {
                    user: req.user, // get the user out of session and pass to template
                    message: '',
                    message1: '',
                    MyCoursesData: rows,
                    AllCoursesData: null
                });
                //res.json(rows);
            }
            else{                
                res.render('profile.ejs', {
                    user: req.user, // get the user out of session and pass to template
                    message: 'You don\'t have any enrolled course',
                    message1: '',
                    MyCoursesData: null,
                    AllCoursesData: null
                });
            }
        });
    });


    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
    console.log("Show User: ", req.isAuthenticated())

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');

}
