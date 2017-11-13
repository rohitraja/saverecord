var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


//Register Page
router.get('/register',function(req,res){
	res.render('register');
});


//Login Page
router.get('/login',function(req,res){
	res.render('login');
});


router.post('/register',function(req,res){
	var regUser ={};
	regUser.name = req.body.name;
	regUser.userName = req.body.username;
	regUser.email = req.body.email;
	regUser.pwd = req.body.password;
	regUser.pwd2 = req.body.password2;
	//Validation
	req.checkBody('name','Name is requier').notEmpty();
	req.checkBody('username','User Name is required').notEmpty();
	req.checkBody('email','Email is required').isEmail();
	req.checkBody('password','Password can not be empty').notEmpty();
	req.checkBody('password2','Confirm password did not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors: errors
		});
	}else{
		var newUser = new User({		
			name: regUser.name,
			email: regUser.email,
			username: regUser.userName,
			password: regUser.pwd
		})

		User.createUser(newUser, function(err,user){
			if(err) throw err;
		});
		req.flash('success_msg','Your are registered and can login');
		res.redirect('/users/login');
	}

});

passport.use(new LocalStrategy(
  function(username, password, done) {
  	User.getUserByUserName	(username,function(err,user){
  		if(err){
  			console.log("Error occured: "+ JSON.stringify(err));
  			throw err;
  		} 
  		if(!user){
  			return done(null, false, {message: 'Unknown User'});
  		}
  		User.comparePassword(password,user.password,function(err,isMatch){
  			if(err) throw err;
  			if(isMatch){
  				return done(null,user);
  			}else{
  				return done(null,false,{message: 'Invalid Username Password'});
  			}
  		})
  	})
    
  }
));


passport.serializeUser(function(user, done) {
	console.log("serializeUser---> "+ JSON.stringify(user._id));
  	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	console.log("deserializeUser---> "+ JSON.stringify(id));
  	User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
 });


router.get('/logout',function(req,res){
	req.logout();
	req.flash('success_msg','You are logged out');
	res.redirect('/users/login');
});

module.exports = router;